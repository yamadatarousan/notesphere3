'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPages, createPage } from '../lib/api';
import { logout } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    if (!token) {
        return (
            <div className="container mx-auto p-4">
                <p>Please log in to view pages.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    const { data: pages, isLoading, error } = useQuery({
        queryKey: ['pages'],
        queryFn: () => fetchPages(token),
        enabled: !!token,
    });

    const createMutation = useMutation({
        mutationFn: (data: { title: string; content?: string }) => createPage(data, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
    });

    const logoutMutation = useMutation({
        mutationFn: () => logout(token),
        onSuccess: () => router.push('/login'),
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
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Pages</h1>
                <button
                    onClick={() => logoutMutation.mutate()}
                    className="bg-red-500 text-white p-2 rounded"
                >
                    Logout
                </button>
            </div>
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