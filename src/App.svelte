<script>
  import service from "./app";
  import { marked } from "marked";

  let openSubmitModal = false;

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;

  $: {
    if (current === "submitting") {
      openSubmitModal = true;
    } else {
      setTimeout(() => window.hljs.highlightAll(), 100);
      openSubmitModal = false;
    }
  }

  async function handleSubmit(e) {
    send({ type: "query", question: e.target.question.value });
    e.target.reset();
  }
</script>

{#if current !== "error"}
  <div class="hero min-h-screen">
    <div class="hero-content">
      <div class="flex flex-col w-full md:min-w-[700px]">
        <h1 class="text-3xl font-mono mb-16 text-center">Cookbook Sidekick</h1>
        <form
          on:submit|preventDefault={handleSubmit}
          class="flex flex-col space-y-2 w-full"
        >
          <input
            name="question"
            type="text"
            class="input input-bordered w-full"
            placeholder="👋🏻 Dev, Ask me a question about the Permaweb?"
            required
          />
          <button class="btn btn-outline">Submit</button>
          {#if context.hx.length > 0}
            <button
              class="btn btn-secondary"
              type="button"
              on:click={() => send("clear")}>Clear</button
            >
          {/if}
        </form>
        <div class="mx-auto">
          {#each context.hx as response}
            <div class="card mt-16">
              <div class="card-title">{response.question}</div>
              <div class="my-4 prose">
                {@html marked(response.completion)}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else if current === "error"}
  <div class="hero">
    <div class="hero-content">
      <div class="bg-error text-white p-16 flex flex-col space-y-4">
        <div>An Error Occurred processing question.</div>

        <button class="btn btn-outline" on:click={() => send("tryAgain")}
          >Try Again</button
        >
      </div>
    </div>
  </div>
{/if}
<input
  type="checkbox"
  id="loading"
  class="modal-toggle"
  bind:checked={openSubmitModal}
/>
<div class="modal">
  <div class="modal-box">
    <div class="grid items-center justify-center bg-[#f2f3f4]">
      <img
        src="https://arweave.net/IkMJRqi_0Xx_QhstK4WE3rsQqQxC07n84UagPgqGXfc"
        alt="loading"
      />
    </div>
  </div>
</div>
