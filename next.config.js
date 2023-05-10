module.exports = {
    async rewrites() {
      return [
        {
            source: '/credit_grants',
            destination: '/api/credit_grants',
        },
        {
          source: '/:slug*',
          destination: 'https://api.openai.com/:slug*',
        },
      ]
    },
  }
  