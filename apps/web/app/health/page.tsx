
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

export default async function HealthPage() {
  const health = await getHealth();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        System Health
      </h1>

      <pre className="mt-4 rounded-lg bg-gray-100 p-4 text-black">
        {JSON.stringify(health ?? { status: 'error' }, null, 2)}
      </pre>
    </main>
  );
}
