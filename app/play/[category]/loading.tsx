export default function PlayLoading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6 animate-pulse">
        {/* Source + title skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-4 w-3/4 bg-white/10 rounded" />
        </div>
        {/* Text block skeleton — 3 shimmer lines */}
        <div className="flex flex-col gap-3">
          <div className="h-6 w-full bg-white/10 rounded" />
          <div className="h-6 w-full bg-white/10 rounded" />
          <div className="h-6 w-2/3 bg-white/10 rounded" />
        </div>
        {/* Shortcut bar skeleton */}
        <div className="h-4 w-48 bg-white/10 rounded self-end" />
      </div>
    </main>
  );
}
