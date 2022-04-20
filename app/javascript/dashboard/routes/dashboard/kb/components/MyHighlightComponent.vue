<template>
  <!-- <div class="tooltip" @mouseover="hover = true" @mouseleave="hover = false">
    <ins>
      <slot></slot>
    </ins>
    <div class="tooltiptext" v-if="hover">
      <p>{{'confidence: ' + annotation.confidence}}</p>
      <p>{{'source: ' + annotation.source}}</p>
    </div>
  </div> -->
  <div style="display: inline; max-width: 20px;" @mouseover="show = true" @mouseleave="show = false">
    <ins>
      <slot></slot>
    </ins>
    <div v-if="show" style="position: absolute; bottom: 20px; left: 0px; display: inline-block; background-color: lightblue; border-radius: 3px; padding: 4px;">
      <p>{{'Question: ' + annotation.confidence}}</p>
    </div>
  </div>
   
</template>

<script>
export default { 
  props: {
    annotation: [Object, Array]
  },

  data() {
    return {
      hover: false,
      show: false
    }    
  }
}
</script>

<style scoped>
.tooltip {
                                background-color: lightblue;
                                position: relative;
                                display: inline-block;
          }

.tooltiptext {
  position: absolute;
  z-index: 1;	
  width: 200px;
  top: 100%;
  left: 50%;
  margin-left: -100px; /* -width/2 to center tooltip */
  background-color: lightblue;
  padding: 8px; 
  border-radius: 4px;	
  color: white;
}

.tooltiptext::after {
  content: " ";
  position: absolute;
  bottom: 100%;  /* At the top of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent yellow transparent;
}
</style>