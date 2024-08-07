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
    if(width && width < 700){
      this.target.setAttribute(
        "transform",
        `translate(${x},${y}) scale(${currScale-0.2})`
      );
    }else{
      this.target.setAttribute(
        "transform",
        `translate(${x},${y}) scale(${currScale})`
      );
    }
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

  if(currentIndex === portraitData.length-1 ){
    editPath()
  }

  if (currentIndex <= portraitData.length - 2) {
    currentIndex++;
  }
    console.log(currentIndex)
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
    .range(width && width < 700 ? [0, svgWidth] : [margin, svgWidth - margin]);

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
      link.download = "myPortrait2024.png";
      link.click();
    });
  };

  $: addPath = (path, color, index, dataScale) => {
    let currScale = portraitData[currentIndex].scale.toString().split(".")[1];
    if (!selectedElements.includes(index)) {
      selectedElements.push(index);
      if (path.length <= 1) {
        d3.select("#portraitSVG")
          .append("g")
          .attr(
            "transform",
            `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${dataScale})`
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
            `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${dataScale})`
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
          `translate(${xScale(portraitData1.x)},${yScale(portraitData1.y)})  scale(${dataScale})`
        )
        .selectAll("path")
        .data(path)
        .join("path")
        .attr("d", (d) => d)
        .attr("fill", (d, i) => color[i]);
    }
  };

  let finished = false;

  let currentElement = null;
  let rotation = 0;


  const editPath = () => {
    finished = true;
    Draggable.create(".draggable-path", {
      type: "x,y",
      onDrag: updatePosition,
      onPress: function() {
                // Bring the element to the front
                this.target.parentNode.appendChild(this.target);
            }

    });

    document.addEventListener('keydown', (event) => {
            if (currentElement) {
                if (event.key === 'r' || event.key === 'R') {
                    rotation += 15; // Rotate by 15 degrees
                    gsap.to(currentElement, { rotation: rotation, transformOrigin: "center center" });
                }
            }
        });




    d3.select("#legend").style("opacity", 0).style("pointer-events", "none");
    d3.select("#prev").style("opacity", 0).style("pointer-events", "none");
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
    <div class={finished?"row center":"row"} id="question">{finished?"Fais glisser les formes pour les repositionner":portraitData1.question}</div>
    <div class="row" id="main">
      <div
        id="portraitWrapper"
        bind:clientHeight={svgHeight}
        bind:clientWidth={svgWidth}
      >
        <svg id="portraitSVG" width={svgWidth} height={svgHeight}></svg>
      </div>
      <div id="buttonsWrapper" class={finished ? "hideFinal" : "showFinal"}>
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
          class={finished?"none button" :"show button"}
        >
          {currentIndex === portraitData.length - 1?"TERMINER":"NEXT"}
        </div>
      </div>
      <div id="downloadWrapper" class={finished ? "showFinal" : "hideFinal"}>
        <div id="download" class={finished?"show button" :"none button"} on:click={captureScreenshot}>
          Télécharger
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
                    ? (width<700?`translate(${((width - 50 * 2) / (portraitData1.answers.length + 1)) * i * 1.3 + 50},40) scale(0.12)`:`translate(${((width - 50 * 2) / (portraitData1.answers.length + 1)) * i + 50},40) scale(0.25)`)
                    : ""}
                  d={path}
                  fill={a.color_hex[pathIndex]}
                  on:click={addPath(
                    a.paths,
                    a.color_hex,
                    currentIndex,
                    (width && width < 700) ? (portraitData1.scale -0.2): portraitData1.scale
                  )}
                  stroke={hoveredLegendPath == a ? "black" : "none"}
                  stroke-width={hoveredLegendPath == a ? 5 : 0}
                  on:mouseover={() => (hoveredLegendPath = a)}
                  on:mouseout={() => (hoveredLegendPath = "")}
                ></path>

                <text
                  x={width
                    ? (width>700?(((width - 50 * 2) / (portraitData1.answers.length + 1)) *
                        i +
                      50):(((width - 50 * 2) / (portraitData1.answers.length + 1)) *
                          i*1.3 +
                        50))
                    : ""}
                  y="20"
                  font-size={width && width<700? 12 : 18}
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
    font-size:24px;
    font-weight:700;
  }
  .none {
    display: inline-block;
    opacity: 0;
    pointer-events: none;
  }

  .none2 {
    display: none;
    opacity: 0;
    pointer-events: none;
  }

  .center{
    justify-content: center;
  }

  .show {
    display: inline-block;
    opacity: 1;
    pointer-events: all;
  }
  #legend {
    width: 100%;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  #main {
    position: relative;
  }

  #question {
    font-size:28px;
    font-weight:600;
    display: flex;
    align-items: center; /* Vertical center alignment */
  }

  #buttonsWrapper {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  #downloadWrapper{
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
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
    width:100%;
  }

  #portraitWrapper,
  #navWrapper{
  height:100%;
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
    width: 100%;
    height: 100dvh;
    display: grid;
    grid-template-columns: 2dvw 78dvw 20dvw;
    gap: 10px;
    margin-bottom: 0px !important;
    overflow-x: hidden; /* Prevent horizontal overflow */
    overflow-y: hidden;
  }

  @media (max-width: 700px) {

    #buttonsWrapper,#editWrapper {
      right: 30px;
    }
    .grid-container {
      display: inherit;
      grid-template-columns: 100dvw; /* Single column layout */
    }


    .left,
    .right {
      display: none; /* Hide the third column */
    }

    .middle {
      grid-template-rows: auto; /* Adjust rows in middle column */
    }

    #question {
      margin-top:20px;
      font-size:18px;
    }

    .showFinal {
      margin-top:-80px;
      font-size:16px;
    }

    #download{

    margin-top:-10px;
    }
  }
</style>
