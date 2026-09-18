/**
 * @file memberUtils.js
 * @description 교인 관리 페이지 유틸리티 함수 및 스타일 상수
 */

/**
 * 북미 전화번호 형식 변환 (+1 (XXX) XXX-XXXX)
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    const num = cleaned.slice(1);
    return `+1 (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
  }
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const TITLE_BG_STYLE = {
  backgroundImage: 'url("/img/Community/SmallGroup.webp")',
  backgroundPositionY: "35%",
};
