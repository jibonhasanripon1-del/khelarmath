'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Post } from '@/lib/supabase';

const CATEGORIES = ['ক্রিকেট', 'ফুটবল', 'টেনিস', 'অ্যাথলেটিক্স', 'অন্যান্য'];

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'এইমাত্র';
  if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
  return `${Math.floor(diff / 86400)} দিন আগে`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'ক্রিকেট', image: '', body: '' });

  const loadPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPosts(data as Post[]);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('khelarmath_admin') !== 'true') {
        router.push('/admin');
        return;
      }
      setChecked(true);
      loadPosts();
    }
  }, [router, loadPosts]);

  function handleLogout() {
    sessionStorage.removeItem('khelarmath_admin');
    router.push('/');
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from('posts').insert({
        title: form.title.trim(),
        category: form.category,
        image: form.image.trim() || null,
        body: form.body.trim(),
      });

      if (!error) {
        setForm({ title: '', category: 'ক্রিকেট', image: '', body: '' });
        setImageError(false);
        loadPosts();
      } else {
        alert('পোস্ট করতে সমস্যা হয়েছে: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('একটি অপ্রত্যাশিত সমস্যা হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('এই খবরটি মুছে ফেলতে চান?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) loadPosts();
    } catch (err) {
      console.error(err);
    }
  }

  const handleImageChange = (val: string) => {
    setImageError(false);
    setForm({ ...form, image: val });
  };

  if (!checked || !isMounted) return null;

  return (
    <>
      <header>
        <Link href="/" className="logo">খেলার<span>মাঠ</span></Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/" className="btn btn-ghost">সাইট দেখুন</Link>
          <button onClick={handleLogout} className="btn btn-ghost">লগআউট</button>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>
        <h2 className="anton" style={{ color: 'var(--pitch)', fontSize: 26, marginBottom: 20, textTransform: 'uppercase' }}>
          নতুন খবর লিখুন
        </h2>
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="field-label">শিরোনাম</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="যেমন: শেষ ওভারে জয় ছিনিয়ে নিলো বাংলাদেশ"
              className="field-input"
              required
            />
          </div>
          <div>
            <label className="field-label">ক্যাটাগরি</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="field-input"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">ছবির লিংক (ঐচ্ছিক)</label>
            <input
              value={form.image}
              onChange={e => handleImageChange(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="field-input"
            />
            {form.image && !imageError && (
              <div style={{ marginTop: 10, height: 140, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--line)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>
          <div>
            <label className="field-label">খবরের বিস্তারিত</label>
            <textarea
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              placeholder="এখানে পুরো খবর লিখুন..."
              rows={8}
              className="field-input"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting} 
            className="btn btn-amber" 
            style={{ 
              justifyContent: 'center', 
              padding: 13, 
              marginTop: 6,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'পাবলিশ হচ্ছে...' : 'পাবলিশ করুন'}
          </button>
        </form>

        {posts.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <h3 className="anton" style={{ color: 'var(--pitch)', fontSize: 19, marginBottom: 14, textTransform: 'uppercase' }}>
              প্রকাশিত খবরসমূহ ({posts.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {posts.map(p => (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: '1px solid var(--line)', borderRadius: 4, padding: '12px 14px'
                }}>
                  <div style={{ paddingRight: 10, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </div>
                    <div className="meta" suppressHydrationWarning>
                      {p.category} · {timeAgo(p.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ background: 'transparent', border: 'none', color: '#C0392B', padding: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, flexShrink: 0 }}
                  >
                    মুছুন
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
