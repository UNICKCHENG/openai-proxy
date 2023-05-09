module.exports = {
    async rewrites() {
      return [
        {
          source: '/openai/:slug*',
          destination: 'https://api.openai.com/:slug*',
        },
      ]
    },
  }
  