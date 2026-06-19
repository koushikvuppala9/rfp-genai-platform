'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

export default function TestApiPage() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await apiClient.get('/health');
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'API request failed');
      }
    }

    checkApi();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>API Test</h1>

      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}

      {error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}
    </main>
  );
}
