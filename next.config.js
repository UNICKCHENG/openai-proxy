const prefix = process.env.API_BASE || 'https://api.openai.com';
const claude_prefix = process.env.CLAUDE_BASE || 'https://claude.ai/api';

module.exports = {
    env: {
        API_BASE: prefix,
        CLAUDE_BASE: claude_prefix,
        // 限流，每秒最多请求次数，具体请参考 Upstash 文档
        UPSTASH_RATE_LIMIT: process.env.UPSTASH_RATE_LIMIT || 30,
        // Claude 默认会话名称
        CLAUSE_DEFAULT_CONVERSATION_NAME: process.env.CLAUSE_DEFAULT_CONVERSATION_NAME ?? 'Hello World',
        // 自定义跨域请求, 默认允许跨域
        ACCESS_CONTROL_ALLOW_ORIGIN: process.env.ACCESS_CONTROL_ALLOW_ORIGIN ?? '*',
    },
    async rewrites() {
        return [
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