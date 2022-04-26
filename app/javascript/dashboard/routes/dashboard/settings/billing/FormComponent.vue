<template>
  <div class="column content-box">
    <div class="card-form">
      <div class="card-list">
        <div class="card-form__outer">
          <VuePaycard :valueFields="valueFields" />
        </div>
        <!-- Form Fields -->
        <form id="card-form" @submit.prevent="submitForm">
          <div class="card-form__inner">
            <div class="card-input">
              <label for="cardNumber" class="card-input__label"
                >Card Number</label
              >
              <input
                type="tel"
                :id="inputFields.cardNumber"
                title="Number"
                class="card-input__input"
                :value="valueFields.cardNumber"
                @input="changeNumber"
                data-card-field
                autocomplete="off"
                :maxlength="cardNumberMaxLength"
              />
            </div>
            <div class="card-input">
              <label for="cardName" class="card-input__label"
                >Card Holder</label
              >
              <input
                type="text"
                :id="inputFields.cardName"
                title="Name"
                v-letter-only
                class="card-input__input"
                :value="valueFields.cardName"
                @input="changeName"
                data-card-field
                autocomplete="off"
              />
            </div>
            <div class="card-form__row">
              <div class="card-form__col">
                <div class="card-form__group">
                  <label
                    for="cardMonth"
                    class="card-input__label"
                    aria-label="Expiration Date"
                    >Expiration Date</label
                  >
                  <select
                    class="card-input__input -select"
                    :id="inputFields.cardMonth"
                    aria-label="Card Month"
                    title="Month"
                    v-model="valueFields.cardMonth"
                    data-card-field
                  >
                    <option value disabled selected>Month</option>
                    <option
                      v-bind:value="n < 10 ? '0' + n : n"
                      v-for="n in 12"
                      v-bind:disabled="n < minCardMonth"
                      v-bind:key="n"
                    >
                      {{ generateMonthValue(n) }}
                    </option>
                  </select>
                  <select
                    class="card-input__input -select"
                    :id="inputFields.cardYear"
                    aria-label="Card year"
                    title="Year"
                    v-model="valueFields.cardYear"
                    data-card-field
                  >
                    <option value disabled selected>Year</option>
                    <option
                      v-bind:value="$index + minCardYear"
                      v-for="(n, $index) in 12"
                      v-bind:key="n"
                    >
                      {{ $index + minCardYear }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="card-form__col -cvv">
                <div class="card-input">
                  <label
                    for="cardCvv"
                    class="card-input__label"
                    aria-label="Card CVV"
                    >CVV</label
                  >
                  <input
                    type="tel"
                    title="CVV"
                    class="card-input__input"
                    v-number-only
                    :id="inputFields.cardCvv"
                    maxlength="4"
                    :value="valueFields.cardCvv"
                    @input="changeCvv"
                    data-card-field
                    autocomplete="off"
                  />

                  <!-- submit button -->
                  <woot-button style="margin-top: 15px;">Submit</woot-button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VuePaycard from "vue-paycard";
export default {
  name: "FormComponent",
  components: { VuePaycard },
  directives: {
    "number-only": {
      bind(el) {
        function checkValue(event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, "");
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true;
          }
          event.preventDefault();
        }
        el.addEventListener("keypress", checkValue);
      },
    },
    "letter-only": {
      bind(el) {
        function checkValue(event) {
          if (event.charCode >= 48 && event.charCode <= 57) {
            event.preventDefault();
          }
          return true;
        }
        el.addEventListener("keypress", checkValue);
      },
    },
  },
  data: () => ({
    api: 'http://127.0.0.1:5000/',
    minCardYear: new Date().getFullYear(),
    mainCardNumber: "",
    cardNumberMaxLength: 19,
    valueFields: {
      cardName: "",
      cardNumber: "",
      cardMonth: null,
      cardYear: null,
      cardCvv: null,
    },
    inputFields: {
      cardNumber: "v-card-number",
      cardName: "v-card-name",
      cardMonth: "v-card-month",
      cardYear: "v-card-year",
      cardCvv: "v-card-cvv",
    },
  }),
  computed: {
    minCardMonth() {
      if (this.valueFields.cardYear === this.minCardYear)
        return new Date().getMonth() + 1;
      return 1;
    },
  },
  props: {
    customer_id: String
  },
  watch: {
    cardYear() {
      if (this.valueFields.cardMonth < this.minCardMonth) {
        this.valueFields.cardMonth = "";
      }
    },
  },
  emits: ['submitted'],
  methods: {
    async postData(url = '', data = {}) {
      const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
      });
      return response.json();
    },
    submitForm() {   
      /* TODO: error checking */ 
      console.log('button pressed');
      this.postData(this.api + 'billing/addPaymentMethod', {
        card: this.valueFields,
        customer_id: this.customer_id
      })
        .then(data => data.text())
        .then(console.log(data));

      this.$emit('submitted');
    },
    changeName(e) {
      this.valueFields.cardName = e.target.value;
      this.$emit("input-card-name", this.valueFields.cardName);
    },
    changeNumber(e) {
      this.valueFields.cardNumber = e.target.value;
      const value = this.valueFields.cardNumber.replace(/\D/g, "");
      // american express, 15 digits
      if (/^3[47]\d{0,13}$/.test(value)) {
        this.valueFields.cardNumber = value
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{6})/, "$1 $2 ");
        this.cardNumberMaxLength = 17;
      } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
        // diner's club, 14 digits
        this.valueFields.cardNumber = value
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{6})/, "$1 $2 ");
        this.cardNumberMaxLength = 16;
      } else if (/^62[0-9]\d*/.test(value)) {
        this.valueFields.cardNumber = value
          .replace(/(\d{6})/, "$1 ")
          .replace(/(\d{6}) (\d{7})/, "$1 $2 ")
          .replace(/(\d{6}) (\d{7}) (\d{6})/, "$1 $2 $3 ")
          .replace(/(\d{5}) (\d{5}) (\d{5}) (\d{4})/, "$1 $2 $3 $4");
        this.cardNumberMaxLength = 21;
      } else if (/^\d{0,16}$/.test(value)) {
        // regular cc number, 16 digits
        this.valueFields.cardNumber = value
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{4})/, "$1 $2 ")
          .replace(/(\d{4}) (\d{4}) (\d{4})/, "$1 $2 $3 ");
        this.cardNumberMaxLength = 19;
      }
      // eslint-disable-next-line
      if (e.inputType == "deleteContentBackward") {
        const lastChar = this.valueFields.cardNumber.substring(
          this.valueFields.cardNumber.length,
          this.valueFields.cardNumber.length - 1
        );
        // eslint-disable-next-line
        if (lastChar == " ") {
          this.valueFields.cardNumber = this.valueFields.cardNumber.substring(
            0,
            this.valueFields.cardNumber.length - 1
          );
        }
      }
      this.$emit("input-card-number", this.valueFields.cardNumber);
    },
    changeMonth() {
      this.$emit("input-card-month", this.valueFields.cardMonth);
    },
    changeYear() {
      this.$emit("input-card-year", this.valueFields.cardYear);
    },
    changeCvv(e) {
      this.valueFields.cardCvv = e.target.value;
      this.$emit("input-card-cvv", this.valueFields.cardCvv);
    },
    generateMonthValue(n) {
      return n < 10 ? `0${n}` : n;
    },
    toggleMask() {
      this.isCardNumberMasked = !this.isCardNumberMasked;
      if (this.isCardNumberMasked) {
        this.maskCardNumber();
      } else {
        this.unMaskCardNumber();
      }
    },
    maskCardNumber() {
      this.valueFields.cardNumberNotMask = this.valueFields.cardNumber;
      this.mainCardNumber = this.valueFields.cardNumber;
      const arr = this.valueFields.cardNumber.split("");
      arr.forEach((element, index) => {
        if (index > 4 && index < 14 && element.trim() !== "") {
          arr[index] = "*";
        }
      });
      this.valueFields.cardNumber = arr.join("");
    },
    unMaskCardNumber() {
      this.valueFields.cardNumber = this.mainCardNumber;
    },
  },
};
</script>

