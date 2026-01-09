小红书自动取消点赞（Userscript）

一个基于 TypeScript + Bun 开发的油猴脚本，用于在小红书「赞过的内容」页面中，批量、可控地自动取消点赞。

⚠️ 本脚本仅用于个人内容整理与学习研究，请勿用于任何违反平台规则的用途。

⸻

✨ 功能特性
• ✅ 仅在「赞过的内容」页面生效
• ✅ 自动向下滚动，逐条取消点赞
• ✅ 支持 最大取消数量限制（防止误操作）
• ✅ 支持 操作频率配置
• ✅ 支持开启 / 停止
• ✅ 页面内原生风格 UI（Tab 按钮 + 弹窗）
• ✅ 使用 TypeScript 编写，结构清晰，易维护

⸻

📍 生效页面

脚本仅在以下页面生效：

https://www.xiaohongshu.com/user/profile/{userId}?tab=liked

    •	{userId} 为任意用户 ID
    •	非「赞过」页面不会注入 UI，也不会执行任何逻辑

⸻

🖱 使用方式 1. 安装浏览器扩展 Tampermonkey 2. 从 Greasy Fork 安装本脚本 3. 打开任意用户的「赞过的内容」页面 4. 在顶部 Tabs 最右侧看到 「自动取消」 按钮 5. 点击按钮，弹出设置弹窗 6. 配置参数后点击「开启自动取消」

达到设定的最大数量后，脚本会自动停止。

⸻

⚙️ 配置项说明（弹窗）

配置项 说明
最大取消数量 本次运行最多取消多少个点赞
取消频率（ms） 每次扫描 / 取消的时间间隔
是否自动滚动 是否自动加载更多内容
滚动频率（ms） 页面向下滚动的时间间隔

所有配置在运行过程中 即时生效，修改后会自动重启任务。

⸻

🧱 技术栈
• TypeScript
• Bun（构建 / 打包）
• Tampermonkey Userscript
• 原生 DOM API（无第三方依赖）

⸻

📦 本地开发 & 构建

目录结构

xhs-auto-unlike/
├─ src/
│ ├─ index.ts # Userscript 入口
│ ├─ state.ts # 全局状态
│ ├─ logic.ts # 核心取消逻辑
│ ├─ ui-tab.ts # Tabs 按钮
│ ├─ ui-modal.ts # 配置弹窗
│ └─ utils.ts
├─ dist/
│ └─ xhs-auto-unlike.user.js
└─ package.json

构建命令

bun install
bun run build

构建完成后生成：

dist/xhs-auto-unlike.user.js

该文件可直接导入 Tampermonkey 或上传至 Greasy Fork。

⸻

⚠️ 注意事项
• 建议设置 较低的操作频率（如 ≥ 800ms），避免高频操作
• 不建议一次性取消过多点赞
• 小红书页面为 SPA，脚本使用 MutationObserver 监听页面变化
• 页面结构更新可能导致脚本失效，需要适配调整

⸻

🛠 可扩展方向（TODO）
• 随机延迟（模拟人工操作）
• 配置持久化（localStorage）
• 模式切换（取消收藏 / 点赞）
• 只处理最近 N 天的内容
• 操作日志 / 统计信息展示

⸻

📄 License

MIT License

⸻

如果你在使用过程中遇到问题，或有功能建议，欢迎提交 Issue 或自行 Fork 修改。
