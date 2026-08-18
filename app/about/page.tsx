import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'পরিচিতি — খেলারমাঠ',
  description: 'খেলারমাঠ ওয়েবসাইটের পেছনের মানুষ ও উদ্দেশ্য',
};

export default function About() {
  return (
    <>
      <header>
        <Link href="/" className="logo">
          খেলার<span>মাঠ</span>
        </Link>

        <Link href="/" className="btn btn-ghost">
          হোমে ফিরুন
        </Link>
      </header>

      <main
        style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: '44px 20px',
        }}
      >
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 32,
            background: '#fff',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 140,
              height: 140,
              margin: '0 auto 20px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #f59e0b',
            }}
          >
            <Image
              src="/ripon.jpg"
              alt="Md Jibon Hasan Ripon"
              fill
              sizes="140px"
              style={{
                objectFit: 'cover',
              }}
              priority
            />
          </div>

          <h1
            className="anton"
            style={{
              fontSize: 26,
              color: '#111827',
              marginBottom: 6,
            }}
          >
            Md Jibon Hasan Ripon
          </h1>

          <p
            style={{
              color: '#6b7280',
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            প্রতিষ্ঠাতা ও ওয়েব ডেভেলপার — খেলারমাঠ
          </p>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              textAlign: 'left',
              marginBottom: 28,
              color: '#374151',
            }}
          >
            খেলা, গল্প, প্রযুক্তি ও সাইবার সিকিউরিটি — সবকিছু নিয়ে
            আমাদের ওয়েবসাইটে পাবেন দরকারি ও আকর্ষণীয় তথ্য।
            নতুন কিছু শেখা, জানা ও বিনোদনের জন্য নিয়মিত আপডেটেড
            কনটেন্ট প্রকাশ করা হয়।
          </p>

          <div
            style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <span
              className="field-label"
              style={{
                marginBottom: 4,
                color: '#6b7280',
              }}
            >
              যোগাযোগ করুন
            </span>

            <a
              href="https://www.facebook.com/sk.ripon.splash"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                width: '100%',
                maxWidth: 280,
                justifyContent: 'center',
              }}
            >
              ফেসবুকে দেখুন
            </a>

            <a
              href="mailto:jibonhasanripon1@gmail.com"
              className="btn btn-outline"
              style={{
                width: '100%',
                maxWidth: 280,
                justifyContent: 'center',
              }}
            >
              jibonhasanripon1@gmail.com
            </a>
          </div>
        </div>
      </main>

      <footer>
        <div className="logo anton">
          খেলার<span>মাঠ</span>
        </div>
        খেলার সব খবর, এক জায়গায় · © ২০২৬
      </footer>
    </>
  );
}
