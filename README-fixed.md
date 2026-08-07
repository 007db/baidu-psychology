# baidu-psychology-v9.0-admin-enterprise-fixed

修复内容：
- 增加后台 JWT 登录检查
- 未登录访问后台自动跳转 admin-login.html
- 增加统一 auth.js
- 保留 Cloudflare Pages + Functions + D1 架构

部署前请检查 Functions 的 token 校验逻辑与 D1 配置。
