<script>
  import { data } from "../store/store";

  $: currentIndex = 0;
</script>

<section id="diySection">
  <h1 class="title" id="titleDiy">Make your own portrait</h1>
  <p id="diyInstructions">
    Go over the same questions and see how your personal data portrait looks
    like for a sport of choice:
  </p>
  <div class="container">
    <div class="row">
      <div class="column">
        <h3><span class="number">1</span>{$data[currentIndex].question}</h3>
        {#each $data as d, i}
          <p>{d.answers[i]}</p>
        {/each}
      </div>
      <div class="column">
        <p>Portrait</p>
      </div>
    </div>
  </div>
</section>

<style>
  #diySection {
    height: 100vh;
    width: 100vw;
    background-color: #fefaed;
  }

  #titleDiy {
    padding: 50px 0px;
  }

  #diyInstructions {
    max-width: 450px;
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    text-align: center;
    width: 75vw;
    margin-left: auto;
    margin-right: auto;
  }

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    column-gap: 120px;
  }

  .column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
  }

  .number {
    display: inline-block;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    text-align: center;
    color: white;
    font-weight: 400;
    margin-right: 10px;
    background-color: #a2804b;
  }
</style>
