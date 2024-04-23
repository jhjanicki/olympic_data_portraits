<script>
  import { portraitData } from "../assets/data/yourPortrait";
  import html2canvas from "html2canvas";
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import gsap from "gsap";
  import Draggable from "gsap/Draggable";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  let svgWidth = 600;
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
  };

  let hoveredLegendPath = null;
</script>

<!-- <svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} /> -->

<div class="grid-container" bind:clientHeight={height} bind:clientWidth={width}>
  <div class="column left"></div>
  <div class="column middle">
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
        <div
          id="finish"
          class={currentIndex === portraitData.length - 1
            ? "show button"
            : "none button"}
          on:click={editPath}
        >
          FINISH
        </div>
        <div id="downloadWrapper" class={finished ? "showFinal" : "hideFinal"}>
          <h3>Drag shape to repoosition it</h3>
          <div id="download" class="button" on:click={captureScreenshot}>
            Download
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
                    ? `translate(${((width - 50 * 2) / (portraitData1.answers.length + 1)) * i + 50},20) scale(0.25)`
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
                      i
                    : ""}
                  y="20"
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
              ? `translate(${navWidth / 2 - 30},${(navHeight / portraitData.length) * i + 20}) scale(0.15)`
              : ""}
            d={d.answers[d.nav_index].paths[0]}
            fill={i <= currentIndex
              ? d.answers[d.nav_index].color_hex[0]
              : "black"}
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

  .button {
    margin: 0px auto 40px auto;
    text-transform: uppercase;
    padding: 4px 8px;
    width: 100px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 20px;
    font-weight: 600;
    font-size: 16px;
  }

  .button:hover {
    transition: all 0.5s ease;
    border: 1px solid rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  #portraitWrapper,
  #portraitSVG,
  #navWrapper {
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
  }

  path.legend:hover {
    cursor: pointer;
  }

  .column {
    height: 100vh; /* Height of the container */
  }

  .left,
  .right {
    background-color: #f0f0f0;
  }

  .middle {
    display: grid;
    grid-template-rows: 10vh 70vh 20vh; /* Height of each row */
  }

  .row {
    /* background-color: #e7e1ef; */
    margin-bottom: 5px; /* Optional margin between rows */
  }

  .grid-container {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 2vw 78vw 20vw;
    gap: 10px;
  }

  @media (max-width: 700px) {
    .grid-container {
      grid-template-columns: 1fr; /* Single column layout */
    }

    .left,
    .right {
      display: none; /* Hide the third column */
    }
  }
</style>
