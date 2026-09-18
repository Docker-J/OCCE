/**
 * @file textUtils.js
 * @description HTML 텍스트 가공 및 추출 성능 최적화 유틸리티
 */

const HTML_ENTITY_MAP = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

const ENTITY_REGEX = /&(?:nbsp|amp|lt|gt|quot|#39|apos);/gi;
const TAG_REGEX = /<[^>]+>/g;
const WHITESPACE_REGEX = /\s+/g;

// 렌더링 루프 시 중복 파싱을 방지하기 위한 캐시
const textCache = new Map();
const MAX_CACHE_SIZE = 500;

/**
 * HTML 문자열에서 태그와 엔티티를 제거하고 순수 텍스트를 추출합니다.
 * DOMParser 생성으로 인한 메인 스레드 블로킹(Jank)을 방지하기 위해
 * 초경량 정규식 처리 및 메모이제이션 캐시를 적용했습니다.
 * 
 * @param {string} html - 파싱할 원본 HTML 문자열
 * @returns {string} 추출된 순수 텍스트
 */
export const extractPlainText = (html) => {
  if (!html || typeof html !== "string") return "";

  if (textCache.has(html)) {
    return textCache.get(html);
  }

  // 1. 단락/블록 태그 닫힘 시 공백을 추가하여 단어가 붙는 현상 방지
  const spaced = html.replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, " ");

  // 2. 모든 HTML 태그 제거
  const withoutTags = spaced.replace(TAG_REGEX, "");

  // 3. 주요 HTML 엔티티 치환
  const decoded = withoutTags.replace(ENTITY_REGEX, (match) => {
    return HTML_ENTITY_MAP[match.toLowerCase()] ?? " ";
  });

  // 4. 불필요한 연속 공백 정규화
  const plainText = decoded.replace(WHITESPACE_REGEX, " ").trim();

  // 캐시 크기 제한 유지
  if (textCache.size >= MAX_CACHE_SIZE) {
    const firstKey = textCache.keys().next().value;
    textCache.delete(firstKey);
  }
  textCache.set(html, plainText);

  return plainText;
};
