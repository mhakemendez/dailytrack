import { Suspense } from 'react';

type HealthResponse = {
  status: string;
  database: string;
  timestamp: string;
};

async function getHealth(): Promise<HealthResponse | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/health`,
      { cache: 'no-store' },
    );

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

async function HealthStatus() {
  const health = await getHealth();

  return (
    <pre className="mt-4 rounded-lg bg-gray-100 p-4 text-black">
      {JSON.stringify(health ?? { status: 'error' }, null, 2)}
    </pre>
  );
}

export default function HealthPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">System Health</h1>

      <Suspense fallback={<p className="mt-4">Checking system health...</p>}>
        <HealthStatus />
      </Suspense>
    </main>
  );
}