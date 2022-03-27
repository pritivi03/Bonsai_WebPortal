<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1;">
      <h2 style="text-align: center">Success!</h2>
      <h3  style="text-align: center">You have successfully upgraded to the {{this.currentPlan}}!</h3>
       <div style="display: flex; flex-direction: row; align-items: center; margin-top: 30px;">
                <h6 style="font-size: 30px; margin-right: 10px;">${{this.planPrice}}</h6>
                <p>/seat / month</p>
        </div>

      <h5>{{this.effectivePeriod}}</h5>
      <p>You will be billed at the beginning of each monthly recurring cycle.</p>

      <router-link :to="`/app/accounts/${accountId}/settings/billing`">
          <woot-button style="margin-top: 20px;">Return to Billing Settings</woot-button>
      </router-link>
  </div>
</template>

<script>
import ky from "ky"
import {mapGetters} from "vuex"

export default {
    computed: {
        ...mapGetters({
            currentUser: 'getCurrentUser',
            accountId: 'getCurrentAccountId',
        }),
    },
    data () {
        return {
            api: "",
            currentPlan: "",

        }
    },
    async mounted () {
        var session_id = this.$route.query["session_id"]
        //use this session id to fetch details from stripe 
        this.api =  "http://127.0.0.1:5000/"
        console.log(this.api + "billing/getCheckout?session_id=" + session_id)

        var planData = {"price_1KY3ErBxBilIm7SklJyAoKHA": "Pro Plan"}
        var priceData = {"price_1KY3ErBxBilIm7SklJyAoKHA": 125}
        var session_info = await ky.get(this.api + "billing/getCheckout?session_id=" + session_id).json()
        var subscription_id = session_info["subscription"]
        var subscription_info = await ky.get(this.api + "billing/getSubscription?subscription_id=" + subscription_id).json()
        this.currentPlan = planData[subscription_info["plan"]["id"]]

        var sub_start = new Date(subscription_info["current_period_start"] * 1000)
        var sub_end = new Date(subscription_info["current_period_end"] * 1000)

        this.effectivePeriod = "Effective from " + sub_start.toLocaleDateString() + " to " + sub_end.toLocaleDateString()
        this.planPrice = priceData[subscription_info["plan"]["id"]]
        
        console.log(this.currentPlan)
        console.log(session_info)
        console.log(subscription_info)
    }
}
</script>

<style>

</style>