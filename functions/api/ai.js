export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // =========================
    // 1. 检查 DeepSeek API Key
    // =========================
    if (!env.DEEPSEEK_API_KEY) {
      return Response.json(
        {
          success: false,
          error: "DEEPSEEK_API_KEY 未配置"
        },
        { status: 500 }
      );
    }

    // =========================
    // 2. 获取用户消息
    // =========================
    const body = await request.json();
    const message = body?.message?.trim();

    if (!message) {
      return Response.json(
        {
          success: false,
          error: "请输入咨询内容"
        },
        { status: 400 }
      );
    }

    // =========================
    // 3. 调用 DeepSeek
    // =========================
    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "deepseek-chat",

          messages: [
            {
              role: "system",
              content:
                "你是摆渡心理AI助手，为用户提供温和、专业、安全的心理支持。不要进行医疗诊断，不替代专业心理咨询。遇到明显危机风险时，应建议用户及时寻求专业帮助。"
            },

            {
              role: "user",
              content: message
            }
          ],

          temperature: 0.7
        })
      }
    );

    // =========================
    // 4. 读取 DeepSeek 返回
    // =========================
    const result = await response.json();

    // DeepSeek API 返回错误
    if (!response.ok) {
      console.error("DeepSeek API错误:", result);

      return Response.json(
        {
          success: false,
          error:
            result?.error?.message ||
            `DeepSeek API 请求失败，HTTP ${response.status}`
        },
        { status: response.status }
      );
    }

    // =========================
    // 5. 提取 AI 回复
    // =========================
    const reply =
      result?.choices?.[0]?.message?.content || "";

    if (!reply) {
      console.error("DeepSeek没有返回AI内容:", result);

      return Response.json(
        {
          success: false,
          error: "DeepSeek没有返回AI回复"
        },
        { status: 500 }
      );
    }

    // =========================
    // 6. 返回统一格式
    // =========================
    return Response.json({
      success: true,
      reply: reply
    });

  } catch (error) {

    console.error("AI接口错误:", error);

    return Response.json(
      {
        success: false,
        error: error?.message || "AI服务暂时异常"
      },
      { status: 500 }
    );
  }
}
