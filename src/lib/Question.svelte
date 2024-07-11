<script>
  import { portraitData } from "../assets/data/yourPortrait";
  import html2canvas from "html2canvas";
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import gsap from "gsap";
  import Draggable from "gsap/Draggable";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { select } from "d3";

  onMount(() => {
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(ScrollTrigger);
  });

  function updatePosition() {
    // Get the current position of the dragged element
    const x = this.x;
    const y = this.y;

    let currScale = +("0." + this.target.id.split("_")[1]);
    // Update the SVG path's transform attribute to move it
    this.target.setAttribute(
      "transform",
      `translate(${x},${y}) scale(${currScale})`
    );
  }

  let currentIndex = 0;
  $: portraitData1 = portraitData[currentIndex];
  let width;
  let height;
  let svgWidth = 400;
  let svgHeight = 500;
  let navWidth = 100;
  let navHeight = 100;
  let margin = 100;

  const next = () => {
    if (currentIndex < portraitData.length - 1) {
      currentIndex++;
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      currentIndex--;
    }
  };

  $: margin = 150;

  $: xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([margin, svgWidth - margin]);
  $: yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, svgHeight - margin / 3]);

  onMount(() => {});

  let selectedElements = [];

  const captureScreenshot = () => {
    const divToCapture = document.getElementById("portraitWrapper");
    html2canvas(divToCapture).then(function (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "screenshot.png";
      link.click();
    });
  };

  $: addPath = (path, color, index) => {
    let currScale = portraitData[currentIndex].scale.toString().split(".")[1];
    if (!selectedElements.includes(index)) {
      selectedElements.push(index);
      if (path.length <= 1) {
        d3.select("#portraitSVG")
          .append("g")
          .attr(
            "transform",
            `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${portraitData1.scale})`
          )
          .attr("id", `path${index}_${currScale}`)
          .attr("class", "draggable-path")

          .append("path")
          .attr("d", path)
          .attr("fill", color);
      } else {
        d3.select("#portraitSVG")
          .append("g")
          .attr(
            "transform",
            `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${portraitData1.scale})`
          )
          .attr("id", `path${index}_${currScale}`)
          .attr("class", "draggable-path")

          .selectAll("path")
          .data(path)
          .join("path")
          .attr("d", (d) => d)
          .attr("fill", (d, i) => color[i]);
      }
    } else {
      d3.select(`#path${index}_${currScale}`)
        .attr(
          "transform",
          `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${portraitData1.scale})`
        )
        .selectAll("path")
        .data(path)
        .join("path")
        .attr("d", (d) => d)
        .attr("fill", (d, i) => color[i]);
    }
  };

  let finished = false;

  const editPath = () => {
    finished = true;
    Draggable.create(".draggable-path", {
      type: "x,y",
      onDrag: updatePosition,
    });

    d3.select("#legend").style("opacity", 0.1).style("pointer-events", "none");
    d3.select("#prev").style("opacity", 0.1).style("pointer-events", "none");
    d3.select("#finish").style("opacity", 0).style("pointer-events", "none");
    d3.select("#finishArrow")
      .style("opacity", 0)
      .style("pointer-events", "none");
  };

  const back = () => {
    select("#headerSection").style("display", "inherit");
    select("#introWrapper").style("display", "inherit");
    select("#questionWrapper").style("display", "none");
  };

  let hoveredLegendPath = null;

</script>

