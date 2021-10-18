import siteConfig from '../siteConfig.json';

import Link from 'next/link';

export default function Nav() {
  return (
    <div>
      <nav className="nav">
        <ul>
          <li>
            <Link href="/">Sean Waplington</Link>
          </li>
          <li className="spacer">
            <Link href="/about">about</Link>
          </li>
          <li className="spacer">
            <Link href="/articles">writing</Link>
          </li>
          <li>
            <Link href="/projects">code</Link>
          </li>
          <li className="spacer">
            <li>
              <a href={`https://keybase.io/${siteConfig.AUTHOR_KEYBASE}`} target="_blank">
                keybase &#x2197;
              </a>
            </li>

            <a href={`https://github.com/${siteConfig.AUTHOR_GITHUB}`} target="_blank">
              github &#x2197;
            </a>
          </li>
          <li>
            <a href={`https://twitter.com/${siteConfig.AUTHOR_TWITTER}`} target="_blank">
              twitter &#x2197;
            </a>
          </li>
          <li>
            <a href={`https://www.linkedin.com/in/${siteConfig.AUTHOR_LINKEDIN}`} target="_blank">
              linkedin &#x2197;
            </a>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        ul {
          list-style: none;
        }
        li {
          padding-right: 10px;
        }
        .spacer {
          margin-top: 20px;
        }
        .nav {
          text-align: left;
          font-size: 1.2em;
          height: 10em;
          line-height: 140%;
          position: -webkit-sticky;
          position: sticky;
          top: 0;
        }
      `}</style>
    </div>
  );
}
