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
                <h6 style="font-size: 30px; margin-right: 10px;">$100</h6>
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

            <woot-button style="margin-top: 30px;">Upgrade</woot-button>
        </div>
        <div style="flex: 1; margin-right: 30px; display: flex; align-items: center; flex-direction: column;;">
            <h5 style="margin-top: 30px;">Pro</h5>
            <p style="text-align: center;">The basics for personal projects, hobby sites, or experiments.</p>

            <div style="display: flex; flex-direction: row; align-items: center; margin-top: 30px;">
                <h6 style="font-size: 30px; margin-right: 10px;">$100</h6>
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

            <woot-button style="margin-top: 30px;">Upgrade</woot-button>
        </div>
        <div style="flex: 1; margin-right: 30px; display: flex; align-items: center; flex-direction: column;">
            <h5 style="margin-top: 30px;">Enterprise</h5>
            <p style="text-align: center;">The basics for personal projects, hobby sites, or experiments.</p>

            <div style="display: flex; flex-direction: row; align-items: center; margin-top: 30px;">
                <h6 style="font-size: 30px; margin-right: 10px;">$100</h6>
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

            <woot-button style="margin-top: 30px;">Contact Us</woot-button>

        </div>
    </div>
  </div>
</template>

<script>
import router from '../../../../index';
import PageHeader from '../../SettingsSubPageHeader';
import alertMixin from 'shared/mixins/alertMixin';
import FeatureRow from "./FeatureRow.vue"

export default {
  components: {
    PageHeader,
    FeatureRow
  },
  mixins: [alertMixin],
  data() {
    return {
      enabledFeatures: {},
    };
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
  },
};
</script>
