<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import MobileHeader from '$lib/components/MobileHeader.svelte';
  import ChatBubble from '$lib/components/ChatBubble.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import { generateChatResponse, generateSpeech, createLessonPrompt } from '$lib/services/openai';
  import { scrollToBottom, extractTranslation, generateId, getRandomName } from '$lib/utils/helpers';
  import { saveCompletedLesson } from '$lib/data/lessons';
    import SkeletonBubble from '$lib/components/SkeletonBubble.svelte';
  
  /** @type {import('./$types').PageData} */
  export let data;
  
  const { lesson } = data;
  
  let messages = [];
  let isProcessing = false;
  let chatContainer;
  let progress = 0;
  let userName = '';
  let lessonCompleted = false;
  
  // When a message is sent via text input
  async function handleSendMessage(messageText) {
    if (isProcessing || lessonCompleted) return;
    processUserInput(messageText);
  }
  
  // When a message option is selected
  async function handleOptionSelect(optionValue, messageId) {
    if (isProcessing || lessonCompleted) return;
    
    // Check if this is from a statement (text input) or a question (option selection)
    const messageWithId = messages.find(msg => msg.id === messageId);
    if (!messageWithId) return;
    
    if (messageWithId.type === 'statement') {
      // This is a text input from a statement - pass it directly
      processUserInput(optionValue);
    } else if (messageWithId.type === 'question') {
      // This is an option selection from a question
      // Convert to number if it's a string index
      const optionIndex = typeof optionValue === 'number' ? optionValue : parseInt(optionValue, 10);
      
      // Validate the option index
      if (isNaN(optionIndex) || !messageWithId.options || messageWithId.options.length <= optionIndex) {
        return;
      }
      
      // Get the selected option text
      const selectedOption = messageWithId.options[optionIndex];
      
      // Split to extract just the Spanish part (before the parenthesis)
      const optionText = selectedOption.split('(')[0].trim();
      
      // Process the selection
      processUserInput(optionText);
    }
  }
  
  // Common function to process user input (typed or selected)
  async function processUserInput(inputText) {
    try {
      isProcessing = true;
      
      let prefix = "";
      let previousMessage = messages[messages.length-1];
      if (previousMessage.type == "statement") {
        prefix= "you said: "
      }

      // Add user message to conversation
      const userMessage = {
        id: generateId(),
        content: prefix + inputText,
        text: prefix + inputText,
        isUser: true,
        timestamp: new Date(),
        isAudio: false
      };
      
      messages = [...messages, userMessage];
      
      // Add a loading message while waiting for response
      const loadingId = generateId();
      messages = [...messages, { id: loadingId, isLoading: true, isUser: false }];
      
      // Scroll to the latest message
      setTimeout(() => scrollToBottom(chatContainer), 100);
      
      // Prepare the conversation history for OpenAI
      const conversationHistory = [
        { 
          role: 'system', 
          content: createLessonPrompt(lesson, userName)
        },
        ...messages
          .filter(msg => !msg.isLoading)
          .map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: JSON.stringify(msg),
        
          }))
      ];
      
      // Get response from API
      const response = await generateChatResponse(conversationHistory);
      
      // Remove loading message
      messages = messages.filter(msg => msg.id !== loadingId);
      
      // Process the response content
      const responseText = response.message.content;
      
      // Parse the response
      let parsedResponse = JSON.parse(responseText);

   
      
      // Check if the goal has been completed
      if (parsedResponse.goalCompleted) {
        lessonCompleted = true;
        saveCompletedLesson(lesson.id);
        progress = 100;
      }
      
      // Build the message
      let showText = parsedResponse.hasEvaluation; // Auto-show text for messages with evaluation
      
      // Add assistant's message to conversation
      const assistantMessage = {
        id: generateId(),
        text: parsedResponse.text,
        content: parsedResponse.text,
        translation: parsedResponse.translation,
        type: parsedResponse.type,
        options: parsedResponse.options,
        score: parsedResponse.score,
        evaluation: parsedResponse.evaluation,
        hasEvaluation: parsedResponse.evaluation != undefined,
        isUser: false,
        timestamp: new Date(),
        isAudio: true,
        goalCompleted: parsedResponse.isGoalCompleted
      };
      console.log("MESAGES")
      console.log(assistantMessage)
      // Generate audio for the message
      try {
        const audioBlob = await generateSpeech(parsedResponse.text);
        assistantMessage.audioBlob = audioBlob;
      } catch (speechError) {
        console.error('Error generating speech:', speechError);
      }
      
      // Messages with evaluation should automatically show text instead of audio
     /* if (parsedResponse.hasEvaluation) {
        assistantMessage.isAudio = false; 
      }*/
      
      messages = [...messages, assistantMessage];


      
      // Update progress if not completed
      if (!parsedResponse.isGoalCompleted) {
        progress = Math.min(90, progress + 5);
      }
      
      // Scroll to the latest message
      setTimeout(() => scrollToBottom(chatContainer), 100);
      
    } catch (error) {
      console.error('Error in chat exchange:', error);
      
      // Remove loading message if there was an error
      messages = messages.filter(msg => !msg.isLoading);
      
      // Add error message
      messages = [...messages, {
        id: generateId(),
        content: 'Sorry, there was an error getting a response. Please try again.',
        isUser: false,
        timestamp: new Date(),
        isError: true
      }];
      
    } finally {
      isProcessing = false;
    }
  }
  
  onMount(async () => {
    // Generate a random name for the user
    userName = getRandomName();
    
    // Start with a welcome message from the assistant
    setTimeout(async () => {
      try {
        isProcessing = true;
        
        // Create initial prompt based on the lesson
        const conversationHistory = [
          { 
            role: 'system', 
            content: createLessonPrompt(lesson, userName)
          },
          {
            role: 'user',
            content: 'Hello, I\'m ready to start the lesson.'
          }
        ];
        
        // Get initial response from API
        const response = await generateChatResponse(conversationHistory);
        
        // Process the response content
        const responseText = response.message.content;
        const parsedResponse = JSON.parse(responseText);
        
        // Add welcome message
        const welcomeMessage = {
          id: generateId(),
          text: parsedResponse.text,
          content: parsedResponse.text,
          translation: parsedResponse.translation,
          type: parsedResponse.type,
          options: parsedResponse.options,
          score: parsedResponse.score,
          evaluation: parsedResponse.evaluation,
          hasEvaluation: parsedResponse.hasEvaluation,
          isUser: false,
          timestamp: new Date(),
          isAudio: true
        };
        
        // Always generate audio for bot messages
        try {
          const audioBlob = await generateSpeech(parsedResponse.text);
          welcomeMessage.audioBlob = audioBlob;
        } catch (speechError) {
          console.error('Error generating speech:', speechError);
        }
        
        messages = [welcomeMessage];
        console.log(welcomeMessage)
        progress = 10; // Initial progress
        
      } catch (error) {
        console.error('Error in initial chat:', error);
        
        // Add a fallback message if there was an error
        messages = [{
          id: generateId(),
          content: `¡Hola! Bienvenido a tu lección de ${lesson.language}.`,
          translation: `Hello! Welcome to your ${lesson.language} lesson.`,
          type: 'statement',
          isUser: false,
          timestamp: new Date()
        }];
        
      } finally {
        isProcessing = false;
      }
    }, 500);
  });
  
  onDestroy(() => {
    // Clean up resources if needed
  });
