<script>
  import { logoData } from "./assets/data/logoData";
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { select } from "d3";
  import Dropdown from "./lib/Dropdown.svelte";
  import MakePortraits from "./lib/MakePortraits.svelte";

  import {
    selectedAnswers,
    selectedQuestion,
    data,
    shapeClicked,
    shapeClickedOnce,
  } from "./store/store";

  let width = 1000;
  let height = 1000;
  let gWidth; // need to make this responsive
  let gHeight;
  let translateX; // need to make this responsive
  let translateY;
  const ids = [
    "#blue",
    "#purple",
    "#yellow",
    "#pink",
    "#darkorange",
    "#orange",
    "#black1",
    "#black2",
    "#brown",
    "#green",
  ];
  // Define the number of objects
  const numberOfObjects = ids.length;

  // Define the radius of the circle
  const radius = 180;

  // Calculate the angle between each object
  const angleIncrement = (2 * Math.PI) / numberOfObjects;

  // Initialize an array to store the positions of the objects
  const positions = [];

  let hovered;

  // Calculate the positions using sine and cosine
  for (let i = 0; i < numberOfObjects; i++) {
    const angle = i * angleIncrement;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positions.push({ x, y });
  }

  console.log(positions);
  positions[0].x = positions[0].x + 70;
  positions[3].y = positions[3].y + 70;
  positions[6].x = positions[6].x - 70;

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

    // fade out title on scroll
    gsap.to("#title", {
      opacity: 0,
      scrollTrigger: {
        trigger: "#headerSection",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // fade in dropdown / instructions on scroll
    gsap.to("#dropdownWrapper", {
      opacity: 1,
      scrollTrigger: {
        trigger: "#headerSection",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        toggleActions: "restart none none reverse",
      },
    });

    // remove dropdown as scrolling to next section
    gsap.to("#dropdownWrapper", {
      opacity: 0,
      scrollTrigger: {
        trigger: "#diySection",
        start: "top bottom",
        scrub: true,
        toggleActions: "restart none none reverse",
      },
    });

    // animate shapes on scroll
    ids.forEach((d, i) => {
      // select(d).attr(
      //   "transform",
      //   `translate(${positions[i].x},${positions[i].y})`
      // );
      gsap.to(d, {
        x: positions[i].x,
        y: positions[i].y,
        rotation: 180,
        scale: 0.6,
        ease: "none",
        onComplete: () => {
          console.log("beep boop");
        },
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

  // update question when user clicks on a shape
  const updateQuestion = (id) => {
    $shapeClicked = true;
    $shapeClickedOnce = true;
    $selectedQuestion = $data.filter((d) => d.id === id)[0].question;
    $selectedAnswers = $data.filter((d) => d.id === id)[0].answers;
  };
</script>

<section id="headerSection">
  <div id="titeWrapper">
    <h1 class="title" id="title">
      Data portraits of French Olympic and Paralympic athletes
    </h1>
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
            <g
              id={d.id}
              on:click={() => updateQuestion(d.id)}
              on:mouseover={() => (hovered = d.id)}
              stroke={hovered === d.id ? "#000" : ""}
              on:mouseout={() => (hovered = null)}
              stroke-width="4px"
            >
              {#each d.paths as path}
                <path d={path} fill={d.color}></path>
              {/each}
            </g>
          {/each}
        </g>
      </svg>
    </div>
  </div>
  <div id="dropdownWrapper">
    <Dropdown />
  </div>
</section>

<MakePortraits />

<style>
  #chart {
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
    max-width: 450px;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }

  #dropdownWrapper {
    opacity: 0;
    position: fixed;
    top: 250px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
