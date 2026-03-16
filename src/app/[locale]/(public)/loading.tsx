export default function PublicLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="relative h-[60vh] min-h-[420px] w-full bg-primary/20" />

      <div className="container-custom py-16">
        <div className="mx-auto mb-14 max-w-lg text-center">
          <div className="mx-auto mb-3 h-4 w-32 rounded bg-accent/20" />
          <div className="mx-auto mb-2 h-8 w-64 rounded bg-surface" />
          <div className="mx-auto mt-5 h-px w-20 bg-accent/20" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[300px] rounded-2xl bg-surface shadow-card"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
