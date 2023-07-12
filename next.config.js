const prefix = process.env.API_BASE || 'https://api.openai.com';

module.exports = {
    env: {
        API_BASE: `${prefix}`,
    },
    async rewrites() {
      return  [
        {
            source: '/api/claude/organizations/:orgId/chat_conversations',
            destination: '/api/claude/:orgId/chat_conversations',
        },
        {
            source: '/claude/:slug*',
            destination: 'https://claude.ai/api/:slug*',
        },
        {
            source: '/google/bard',
            destination: `/api/google/bard`,
        },
        {
            source: '/ai-topia/:slug*',
            destination: 'https://open.ai-topia.com/:slug*',
        },
        {
            source: '/billing/credit_grants',
            destination: '/api/openai/credit_grants',
        },
        {
          source: '/:slug*',
          destination: `${prefix}/:slug*`,
        },
        ]
    },
}
  