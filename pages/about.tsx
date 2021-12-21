import siteConfig from '../siteConfig.json';
import marsStation from '../public/assets/mars-station.jpeg';
import bread0 from '../public/assets/bread0.jpeg'; // bread0 dims = 3024 × 4032 (0.75)
import av2 from '../public/assets/av2.jpeg'; // av2 dims = 1080 × 720 (1.5)

import { useState } from 'react';
import { usePopper } from 'react-popper';

import Layout from '../components/layout';
import Image from 'next/dist/client/image';

export default function About() {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement>(null);
  // const [arrowElement, setArrowElement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { styles, attributes, update } = usePopper(referenceElement, popperElement);

  const handleShow = () => {
    popperElement.setAttribute('show', '');
    update();
  };
  const handleHide = () => {
    popperElement.removeAttribute('show');
  };

  return (
    <Layout title="About" description="About me">
      <main>
        <Image src={av2} width={300} height={200} alt="me" quality={100} placeholder="blur" />
        <p>
          <p>
            I'm a software engineer based in Europe. This site is for thoughts on programming,
            rationality, and anything else I find interesting. Currently, I'm interested in Golang,
            decentralised computing, and Web3.
          </p>
          <p>
            If you like building things, have ambitious ideas, or just like talking about software,
            then this is an open invitation to reach out! I rarely check Twitter these days– email
            is best:
            <a className="orange"> seanwaplington[át]gmail[dōt]com</a>
          </p>
          Some random interests:{' '}
          <span className="hover_img">
            <button
              className="btn1"
              ref={setReferenceElement}
              onMouseEnter={handleShow}
              onMouseLeave={handleHide}
            >
              <a href="#">
                making bread
                <div
                  className="popper"
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <Image src={bread0} width={825} height={1100} />
                </div>
              </a>
            </button>
          </span>
          , watching films (
          <a href="https://letterboxd.com/clair44/list/100-favourite-films/" target="_blank">
            my top 100 &#x2197;
          </a>
          ),{' '}
          <a href="https://www.lesswrong.com/" target="_blank">
            LW
          </a>
          /
          <a href="https://slatestarcodex.com/" target="_blank">
            SSC
          </a>
        </p>
      </main>
      <style jsx>
        {`
          .orange {
            color: var(--harmony);
          }
          .btn1 {
            border: none;
            background-color: white;
            font-size: inherit;
            cursor: default;
            padding: 0;
          }
          .popper {
            display: none;
            width: 200px;
          }
          .popper[show] {
            display: block;
          }
          .hover_img a {
            position: relative;
          }
          .hover_img a span {
            position: absolute;
            display: none;
            z-index: 99;
          }
          .hover_img a:hover span {
            display: block;
          }
        `}
      </style>
    </Layout>
  );
}
