<script>
  import service from "./app";
  import { marked } from "marked";
  import SaveDialog from "./components/save-dialog.svelte";

  let openSubmitModal,
    openSaveDialog = false;

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

  $: {
    if (current === "showSaveDialog") {
      openSaveDialog = true;
    } else {
      openSaveDialog = false;
    }
  }

  const handleSave = (e) => {
    const header = {
      title: e.target.title.value,
      description: e.target.description.value,
      topics: e.target.topics.value.split(","),
    };
    send({ type: "submit", header });
  };

  async function handleSubmit(e) {
    send({ type: "query", question: e.target.question.value });
    e.target.reset();
  }
</script>

{#if current !== "error"}
  <div class="hero min-h-screen">
    <div class="hero-content">
      <div class="flex flex-col w-full md:min-w-[700px]">
        <div class="flex items-center justify-center relative">
          <img
            class="invert h-16 w-16"
            src="https://g8way.io/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0"
            alt="cookbook-logo"
          />
        </div>
        <div class="text-center">
          <div class="badge badge-outline text-center">Experimental</div>
        </div>
        <h1 class="text-3xl font-mono text-center">
          Permaweb Developer Sidekick
        </h1>

        <form
          on:submit|preventDefault={handleSubmit}
          class="mt-16 flex flex-col space-y-2 w-full"
        >
          <input
            name="question"
            type="text"
            class="input input-bordered w-full"
            placeholder="👋🏻 Dev, Ask me a question about building on the Permaweb?"
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
        <div class="mt-2 text-sm font-light font-mono text-center">
          Powered by <a class="link" href="https://otherwill.com">Otherwill</a>
          - Instant Answers - Just Add Docs -
          <a class="link" href="https://cookbook.g8way.io">Permaweb Cookbook</a>
        </div>
        <div class="mx-auto">
          {#each context.hx as response}
            <div class="card mt-16">
              <div class="card-title">{response.question}</div>
              <div class="my-4 prose">
                {@html marked(response.completion)}
              </div>
            </div>
          {/each}
          {#if context.hx.length > 0 && current !== "confirm"}
            <button class="btn btn-block" on:click={() => send("save")}
              >Save As Permapage</button
            >
          {/if}
          {#if current === "confirm"}
            <div class="bg-success text-white py-4 px-8 rounded">
              Successfully created webpage: <a
                class="link"
                href="https://arweave.net/{context.id}">{context.id}</a
              >
            </div>
            <button class="btn btn-block mt-2" on:click={() => send("ready")}
              >New Query</button
            >
          {/if}
        </div>
      </div>
    </div>
  </div>
  <SaveDialog
    bind:open={openSaveDialog}
    on:submit={handleSave}
    on:cancel={() => send("cancel")}
  />
{:else if current === "confirm"}
  <div class="hero min-h-screen">
    <div class="hero-content">
      <div>
        You have published a web-page of your conversation with the sidekick, do
        you want to share?
      </div>
    </div>
  </div>
{:else if current === "error"}
  <div class="hero min-h-screen">
    <div class="hero-content">
      <div class="bg-error text-white p-16 flex flex-col space-y-4">
        <div>
          Sorry, this request took to long or our servers are backed up with
          requests. Please try your question again.
        </div>

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
    <div class="grid items-center justify-center bg-[#f2f3f4] p-4">
      <img
        class="text-center w-full"
        src="https://arweave.net/IkMJRqi_0Xx_QhstK4WE3rsQqQxC07n84UagPgqGXfc"
        alt="loading"
      />
      <div class="text-center">
        Thank you for waiting, we are cooking up some great content for you!
        This is very experimental and the experience should improve
        continuously.
      </div>
    </div>
  </div>
</div>
