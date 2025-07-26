module.exports = {
  branches: ['main'],
  plugins: [
    // 分析提交信息，确定版本类型
    '@semantic-release/commit-analyzer',
    
    // 生成发布说明
    '@semantic-release/release-notes-generator',
    
    // 更新 package.json 中的版本号（不发布到 npm）
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    
    // 构建项目
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm build',
        publishCmd: 'echo "Build completed"'
      }
    ],
    
    // 创建 GitHub Release 并上传用户脚本文件
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'dist/highlight-keywords.user.js',
            name: 'highlight-keywords.user.js',
            label: 'Userscript File'
          }
        ]
      }
    ],
    
    // 更新 CHANGELOG.md
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    
    // 提交更新的文件
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
}