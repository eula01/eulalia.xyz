import siteConfig from '../siteConfig.json';
import marsStation from '../public/assets/mars-station.jpeg';
import cake from '../public/assets/neighborcakes.jpeg'; // cake dims = 3024 × 4032 (0.75)
import av2 from '../public/assets/av2.jpeg'; // av2 dims = 2320 × 3088 (0.75129534)

import { useState } from 'react';
import { usePopper } from 'react-popper';

import Layout from '../components/layout';
import Image from 'next/dist/client/image';

export default function About() {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement>(null);
  // const [arrowElement, setArrowElement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement
  );

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
        <Image
          src={av2}
          width={127}
          height={170}
          alt="me"
          quality={100}
          placeholder="blur"
        />
        <p>
          <p>
            I'm a software engineer living in the San Francisco Bay
            Area. I'm currently interested in Golang and distributed computing,
            but generality is my true goal. I made this site to gather my
            thoughts and code in one place; it's minimal, as{' '}
            <a
              href="https://en.wikipedia.org/wiki/Occam%27s_razor"
              target="_blank"
            >
              {' '}
              most things{' '}
            </a>{' '}
            should be.
          </p>
          <p>
            If you like building things, have some cool ideas, or just like
            talking about code, then reach out! Twitter would be fastest, but
            here's my email anyways:
            <a className="orange"> seanwaplington[át]gmail[dōt]com</a>
          </p>
          Some random things I like:
          <ul>
            <li>Consuming ~200KB/day of Wikipedia (excl. images)</li>
            <li>
              <span className="hover_img">
                Baking, or a 'productive sugar addiction' –{' '}
                <button
                  className="btn1"
                  ref={setReferenceElement}
                  onMouseEnter={handleShow}
                  onMouseLeave={handleHide}
                >
                  <a href="#">
                    at least my neighbors love me :)
                    <div
                      className="popper"
                      ref={setPopperElement}
                      style={styles.popper}
                      {...attributes.popper}
                    >
                      iirc (9/26) we only got one plate back lol
                      <Image src={cake} />
                    </div>
                  </a>
                </button>
              </span>
            </li>
            <li>
              Films (
              <a
                href="https://letterboxd.com/clair44/list/100-favourite-films/"
                target="_blank"
              >
                my top 100 &#x2197;
              </a>
              )
            </li>
          </ul>
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
          }
          .popper[show] {
            display: block;
          }
          .hover_img {
            width: 300px;
            height: 225px;
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
