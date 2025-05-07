<script>
    import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';

  export let onSendMessage = () => {};
  export let disabled = false;

  let inputValue = '';
  let textareaEl;

  function handleSubmit() {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      inputValue = '';
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleDocumentClick(event) {
    if (textareaEl && !textareaEl.contains(event.target)) {
      // Prevent focus loss by re-focusing textarea
      textareaEl.focus();
    }
  }
if (browser) {

  onMount(() => {
    document.addEventListener('click', handleDocumentClick);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleDocumentClick);
  });
}
</script>


<div class="border-t border-gray-200 bg-white px-4 py-2 absolute bottom-0 left-0 right-0">
  <form on:submit|preventDefault={handleSubmit} class="flex items-center">
    <textarea
    bind:this={textareaEl}
    bind:value={inputValue}
    on:keydown={handleKeyDown}
    placeholder="Type your message..."
    rows="1"
    class="flex-1 border border-gray-300 rounded-full px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"

  />
  
    <button 
      type="submit" 
      class="ml-2 p-2 bg-primary text-white rounded-full disabled:opacity-50"
      disabled={!inputValue.trim() || disabled}
      aria-label="Send message"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    </button>
  </form>
</div>

<!-- Add spacer to push content above fixed input -->
<div class="h-16"></div>