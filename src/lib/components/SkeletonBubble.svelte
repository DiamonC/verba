<script>

</script>

<div>


  <div id="skeleBubble" class="chat-bubble chat-bubble-bot">
    <div class="ticontainer">
      <div class="tiblock">
        <div class="tidot"></div>
        <div class="tidot"></div>
        <div class="tidot"></div>
      </div>
    </div>
  </div>
  


</div>

<style>

.tiblock {
    align-items: center;
    display: flex;
    height: 17px;
}

.ticontainer .tidot {
    background-color: #90949c;
}

.tidot {
  animation: mercuryTypingAnimation 1.5s infinite ease-in-out;
  -webkit-animation: mercuryTypingAnimation 1.5s infinite ease-in-out;
  border-radius: 2px;
  display: inline-block;
  height: 4px;
  margin-right: 2px;
  width: 4px;
}



@keyframes mercuryTypingAnimation {
  0% { transform: translateY(0px); }
  28% { transform: translateY(-5px); }
  44% { transform: translateY(0px); }
}


.tidot:nth-child(1){
-webkit-animation-delay:200ms;
}
.tidot:nth-child(2){
-webkit-animation-delay:300ms;
}
.tidot:nth-child(3){
-webkit-animation-delay:400ms;
}
</style>