const prefix = process.env.API_BASE || 'https://api.openai.com';

module.exports = {
    env: {
        API_BASE: `${prefix}`,
    },
    async rewrites() {
      return  [
        {
            source: '/claude/:slug*',
            destination: '/api/claude/:slug*',
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
            source: '/openai/billing/credit_grants',
            destination: '/api/openai/billing/credit_grants',
        },
        {
          source: '/openai:slug*',
          destination: `${prefix}/:slug*`,
        },
        ]
    },
}
  