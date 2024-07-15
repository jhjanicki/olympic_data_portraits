<script>
  import { athleteData } from "../assets/data/athleteData.js";
  import Modal from "./Modal.svelte";
  import { modalOpen, selectedAthlete } from "../store/store";

  let selectedOption = "Athletes";
  $: flipClass = selectedOption === "Portraits" ? "flipPortrait" : "";

  const open = (id) => {
    $modalOpen = true;
    $selectedAthlete = id;
  };
</script>

<Modal />
<div class="mode_container">
  <div class="tw-toggle">
    <div class="option" data-option="1">
      <input
        checked
        type="radio"
        name="toggle"
        id="option_1"
        value="Athletes"
        bind:group={selectedOption}
      />
      <label class="toggle toggle-yes" for="option_1">Athlètes</label>
    </div>
    <div class="option">
      <input
        type="radio"
        name="toggle"
        id="option_2"
        value="Portraits"
        bind:group={selectedOption}
      />
      <label class="toggle toggle-yes" for="option_2">Portraits</label>
    </div>
  </div>
</div>
<div class="container">
  {#each athleteData as d}
    <div class="item">
      <img src="bg.svg" />
      <img class="names" src={`./people/${d.id}.png`} />
      <img class="sports" src={`./sport/${d.id}.png`} />
      <div class="flip-card item_flip">
        <div class={`flip-card-inner ${flipClass}`}>
          <div class="flip-card-front">
            <img src={`./flip/${d.id}.png`} />
          </div>
          <div class="flip-card-back">
            <img src={`./flip/${d.id}_b.png`} />
          </div>
        </div>
      </div>
      <p class="arrow" id="aboutArrow" on:click={() => open(d.id)}>
        Son portrait expliqué ici→
      </p>
    </div>
  {/each}
</div>

<style>
  .mode_container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
  }
  .container {
    display: grid;
    gap: 10px;
    width: 90%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
  }

  .item {
    color: white;
    border: 1px solid #d9ac4e;
    text-align: center;
    border-radius: 5px;
    font-size: 1.5em;
    position: relative;
  }

  .names {
    max-width: 70%;
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
  }

  .sports {
    max-width: 60%;
    position: absolute;
    top: 140px;
    left: 50%;
    transform: translateX(-50%);
  }

  .flip-card {
    top: 170px;
    left: 0;
    position: absolute;
    background-color: transparent;
    width: 100%;
    height: calc(100% - 180px);
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
  }

  /* Responsive grid layout */
  @media (min-width: 1200px) {
    .container {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 577px) and (max-width: 991px) {
    .container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .container {
      grid-template-columns: 1fr;
    }
  }

  /* This container is needed to position the front and back side */
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  /* Do an horizontal flip when you move the mouse over the flip box container */
  /* .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
    cursor: pointer;
  } */

  /* Position the front and back side */
  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
  }

  .flip-card-front {
    z-index: 2;
    transform: rotateY(0deg);
  }

  .flip-card-back {
    transform: rotateY(180deg);
  }

  .flip-card img {
    width: 100%; /* or any custom size */
    height: 100%;
    object-fit: contain;
  }

  .item_flip {
    display: inline-block;
    vertical-align: middle;
  }

  .tw-toggle {
    /* background: #95A5A6; */
    display: inline-block;
    padding: 0px 0px;
    border-radius: 20px;
    position: relative;
    border: 2px solid #d9ac4e;
  }

  .tw-toggle label {
    text-align: center;
    font-family: sans-serif;
    display: inline-block;
    color: black;
    position: relative;
    z-index: 2;
    margin: 0;
    padding: 7px 9px;
    font-size: 16px;
    /* cursor: pointer; */
  }

  .tw-toggle input {
    /* display: none; */
    position: absolute;
    z-index: 3;
    opacity: 0;
    cursor: pointer;
  }

  .option {
    display: inline-block;
  }

  .tw-toggle input[value="Athletes"]:checked + label {
    background-color: #d9ac4e;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  .tw-toggle input[value="Portraits"]:checked + label {
    background-color: #d9ac4e;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .flipPortrait {
    transform: rotateY(180deg);
  }

  .arrow {
    display: inline-block;
    color: black;
    font-size: 16px;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
  }

  .arrow:hover {
    cursor: pointer;
    font-weight:600;
    transition: all 0.5 ease;
  }
</style>
