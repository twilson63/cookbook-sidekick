<script>
  let chat = [];
  let thread = "";
  async function handleSubmit(e) {
    const result = await fetch(
      "https://otherwill-git-thread-otherwill.vercel.app/api/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: e.target.question.value,
          model: "hyper_v0.2.0",
          thread_id: thread,
        }),
      }
    ).then((res) => res.json());
    console.log(result);
    thread = result.thread_id;
    chat = chat.concat([{ question: e.target.question.value, ...result }]);
    e.target.reset();
  }
</script>

<div class="hero min-h-screen">
  <div class="hero-content">
    <div class="flex flex-col">
      <form on:submit|preventDefault={handleSubmit}>
        <input name="question" type="text" class="input input-bordered" />
        <button class="btn btn-outline">Submit</button>
      </form>
      <div class="mx-auto">
        {#each chat as response}
          <div class="card">
            <div class="card-title">{response.question}</div>
            <div class="card-body">{response.completion}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
