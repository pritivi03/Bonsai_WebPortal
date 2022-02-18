<template>
  <div class="columns profile--settings">
    <form v-if="!uiFlags.isFetchingItem" @submit.prevent="updateAccount">
      <div class="small-12 row profile--settings--row">
        <div class="columns small-3">
          <h4 class="block-title">
            Plan
          </h4>
          <p>Fees and metered feature usage</p>
        </div>
        <div class="columns small-9 medium-5">
          <label :class="{ error: $v.name.$error }">
            <h5>Starter Plan</h5>
            <p>Effective from {{"May 20th, 2020"}} to {{"June 20th, 2020"}}</p>
          </label>
          <label :class="{ error: $v.locale.$error }" style="margin-top: 15px;">
            <p>57 KB / 100 GB bandwidth</p>
            <p>0 / 300 build minutes</p>
            <p>0 / 300 deflection</p>
          </label>
          
          <label :class="{ error: $v.autoResolveDuration.$error }" style="margin: 0px; margin-top: 15px; width: 100px; display: flex; align-items: center;">
            <h5><b>$1000</b></h5><p style="padding-top: 3px;">/seat/month</p>
          </label>

          <woot-button style="margin-top: 15px;">Change Plan</woot-button>
        </div>
      </div>

      <div class="profile--settings--row row">
        <div class="columns small-3">
          <h4 class="block-title">
            Payment Information
          </h4>
          <p>
            Payment and billing information for this account
          </p>
        </div>
        <div class="columns small-9 medium-5">
            <table class="woot-table">
                <tr>
                    <td>Method</td>
                    <td>Number</td>
                    <td>Expiry</td>
                </tr>
                
            </table>
            <woot-button style="margin-top: 15px;">Add Payment Method</woot-button>
        </div>
      </div>

      <woot-submit-button
        class="button nice success button--fixed-right-top"
        :button-text="$t('GENERAL_SETTINGS.SUBMIT')"
        :loading="isUpdating"
      >
      </woot-submit-button>
    </form>

    <woot-loading-state v-if="uiFlags.isFetchingItem" />
  </div>
</template>

<script>
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import configMixin from 'shared/mixins/configMixin';
import accountMixin from '../../../../mixins/account';
const semver = require('semver');

export default {
  mixins: [accountMixin, alertMixin, configMixin],
  data() {
    return {
      id: '',
      name: '',
      locale: 'en',
      domain: '',
      supportEmail: '',
      features: {},
      autoResolveDuration: null,
      latestChatwootVersion: null,
      paymentMethods: []
    };
  },
  validations: {
    name: {
      required,
    },
    locale: {
      required,
    },
    autoResolveDuration: {
      minValue: minValue(1),
      maxValue: maxValue(999),
    },
  },
  computed: {
    ...mapGetters({
      globalConfig: 'globalConfig/get',
      getAccount: 'accounts/getAccount',
      uiFlags: 'accounts/getUIFlags',
    }),
    hasAnUpdateAvailable() {
      if (!semver.valid(this.latestChatwootVersion)) {
        return false;
      }

      return semver.lt(
        this.globalConfig.appVersion,
        this.latestChatwootVersion
      );
    },
    languagesSortedByCode() {
      const enabledLanguages = [...this.enabledLanguages];
      return enabledLanguages.sort((l1, l2) =>
        l1.iso_639_1_code.localeCompare(l2.iso_639_1_code)
      );
    },
    isUpdating() {
      return this.uiFlags.isUpdating;
    },

    featureInboundEmailEnabled() {
      return !!this.features.inbound_emails;
    },

    featureCustomDomainEmailEnabled() {
      return this.featureInboundEmailEnabled && !!this.customEmailDomainEnabled;
    },

    getAccountId() {
      return this.id.toString();
    },
  },
  mounted() {
    if (!this.id) {
      this.initializeAccount();
      this.customUpdateAccount()
    }
  },
  methods: {
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
      } catch (error) {
        // Ignore error
      }
    },

    async updateAccount() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showAlert(this.$t('GENERAL_SETTINGS.FORM.ERROR'));
        return;
      }
      try {
        await this.$store.dispatch('accounts/update', {
          locale: this.locale,
          name: this.name,
          domain: this.domain,
          support_email: this.supportEmail,
          auto_resolve_duration: this.autoResolveDuration,
        });
        this.$root.$i18n.locale = this.locale;
        this.showAlert(this.$t('GENERAL_SETTINGS.UPDATE.SUCCESS'));
      } catch (error) {
        this.showAlert(this.$t('GENERAL_SETTINGS.UPDATE.ERROR'));
      }
    },
    async customUpdateAccount() {
      try {
        await this.$store.dispatch('accounts/update', {
          stripe_id: "abc"
        });
      } catch (error) {
        console.log(error)
      }
    }
  },
};
</script>

<style lang="scss">
@import '~dashboard/assets/scss/variables.scss';
@import '~dashboard/assets/scss/mixins.scss';

.profile--settings {
  padding: 24px;
  overflow: auto;
}

.profile--settings--row {
  @include border-normal-bottom;
  padding: $space-normal;
  .small-3 {
    padding: $space-normal $space-medium $space-normal 0;
  }
  .small-9 {
    padding: $space-normal;
  }
}

.current-version {
  font-size: var(--font-size-small);
  text-align: center;
  padding: var(--space-normal);
}
</style>
