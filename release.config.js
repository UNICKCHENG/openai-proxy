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
          "zip -qq -r openai-proxy-${nextRelease.version}.zip .next readme.md LICENSE package.json",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "openai-proxy-*.zip", 
      },
    ],
  ],
};