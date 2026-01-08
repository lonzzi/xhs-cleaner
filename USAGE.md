# XHS Cleaner 使用指南

## 获取小红书 Cookie 的详细步骤

### Chrome / Edge 浏览器

1. 打开 [小红书](https://www.xiaohongshu.com) 并登录
2. 按下 `F12` 或 `右键` -> `检查` 打开开发者工具
3. 点击顶部的 `Network` (网络) 标签
4. 按下 `Ctrl+R` (Windows) 或 `Cmd+R` (Mac) 刷新页面
5. 在网络请求列表中，点击任意一个 `xiaohongshu.com` 的请求
6. 在右侧面板中找到 `Request Headers` (请求头)
7. 找到 `Cookie:` 字段，复制整行的值

### Safari 浏览器

1. 打开 Safari -> 偏好设置 -> 高级 -> 勾选"在菜单栏中显示开发菜单"
2. 访问 [小红书](https://www.xiaohongshu.com) 并登录
3. 点击菜单栏的 `开发` -> `显示 Web 检查器`
4. 后续步骤同 Chrome

### Firefox 浏览器

1. 打开 [小红书](https://www.xiaohongshu.com) 并登录
2. 按下 `F12` 打开开发者工具
3. 点击 `网络` 标签
4. 刷新页面
5. 点击任意请求，查看右侧的 `Cookie` 字段

## 常见问题

### 1. Cookie 无效或过期

**现象**: 运行时提示认证失败

**解决方案**:

- 重新获取 Cookie
- 确保 Cookie 完整复制，没有遗漏
- 尝试退出登录重新登录后再获取

### 2. 请求频率过快

**现象**: 提示请求过于频繁

**解决方案**:

- 工具已内置随机延迟 (1-3秒)
- 如仍遇到问题，可稍后再试
- 建议分批处理，不要一次性清理太多

### 3. 部分内容清理失败

**现象**: 显示部分失败

**可能原因**:

- 内容已被删除
- 网络波动
- Cookie 过期

**解决方案**:

- 查看错误日志
- 重新运行清理命令
- 检查 Cookie 是否有效

## 安全提示

1. **不要分享 Cookie**: Cookie 相当于你的登录凭证，不要分享给他人
2. **定期更换密码**: 如果担心 Cookie 泄露，可以修改密码使 Cookie 失效
3. **注意隐私**: 配置文件存储在 `~/.xhs-cleaner/config.json`，注意保护

## API 说明

本工具使用的是小红书的 Web API，主要端点：

- 获取列表: `/api/sns/web/v1/user_posted`
- 取消点赞: `/api/sns/web/v1/note/like`
- 取消收藏: `/api/sns/web/v1/note/collect`

**注意**: 小红书可能会更新 API，如果工具失效，请提交 Issue。
