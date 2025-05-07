<script>
  import MobileHeader from '$lib/components/MobileHeader.svelte';
  import LessonCard from '$lib/components/LessonCard.svelte';
  import { lessons, getCompletedLessons, DEFAULT_LANGUAGE } from '$lib/data/lessons';
  import { onMount } from 'svelte';
  
  let completedLessons = {};
  let loading = true;
  let activeTab = 'all'; // all, beginner, intermediate, advanced
  
  // Filter lessons by difficulty level only
  $: filteredLessons = activeTab === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.difficulty === activeTab);
  
  onMount(() => {
    completedLessons = getCompletedLessons();
    loading = false;
  });
  
  function setActiveTab(tab) {
    activeTab = tab;
  }
</script>

<div class="app-container">
  <MobileHeader title="Verba" />

  
  <main class="flex-1 px-4 py-2 overflow-y-auto hide-scrollbar pb-20">
    <h2 class="text-2xl font-bold mb-4 mt-2">Spanish Lessons</h2>
    
    <!-- Difficulty filters -->
    <div class="flex space-x-2 mb-6 overflow-x-auto hide-scrollbar py-1">
      <button 
        class="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap {activeTab === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}"
        on:click={() => setActiveTab('all')}
      >
        All Levels
      </button>
      <button 
        class="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap {activeTab === 'beginner' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}"
        on:click={() => setActiveTab('beginner')}
      >
        Beginner
      </button>
      <button 
        class="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap {activeTab === 'intermediate' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}"
        on:click={() => setActiveTab('intermediate')}
      >
        Intermediate
      </button>
      <button 
        class="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap {activeTab === 'advanced' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}"
        on:click={() => setActiveTab('advanced')}
      >
        Advanced
      </button>
    </div>
    
    <!-- Lessons grid -->
    {#if loading}
      <div class="flex justify-center py-10">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    {:else if filteredLessons.length === 0}
      <div class="text-center py-10 text-gray-500">
        No lessons available for this difficulty level yet.
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-4 mb-8">
        {#each filteredLessons as lesson}
          <LessonCard 
            id={lesson.id}
            title={lesson.title}
            description={lesson.description}
            difficulty={lesson.difficulty}
            language={lesson.language}
            estimatedMinutes={lesson.estimatedMinutes}
            completedDate={completedLessons[lesson.id] || null}
          />
        {/each}
      </div>
    {/if}
  </main>
</div>