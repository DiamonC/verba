<script>
  export let id = '';
  export let title = '';
  export let description = '';
  export let difficulty = 'beginner';
  export let language = '';
  export let estimatedMinutes = 5;
  export let completedDate = null;
  
  import { getDifficultyGradient } from '$lib/utils/helpers';
  
  const gradientClass = getDifficultyGradient(difficulty);
</script>

<a href="/lesson/{id}" class="block rounded-xl overflow-hidden shadow-md bg-white transform transition hover:shadow-lg hover:scale-[1.01]">
  <div class="{gradientClass} text-white p-4">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-bold">{title}</h3>
        <p class="text-sm text-white/80">{language}</p>
      </div>
      {#if completedDate}
        <div class="bg-white rounded-full p-1 ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      {/if}
    </div>
  </div>
  <div class="p-4">
    <p class="text-gray-600 text-sm line-clamp-2">{description}</p>
    <div class="flex justify-between items-center mt-3">
      <span class="text-xs uppercase font-semibold text-gray-500">{difficulty}</span>
      <span class="text-xs text-gray-500">{estimatedMinutes} min</span>
    </div>
  </div>
</a>