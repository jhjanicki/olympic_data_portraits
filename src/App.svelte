<script>
  import { language } from "./store/store";
  import { logoData } from "./assets/data/logoData";
  import { portraitData } from "./assets/data/yourPortrait";
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { select } from "d3";
  import Question from "./lib/Question.svelte";
  import Athletes from "./lib/Athletes.svelte";

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



  function changeLanguage(selectedLang) {
    $language = selectedLang;
    selectedQuestion === "";
    closeDropdown("",0)
  }

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

    ScrollTrigger.create({
      trigger: "#headerSection",
      start: "top+=300 top", // When the top of headerSection is 300px from the top of the viewport
      onEnter: () => {
          gsap.set("#languageWrapper", { position: "absolute", top: "50px" }); // Adjust top based on your header height
      },
      onLeaveBack: () => {
          gsap.set("#languageWrapper", { position: "fixed", top: "50px" });
      }
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


  let legendWidth = 550;

  $: dropdownSelected = false;
  let currentIndex = 0;
  $: portraitData1 = dropdownSelected ? portraitData[currentIndex] : "";

  let active = false;
  let selectedQuestion = "";

  const toggleDropdown = () => {
    active = !active;
  };

  const closeDropdown = (question, index) => {
    selectedQuestion = question;
    active = false;
    currentIndex = index;
    dropdownSelected = true;
  };
</script>

<div id="languageWrapper">
<div
  class="button {$language === 'french' ? 'active' : ''}"
  on:click={() => changeLanguage('french')}
>
    Français
  </div>
  <div
    class="button {$language === 'english' ? 'active' : ''}"
    on:click={() => changeLanguage('english')}
  >
    English
  </div>
</div>
<section id="headerSection">
  <div id="titeWrapper">
    <div class="title" id="title"></div>
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
            <text x="140" y="150" fill="#d9ac4e" font-size="24">
              Portraits 2024
            </text>
            <text x={$language === "french"?"95":"105"} y="220" fill="#d9ac4e" font-size="18">
              {$language === "french"?"Quand l’art et la performance":"When art and performance"}
            </text>
            <text x={$language === "french"?"125":"140"} y="245" fill="#d9ac4e" font-size="18"
              >{$language === "french"?"se prennent aux Jeux":"take on the Games"}</text
            >
            <text x={$language === "french"?"100":"107"} y="320" fill="#d9ac4e" font-size="16"
              >{$language === "french"?"Une exposition de Blandine Pont":"An exhibition by Blandine Pont"}
            </text>
            <text x={$language === "french"?"150":"145"} y="340" fill="#d9ac4e" font-size="16"
              >{$language === "french"?"et Jeremy Wanner,":"and Jeremy Wanner,"}</text
            >
            <text x={$language === "french"?"108":"115"} y="360" fill="#d9ac4e" font-size="16"
              >{$language === "french"?"labellisée Olympiade Culturelle":"a form of cultural Olympics"}</text
            >
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
    {$language==="french"?"Paris 2024 approche à grands pas et avec lui l’envie de connaître un peu plus celles et ceux qui seront au coeur de ces Jeux. Portrait 2024 est une exposition pensée pour révéler les différentes facettes de 13 athlètes Olympiques et Paralympiques français.e.s au grand public sous une forme ludique et inédite.":"Paris 2024 is fast approaching, and with it the desire to get to know a little more about those who will be at the heart of these Games. Portrait 2024 is an exhibition designed to reveal the different facets of 13 French Olympic and Paralympic athletes to the general public in a fun and original way."
    }
  </p>
  <br>
  <p class="introText">
    {$language==="french"?"Générés à partir de leurs réponses à un questionnaire au sujet de leur vie sportive et sur des aspects plus personnels, découvrez ces portraits colorés au carrefour entre la science des données et l’art.":"Generated from their answers to a questionnaire about their sporting and personal lives, discover these colorful portraits at the crossroads between data science and art."}
  </p>
</section>

<section id="explainWrapper">
  <div class="scroll-arrow">
    ↓<br />
    <span class="arrow-text">{$language==="french"?"Explorez les questions":"Explore the questions"} </span>
  </div>
  <div class={active ? "select-menu active" : "select-menu"}>
    <div class="select-menu-button" on:click={toggleDropdown}>
      <span class="select-menu-text"
        >{selectedQuestion === ""
          ? ($language==="french"?"Sélectionnez une question pour voir les formes associées":"Select a question to see the associated shapes")
          : selectedQuestion}</span
      >
      <img id="carrot" class={active ? "flip" : ""} src="carrot.svg" />
    </div>
    <ul class="options">
      {#each portraitData as d, i}
        <li class="option" on:click={() => closeDropdown($language==="french"?d.question:d.questionEN, i)}>
          <span class="optionText">{$language==="french"?d.question:d.questionEN}</span>
        </li>
      {/each}
    </ul>
  </div>

  <div class="dropdownWrapper">
    <svg id="dropdownSVG" width={legendWidth} height={150}>
      <g id={portraitData1.id}>
        {#if dropdownSelected}
          {#each portraitData1.answers as a, i}
            <g>
              {#each a.paths as path, pathIndex}
                <path
                  class="legend"
                  transform={width
                    ? (width < 700 ? `translate(${((legendWidth-100) / (portraitData1.answers.length + 1)) * i + 20},40) scale(0.1)` :`translate(${(legendWidth / (portraitData1.answers.length + 1)) * i + 50},40) scale(0.15)`)
                    : ""}
                  d={path}
                  fill={a.color_hex[pathIndex]}
                ></path>

                <text
                  x={width
                    ? (width < 700? ((legendWidth-100) / (portraitData1.answers.length + 1)) * i +
                        20:((legendWidth) / (portraitData1.answers.length + 1)) * i +
                      50)
                    : ""}
                  y="20"
                  font-size={width&&width < 700?12:16}
                  >{$language==="french"?a.answer:a.answerEN}
                </text>
              {/each}
            </g>
          {/each}
        {/if}
      </g>
    </svg>
  </div>
</section>

<section id="athletesWrapper">
  <Athletes />
</section>
<div class="scroll-arrow">
  ↓<br />
  <span class="arrow-text"
    >{$language==="french"?"Répondez aux questions ci-dessous et découvrez votre Portrait 2024 !":"Create your own portrait below!"}
  </span>
</div>

<div class="portraitsNav" id="topNav">
  <p>{$language==="french"?"Votre Portrait 2024":"Your Portrait 2024"}</p>
</div>


<section id="questionWrapper">
  <Question />
</section>


<section id="aboutWrapper" class="aboutText">
  <div class="column">
      <p>{$language==="french"?"Ce projet est exposé pendant les Jeux Olympiques et Paralympiques à la Samaritaine Paris Pont Neuf. Restez connectés pour ne pas manquer les événements associés !":"This project is on display during the Olympic and Paralympic Games at the Samaritaine Paris Pont Neuf. Stay tuned for related events!"} </p>

  </div>
  <div class="column">
      <p><b>{$language==="french"?"Équipe :":"Group:"}</b></p>
      <p>{$language==="french"?"Direction artistique : Blandine Pont et Jeremy Wanner":"Art direction: Blandine Pont and Jeremy Wanner"}</p>
      <p>{$language==="french"?"Scénographie : Antoine Wanner":"Scenography: Antoine Wanner"}</p>
      <p>{$language==="french"?"Visualisation interactives et web design: Julia H. Janicki":"Interactive visualization and web dev/design: Julia Janicki"}</p>
      <p>{$language==="french"?"Motion design : Noémie Joole":"Motion design: Noémie Joole"}</p>
      <p>{$language==="french"?"Communication : Sophie Gaonach":"Communication: Sophie Gaonach"} </p>
  </div>
  <div class="column">
      <p><b>{$language==="french"?"Contact :":"Get in touch"}</b></p>
      <p> <a href="mailto:portraits_2024@oiiwa.com?subject=Portraits 2024">{$language==="french"?"Nous écrire":"Email"}</a></p>
      <p> <a href="https://www.instagram.com/blandinepnt/">Blandine Pont</a></p>
      <p> <a href="https://www.instagram.com/oiiwatelier/">Jeremy Wanner</a></p>
  </div>

</section>

<style>
  #languageWrapper {
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    top: 50px;
    transition: all 0.5s ease;
    z-index:1000;
  }

  #languageWrapper div{
    display: inline;
  }

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

  #explainWrapper {
    margin: 100px 0px;
    text-align: center;
    width:100%;
  }

  #questionWrapper {
    /* display: none; */
    margin-top: 0px;
    width:100%;
    height: 100vh;
  }

  #aboutWrapper{
    width: 100%;
    background: #d9ac4e;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    text-align:left;
  }

  #aboutWrapper p{
    margin:0px;
  }

  #aboutWrapper .column{
    padding: 20px;
  }

  .aboutText {
    width: 600px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    font-size: 18px;
  }

  #dropdownSVG{
    margin: 0px auto;
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

  #topNav{
    margin-top:50px;
  }

  .portraitsNav{
    background-color:#d9ac4e;
    height:30px;
    width:100%;
    display: flex;
    justify-content: center; /* Horizontal centering */
    align-items: center;
    color: white;
  }

  @media (max-width: 700px) {
    .introText {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
    .aboutText {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .select-menu {
    max-width: 500px;
    margin: 0px auto;
  }

  .select-menu-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    /* remove default arrow */
    margin: 18px 0px;
    border: 1px solid #d2d2d2;
    border-radius: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
    cursor: pointer;
    padding: 8px;
    background-size: auto;
  }

  .options {
    list-style-type: none;
    position: absolute;
    width: 498px;
    overflow-y: auto;
    max-height: 295px;
    padding: 10px;
    margin-top: -20px;
    border: 1px solid #d2d2d2;
    border-radius: 0;
    background: #fff;
    z-index: 100;
    display: none;
  }

  .option {
    height: 40px;
    cursor: pointer;
    text-align: center;
    padding-top: 5px;
    background: #fff;
  }

  .option:hover {
    background: #d9ac4e;
    color: #fff;
  }

  .select-menu.active .options {
    display: inherit;
    padding: 0px;
    display: block;
    opacity: 0;
    z-index: 10;
    animation-name: fadeInUp;
    -webkit-animation-name: fadeInUp;
    animation-duration: 0.4s;
    animation-fill-mode: both;
    -webkit-animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
  }

  #carrot {
    width: 15px;
    margin-top: 8px;
    float: right;
  }

  .flip {
    transform: rotate(180deg);
    transition: 0.3s transform ease;
  }

  @keyframes fadeInUp {
    from {
      transform: translate3d(0, 30px, 0);
    }

    to {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  @keyframes fadeInDown {
    from {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }

    to {
      transform: translate3d(0, 20px, 0);
      opacity: 0;
    }
  }

  @media (max-width: 498px) {
    .options{
      width: calc(100% - 18px);
    }

  }

  @media (max-width: 600px) {

    #aboutWrapper{
        grid-template-columns: 1fr;
    }

  }

</style>
