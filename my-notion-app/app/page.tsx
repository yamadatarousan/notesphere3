'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchPages, createPage, updatePage, deletePage } from '../lib/api';
import { logout } from '../lib/auth'; // ここを修正

export default function Home() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [pages, setPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // トークン取得
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log('Token loaded:', storedToken || 'none');
        setToken(storedToken || '');
    }, []);

    // ページ一覧取得
    const loadPages = async () => {
        if (!token) {
            console.log('No token, skipping loadPages');
            return;
        }
        setIsLoading(true);
        try {
            console.log('Fetching pages with token:', token);
            const data = await fetchPages(token);
            console.log('Fetched pages:', data);
            setPages(data);
            setError(null);
        } catch (err) {
            console.error('Fetch pages error:', err);
            setError('Failed to fetch pages');
        } finally {
            setIsLoading(false);
        }
    };

    // トークン変更時にページ取得
    useEffect(() => {
        console.log('Token changed, loading pages:', token || 'none');
        loadPages();
    }, [token]);

    // ページ作成
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;
        const form = e.currentTarget;
        const title = form.title.value;
        try {
            console.log('Creating page:', title);
            await createPage({ title }, token);
            console.log('Page created, reloading pages');
            await loadPages();
            form.reset();
        } catch (err) {
            console.error('Create page error:', err);
            setError('Failed to create page');
        }
    };

    // ページ更新
    const handleUpdate = async (id: number, title: string) => {
        if (!token) return;
        try {
            console.log('Updating page:', id, title);
            await updatePage(id, { title }, token);
            console.log('Page updated, reloading pages');
            await loadPages();
        } catch (err) {
            console.error('Update page error:', err);
            setError('Failed to update page');
        }
    };

    // ページ削除
    const handleDelete = async (id: number) => {
        if (!token) return;
        try {
            console.log('Deleting page:', id);
            await deletePage(id, token);
            console.log('Page deleted, reloading pages');
            await loadPages();
        } catch (err) {
            console.error('Delete page error:', err);
            setError('Failed to delete page');
        }
    };

    // ログアウト
    const handleLogout = async () => {
        if (!token) return;
        try {
            console.log('Logging out');
            await logout(token);
            console.log('Logged out, clearing token');
            localStorage.removeItem('token');
            setToken('');
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
            setError('Failed to logout');
        }
    };

    // トークン読み込み中
    if (token === null) {
        console.log('Token is null, showing loading');
        return <div>Loading...</div>;
    }

    // トークンがない場合
    if (!token) {
        console.log('No token, showing login prompt');
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

    // ページ読み込み中、エラー、データなし
    if (isLoading) {
        console.log('Pages loading');
        return <div>Loading...</div>;
    }
    if (error) {
        console.log('Error occurred:', error);
        return <div>Error: {error}</div>;
    }
    if (!pages) {
        console.log('No pages found');
        return <div>No pages found</div>;
    }

    console.log('Rendering pages:', pages);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Pages</h1>
                <button
                    onClick={handleLogout}
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
                    <li key={page.id} className="p-2 border-b flex justify-between">
                        {page.title}
                        <div>
                            <button
                                onClick={() => handleUpdate(page.id, `Updated ${page.title}`)}
                                className="text-blue-500 mr-2"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(page.id)}
                                className="text-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}