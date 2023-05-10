const prefix = process.env.API_BASE || 'https://api.openai.com';

module.exports = {
    async rewrites() {
      return [
        {
            source: '/credit_grants',
            destination: '/api/credit_grants',
        },
        {
          source: '/:slug*',
          destination: `${prefix}/:slug*`,
        },
      ]
    },
  }
  