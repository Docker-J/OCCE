-- Schema definition for D1 database initialization
-- Announcements & Pastor Columns
CREATE TABLE IF NOT EXISTS Announcements (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  images TEXT,
  timestamp TEXT,
  video TEXT,
  pin INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Columns (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  images TEXT,
  timestamp TEXT
);

-- ====================================================================
-- 1. 정원(소그룹) 마스터 테이블
-- ====================================================================
CREATE TABLE IF NOT EXISTS gardens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,                      -- 정원명 (예: '미배정', '나라', '에덴')
  category TEXT NOT NULL DEFAULT 'ADULT',         -- 정원 구분 ('ADULT': 장년 정원, 'YOUNG_ADULT': 청년 정원)
  leader_member_id INTEGER NULL,                  -- 정원지기 교인 ID (church_members 참조. 장년: 해당 정원 소속, 청년: 청년부 전체 대상)
  sub_leader_member_id INTEGER NULL,              -- 부정원지기 교인 ID (church_members 참조. 청년 정원 전용)
  order_num INTEGER NOT NULL DEFAULT 0,           -- UI 노출 우선순위 (드래그 앤 드롭 및 순서 변경 지원)
  is_active BOOLEAN NOT NULL DEFAULT 1,           -- 현재 운영 중 여부
  FOREIGN KEY (leader_member_id) REFERENCES church_members(id),
  FOREIGN KEY (sub_leader_member_id) REFERENCES church_members(id)
);

CREATE INDEX IF NOT EXISTS idx_gardens_active_order ON gardens(is_active, order_num);
CREATE INDEX IF NOT EXISTS idx_gardens_leader ON gardens(leader_member_id) WHERE leader_member_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gardens_sub_leader ON gardens(sub_leader_member_id) WHERE sub_leader_member_id IS NOT NULL;

-- 기본 정원 데이터 시드 (미배정)
INSERT OR IGNORE INTO gardens (id, name, order_num, is_active) VALUES (1, '미배정', 999, 1);

