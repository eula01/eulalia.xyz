import Link from 'next/link';
import { getAllTags, getPostsFilteredByTag } from '../../lib/posts';
import Layout from '../../components/layout';
import PostList from '../../components/postList';

export function getStaticPaths() {
  const tags = getAllTags();
  const paths = tags.map((tag) => ({
    params: { tag: tag },
  }));

  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  return {
    props: {
      otherTags: getAllTags().filter((tag) => tag !== params.tag),
      tag: params.tag,
      posts: getPostsFilteredByTag(params.tag),
    },
  };
}

export default function TagList({ otherTags, tag, posts }) {
  const title = `${tag} posts`;
  console.log('??', otherTags, tag, posts);

  return (
    <Layout title={title} description={`All posts tagged with ${tag}`}>
      <h1 className="tag-wrap">{title}</h1>
      <main>
        <p className="tags">
          {otherTags.length ? (
            <span>
              other tags:{' '}
              {otherTags
                .map((tag, i) => (
                  <Link href={`/tags/${otherTags[i]}`} key={i}>
                    {tag}
                  </Link>
                ))
                .reduce((prev, curr) => [prev, ', ', curr])}{' '}
              or
            </span>
          ) : null}{' '}
          <Link href="/articles">all articles</Link>
        </p>
        <PostList posts={posts} />
      </main>
      <style jsx>{`
        .tag-wrap {
          margin-bottom: 5px;
          padding-bottom: 0px;
        }
        .tags {
          margin-top: 0px;
          color: var(--light-text);
          padding-bottom: 24px;
        }
      `}</style>
    </Layout>
  );
}
