import Document, { Html, Head, Main, NextScript } from 'next/document';
import { helvetica,poppins } from "../styles/fonts";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script src="https://meet.jit.si/external_api.js"></script>
          
          {/* Essential Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          
          {/* Web App Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
            
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