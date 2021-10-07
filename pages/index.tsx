import siteConfig from '../siteConfig.json';
import av2 from '../public/assets/av2.jpeg';

import Image from 'next/image';
import Link from 'next/link';

import Layout from '../components/layout';
import PostList from '../components/postList';

import { getSortedPostsData, getPostData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const words = allPostsData.reduce(
    (count, current) =>
      count + getPostData(current.id).content.split(' ').length,
    0
  );
  return {
    props: {
      allPostsData,
      description: siteConfig.SITE_DESC,
      words,
    },
  };
}

export default function Home({ allPostsData, description, words }) {
  return (
    <Layout title="Blog" description={description}>
      <main>
        {/* <div className="avi">
          <Image src="" />
          <p className="avi-text">
            somewhere nice, for my thoughts and code place
          </p>
        </div> */}

        <div className="posts">
          <section className="posts-section">
            <h2>recent:</h2>
            <PostList posts={allPostsData.slice(0, 4)} />
          </section>
        </div>
      </main>
      <footer></footer>
      <style jsx>{`
        .avi {
          display: flex;
          align-items: center;
          padding-top: 30px;
        }
        .avi-text {
          margin-left: 30px;
        }
      `}</style>
    </Layout>
  );
}
