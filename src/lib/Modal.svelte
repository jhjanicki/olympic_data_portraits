<script>
  import { modalOpen } from "../store/store";
  import { portraitData } from "../assets/data/athletePortraitsOpen";

  let id = "c_dudek";

  let athletePortrait = portraitData.filter((d) => d.id === id)[0];
  console.log(athletePortrait);
</script>

<div class="modal {$modalOpen ? 'show' : 'none'}">
  <div class="modal-content">
    <span id="closeModal" on:click={(event) => ($modalOpen = false)}
      >&times;</span
    >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
      {#each athletePortrait.portraits as d}
        <g>
          {#each d.paths as path, i}
            <path d={path} fill={d.color[i]}></path>
          {/each}
        </g>
      {/each}</svg
    >
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
</style>
