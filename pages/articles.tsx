import Link from 'next/link';
import { getAllTags, getSortedPostsData } from '../lib/posts';
import Layout from '../components/layout';
import PostList from '../components/postList';

export function getStaticProps() {
  return {
    props: { tags: getAllTags(), posts: getSortedPostsData() },
  };
}

export default function Articles({ tags, posts }) {
  const title = 'writing';
  return (
    <Layout title={title} description="my blogposts">
      <main>
        <p className="tags">
          tags:{' '}
          {tags
            .map((tag, i) => (
              <Link href={`/tags/${tags[i]}`} key={i}>
                {tag}
              </Link>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])
            }
        </p>
        <PostList posts={posts} />
      </main>
      <style jsx>{`
        .tags {
          color: var(--light-text);
          padding-bottom: 24px;
        }
      `}</style>
    </Layout>
  );
}
