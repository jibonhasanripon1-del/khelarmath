'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Post } from '@/lib/supabase';

const CATEGORIES = ['ক্রিকেট', 'ফুটবল', 'টেনিস', 'অ্যাথলেটিক্স', 'অন্যান্য'];

// হাইড্রেশন এরর এড়াতে client-side time calculation function
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'এইমাত্র';
  if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
  return `${Math.floor(diff / 86400)} দিন আগে`;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('সব');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // ক্লায়েন্ট রেন্ডার নিশ্চিত করার জন্য মাউন্ট স্টেট
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setPosts(data as Post[]);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = activeCategory === 'সব'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const latest = posts.slice(0, 4);

  return (
    <>
      {/* সর্বশেষ সংবাদের টিকার */}
      <div className="ticker-wrap">
        <div className="ticker">
          {latest.length > 0 ? (
            <>
              {[...latest, ...latest].map((p, i) => (
                <span key={`${p.id}-${i}`}><span className="dot"></span> {p.title}</span>
              ))}
            </>
          ) : (
            <span><span className="dot"></span> খেলারমাঠে স্বাগতম — সর্বশেষ খবরের জন্য চোখ রাখুন</span>
          )}
        </div>
      </div>

      <header>
        <Link href="/" className="logo">খেলার<span>মাঠ</span></Link>
        <Link href="/admin" className="btn btn-primary">অ্যাডমিন লগইন</Link>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '30px 5%' }}>
        {/* ক্যাটাগরি ফিল্টার ফিলস */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {['সব', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill ${activeCategory === cat ? 'active' : ''}`}
            >{cat}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '60px 0' }}>লোড হচ্ছে...</p>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '70px 20px', border: '1px dashed var(--line)', borderRadius: 6
          }}>
            <p className="anton" style={{ fontSize: 22, color: 'var(--pitch)', marginBottom: 8, textTransform: 'uppercase' }}>
              এখনো কোনো খবর নেই
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              অ্যাডমিন লগইন করে প্রথম খবর প্রকাশ করুন।
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 22 }}>
            {filtered.map(p => (
              <div key={p.id} className="card" onClick={() => setSelectedPost(p)}>
                <div
                  className="card-img"
                  style={p.image ? { backgroundImage: `url(${p.image})` } : {}}
                />
                <div className="card-body">
                  <span className="card-tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  {/* suppressHydrationWarning যোগ করা হয়েছে হাইড্রেশন এরর ঠেকাতে */}
                  <span className="meta" suppressHydrationWarning>
                    {isMounted ? timeAgo(p.created_at) : 'কিছুক্ষণ আগে'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* বিস্তারিত খবর দেখার মডাল পপআপ */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,42,30,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 6, maxWidth: 640, width: '100%', maxHeight: '85vh',
              overflowY: 'auto', position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.5)', border: 'none',
                borderRadius: '50%', width: 32, height: 32, color: '#fff', cursor: 'pointer', fontSize: 16, zIndex: 2
              }}
            >✕</button>
            {selectedPost.image && (
              <div style={{ height: 220, backgroundImage: `url(${selectedPost.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            )}
            <div style={{ padding: 28 }}>
              <span className="card-tag">{selectedPost.category}</span>
              <h2 className="anton" style={{ fontSize: 26, margin: '10px 0', lineHeight: 1.3 }}>{selectedPost.title}</h2>
              <span className="meta" suppressHydrationWarning>{timeAgo(selectedPost.created_at)}</span>
              <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selectedPost.body}</p>
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="logo anton">খেলার<span>মাঠ</span></div>
        খেলার সব খবর, এক জায়গায় · © ২০২৬
      </footer>
    </>
  );
}