</script>

<div class="app-container relative">
  <MobileHeader 
    title={lesson.title} 
    showBackButton={true} 
    progress={progress} 
  />
  
  <div class="flex p-3 mb-1 bg-gray-50 items-center">
    <div>
      <h2 class="text-sm font-semibold text-gray-600 hidden">{lesson.language} • {lesson.difficulty}</h2>
      <p class="text-xs text-gray-500 mt-0.5">{lesson.scenario}</p>
    </div>
  </div>
  
  <main 
    bind:this={chatContainer}
    class="flex-1 px-4 py-2 overflow-y-auto hide-scrollbar flex flex-col pb-20"
  >
    {#each messages as message (message.id)}
      {#if 1 == 1}

  <ChatBubble 
  text={message.text || ''} 
  isUser={message.isUser || false}
  timestamp={message.timestamp}
  isAudio={message.isAudio || false}
  audioBlob={message.audioBlob || null}
  isLoading={message.isLoading || false}
  translation={message.translation || ''}
  type={message.type || 'statement'}
  options={message.options || []}
  score={message.score || 0}
  evaluation={message.evaluation || ''}
  hasEvaluation={message.hasEvaluation || false}
  onOptionSelect={message.isUser ? null : (value) => handleOptionSelect(value, message.id)}
/>

      {/if}
      
      {#if message.goalCompleted}
        <div class="bg-green-100 text-green-800 p-3 rounded-lg text-center my-4 font-medium">
          🎉 Goal completed! You've successfully completed this lesson.
        </div>
      {/if}
    {/each}
    {#if isProcessing}
    <SkeletonBubble/>
    {/if}
  </main>
  
  <!-- Only show chat input for appropriate message types -->
  <ChatInput 
    onSendMessage={handleSendMessage} 
    disabled={isProcessing || lessonCompleted
    }
  />
  
  {#if lessonCompleted}
    <div class="fixed bottom-20 left-0 right-0 flex justify-center">
      <a href="/" class="bg-primary text-white px-6 py-3 rounded-full font-medium shadow-lg">
        Return to Lessons
      </a>
    </div>
  {/if}
</div>