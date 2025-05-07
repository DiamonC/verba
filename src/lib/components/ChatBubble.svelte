<script>
  export let text = '';
  export let isUser = false;
  export let timestamp = new Date();
  export let showTimestamp = true;
  export let isAudio = false;
  export let audioBlob = null; 
  export let isLoading = false;
  export let translation = '';
  export let type = 'statement';
  export let options = [];
  export let onOptionSelect = () => {};
  export let evaluation = {};
  export let hasEvaluation = false;
  
  import { formatTime } from '$lib/utils/helpers';
  import { playAudio } from '$lib/services/openai';
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';
    import SkeletonBubble from './SkeletonBubble.svelte';
  
  const formattedTime = formatTime(timestamp);
  let showText = false;
  let showTranslation = false;
  let heardText = '';
  let hasSubmittedHeard = false;
  let selectedOption = null;
  
  // Audio player state
  let audioDuration = 0;
  let currentTime = 0;
  let isPlaying = false;
  let audioElement;
  let autoplayTriggered = false;
  let showMessage = !hasEvaluation; // Initialize to false if there's an evaluation
  

  
  // Delay showing the message if there's an evaluation
  onMount(() => {
    if (hasEvaluation && !showMessage) {
      setTimeout(() => {
        showMessage = true;
      }, 1500); // 3-second delay
    }
  });
  
  onMount(() => {
    // Handle message display delay if there's an evaluation
    if (hasEvaluation && !showMessage) {
      setTimeout(() => {
        showMessage = true;
        
        // Only initialize audio player after message is shown
        if (showMessage && browser && audioBlob && isAudio && !isUser && !showText) {
          initializeAudioPlayer();
        }
      }, 1500); // 3-second delay
    } 
    // If no evaluation, initialize audio player immediately
    else if (browser && audioBlob && isAudio && !isUser && !showText) {
      initializeAudioPlayer();
    }
  });
  
  function initializeAudioPlayer() {
    // Create audio element to get duration and handle playback
    audioElement = new Audio(URL.createObjectURL(audioBlob));
    
    audioElement.onloadedmetadata = () => {
      audioDuration = audioElement.duration;
    };
    
    audioElement.ontimeupdate = () => {
      currentTime = audioElement.currentTime;
    };
    
    audioElement.onplay = () => {
      isPlaying = true;
    };
    
    audioElement.onpause = () => {
      isPlaying = false;
    };
    
    audioElement.onended = () => {
      isPlaying = false;
      currentTime = 0;
    };
    
    // Auto-play the audio once it's loaded
    if (!autoplayTriggered) {
      audioElement.play().catch(err => {
        // Browser may prevent autoplay, especially if there's no user interaction
        console.log('Autoplay prevented:', err);
      });
      autoplayTriggered = true;
    }
  }
  
  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
  });
  
  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  function handlePlayAudio() {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
    } else if (audioBlob) {
      playAudio(audioBlob);
    }
  }
  
  function toggleShowText() {
    showText = true;
  }
  
  function toggleShowTranslation() {
    showTranslation = !showTranslation;
  }
  
  function submitHeardText() {
    hasSubmittedHeard = true;
    onOptionSelect(heardText);
  }
  
  function selectOption(index) {
    selectedOption = index;
    onOptionSelect(index);
  }
  
  // Get evaluation.score color class
  function getScoreColor(score) {
    if (evaluation.score >= 4) return 'text-green-600';
    if (evaluation.score >= 3) return 'text-blue-600';
    if (evaluation.score >= 2) return 'text-orange-600';
    return 'text-red-600';
  }
</script>

