import SettingsContent from '../Wrapper';
import Index from './Index.vue';
import { frontendURL } from '../../../../helper/URLHelper';
import ChangePlanWrap from "./Change/Index.vue"
import ChoosePlan from "./Change/Choose.vue"
import FinishSetup from "./Change/Finish.vue"

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/settings/billing'),
      roles: ['administrator'],
      component: SettingsContent,
      props: {
        headerTitle: 'BILLING_SETTINGS.TITLE',
        icon: 'credit-card-person',
        showNewButton: false,
      },
      children: [
        {
          path: '',
          name: 'general_billing_index',
          component: Index,
          roles: ['administrator'],
        },
        {
          path: 'plan',
          component: ChangePlanWrap,
          children: [
            {
              path: '',
              name: 'billing_plan_choose',
              component: ChoosePlan,
              roles: ['administrator'],
            },
            {
              path: 'finish',
              name: 'billing_plan_finish',
              component: FinishSetup,
              roles: ['administrator'],
            },
            /*{
              path: ':teamId/agents',
              name: 'settings_teams_add_agents',
              roles: ['administrator'],
              component: AddAgents,
            },*/
          ],
        },
      ],
    },
  ],
};
