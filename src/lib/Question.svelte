<script>
  import { portraitData } from "../assets/data/yourPortrait";
  import html2canvas from "html2canvas";

  import * as d3 from "d3";

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

  let selectedPath;

  $: addPath = (path, color, index) => {
    if (!selectedElements.includes(index)) {
      selectedElements.push(index);
      if (path.length <= 1) {
        d3.select("#portraitSVG")
          .append("g")
          .attr(
            "transform",
            `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${portraitData1.scale})`
          )
          .attr("id", `path${index}`)
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
          .attr("id", `path${index}`)
          .attr("class", "draggable-path")

          .selectAll("path")
          .data(path)
          .join("path")
          .attr("d", (d) => d)
          .attr("fill", (d, i) => color[i]);
      }
    } else {
      d3.select(`#path${index}`)
        .attr(
          "transform",
          `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${portraitData1.scale})`
        )
        .selectAll("path")
        // .transition()
        // .duration(100)
        .data(path)
        .join("path")
        .attr("d", (d) => d)
        .attr("fill", (d, i) => color[i]);
    }
  };

  let left = 100;
  let top = 100;
  let moving = false;

  function onMouseDown() {
    moving = true;
  }

  function onMouseMove(e) {
    console.log(e);
    if (moving) {
      left += e.movementX;
      top += e.movementY;
    }
  }

  function onMouseUp() {
    moving = false;
  }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<div class="grid-container" bind:clientHeight={height} bind:clientWidth={width}>
  <div class="column left">
    <div id="download" class="button" on:click={captureScreenshot}>
      Download
    </div>
  </div>
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
      <div id="buttonsWrapper">
        <div
          on:click={prev}
          class={currentIndex === 0 ? "none button" : "show button"}
        >
          PREV
        </div>
        <div
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
                  transform={width
                    ? `translate(${((width - 50 * 2) / (portraitData1.answers.length + 1)) * i + 50},20) scale(0.25)`
                    : ""}
                  d={path}
                  fill={a.color_hex[pathIndex]}
                  on:click={addPath(a.paths, a.color_hex, currentIndex)}
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
    grid-template-columns: 10vw 70vw 20vw;
    /* grid-template-columns: 20% 60% 20%;  */
    /* 10% for the first and third columns, and 80% for the middle column */
    /* grid-template-rows: 15% 60% 25%;  */
    /* 15% for the first row, 60% for the middle row, and 25% for the third row */
    gap: 10px; /* Optional: Add gap between grid items */
  }

  .draggable {
    user-select: none;
    position: absolute;
    cursor: grab;
  }

  .draggable:active {
    cursor: grabbing;
  }
</style>
