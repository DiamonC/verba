<script>
  export let isActive = false;
  export let leftOption = 'Off';
  export let rightOption = 'On';
  export let onChange = () => {};
  
  function handleToggle() {
    onChange(!isActive);
  }
</script>

<div class="flex items-center">
  <span class="text-sm mr-2 {!isActive ? 'font-medium text-gray-900' : 'text-gray-500'}">{leftOption}</span>
  <button 
    on:click={handleToggle}
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 {isActive ? 'bg-primary' : 'bg-gray-200'}"
    role="switch" 
    aria-checked={isActive}
  >
    <span 
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" 
      class:translate-x-5={isActive} 
      class:translate-x-0={!isActive}
    ></span>
  </button>
  <span class="text-sm ml-2 {isActive ? 'font-medium text-gray-900' : 'text-gray-500'}">{rightOption}</span>
</div>