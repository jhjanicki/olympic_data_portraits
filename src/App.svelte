<script>
  import { logoData } from "./assets/data/logoData";
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { select } from "d3";
  import Question from "./lib/Question.svelte";

  let width = 1000;
  let height = 1000;
  let gWidth; // need to make this responsive
  let gHeight;
  $: translateX = 0; // need to make this responsive
  $: translateY = 0;
  const ids = [
    "#failure_logo",
    "#senses_logo",
    "#introextra_logo",
    "#city_logo",
    "#element_logo",
    "#palmares_logo",
    "#strength_logo",
    "#direction_logo",
    "#personalitly_logo",
  ];

  logoData.map((d) => `#${d.id}`);
  // Define the number of objects
  const numberOfObjects = ids.length;

  // Define the radius of the circle
  const radius = 180;

  // Calculate the angle between each object
  const angleIncrement = (2 * Math.PI) / numberOfObjects;

  // Initialize an array to store the positions of the objects
  const positions = [];

  // Calculate the positions using sine and cosine
  for (let i = 0; i < numberOfObjects; i++) {
    const angle = i * angleIncrement;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positions.push({ x, y });
  }

  positions[0].y = positions[0].y + 20;
  positions[3].y = positions[3].y - 20;
  positions[5].x = positions[5].x + 40;
  positions[6].x = positions[6].x - 20;
  positions[6].y = positions[6].y - 110;
  positions[7].y = positions[7].y - 70;
  positions[8].x = positions[8].x + 30;

  onMount(() => {
    gWidth = select("#gWrapper").node().getBBox().width;
    gHeight = select("#gWrapper").node().getBBox().height;

    // Calculate translation values to center the <g> element
    translateX = (width - gWidth) / 2 - select("#gWrapper").node().getBBox().x;
    translateY =
      (height - gHeight) / 2 - select("#gWrapper").node().getBBox().y;

    gsap.registerPlugin(ScrollTrigger);

    // pin the logo
    ScrollTrigger.create({
      trigger: "#headerSection",
      start: "top top",
      end: "bottom 150px",
      pin: "#svg",
    });

    // fade in dropdown / instructions on scroll
    gsap.to("#title", {
      opacity: 1,
      scrollTrigger: {
        trigger: "#headerSection",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        toggleActions: "restart none none reverse",
      },
    });

    // remove dropdown as scrolling to intro section
    gsap.to("#title", {
      opacity: 0,
      scrollTrigger: {
        trigger: "#introWrapper",
        start: "top bottom",
        scrub: true,
        toggleActions: "restart none none reverse",
      },
    });

    // animate shapes on scroll
    ids.forEach((d, i) => {
      gsap.to(d, {
        x: positions[i].x,
        y: positions[i].y,
        rotation: 180,
        scale: 0.6,
        ease: "none",
        onComplete: () => {},
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: "#svg",
          start: "top top",
          end: "bottom center",
          scrub: true,
          // markers: true,
        },
      });
    });
  });

  const start = () => {
    select("#headerSection").style("display", "none");
    select("#introWrapper").style("display", "none");
    select("#questionWrapper").style("display", "inherit");
    select("body").style("margin", 0);
  };
</script>

<section id="headerSection">
  <div id="titeWrapper">
    <div class="title" id="title">
      <h1>Portraits 2024</h1>
      <h3>Quand l’art et la performance se prennent aux Jeux</h3>
      <h4>
        Une exposition de Blandine Pont et Jeremy Wanner, labellisée Olympiade
        Culturelle
      </h4>
    </div>
  </div>
  <div id="chartWrapper">
    <div id="chart" bind:clientWidth={width} bind:clientHeight={height}>
      <svg id="svg">
        <g
          id="gWrapper"
          transform={translateX && translateY
            ? `translate(${translateX}, ${translateY})`
            : ""}
        >
          <g id="bg">
            <path
              d="M393.61 250.09c0 24.79.08 49.59-.02 74.39a171.5 171.5 0 0 1-26.39 91.81c-16.99 27.22-40.05 47.79-68.42 62.52a180.913 180.913 0 0 1-52.07 17.48 186.67 186.67 0 0 1-41.02 2.74c-37.22-1.64-71.14-12.99-101.37-34.95a168.545 168.545 0 0 1-43.33-45.75 172.309 172.309 0 0 1-27.55-93.13c.03-50.31-.05-100.61.03-150.91a168.92 168.92 0 0 1 17.08-73.75c3.6-7.42 7.73-14.58 12.34-21.42 16.76-25.09 38.88-44.11 65.57-57.92a182.37 182.37 0 0 1 50.92-17.21c14.19-2.58 28.63-3.52 43.03-2.81 26.67 1.1 52.78 8 76.52 20.22a175.801 175.801 0 0 1 43.34 31.35 163.56 163.56 0 0 1 20.35 24.07 174.087 174.087 0 0 1 26.25 58.7c2.11 8.92 3.51 17.98 4.21 27.12.31 4.15.48 8.33.49 12.49.04 24.99.05 49.98.02 74.98Z"
              style="stroke:#d9ac4e;stroke-miterlimit:10;stroke-width:.89px;fill:none"
            />
          </g>
          {#each logoData as d}
            <g id={d.id}>
              {#each d.paths as path}
                <path d={path} fill={d.color}></path>
              {/each}
            </g>
          {/each}
        </g>
      </svg>
    </div>
  </div>
</section>
<section id="introWrapper">
  <p class="introText">
    Paris 2024 approche à grands pas et avec lui l’envie de connaître un peu
    plus celles et ceux qui seront au coeur de ces Jeux. Portrait 2024 est une
    exposition pensée pour révéler les différentes facettes de 12 athlètes
    Olympique et Paralympique français.e.s au grand public sous une forme
    ludique et inédite.
  </p>
  <p class="introText">
    Générés à partir de leurs réponses à un questionnaire au sujet de leur vie
    sportive et sur des aspects plus personnels, découvrez ces portraits colorés
    au carrefour entre la science des données et l’art.
  </p>

  <div class="scroll-arrow">
    ↓<br />
    <span class="arrow-text"
      >Répondez aux questions ci-dessous et découvrez votre Portrait 2024!
    </span>
  </div>
  <div id="start" class="button" on:click={start}>C'est parti!</div>
</section>

<section id="questionWrapper">
  <Question />
</section>

<style>
  #chart,
  #chart2,
  #chart3 {
    width: 100%;
  }
  #svg {
    display: block;
    width: 100vw;
    height: 100vh;
    margin-left: auto;
    margin-right: auto;
  }

  #titeWrapper {
    max-width: 250px;
    position: fixed;
    top: calc(50% - 120px);
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    color: #d9ac4e;
    text-align: center;
  }

  #title {
    opacity: 0;
  }
  #introWrapper {
    text-align: center;
  }

  .introText {
    width: 600px;
    text-align: justify;
    margin-left: auto;
    margin-right: auto;
    font-size: 18px;
  }

  #questionWrapper {
    display: none;
    margin-top: 0px;
    height: 100vh;
  }

  .scroll-arrow {
    max-width: 200px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 30px;
    padding-bottom: 20px;
    animation: arrowAnim 5s ease-in-out infinite;
    color: black;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    z-index: 2;
  }

  .arrow-text {
    display: inline-block;
    animation: blink 5s ease-in-out infinite;
  }

  #start {
    margin-bottom: 50px;
  }

  @media (max-width: 700px) {
    .introText {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
