<script>
  import { createEventDispatcher } from "svelte";
  export let open = false;

  const dispatch = createEventDispatcher();
  const cancel = () => dispatch("cancel");
</script>

<input
  type="checkbox"
  id="save-dialog"
  bind:checked={open}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Save Conversation as Permapage</h3>
    <form on:submit|preventDefault>
      <div class="form-control">
        <label class="label">Title</label>
        <input type="text" class="input input-bordered" name="title" required />
      </div>
      <div class="form-control">
        <label class="label">Description</label>
        <textarea class="textarea textarea-bordered" name="description" />
      </div>
      <div class="form-control">
        <label class="label">Topics</label>
        <input type="text" class="input input-bordered" name="topics" />
        <div class="text-xs font-mono">Comma-separated list of topics</div>
      </div>
      <div class="mt-8 flex justify-end space-x-2">
        <button class="btn">Save</button>
        <button class="btn btn-secondary" type="button" on:click={cancel}
          >Cancel</button
        >
      </div>
    </form>
  </div>
</div>
