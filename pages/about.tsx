import siteConfig from "../siteConfig.json";
import marsStation from "../public/assets/mars-station.jpeg";
import av2 from "../public/assets/hrgrad.jpeg";

import { useState } from "react";
import { usePopper } from "react-popper";

import Layout from "../components/layout";
import Image from "next/dist/client/image";

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
    popperElement.setAttribute("show", "");
    update();
  };
  const handleHide = () => {
    popperElement.removeAttribute("show");
  };

  return (
    <Layout title="About" description="About me">
      <main>
        <Image
          src={av2}
          width={2436}
          height={1624}
          alt="me"
          quality={100}
          placeholder="blur"
        />
        (DM me on Twitter with who you think i am... if you guess correctly you
        win something)
        <p>
          <p>
            I'm a relatively generalized software engineer, specialized in web
            development. For fun, I'm interested in Golang and decentralized
            computing (I'm not a cryptobro, don't worry).
          </p>
          <p>
            I'm in London for the time being, so if you're around and want to
            hang out, hit me up on Twitter! (obviously, I will be moving to the
            US as soon as I can)
          </p>
          <p>
            Epistemic overview:
            <ul>
              <li>
                I'm deeply optimistic & extremely excited about the future
              </li>
              <li>
                I code because it's fun and it's the most effective way to build
              </li>
              <li>
                I'm something like a postrat (or adjacent) and I reject the core
                premise of Effective Altruism. Let us accelerate into AGI, the
                heart of X-risk!
              </li>
              <li>
                I think Earth is serverly underpopulated (she can support 10
                quadrillion humans with current tech) and that you're probably
                nowhere near as pronatalist as you should be
              </li>
              <li>I will live for 140 years (minimum)</li>
            </ul>
            I'll keep expanding this list, and convert it to a blogpost when
            needed. You are witnessing KISS in action!
          </p>
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
