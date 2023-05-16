const prefix = process.env.API_BASE || 'https://api.openai.com';

module.exports = {
    env: {
        API_BASE: `${prefix}`,
    },
    async rewrites() {
      return [
        {
            source: '/google/bard',
            destination: `/api/google/bard`,
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
  