-- ====================================================================
-- 2. 세대(가구) 마스터 테이블
-- ====================================================================
CREATE TABLE IF NOT EXISTS households (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_name TEXT,                            -- 세대명 (선택 사항 / 미사용 시 NULL)
  garden_id INTEGER NOT NULL DEFAULT 1,           -- gardens(id) 참조 (기본값: 1 미배정)
  address TEXT,                                   -- 도로명 주소 (Google Autocomplete 기본 주소)
  address_detail TEXT,                            -- 상세 주소 (Unit / Suite / Apt #)
  city TEXT DEFAULT 'Edmonton',                   -- 도시 (기본값: Edmonton)
  province TEXT DEFAULT 'AB',                     -- 주 (기본값: AB)
  postal_code TEXT,                               -- 우편번호 (예: T6W 0A1)
  notes TEXT,                                     -- 세대 특이사항 / 심방 안내
  
  FOREIGN KEY (garden_id) REFERENCES gardens(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_households_garden_id ON households(garden_id);

-- ====================================================================
-- 3. 교인 마스터 테이블
-- ====================================================================
CREATE TABLE IF NOT EXISTS church_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER NOT NULL,
  
  -- 세대주 식별 (순환 FK 제거: 세대당 1명만 is_head=1 허용)
  is_head BOOLEAN NOT NULL DEFAULT 0,
  relationship TEXT NOT NULL CHECK (relationship IN ('HEAD', 'SPOUSE', 'CHILD', 'PARENT', 'OTHER')),
  
  name TEXT NOT NULL,
  name_en TEXT NULL,                              -- 영문 성명 (교적 엑셀 3번째 컬럼)
  birth_date DATE,
  gender TEXT CHECK (gender IN ('M', 'F')),
  phone TEXT,                                     -- 원본 표시용 전화번호
  phone_clean TEXT,                               -- 검색/대조용 숫자만 (예: 7801234567)
  
  -- 4단계 세례 신분 ENUM
  baptism_status TEXT NOT NULL DEFAULT 'NONE'
      CHECK (baptism_status IN ('NONE', 'INFANT', 'CONFIRMATION', 'BAPTIZED')),
  
  position TEXT NOT NULL DEFAULT '성도',           -- 직분/호칭 ('성도', '교역자' 등)
  department TEXT NOT NULL DEFAULT '장년부',       -- 사역/교육부서 (장년부, 청년부, 중고등부, 유초등부, 유아유치부)
  custom_garden_id INTEGER NULL,                  -- 청년 등 독립 소그룹 예외 시 gardens(id) 참조
  registration_date DATE NULL,                    -- 실제 교회 등록 일자
  
  -- 온교회 단일 상태 머신 (제적 시 REMOVED)
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REMOVED')),
  
  -- 웹 계정 매핑
  is_registered BOOLEAN NOT NULL DEFAULT 0,
  cognito_sub TEXT UNIQUE NULL,
  
  FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE RESTRICT,
  FOREIGN KEY (custom_garden_id) REFERENCES gardens(id) ON DELETE SET NULL
);

-- 세대당 활성 세대주는 1명만 존재
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_head_per_household 
ON church_members(household_id) WHERE is_head = 1 AND status != 'REMOVED';

-- 세대(가구) 구성원 전체 조회 인덱스 (가구별 구성원 로딩 및 제적 관리 최적화)
CREATE INDEX IF NOT EXISTS idx_members_household_id ON church_members(household_id);

-- 독립 소그룹(정원) 지정 예외 인덱스
CREATE INDEX IF NOT EXISTS idx_members_custom_garden ON church_members(custom_garden_id) WHERE custom_garden_id IS NOT NULL;

-- 회원가입 초고속 조회 복합 인덱스 (1ms 이내)
CREATE INDEX IF NOT EXISTS idx_members_auth_lookup 
ON church_members(name, phone_clean) WHERE status != 'REMOVED';

-- 웹 사용자 매핑 인덱스
CREATE INDEX IF NOT EXISTS idx_members_cognito_sub 
ON church_members(cognito_sub) WHERE cognito_sub IS NOT NULL;

-- 교역자 및 직분 인덱스
CREATE INDEX IF NOT EXISTS idx_members_position ON church_members(position) WHERE status = 'ACTIVE';

-- 성례 통계 인덱스
CREATE INDEX IF NOT EXISTS idx_members_baptism 
ON church_members(baptism_status) WHERE status != 'REMOVED';

-- 상태별/부서별 조회 인덱스
CREATE INDEX IF NOT EXISTS idx_members_status_dept 
ON church_members(status, department);

-- ====================================================================
-- 4. FCM 푸시 알림 디바이스 토큰 테이블
-- ====================================================================
CREATE TABLE IF NOT EXISTS fcm_tokens (
  token TEXT PRIMARY KEY,                         -- FCM 디바이스 토큰 문자열
  member_id INTEGER NULL,                         -- 교인 외래키 (비로그인은 NULL)
  device_info TEXT NULL,                          -- 기기 종류/브라우저 정보 (선택)
  expires_at INTEGER NOT NULL,                    -- 만료 Epoch 타임스탬프 (3개월 TTL)
  
  FOREIGN KEY (member_id) REFERENCES church_members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_member ON fcm_tokens(member_id) WHERE member_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_expires ON fcm_tokens(expires_at);

-- ====================================================================
-- 5. 교육과정 마스터 테이블 (자유 등록형)
-- ====================================================================
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,                      -- 과정명 (예: '새가족 성경공부', '제자훈련')
  category TEXT NULL,                             -- 분류 (예: '새가족', '제자도', '성경연구')
  description TEXT NULL,                          -- 과정 개요
  order_num INTEGER NOT NULL DEFAULT 0,           -- UI 노출 우선순위
  is_active BOOLEAN NOT NULL DEFAULT 1            -- 현재 운영 중 여부
);

CREATE INDEX IF NOT EXISTS idx_courses_active_order ON courses(is_active, order_num);

-- ====================================================================
-- 6. 교육과정 기수(Cohorts) 마스터 테이블
-- ====================================================================
CREATE TABLE IF NOT EXISTS course_cohorts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,                     -- 소속 교육과정 FK
  term_name TEXT NOT NULL,                        -- 기수명 (예: '1기', '2기', '2024년 가을학기')
  instructor TEXT NULL,                           -- 담당 교역자 / 인도자
  start_date DATE NULL,                           -- 개강일
  end_date DATE NULL,                             -- 종강/수료일
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS'      -- 기수 상태
      CHECK (status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED')),
  notes TEXT NULL,                                -- 기수 메모
  
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(course_id, term_name)
);

CREATE INDEX IF NOT EXISTS idx_course_cohorts_course ON course_cohorts(course_id, status);

-- ====================================================================
-- 7. 교인별 교육과정 수강 및 이수 기록 테이블
-- ====================================================================
CREATE TABLE IF NOT EXISTS member_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,                     -- 교인 FK
  cohort_id INTEGER NOT NULL,                     -- 기수 FK
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS' 
      CHECK (status IN ('COMPLETED', 'IN_PROGRESS')),
  completion_date DATE NULL,                      -- 수료 일자
  notes TEXT NULL,                                -- 특이사항 / 과제 이수 메모
  
  FOREIGN KEY (member_id) REFERENCES church_members(id) ON DELETE CASCADE,
  FOREIGN KEY (cohort_id) REFERENCES course_cohorts(id) ON DELETE CASCADE,
  UNIQUE(member_id, cohort_id)
);

CREATE INDEX IF NOT EXISTS idx_member_courses_member ON member_courses(member_id, status);
CREATE INDEX IF NOT EXISTS idx_member_courses_cohort ON member_courses(cohort_id, status);

-- ====================================================================
-- 8. 사역자 심방 기록 테이블
-- ====================================================================
CREATE TABLE IF NOT EXISTS visitation_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER NOT NULL,
  member_id INTEGER NULL,
  visit_date DATE NOT NULL,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('REGULAR', 'SICK', 'COMFORT', 'CELEBRATION', 'COUNSEL', 'NEW_MEMBER')),
  visitors TEXT NOT NULL,
  scripture TEXT,
  hymn TEXT,
  prayer_requests TEXT,
  notes TEXT,
  is_confidential BOOLEAN NOT NULL DEFAULT 1,
  follow_up_date DATE NULL,
  created_by TEXT NOT NULL,
  
  FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES church_members(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_visitations_timeline 
ON visitation_records(household_id, visit_date DESC);

-- ====================================================================
-- 9. 소그룹 출석/모임 보고서 테이블 (Phase 3 직결용)
-- ====================================================================
CREATE TABLE IF NOT EXISTS sunday_attendance_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  garden_id INTEGER NOT NULL,
  report_date DATE NOT NULL,
  submitter_member_id INTEGER,
  attendees_count INTEGER NOT NULL DEFAULT 0,
  absentees_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  
  UNIQUE (garden_id, report_date),
  FOREIGN KEY (garden_id) REFERENCES gardens(id) ON DELETE CASCADE,
  FOREIGN KEY (submitter_member_id) REFERENCES church_members(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS gathering_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  garden_id INTEGER NOT NULL,
  gathering_date DATE NOT NULL,
  gathering_time TEXT,
  location TEXT NOT NULL,
  submitter_member_id INTEGER,
  notes TEXT,
  
  FOREIGN KEY (garden_id) REFERENCES gardens(id) ON DELETE CASCADE,
  FOREIGN KEY (submitter_member_id) REFERENCES church_members(id) ON DELETE SET NULL
);
