# 小红书批量清理工具 (XHS Cleaner)

> **⚠️ 重要说明**
>
> **Bun CLI 工具无法使用**，因为小红书 API 需要 `x-s`、`x-s-common` 等加密签名请求头，这些签名只能通过浏览器的 JavaScript 生成。
>
> **请使用浏览器脚本：** 查看 **[BROWSER_SCRIPT.md](BROWSER_SCRIPT.md)** 获取可用的浏览器控制台脚本。
>
> 本 TypeScript CLI 工具项目作为学习示例保留，展示了完整的开发工具链配置和最佳实践。

---

## 🎯 推荐使用方法

### 使用浏览器控制台脚本

这是目前唯一可用的方法，请查看 **[BROWSER_SCRIPT.md](BROWSER_SCRIPT.md)**

**特点：**

- ✅ 开箱即用，无需配置
- ✅ 自动验证登录状态
- ✅ 自动获取 User ID
- ✅ 实时进度显示
- ✅ 安全可靠

**使用步骤：**

1. 打开小红书网页版并登录
2. 按 F12 打开开发者工具 → Console 标签
3. 复制 [BROWSER_SCRIPT.md](BROWSER_SCRIPT.md) 中的脚本并运行
4. 脚本会自动验证登录并开始批量清理

---

## 📚 关于此项目

本项目展示了一个完整的 TypeScript CLI 工具开发流程，虽然由于小红书 API 签名限制无法实际使用，但作为学习示例包含了现代前端工程的所有最佳实践。

### ✨ 技术特性

- 🚀 使用 bun 运行，速度快
- 📦 TypeScript 类型安全
- 🎨 美观的命令行交互界面
- 🔄 批量处理，自动翻页
- ⏱️ 智能延迟，避免请求过快
- 📝 详细的日志输出
- ⚙️ 配置持久化存储

### 📋 技术栈

- **运行时**: Bun
- **语言**: TypeScript
- **代码规范**:
  - ESLint 9 (最新 flat config)
  - Prettier
  - Husky (Git Hooks)
  - Commitlint (提交信息规范)
- **依赖**:
  - axios - HTTP 客户端
  - commander - CLI 框架
  - inquirer - 命令行交互
  - ora - 加载动画
  - chalk - 终端颜色

---

## 💻 项目开发（学习参考）

如果你想学习这个项目的开发配置：

### 安装 Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### 安装依赖

```bash
bun install
```

### 代码质量检查

```bash
# 代码格式化
bun run format

# 代码检查
bun run lint

# 自动修复代码问题
bun run lint:fix
```

---

## 📁 项目结构

```
xhs-cleaner/
├── src/
│   ├── index.ts              # CLI 主入口
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   └── utils/
│       ├── client.ts         # 小红书 API 客户端
│       ├── config.ts         # 配置管理
│       └── logger.ts         # 日志工具
├── .husky/                   # Git Hooks
│   ├── pre-commit
│   └── commit-msg
├── eslint.config.js          # ESLint 配置
├── .prettierrc.json          # Prettier 配置
├── commitlint.config.js      # Commitlint 配置
├── .lintstagedrc.json        # Lint-staged 配置
├── tsconfig.json             # TypeScript 配置
├── package.json              # 项目配置
├── README.md                 # 项目文档
├── BROWSER_SCRIPT.md         # 浏览器脚本（可用）
└── USAGE.md                  # 使用指南
```

---

## 🔧 开发工具链

项目配置了完整的代码质量工具链：

### ESLint 9

- 使用最新的 flat config 格式
- 集成 TypeScript ESLint 规则
- 严格的类型检查

### Prettier

- 统一代码格式
- 自动格式化

### Husky

- `pre-commit`: 运行 lint-staged 自动格式化代码
- `commit-msg`: 运行 commitlint 验证提交信息

### Commitlint

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 规范的提交信息格式

---

## 📖 提交规范

提交信息遵循 Conventional Commits 规范：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
build: 构建相关
ci: CI/CD 相关
chore: 其他修改
```

**示例：**

```bash
git commit -m "feat: 添加批量取消收藏功能"
git commit -m "fix: 修复 Cookie 过期检测问题"
```

---

## ⚠️ 注意事项

1. **CLI 工具无法使用** - 由于小红书 API 签名限制，请使用浏览器脚本
2. **浏览器脚本可用** - 查看 [BROWSER_SCRIPT.md](BROWSER_SCRIPT.md)
3. **不可逆操作** - 批量取消后无法恢复，请谨慎使用
4. **Cookie 安全** - Cookie 包含敏感信息，请勿泄露

---

## 📄 许可证

MIT

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**免责声明**: 本工具仅供学习交流使用，请勿用于非法用途。使用本工具产生的一切后果由使用者自行承担。
