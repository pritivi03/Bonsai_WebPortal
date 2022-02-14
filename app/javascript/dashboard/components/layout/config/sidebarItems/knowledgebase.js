import { frontendURL } from '../../../../helper/URLHelper';

const knowledgebase = accountId => ({
  parentNav: 'knowledgebase',
  routes: [
    'kb_dashboard',
    'kb_upload',
  ],
  menuItems: [
    {
      icon: 'list',
      label: 'KB_DASHBOARD',
      key: 'kb_dashboard',
      toState: frontendURL(`accounts/${accountId}/knowledge-base`),
      toolTip: 'Conversation from all subscribed inboxes',
      toStateName: 'kb_dashboard',
    },
    {
        icon: 'attach',
        label: 'KB_UPLOAD',
        key: 'kb_upload',
        toState: frontendURL(`accounts/${accountId}/knowledge-base/upload`),
        toolTip: 'Conversation from all subscribed inboxes',
        toStateName: 'kb_upload',
      },
  ],
});

export default knowledgebase;
