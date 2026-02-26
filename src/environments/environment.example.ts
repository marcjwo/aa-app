export const environment = {
  production: false,
  // Conversational Analytics API Configuration
  // TODO: User must replace these with actual values from their Google Cloud project
  projectId: 'YOUR_PROJECT_ID',
  location: 'global',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID', // OAuth 2.0 Web Client ID
  lookerClientId: 'YOUR_LOOKER_CLIENT_ID',
  lookerClientSecret: 'YOUR_LOOKER_CLIENT_SECRET',
  lookerInstanceUrl: 'https://looker.cloud-bi-opm.com',
  lookerModel: 'agent_analytics',
  // lookerExplore: 'agent_logs'
  lookerExplore: 'manufacturing_agent_logs'
};
