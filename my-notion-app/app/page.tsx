// app/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPages, createPage } from '../lib/api';

export default function Home() {
  const queryClient = useQueryClient();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const { data: pages, isLoading, error } = useQuery({
    queryKey: ['pages'],
    queryFn: () => fetchPages(token),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content?: string }) => createPage(data, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = form.title.value;
    await createMutation.mutateAsync({ title });
    form.reset();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!pages) return <div>No pages found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Pages</h1>
      <form onSubmit={handleCreate} className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Page title"
          className="border p-2 mr-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Page
        </button>
      </form>
      <ul>
        {pages.map((page: any) => (
          <li key={page.id} className="p-2 border-b">
            {page.title}
          </li>
        ))}
      </ul>
    </div>
  );
}