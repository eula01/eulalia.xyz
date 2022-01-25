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
            I'm a software engineer based in Europe. Currently, I'm interested in Golang and
            decentralised computing. This site is for thoughts on programming, rationality, and
            effective altruism. Or anything else, really.
          </p>
          <p>
            If you want to chat about anything I've written, or life in general, then this is an
            open invitation to reach out! My Twitter is to your left, or you can email me here:
            <a className="orange"> seanwaplington@gmail.com</a>
          </p>
          To name a few random interests: chess,{' '}
          <span className="hover_img">
            <button
              className="btn1"
              ref={setReferenceElement}
              onMouseEnter={handleShow}
              onMouseLeave={handleHide}
            >
              <a href="#">
                bread
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
          ), browsing{' '}
          <a href="https://www.lesswrong.com/" target="_blank">
            lesswrong
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
