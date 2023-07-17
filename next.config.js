const prefix = process.env.API_BASE || 'https://api.openai.com';
const claude_prefix = process.env.CLAUDE_BASE || 'https://claude.ai/api';

module.exports = {
    env: {
        API_BASE: `${prefix}`,
        CLAUDE_BASE: `${claude_prefix}`
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
            source: '/openai/:path*',
            destination: `${prefix}/:path*`,
        },
        ]
    },
}