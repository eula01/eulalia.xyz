import Link from 'next/link';
import Date from './date';

export default function PostList({ posts }) {
  return (
    <div>
      {posts.map(({ id, date, title }) => (
        <div className="post" key={id}>
          <div className="post-date"><Date dateString={date} /></div>
          <Link href={`/${id}`}>
            <a>{title}</a>
          </Link>
        </div>
      ))}
      <style jsx>{`
        .post {
          display: grid;
          grid-template-columns: 15ch auto;
          padding-bottom: 20px;
        }
        .post-date {
          color: var(--light-text);
        }

      `}</style>
    </div>
  );
}
