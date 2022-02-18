import SettingsContent from '../Wrapper';
import Index from './Index.vue';
import { frontendURL } from '../../../../helper/URLHelper';

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
      ],
    },
  ],
};
