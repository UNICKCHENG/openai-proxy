module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    "@semantic-release/git",
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "zip -qq -r openai-proxy-${nextRelease.version}.zip .next readme.md LICENSE package.json &&\
          docker build -t unickcheng/openai-proxy:latest .",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "openai-proxy-*.zip",
      },
    ],
    [
      "@semantic-release-plus/docker",
      {
        "registry": "docker.io",
        "name": "unickcheng/openai-proxy",
      }
    ]
  ],
};