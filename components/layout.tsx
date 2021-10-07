import siteConfig from '../siteConfig.json';

import Head from 'next/head';

import Nav from './nav';
import codeTheme from './codeTheme';

export default function Layout({ children, title, description }) {
  return (
    <div className="container">
      <Head>
        <script
          data-goatcounter={`https://${siteConfig.GOAT_COUNTER}.goatcounter.com/count`}
          async
          src="//gc.zgo.at/count.js"
        />

        <title>
          {title} — {siteConfig.AUTHOR_NAME}
        </title>
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta charSet="UTF-8" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />

        <meta property="twitter:card" content="summary" />
        <meta
          property="twitter:site"
          content={`@${siteConfig.AUTHOR_TWITTER}`}
        />
        <meta
          property="twitter:creator"
          content={`@${siteConfig.AUTHOR_TWITTER}`}
        />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Nav />
      <div>{children}</div>
      <style jsx global>{`
        :root {
          --text: #1d1d27;
          --input-background: #fff;
          --link: #16b8f3;
          --link-hover: #496495;
          --light-text: #9999b8;
          --harmony: #f35c16;
          --border: #b6b6c2;
          --button: #4a7ddd;
          --button-text: #fff;
        }

        .light-1 {
          color: var(--light-text)
        }

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol';
          font-size: 15px;
          letter-spacing: -0.01em;
        }
        .container {
          display: grid;
          grid-template-columns: 15em 1fr;
          grid-template-rows: 1fr;
          max-width: 54em;
          padding-top: 0;
          margin-left: auto;
          margin-right: auto;
          max-width: ${siteConfig.LAYOUT_WIDTH}px;
          padding-top: 50px;
          padding-right: 16px;
          padding-bottom: 96px;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          letter-spacing: -0.24px;
          font-weight: 400;
          padding-top: 16px;
          padding-bottom: 16px;
        }

        p {
          margin-bottom: 24px;
          line-height: 24px;
          color: var(--text);
        }

        pre,
        code {
          font-family: 'Roboto Mono', monospace;
          font-size: 14px;
        }

        code {
          background-color: ${codeTheme.plain.backgroundColor};
          padding: 2px;
        }

        hr {
          border-top: 1px solid var(--border);
          margin-top: 48px;
          margin-bottom: 48px;
        }

        div[class*='language-'],
        div[class*='language-'] {
          line-height: 24px;
          padding-top: 8px;
          padding-left: 8px;
          padding-right: 8px;
          padding-bottom: 16px;
          overflow: overlay;
        }

        * {
          box-sizing: border-box;
        }

        a {
          color: var(--link);
          text-decoration: none;
        }

        a:hover {
          color: var(--link-hover);
          text-decoration: none;
        }

        ul {
          list-style-type: square;
        }

        li {
          padding-bottom: 6px;
          line-height: 24px;
        }

        blockquote {
          margin-left: 16px;
          border-left-color: var(--border);
          border-left-style: solid;
          border-left-width: 1px;
        }

        blockquote > p {
          padding-left: 16px;
        }
      `}</style>
    </div>
  );
}
