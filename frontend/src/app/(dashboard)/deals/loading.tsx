export default function LoadingLeads() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DealsLoading...</h1>
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}