<style>
html,
body,
#root {
  align-items: center;
  background-color: transparent !important;
  display: flex;
  height: 97vh;
  justify-content: center;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Source Sans Pro", "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
}
#docs-root .card-form__inner {
  display: none;
}
#docs-root .card-form {
  margin-top: 90px;
}
* {
  box-sizing: border-box;
}
*:focus {
  outline: none;
}
#root {
  min-height: 100vh;
  display: flex;
  padding: 50px 15px;
}
@media screen and (max-width: 700px), (max-height: 500px) {
  #root {
    flex-wrap: wrap;
    flex-direction: column;
  }
}
.card-form {
  width: 1500px;
}
@media screen and (max-width: 576px) {
  .card-form {
    margin: 0 auto;
  }
}
.card-form__inner {
  background: #fff;
  box-shadow: 0px 30px 60px 0 rgba(90, 116, 148, 0.4);
  border-radius: 10px;
  padding: 45px 25px 25px 25px;
}

.card-form__outer {
  border: 1px solid red;
  /* width: 1100px; */
  margin: 10px;
}

@media screen and (max-width: 480px) {
  .card-form__inner {
    padding: 25px;
  }
}
@media screen and (max-width: 360px) {
  .card-form__inner {
    padding: 15px;
  }
}
.card-form__row {
  display: flex;
  align-items: flex-start;
}
@media screen and (max-width: 480px) {
  .card-form__row {
    flex-wrap: wrap;
  }
}
.card-form__col {
  flex: auto;
  margin-right: 35px;
}
.card-form__col:last-child {
  margin-right: 0;
}
@media screen and (max-width: 480px) {
  .card-form__col {
    margin-right: 0;
    flex: unset;
    width: 100%;
    margin-bottom: 20px;
  }
  .card-form__col:last-child {
    margin-bottom: 0;
  }
}
.card-form__col.-cvv {
  max-width: 150px;
}
@media screen and (max-width: 480px) {
  .card-form__col.-cvv {
    max-width: initial;
  }
}
.card-form__group {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}
.card-form__group .card-input__input {
  flex: 1;
  margin-right: 15px;
}
.card-form__group .card-input__input:last-child {
  margin-right: 0;
}
.card-form__button {
  width: 100%;
  height: 55px;
  background: #2364d2;
  border: none;
  border-radius: 5px;
  font-size: 22px;
  font-weight: 500;
  font-family: "Source Sans Pro", sans-serif;
  box-shadow: 3px 10px 20px 0px rgba(35, 100, 210, 0.3);
  color: #fff;
  margin-top: 20px;
  cursor: pointer;
}
@media screen and (max-width: 480px) {
  .card-form__button {
    margin-top: 10px;
  }
}
.card-list {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
@media screen and (max-width: 759px) {
  .card-list {
    flex-flow: column nowrap;
    margin-top: 200px;
  }
}
@media screen and (max-width: 480px) {
  .card-list {
    margin-bottom: 0;
  }
}
.card-input {
  margin-bottom: 20px;
}
.card-input__label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
  color: #1a3b5d;
  width: 100%;
  display: block;
  user-select: none;
}
.card-input__input {
  width: 100%;
  height: 50px;
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #ced6e0;
  transition: all 0.3s ease-in-out;
  font-size: 18px;
  padding: 5px 15px;
  background: none;
  color: #1a3b5d;
  font-family: "Source Sans Pro", sans-serif;
}
.card-input__input:hover,
.card-input__input:focus {
  border-color: #3d9cff;
}
.card-input__input:focus {
  box-shadow: 0px 10px 20px -13px rgba(32, 56, 117, 0.35);
}
.card-input__input.-select {
  -webkit-appearance: none;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUxJREFUeNrM1sEJwkAQBdCsngXPHsQO9O5FS7AAMVYgdqAd2IGCDWgFnryLFQiCZ8EGnJUNimiyM/tnk4HNEAg/8y6ZmMRVqz9eUJvRaSbvutCZ347bXVJy/ZnvTmdJ862Me+hAbZCTs6GHpyUi1tTSvPnqTpoWZPUa7W7ncT3vK4h4zVejy8QzM3WhVUO8ykI6jOxoGA4ig3BLHcNFSCGqGAkig2yqgpEiMsjSfY9LxYQg7L6r0X6wS29YJiYQYecemY+wHrXD1+bklGhpAhBDeu/JfIVGxaAQ9sb8CI+CQSJ+QmJg0Ii/EE2MBiIXooHRQhRCkBhNhBcEhLkwf05ZCG8ICCOpk0MULmvDSY2M8UawIRExLIQIEgHDRoghihgRIgiigBEjgiFATBACAgFgghEwSAAGgoBCBBgYAg5hYKAIFYgHBo6w9RRgAFfy160QuV8NAAAAAElFTkSuQmCC");
  background-size: 12px;
  background-position: 90% center;
  background-repeat: no-repeat;
  padding-right: 30px;
}
</style>
