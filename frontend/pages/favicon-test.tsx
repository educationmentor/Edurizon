import Head from 'next/head';

export default function FaviconTest() {
  return (
    <>
      <Head>
        <title>Favicon Test</title>
        <link rel="icon" href="/favicon.ico?v=3" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
      </Head>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Favicon Test Page</h1>
        <p>Check the browser tab to see if the favicon appears.</p>
        <p>If you don't see the favicon:</p>
        <ul>
          <li>Hard refresh the page (Ctrl+F5)</li>
          <li>Clear browser cache</li>
          <li>Try in incognito mode</li>
          <li>Check browser developer tools Network tab</li>
        </ul>
        
        <h2>Direct links to test favicon files:</h2>
        <ul>
          <li><a href="/favicon.ico" target="_blank">favicon.ico</a></li>
          <li><a href="/favicon-32x32.png" target="_blank">favicon-32x32.png</a></li>
          <li><a href="/favicon-16x16.png" target="_blank">favicon-16x16.png</a></li>
          <li><a href="/apple-touch-icon.png" target="_blank">apple-touch-icon.png</a></li>
        </ul>
      </div>
    </>
  );
} 