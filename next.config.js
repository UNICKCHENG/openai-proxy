const prefix = process.env.API_BASE || 'https://api.openai.com';

module.exports = {
    env: {
        API_BASE: `${prefix}`,
    },
    async rewrites() {
      return [
        {
            source: '/billing/credit_grants',
            destination: '/api/credit_grants',
        },
        {
          source: '/:slug*',
          destination: `${prefix}/:slug*`,
        },
      ]
    },
}
  