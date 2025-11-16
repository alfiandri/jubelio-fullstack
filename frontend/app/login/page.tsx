"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../lib/api';
import AnimatedPage from "./../AnimatedPage";


export default function LoginPage() {
    const [email, setEmail] = useState('admin@demo.local');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const router = useRouter();


    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true); setErr(null);
        try {
            const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
            if (!res.ok) throw new Error('Invalid');
            const { token } = await res.json();
            localStorage.setItem('token', token);
            router.push('/');
        } catch (e) { setErr('Login failed'); }
        finally { setLoading(false); }
    }


    return (
        <AnimatedPage>
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl mb-4">Login</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 bg-panel rounded" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 bg-panel rounded" />
                    <button className="button bg-accent text-bg" type="submit" disabled={loading}>{loading ? '...' : 'Login'}</button>
                    {err && <div className="text-red-400">{err}</div>}
                </form>
            </div>
        </AnimatedPage>
    );
}