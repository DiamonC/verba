<script>
  export let title = 'Verba';
  export let showBackButton = false;
  export let progress = null;
  
  function goBack() {
    history.back();
  }
</script>

<header class="bg-white shadow-sm px-4 py-3 flex items-center fixed top-0 left-0 right-0 z-10">
  {#if showBackButton}
    <button on:click={goBack} class="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  {/if}
  
  <h1 class="text-lg font-crimson font-semibold text-center flex-1">{title}</h1>

  <img src="/generated-icon.png" class="w-8"/>
  

  
  {#if progress !== null}
    <div class="w-full absolute bottom-0 left-0 h-1.5 bg-gray-200">
      <div class="h-full progress-gradient" style="width: {progress}%"></div>
    </div>
  {/if}
</header>

<!-- Add spacer to push content below fixed header -->
<div class="h-12"></div>

<style>
  .progress-gradient {
    background: linear-gradient(90deg, #E68744 0%, #FBAE1D 100%);
  }
</style>