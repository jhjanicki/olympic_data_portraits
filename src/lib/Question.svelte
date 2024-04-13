<script>
  import { portraitData } from "../assets/data/yourPortrait";
  import * as d3 from "d3";

  let currentIndex = 0;
  $: portraitData1 = portraitData[currentIndex];
  let width;
  let height;
  let svgWidth = 600;
  let svgHeight = 500;
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

  $: xScale = d3.scaleLinear().domain([0, 100]).range([0, svgWidth]);
  $: yScale = d3.scaleLinear().domain([0, 100]).range([0, svgHeight]);

  $: addPath = (path, color) => {
    d3.select("#portraitSVG")
      .append("path")
      .attr("d", path)
      .attr("fill", color)
      .attr(
        "transform",
        `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${portraitData1.scale})`
      );
  };
</script>

<div class="grid-container" bind:clientHeight={height} bind:clientWidth={width}>
  <div class="column left">
    <!-- No rows in the first column -->
  </div>
  <div class="column middle">
    <div class="row" id="question"><h1>{portraitData1.question}</h1></div>
    <div class="row">
      <div id="portraitWrapper">
        <svg id="portraitSVG" width={svgWidth} height={svgHeight}></svg>
      </div>
    </div>
    <div class="row">
      <svg id="legend">
        <g>
          <g id={portraitData1.id}>
            {#each portraitData1.answers as a, i}
              {#each a.paths as path}
                <path
                  transform={`translate(${((width - margin * 2) / (portraitData1.answers.length + 1)) * i + margin},20) scale(0.25)`}
                  d={path}
                  fill={a.color_hex}
                  on:click={addPath(path, a.color_hex)}
                ></path>
                <text
                  x={((width - margin * 2) /
                    (portraitData1.answers.length + 1)) *
                    i}
                  y="20">{a.answer}</text
                >
              {/each}
            {/each}
          </g>
        </g>
      </svg>
    </div>
  </div>
  <div class="column right">
    <button on:click={prev}>PREV</button>
    <button on:click={next}>NEXT</button>
  </div>
</div>

<style>
  #legend {
    width: 100%;
  }

  #portraitWrapper,
  #portraitSVG {
    display: block;
    margin-left: auto;
    margin-right: auto;
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
    background-color: #e7e1ef;
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
</style>
