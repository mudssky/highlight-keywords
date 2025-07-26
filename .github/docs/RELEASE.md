# 发布配置说明

本项目已配置 semantic-release 自动发布系统，可以自动：

1. 分析提交信息确定版本类型（patch/minor/major）
2. 更新 package.json 中的版本号
3. 构建油猴脚本
4. 创建 GitHub Release
5. 上传用户脚本文件到 Release
6. 生成和更新 CHANGELOG.md
7. 提交版本更新

## 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能 (minor 版本)
- `fix:` - 修复 bug (patch 版本)
- `BREAKING CHANGE:` - 破坏性变更 (major 版本)
- `docs:` - 文档更新
- `style:` - 代码格式化
- `refactor:` - 重构
- `test:` - 测试相关
- `chore:` - 构建过程或辅助工具的变动

## 发布流程

1. 确保代码已推送到 `main` 分支
2. GitHub Actions 会自动触发发布流程
3. semantic-release 会：
   - 分析自上次发布以来的提交
   - 确定新版本号
   - 构建项目
   - 创建 GitHub Release
   - 上传 `highlight-keywords.user.js` 文件

## 手动发布（本地）

如果需要手动发布，需要设置 GitHub token：

```bash
# 设置环境变量
export GITHUB_TOKEN=your_github_token

# 运行发布
pnpm semantic-release
```

## 配置文件

- `.releaserc.cjs` - semantic-release 配置
- `.github/workflows/release.yml` - GitHub Actions 工作流
- `CHANGELOG.md` - 自动生成的变更日志

## 注意事项

1. 只有推送到 `main` 分支才会触发发布
2. 如果没有符合规范的提交，不会创建新版本
3. 版本号会自动更新到 package.json 和用户脚本头部
4. 用户可以从 GitHub Releases 页面下载最新的用户脚本