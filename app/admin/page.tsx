'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  const [isMounted, setIsMounted] = useState(false); // হাইড্রেশন এরর এড়াতে
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // পেজ লোড হওয়ার পর সেশন চেক করে ড্যাশবোর্ডে রিডাইরেক্ট করা
    if (typeof window !== 'undefined' && sessionStorage.getItem('khelarmath_admin') === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError('দয়া করে পাসওয়ার্ডটি লিখুন');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      // নেটওয়ার্ক বা সার্ভার এরর চেক
      if (!res.ok) {
        throw new Error('সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করুন');
      }

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('khelarmath_admin', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'পাসওয়ার্ড ভুল হয়েছে');
      }
    } catch (err) {
      console.error(err);
      setError('লগইন করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  }

  // হাইড্রেশন শেষ হওয়া পর্যন্ত সাদা স্ক্রিন বা লোডার দেখানো (কনসোল এরর এড়াতে)
  if (!isMounted) return null;

  return (
    <>
      <header>
        <Link href="/" className="logo">খেলার<span>মাঠ</span></Link>
      </header>
      <div style={{ maxWidth: 380, margin: '60px auto', padding: '0 20px' }}>
        <div style={{ border: '1px solid var(--line)', borderRadius: 6, padding: 30, background: '#fff' }}>
          <h2 className="anton" style={{ color: 'var(--pitch)', fontSize: 24, marginBottom: 6, textTransform: 'uppercase' }}>
            অ্যাডমিন লগইন
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            আপনার নির্ধারিত পাসওয়ার্ড দিন
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="পাসওয়ার্ড লিখুন"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="field-input"
              style={{ marginBottom: 12, width: '100%', boxSizing: 'border-box' }}
              disabled={loading} // লগইন চলার সময় ইনপুট ডিজেবল
              required
            />
            {error && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: 12,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading} // ডাবল ক্লিক আটকাতে
            >
              {loading ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
