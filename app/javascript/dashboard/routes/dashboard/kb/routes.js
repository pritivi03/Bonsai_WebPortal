import KBFileUpload from "./components/KBFileUpload"
import KBDashboard from "./components/KBDashboard"
import { frontendURL } from "../../../helper/URLHelper"

export const routes = [
    {
      path: frontendURL('accounts/:accountId/knowledge-base'),
      name: 'kb_dashboard',
      roles: ['administrator'],
      component: KBDashboard,
    },
    {
      path: frontendURL('accounts/:accountId/knowledge-base/upload'),
      name: 'kb_upload',
      roles: ['administrator'],
      component: KBFileUpload,
    },
];
  