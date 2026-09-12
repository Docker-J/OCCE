export const getRecentSundays = () => {
  const sundays = [];
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Find the closest past Sunday (if today is Sunday, it starts with today)
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - currentDay);

  for (let i = 0; i < 4; i++) {
    const sunday = new Date(lastSunday);
    sunday.setDate(lastSunday.getDate() - i * 7);
    sundays.push(sunday);
  }
  return sundays;
};

export const formatDateString = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateLabel = (date) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return `${yyyy}년 ${mm}월 ${dd}일 주일`;
};
