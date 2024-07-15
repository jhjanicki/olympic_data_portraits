<script>
  import { modalOpen, selectedAthlete } from "../store/store";
  import { portraitData } from "../assets/data/athletePortraitsOpen";

  let id = "c_dudek";

  $: console.log($selectedAthlete);

  $: athletePortrait = portraitData.filter((d) =>
    $selectedAthlete !== "" ? d.id === $selectedAthlete : d.id === "c_dudek"
  )[0];
  let hoveredLegendPath = null;
  let selectedQuestion = "";
  let selectedAnswer = "";
  function clicked(d) {
    selectedQuestion = d.question;
    selectedAnswer = d.answer;
  }
  function closeModal() {
    $modalOpen = false;
    selectedQuestion = "";
    selectedAnswer = "";
  }
</script>

<div class="modal {$modalOpen ? 'show' : 'none'}">
  <div class="modal-content">
    <span id="closeModal" on:click={() => closeModal()}>&times;</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
      {#each athletePortrait.portraits as d}
        <g>
          {#each d.paths as path, i}
            <path
              d={path}
              fill={d.color[i]}
              stroke={hoveredLegendPath === d ? "black" : "none"}
              stroke-width={hoveredLegendPath === d ? 5 : 0}
              on:mouseover={() => (hoveredLegendPath = d)}
              on:mouseout={() => (hoveredLegendPath = "")}
              on:click={() => clicked(d)}
            ></path>
          {/each}
        </g>
        <!-- <text x="200" y="480" font-size="30">{selectedQuestion}</text>
        <text x="450" y="550" font-size="30">{selectedAnswer}</text> -->
      {/each}</svg
    >
    <div id="textWrapper">
      <p>{selectedQuestion === "" ? "Cliquez sur une forme" : selectedQuestion}</p>
      <p>{selectedAnswer}</p>
    </div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    z-index: 5;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    /* Enable scroll if needed */
    background-color: rgba(0, 0, 0, 0.3);
  }

  .modal-content {
    position: relative;
    background-color: #fefefe;
    margin-left: auto;
    margin-right: auto;
    top: 50%;
    transform: translate(0, -50%);
    padding: 20px;
    box-shadow: 1px 1px 5px -1px rgba(0, 0, 0, 0.5);
    width: 500px;
    border: none;
    border-radius: 20px;
  }

  .modal-content p {
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  /* The Close Button */
  #closeModal {
    font-size: 24px;
    display: inline-block;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    text-align: center;
    background-color: #d9ac4e;
    color: white;
    margin-right: 10px;
    transition: all 0.5s ease;
    transform: rotate(90deg);
    position: absolute;
    right: 0px;
    top: 10px;
  }

  #closeModal:hover,
  #closeModal:focus {
    background-color: #ae9184;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.5s ease;
  }

  .none {
    display: none;
  }
  .show {
    display: block;
  }

  @media (max-width: 600px) {
    .modal-content {
      width: 80%;
    }
  }

  #textWrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 42%;
    text-align: center;
  }

  @media (max-width: 600px) {
    #textWrapper {
      top: 40%;
    }
  }
</style>
