import siteConfig from '../siteConfig.json';
import projects from '../data/projects';

import Link from 'next/link';

import Layout from '../components/layout';

export default function Projects() {
  return (
    <Layout title="code" description="a selection of my projects">
      <main>
        <h3 className="spacer" />
        <div className="project-list">
          {projects.map((project, i) => (
            <div className="project" key={i}>
              <a href={project.link} target="_blank">
                {project.name}
              </a>
              <p className="project-desc">{project.desc}</p>
              {project.to ? (
                <p className="project-post">
                  read the <Link href={project.to}>blogpost</Link>
                </p>
              ) : null}
            </div>
          ))}
        </div>
        <h3>
          more on{' '}
          <a href={`https://github.com/${siteConfig.AUTHOR_GITHUB}`} target="_blank">
            github &#x2197;
          </a>
        </h3>
      </main>
      <style jsx>{`
        .spacer {
          padding-bottom: 30px;
        }
        .project {
          flex: 50%;
          padding-right: 20px;
          padding-bottom: 28px;
        }
        .project-desc {
          margin-top: 4px;
          margin-bottom: 0px;
        }
        .project-post {
          margin-top: 0px;
          color: var(--light-text);
        }
        .project-list {
          display: flex;
          flex-wrap: wrap;
        }
        @media only screen and (max-width: ${siteConfig.LAYOUT_WIDTH}px) {
          .project-list {
            display: block;
          }
          .project {
            padding-right: 0px;
          }
        }
      `}</style>
    </Layout>
  );
}
