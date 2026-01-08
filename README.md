# 小红书批量清理工具 (XHS Cleaner)

## 🎯 推荐使用方法

### 1. 使用 CLI 工具 (推荐)

通过 Playwright 自动化操作，更加稳定和强大。

**特点：**

- ✅ 自动处理 API 签名 (x-s, x-s-common)
- ✅ 批量处理，自动翻页
- ✅ 智能延迟，防止触发风控
- ✅ 详细的清理方案选择

**使用步骤：**

1. 复制你的小红书 Cookie
2. 运行 `bun run start clean`
3. 按提示操作即可

---

## 📚 关于此项目

这是一个基于 TypeScript 开发的高级 CLI 工具，通过 Playwright 驱动 headless 浏览器来实现对小红书收藏和点赞的批量清理。

### ✨ 技术特性

- 🚀 **Playwright 驱动**: 自动绕过复杂的 API 签名校验
- 📦 **TypeScript**: 全程类型安全
- 🎨 **高级交互**: 基于 Inquirer 和 Ora 提供极致的终端 UI 体验
- 🔄 **批量自动化**: 支持自动加载下一页内容
- ⏱️ **智能风控规避**: 内置随机延迟机制
- ⚙️ **配置持久化**: 免去重复输入，支持多用户配置

### 📋 技术栈

- **运行时**: Bun
- **自动化**: Playwright (Chromium)
- **语言**: TypeScript
- **代码规范**: ESLint 9 + Prettier
- **Git 工作流**: Husky + Commitlint + lint-staged
- **依赖库**:
  - commander - 命令行解析框架
  - inquirer - 交互式命令行
  - ora - 丝滑的加载状态显示
  - chalk - 终端色彩增强

---

## 💻 快速开始

### 安装 Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### 安装依赖并安装浏览器

```bash
bun install
npx playwright install chromium
```

### 运行工具

```bash
# 配置你的 Cookie 和 User ID
bun run start config

# 开始清理
bun run start clean
```

### 代码质量维护

```bash
# 代码检查
bun run lint

# 自动修复
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
│       ├── client.ts         # Playwright 封装的 API 客户端
│       ├── config.ts         # 配置持久化
│       └── logger.ts         # 日志系统
├── .husky/                   # Git 拦截器
├── eslint.config.js          # ESLint 9 配置
├── tsconfig.json             # TS 配置
├── README.md                 # 项目主文档
└── BROWSER_SCRIPT.md         # 备选浏览器脚本
```

---

## ⚠️ 注意事项

1. **操作不可逆** - 批量取消操作无法撤销，操作前请确认。
2. **账号安全** - Cookie 是你的登录凭证，请妥善保管，本工具不会上传任何数据。
3. **频率限制** - 工具内置了延迟，虽然使用了 Playwright，但仍建议不要在短时间内处理极大量的数据。

---

## 📄 许可证

MIT

---

**免责声明**: 本工具仅供学习和个人技术练习使用，请勿用于任何形式的非法用途。使用本工具产生的任何后果由使用者自行承担。
