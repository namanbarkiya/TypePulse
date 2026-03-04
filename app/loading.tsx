export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
        <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl flex flex-col gap-6 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-white/10 rounded" />
            <div className="h-4 w-2/3 bg-white/10 rounded" />
          </div>
          <div className="flex flex-col gap-3" style={{ height: "9.75rem" }}>
            <div className="h-8 w-full bg-white/10 rounded" />
            <div className="h-8 w-full bg-white/10 rounded" />
            <div className="h-8 w-3/4 bg-white/10 rounded" />
          </div>
          <div className="h-3 w-40 bg-white/10 rounded self-end" />
        </div>
      </div>
      <div className="px-8 py-5 border-t border-white/5">
        <div className="h-3 w-64 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
}
