'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchPages, createPage, updatePage, deletePage } from '../lib/api';
import { logout } from '../lib/auth';
import { Toaster, toast } from 'react-hot-toast';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import 'tailwindcss/tailwind.css';

export default function Home() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [pages, setPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingPage, setEditingPage] = useState<{ id: number; title: string; content: string } | null>(null);

    // Tiptap エディター
    const editor = useEditor({
        extensions: [StarterKit],
        content: editingPage ? editingPage.content : '',
        onUpdate: ({ editor }) => {
            console.log('Editor content:', editor.getHTML());
        },
    });

    useEffect(() => {
        if (editingPage && editor) {
            editor.commands.setContent(editingPage.content || '');
        }
    }, [editingPage, editor]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log('Token loaded:', storedToken || 'none');
        setToken(storedToken || '');
    }, []);

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
            setError('ページの取得に失敗しました');
            toast.error('ページの取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Token changed, loading pages:', token || 'none');
        loadPages();
    }, [token]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !editor) return;
        const form = e.currentTarget;
        const title = form.title.value;
        const content = editor.getHTML();
        try {
            console.log('Creating page:', title, content);
            await createPage({ title, content }, token);
            console.log('Page created, reloading pages');
            toast.success('ページを作成しました');
            await loadPages();
            form.reset();
            editor.commands.setContent('');
        } catch (err) {
            console.error('Create page error:', err);
            setError('ページの作成に失敗しました');
            toast.error('ページの作成に失敗しました');
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !editor || !editingPage) return;
        const form = e.currentTarget;
        const title = form.title.value;
        const content = editor.getHTML();
        try {
            console.log('Updating page:', editingPage.id, title, content);
            await updatePage(editingPage.id, { title, content }, token);
            console.log('Page updated, reloading pages');
            toast.success('ページを更新しました');
            await loadPages();
            setEditingPage(null);
            editor.commands.setContent('');
            form.reset();
        } catch (err) {
            console.error('Update page error:', err);
            setError('ページの更新に失敗しました');
            toast.error('ページの更新に失敗しました');
        }
    };

    const startEditing = (page: { id: number; title: string; content: string }) => {
        setEditingPage(page);
    };

    const cancelEditing = () => {
        setEditingPage(null);
        if (editor) {
            editor.commands.setContent('');
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        try {
            console.log('Deleting page:', id);
            await deletePage(id, token);
            console.log('Page deleted, reloading pages');
            toast.success('ページを削除しました');
            await loadPages();
        } catch (err) {
            console.error('Delete page error:', err);
            setError('ページの削除に失敗しました');
            toast.error('ページの削除に失敗しました');
        }
    };

    const handleLogout = async () => {
        if (!token) return;
        try {
            console.log('Logging out');
            await logout(token);
            console.log('Logged out, clearing token');
            localStorage.removeItem('token');
            setToken('');
            router.push('/login');
            toast.success('ログアウトしました');
        } catch (err) {
            console.error('Logout error:', err);
            setError('ログアウトに失敗しました');
            toast.error('ログアウトに失敗しました');
        }
    };

    if (token === null) {
        console.log('Token is null, showing loading');
        return <div>Loading...</div>;
    }

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

    if (isLoading) {
        console.log('Pages loading');
        return <div className="spinner">Loading...</div>;
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
            <Toaster />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Pages</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white p-2 rounded"
                >
                    Logout
                </button>
            </div>
            <form onSubmit={editingPage ? handleUpdate : handleCreate} className="mb-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Page title"
                    defaultValue={editingPage ? editingPage.title : ''}
                    className="border p-2 mr-2 rounded w-full mb-2"
                    required
                />
                <EditorContent editor={editor} className="border p-2 rounded mb-2" />
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {editingPage ? 'Save' : 'Create Page'}
                    </button>
                    {editingPage && (
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className="bg-gray-500 text-white p-2 rounded"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
            <ul>
                {pages.map((page: any) => (
                    <li key={page.id} className="p-2 border-b flex justify-between">
                        <div>
                            <div>{page.title}</div>
                            <div className="text-gray-500 text-sm">
                                {page.content ? page.content.substring(0, 50) + '...' : 'No content'}
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => startEditing(page)}
                                className="text-blue-500 mr-2"
                            >
                                Edit
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