<div class="flex">
  <div class="w-2/3">
    <!-- Evaluation display (for the previous message) -->
    {#if !isUser && hasEvaluation && evaluation.score > 0}
      <div class="mt-2 mb-3 mx-3">
        <div class="flex items-center mb-1">
          <span class="text-xs font-bold {getScoreColor(evaluation.score)} bg-gray-100 rounded-full px-2 py-0.5 mr-2">
            Score: {evaluation.score}/5
          </span>
        </div>
        <p class="text-sm text-gray-700">{evaluation.feedback}</p>
      </div>
    {/if}
  
    <!-- Pedro name indicator for bot messages -->
    {#if !isUser && !isLoading && (!hasEvaluation || showMessage)}
      <div class="text-xs font-medium text-gray-500 mb-1 ml-2">Pedro</div>
    {/if}
      {#if hasEvaluation && !showMessage}
      <SkeletonBubble/>
      {/if}
    <!-- Bot message with text input for what user heard -->
    {#if !isUser && type === 'statement' && isAudio && !showText && !hasSubmittedHeard && !isLoading && (!hasEvaluation || showMessage)}
      <div class="mb-3 mx-2">
        <p class="text-sm text-gray-700 mb-2">What do you think Pedro said?</p>
      </div>
    {/if}
  
    <!-- Only show chat bubble if it's user message, or bot message that should be shown now -->
    {#if isUser || !hasEvaluation || showMessage}
      <div class="chat-bubble {isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}">
        {#if isLoading}
          <div class="flex space-x-1 py-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
          </div>
        {:else if isUser}
          <p class="text-sm whitespace-pre-wrap">{text}</p>
        {:else}
        <!-- Bot messages -->
        {#if type === "statement" && isAudio && !showText && !hasEvaluation}
          <!-- Enhanced Audio player -->
          <div>
            <button 
              on:click={handlePlayAudio} 
              class="flex items-center p-1 rounded-full hover:bg-gray-200 transition-colors"
              disabled={!audioBlob}
              aria-label={isPlaying ? "Pause audio message" : "Play audio message"}
            >
              {#if isPlaying}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="ml-2 text-xs text-gray-500">
                  {formatDuration(currentTime)} / {formatDuration(audioDuration)}
                </span>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="ml-2 text-xs text-gray-500">
                  {audioDuration > 0 ? `${formatDuration(audioDuration)}` : 'Audio message'}
                </span>
              {/if}
            </button>
            
            {#if audioDuration > 0}
              <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-primary h-1.5 rounded-full" style="width: {(currentTime / audioDuration) * 100}%"></div>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Text version (shown after input or clicking "Show text") -->
          <div>
            <p class="text-sm whitespace-pre-wrap">{text}</p>
            
            {#if translation && showTranslation}
              <p class="text-xs mt-2 text-gray-500 italic">
                <strong>Translation:</strong> {translation}
              </p>
            {/if}
          </div>
        {/if}
      {/if}
      
      {#if showTimestamp && !isLoading}
        <div class="text-[10px] text-gray-500 mt-1 text-right">
          {formattedTime}
        </div>
      {/if}
    </div>
    {/if}
    
    <!-- What user heard (displayed after submission) -->
    {#if !isUser && type === 'statement' && hasSubmittedHeard && heardText.trim() && !isLoading && (!hasEvaluation || showMessage)}
      <div class="mx-2 mt-1 mb-2">
        <p class="text-xs text-gray-500 italic">You heard: "{heardText}"</p>
      </div>
    {/if}
    
    <!-- Response options for question type messages -->
    {#if !isUser && type === 'question' && options.length > 0 && !isLoading && selectedOption === null && (!hasEvaluation || showMessage)}
      <div class="mt-3 mx-2 hidden">
        <p class="text-sm text-gray-700 mb-2">Ideas for what to say</p>
        <div class="flex flex-col space-y-2">
          {#each options as option, index}
            <div class="text-left px-3 py-2 rounded border border-gray-300 text-sm">
              {#if option.includes(":::")}
                {option.split(":::")[1].trim()}
              {:else}
                {option}
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Action buttons below chat bubble -->
    {#if !isUser && !isLoading && (!hasEvaluation || showMessage)}
      <div class="flex justify-center mt-1 space-x-2">
        {#if isAudio && !showText && (type === 'statement' || hasSubmittedHeard)}
          <button 
            on:click={toggleShowText}
            class="text-xs text-primary-600 underline"
          >
            Show text
          </button>
        {:else if showText && translation && !showTranslation}
          <!--<button 
            on:click={toggleShowTranslation}
            class="text-xs text-primary-600 underline"
          >
            Show translation
          </button>-->
        {/if}
      </div>
    {/if}
  </div>
</div>