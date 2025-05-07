<script>
  import { createEventDispatcher } from 'svelte';

  export let languages = [];
  export let selectedLanguage = '';
  
  const dispatch = createEventDispatcher();
  
  function handleLanguageSelect(language) {
    // Only dispatch if language is different
    if (language !== selectedLanguage) {
      selectedLanguage = language;
      dispatch('select', { language });
    }
  }
</script>

<div class="px-4 py-3 bg-white border-b border-gray-200">
  <h2 class="text-sm font-medium text-gray-700 mb-2">Select language</h2>
  
  <div class="flex flex-wrap gap-2">
    <!-- "All" option -->
    <button 
      on:click={() => handleLanguageSelect('')}
      class="px-3 py-1 rounded-full text-sm {selectedLanguage === '' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}"
    >
      All
    </button>
    
    <!-- Language options -->
    {#each languages as language (language)}
      <button 
        on:click={() => handleLanguageSelect(language)}
        class="px-3 py-1 rounded-full text-sm {selectedLanguage === language ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}"
      >
        {language}
      </button>
    {/each}
  </div>
</div>