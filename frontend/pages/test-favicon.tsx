import { useEffect } from 'react';
import Head from 'next/head';

export default function TestFavicon() {
  useEffect(() => {
    // Test if favicon files are accessible
    const testFiles = [
      '/favicon.ico',
      '/favicon-32x32.png',
      '/favicon-16x16.png',
      '/apple-touch-icon.png'
    ];

    testFiles.forEach(file => {
      fetch(file)
        .then(response => {
          if (response.ok) {
            console.log(`✅ ${file} is accessible`);
          } else {
            console.log(`❌ ${file} is not accessible (${response.status})`);
          }
        })
        .catch(error => {
          console.log(`❌ ${file} error:`, error);
        });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Favicon Test</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </Head>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Favicon Test Page</h1>
        <p>Check the browser console to see if favicon files are accessible.</p>
        <p>Also check the browser tab to see if the favicon appears.</p>
        
        <h2>Expected favicon files:</h2>
        <ul>
          <li>/favicon.ico</li>
          <li>/favicon-32x32.png</li>
          <li>/favicon-16x16.png</li>
          <li>/apple-touch-icon.png</li>
        </ul>
        
        <h2>Troubleshooting:</h2>
        <ul>
          <li>Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
          <li>Clear browser cache</li>
          <li>Try in incognito/private mode</li>
          <li>Check browser developer tools Network tab</li>
        </ul>
      </div>
    </>
  );
} 