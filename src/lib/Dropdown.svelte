<script>
  import {
    selectedQuestion,
    selectedAnswers,
    selectedAnswer,
    shapeClicked,
    shapeClickedOnce,
  } from "../store/store";

  let active = false;

  const toggleDropdown = () => {
    active = !active;
  };

  const closeDropdown = (answer) => {
    $selectedAnswer = answer;
    $shapeClicked = false;
    active = false;
  };
</script>

{#if $shapeClickedOnce}
  <div class={active ? "select-menu active" : "select-menu"}>
    <div class="select-menu-button" on:click={toggleDropdown}>
      <span class="select-menu-text"
        >{$selectedQuestion === ""
          ? "Select a question"
          : !$shapeClicked
            ? $selectedAnswer
            : $selectedQuestion}</span
      >
      <img id="carrot" class={active ? "flip" : ""} src="carrot.svg" />
    </div>
    <ul class="options">
      {#each $selectedAnswers as d}
        <li class="option" on:click={() => closeDropdown(d)}>
          <span class="optionText">{d}</span>
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <p id="clickInstruction">
    Each shape represents a question we posed to 14 French athletes related to
    their professional and personal lives. Click on a shape to see a question
    and all possible answers.
  </p>
{/if}

<style>
  #clickInstruction {
    text-align: center;
    max-width: 250px;
  }
  .select-menu {
    max-width: 220px;
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
    position: absolute;
    width: 220px;
    overflow-y: auto;
    max-height: 295px;
    padding: 10px;
    margin-top: -20px;
    border: 1px solid #d2d2d2;
    border-radius: 0;
    background: #fff;
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
    background: #4f0097;
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
</style>
