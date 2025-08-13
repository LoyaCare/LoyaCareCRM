"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lead Card</h1>
      <p className="text-red-500">Data loading failed : {error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        One more try
      </button>
    </main>
  );
}