<div class="grid-container" bind:clientHeight={height} bind:clientWidth={width}>
  <div class="column left"></div>
  <div class="column middle">
    <div class="row" id="arrowsWrapper"></div>
    <div class="row" id="question"><h1>{portraitData1.question}</h1></div>
    <div class="row" id="main">
      <div
        id="portraitWrapper"
        bind:clientHeight={svgHeight}
        bind:clientWidth={svgWidth}
      >
        <svg id="portraitSVG" width={svgWidth} height={svgHeight}></svg>
      </div>
      <div id="editWrapper">
        <div>
          <div
            id="finishArrow"
            class={currentIndex === portraitData.length - 1
              ? "show arrow"
              : "none2 arrow"}
          >
            →
          </div>
          <div
            id="finish"
            class={currentIndex === portraitData.length - 1
              ? "show button arrow"
              : "none2 button arrow"}
            on:click={editPath}
          >
            Terminer
          </div>
        </div>

        <div id="downloadWrapper" class={finished ? "showFinal" : "hideFinal"}>
          <h3 id="instructions">
            Fais glisser les formes pour les repositionner
          </h3>
          <div id="download" class="button" on:click={captureScreenshot}>
            Télécharger
          </div>
        </div>
      </div>
      <div id="buttonsWrapper">
        <div
          id="prev"
          on:click={prev}
          class={currentIndex === 0 ? "none button" : "show button"}
        >
          PREV
        </div>
        <div
          id="next"
          on:click={next}
          class={currentIndex === portraitData.length - 1
            ? "none button"
            : "show button"}
        >
          NEXT
        </div>
      </div>
    </div>
    <div class="row">
      <svg id="legend">
        <g id={portraitData1.id}>
          {#each portraitData1.answers as a, i}
            <g>
              {#each a.paths as path, pathIndex}
                <path
                  class="legend"
                  transform={width
                    ? (width<700?`translate(${((width - 50 * 2) / (portraitData1.answers.length + 1)) * i + 50},40) scale(0.15)`:`translate(${((width - 50 * 2) / (portraitData1.answers.length + 1)) * i + 50},40) scale(0.25)`)
                    : ""}
                  d={path}
                  fill={a.color_hex[pathIndex]}
                  on:click={addPath(
                    a.paths,
                    a.color_hex,
                    currentIndex,
                    portraitData1.scale
                  )}
                  stroke={hoveredLegendPath == a ? "black" : "none"}
                  stroke-width={hoveredLegendPath == a ? 5 : 0}
                  on:mouseover={() => (hoveredLegendPath = a)}
                  on:mouseout={() => (hoveredLegendPath = "")}
                ></path>

                <text
                  x={width
                    ? ((width - 50 * 2) / (portraitData1.answers.length + 1)) *
                        i +
                      50
                    : ""}
                  y="20"
                  font-size={width && width<700? 14 : 18}
                  >{a.answer}
                </text>
              {/each}
            </g>
          {/each}
        </g>
      </svg>
    </div>
  </div>
  <div class="column right">
    <div
      id="navWrapper"
      bind:clientHeight={navHeight}
      bind:clientWidth={navWidth}
    >
      <svg id="navSVG" width={navWidth} height={navHeight}>
        {#each portraitData as d, i}
          <path
            transform={navWidth
              ? `translate(${navWidth / 2 - 30},${((navHeight - 30) / portraitData.length) * i + 20}) scale(0.15)`
              : ""}
            d={d.answers[d.nav_index].paths[0]}
            fill={i <= currentIndex
              ? d.answers[d.nav_index].color_hex[0]
              : "#D9AC4E "}
          ></path>
        {/each}
      </svg>
    </div>
  </div>
</div>

<style>
  .hideFinal {
    display: none;
    pointer-events: none;
  }
  .showFinal {
    display: inherit;
    pointer-events: all;
  }
  .none {
    display: inline-block;
    opacity: 0.1;
    pointer-events: none;
  }

  .none2 {
    display: none;
    opacity: 0;
    pointer-events: none;
  }

  .show {
    display: inline-block;
    opacity: 1;
    pointer-events: all;
  }
  #legend {
    width: 100%;
  }

  #main {
    position: relative;
  }

  #question {
    display: flex;
    align-items: center; /* Vertical center alignment */
  }

  #buttonsWrapper {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  #editWrapper {
    position: absolute;
    right: 0;
    top: 0;
  }

  #portraitWrapper,
  #portraitSVG,
  #navWrapper {
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
  }

  #instructions {
    max-width: 200px;
  }
  path.legend:hover {
    cursor: pointer;
  }

  .column {
    height: 100dvh; /* Height of the container */
  }
  .right {
    background-color: #faf4e3;
  }

  .middle {
    display: grid;
    grid-template-rows: 5dvh 10dvh 65dvh 20dvh; /* Height of each row */
  }

  #finishArrow {
    animation: arrowAnimX 5s ease-in-out infinite;
    margin-right: 10px;
  }

  .grid-container {
    width: 100dvw;
    height: 100dvh;
    display: grid;
    grid-template-columns: 2dvw 78dvw 20dvw;
    gap: 10px;
    margin-bottom: 0px !important;
    overflow-x: hidden; /* Prevent horizontal overflow */
    overflow-y: hidden;
  }

  @media (max-width: 700px) {
    .grid-container {
      grid-template-columns: 1fr; /* Single column layout */
    }

    .left,
    .right {
      display: none; /* Hide the third column */
    }

    .middle {
      grid-template-rows: auto; /* Adjust rows in middle column */
    }
  }
</style>
