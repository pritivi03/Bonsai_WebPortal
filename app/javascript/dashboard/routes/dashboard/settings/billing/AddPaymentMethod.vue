<template>
    <div class="column content-box">
      
    </div>
</template>

<script>
import VuePaycard from "vue-paycard";

export default {
  name: "AddPaymentMethod",
  props: {
    show: Boolean
  },
  data() {
    return {
      valueFields: {
        cardName: "",
        cardNumber: "",
        cardMonth: "",
        cardYear: "",
        cardCvv: ""
      }
    };
  },
  components: {
    VuePaycard,
  },
};
</script>

<style scoped>
</style>