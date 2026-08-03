# 摆渡心理 V4.0 Sprint 3.5 DeepSeek版

升级：
- DeepSeek AI心理助手接口
- D1聊天记录
- 会员权限基础控制
- Cloudflare Pages Functions

部署：
1. 上传 frontend/functions/database 到 GitHub
2. Cloudflare Pages保持:
Root directory: 空
Build output directory: frontend

环境变量:
DEEPSEEK_API_KEY=你的DeepSeek Key
