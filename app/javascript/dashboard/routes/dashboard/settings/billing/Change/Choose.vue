<template>
  <div class="wizard-body small-9 columns">
    <page-header
      header-title="Change your plan"
      header-content="Upgrade or downgrade your team to suit your business needs."
    />
    <div class="row channels">
        <div style="flex: 1; margin-right: 30px; display: flex; align-items: center; flex-direction: column;">
            <h5 style="margin-top: 30px;">Starter</h5>
            <p style="text-align: center;">The basics for personal projects, hobby sites, or experiments.</p>

            <div style="display: flex; flex-direction: row; align-items: center; margin-top: 30px;">
                <h6 style="font-size: 30px; margin-right: 10px;">$45</h6>
                <p>/seat / month</p>
            </div>

            <div style="margin-top: 30px; display: flex; flex-direction: column; align-items: center;">
                <feature-row text="1 team member" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="3 concurrent builds" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="400 GB bandwidth/month" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="1,000 build minutes/month" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="Slack & email notifications" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="Email support from Bonsai" style="margin-bottom: 4px;"></feature-row>
            </div>

            <woot-button style="margin-top: 30px;" :disabled="this.currentPlan == 'Starter Plan' ">{{(this.currentPlan == 'Pro Plan' ? "Downgrade" : "Upgrade")}}</woot-button>
        </div>
        <div style="flex: 1; margin-right: 30px; display: flex; align-items: center; flex-direction: column;;">
            <h5 style="margin-top: 30px;">Pro</h5>
            <p style="text-align: center;">The basics for personal projects, hobby sites, or experiments.</p>

            <div style="display: flex; flex-direction: row; align-items: center; margin-top: 30px;">
                <h6 style="font-size: 30px; margin-right: 10px;">$150</h6>
                <p>/seat / month</p>
            </div>

            <div style="margin-top: 30px; display: flex; flex-direction: column; align-items: center;">
                <feature-row text="1 team member" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="3 concurrent builds" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="400 GB bandwidth/month" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="1,000 build minutes/month" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="Slack & email notifications" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="Email support from Bonsai" style="margin-bottom: 4px;"></feature-row>
            </div>

            <woot-button style="margin-top: 30px;" :disabled="this.currentPlan == 'Pro Plan' " @click="proPlanClicked()">Upgrade</woot-button>
        </div>
        <div style="flex: 1; margin-right: 30px; display: flex; align-items: center; flex-direction: column;">
            <h5 style="margin-top: 30px;">Enterprise</h5>
            <p style="text-align: center;">The basics for personal projects, hobby sites, or experiments.</p>

            <div style="display: flex; flex-direction: row; align-items: center; margin-top: 30px;">
                <h6 style="font-size: 30px; margin-right: 10px;">Custom Pricing</h6>
                <p></p>
            </div>

            <div style="margin-top: 30px; display: flex; flex-direction: column; align-items: center;">
                <feature-row text="1 team member" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="3 concurrent builds" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="400 GB bandwidth/month" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="1,000 build minutes/month" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="Slack & email notifications" style="margin-bottom: 4px;"></feature-row>
                <feature-row text="Email support from Bonsai" style="margin-bottom: 4px;"></feature-row>
            </div>

            <woot-button style="margin-top: 30px;">Contact Us</woot-button>

        </div>
    </div>
  </div>
</template>

<script>
import router from '../../../../index';
import PageHeader from '../../SettingsSubPageHeader';
import FeatureRow from "./FeatureRow.vue"
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import configMixin from 'shared/mixins/configMixin';
import accountMixin from '../../../../../mixins/account';
const semver = require('semver');
import ky from 'ky'
import {loadStripe} from '@stripe/stripe-js';


export default {
  components: {
    PageHeader,
    FeatureRow
  },
  computed: {
    ...mapGetters({
      globalConfig: 'globalConfig/get',
      getAccount: 'accounts/getAccount',
      uiFlags: 'accounts/getUIFlags',
    }),
  },
  mixins: [accountMixin, alertMixin, configMixin],
  data() {
    return {
      enabledFeatures: {},
      api: "http://127.0.0.1:5000/",
      currentPlan: ""
    };
  },
  async mounted() {
    if (!this.id) {
      console.log("hey")
      await this.initializeAccount();
      this.retrieveBillingInfo();
      //this.customUpdateAccount()
    }
  },
  methods: {
    async createTeam(data) {
      try {
        const team = await this.$store.dispatch('teams/create', {
          ...data,
        });

        router.replace({
          name: 'settings_teams_add_agents',
          params: {
            page: 'new',
            teamId: team.id,
          },
        });
      } catch (error) {
        this.showAlert(this.$t('TEAMS_SETTINGS.TEAM_FORM.ERROR_MESSAGE'));
      }
    },

    async initializeAccount() {
      try {
        await this.$store.dispatch('accounts/get');
        const {
          name,
          locale,
          id,
          domain,
          support_email,
          custom_email_domain_enabled,
          features,
          auto_resolve_duration,
          latest_chatwoot_version: latestChatwootVersion,
          stripe_id
        } = this.getAccount(this.accountId);

        console.log(this.getAccount(this.accountId))

        this.$root.$i18n.locale = locale;
        this.name = name;
        this.locale = locale;
        this.id = id;
        this.domain = domain;
        this.supportEmail = support_email;
        this.customEmailDomainEnabled = custom_email_domain_enabled;
        this.features = features;
        this.autoResolveDuration = auto_resolve_duration;
        this.latestChatwootVersion = latestChatwootVersion;
        this.stripe_id = stripe_id
      } catch (error) {
        // Ignore error
        console.log(error)
      }
    },

    async onStarterPlan() {
      //they have not paid for anything yet, this means they are on the free account

      //set the effective period to free forever
      this.effectivePeriod = "Effective in continuity"

      this.currentPlan = "Starter Plan"

      console.log(this.stripe_id)
    },

    async retrieveBillingInfo() {
      //check to see if there is a stripe ID


      if (this.stripe_id == "" || this.stripe_id == undefined) {
        this.onStarterPlan()
      } else {

        //use their stripe_id to fetch their current subscriptions

        fetch(this.api + "billing/getCustomerCurrentSubscriptions?customer_id=" + this.stripe_id)
        .then(response => response.json())
        .then(resp => {
          

          if (resp == undefined || resp["data"] == undefined || resp["data"][0] == undefined) {
            this.onStarterPlan()
          } else {
            var active_sub = resp["data"][0]
            var planData = {"price_1KY3ErBxBilIm7SklJyAoKHA": "Pro Plan"}
            var priceData = {"price_1KY3ErBxBilIm7SklJyAoKHA": 125}

            var sub_id = active_sub["plan"]["id"]

            var sub_start = new Date(active_sub["current_period_start"] * 1000)
            var sub_end = new Date(active_sub["current_period_end"] * 1000)

            this.effectivePeriod = "Effective from " + sub_start.toLocaleDateString() + " to " + sub_end.toLocaleDateString()
            this.planPrice = priceData[sub_id]

            this.currentPlan = planData[sub_id]
            console.log("here")

          }

        });

      }

      

    },

    async proPlanClicked() {
      const stripe = await loadStripe('pk_test_XSPOE6TWHgBLf88AFXzR5d8M');

      const session = await ky.post(this.api + "billing/createCheckout", {json: {'account_id': this.id, 'customer_id': this.stripe_id}}).json()
      console.log(session)
      stripe.redirectToCheckout({sessionId: session.id})
    }
  },
};
</script>
