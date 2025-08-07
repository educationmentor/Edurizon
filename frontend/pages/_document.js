import Document, { Html, Head, Main, NextScript } from 'next/document';
import { helvetica,poppins } from "../styles/fonts";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>          
          {/* Essential Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
          {/* Web App Manifest */}
          <link rel="manifest" href="/manifest.json" />
          {/* Safari pinned tab icon */}
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          {/* Web App Icons */}
          <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png" />
            
            {/* Theme Color */}
            <meta name="theme-color" content="#ffffff" />
            <meta charSet="UTF-8" />
            {/* Preload Fonts */}
            <link rel="preload" href={poppins.src} as="font" type="font/ttf" crossOrigin="anonymous" />
            <link rel="preload" href={helvetica.src} as="font" type="font/ttf" crossOrigin="anonymous" />

            {/* Global Font Style */}
            <style>{`
              body {
                font-family: ${poppins.style.fontFamily}, sans-serif;
              }

              h1, h2, h3, h4, h5, h6 {
                font-family: ${helvetica.style.fontFamily}, sans-serif;
                font-weight: 700;
              }
            `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;