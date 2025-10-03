export default function Loading() {
  return (
    <div className="flex justify-center items-center gap-[10px]">
      <div className="relative">
        <div className="absolute w-8 h-8 border-6 border-blue-200 rounded-full animate-spin" />
        <div className="absoulte w-8 h-8 border-6 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <span>로딩 중...</span>
    </div>
  );
}
