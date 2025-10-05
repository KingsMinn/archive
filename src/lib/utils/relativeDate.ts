export function relativeDate(date: Date | string) {
  const now = new Date();
  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) return "날짜 없음";

  const diffMs = now.getTime() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHour / 24);
  const diffMonths = Math.floor(diffDays / 30); //TODO: 대략적인 계산, 추후 수정

  if (diffMin < 1) return "방금 전";
  if (diffHour < 1) return `${diffMin}분 전`;
  if (diffDays < 1) return `${diffMin}시간 전`;
  if (diffDays === 1) return "어제";
  if (diffDays === 2) return "그저께";
  if (diffMonths < 1) return `${diffDays}일 전`;
  if (diffMonths < 12) return `${diffMonths}개월 전`;
  return formatAbsoluteDate(targetDate);
}

export function formatAbsoluteDate(date: Date | string) {
  const target = new Date(date);
  const year = target.getFullYear();
  const month = target.getMonth() + 1;
  const day = target.getDay();
  return `${year}년 ${month}월 ${day}일`;
}
