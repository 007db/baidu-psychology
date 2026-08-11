export async function onRequestPost(context) {
  try {
    const { message, history = [] } = await context.request.json();

    if (!message) {
      return Response.json(
        {
          success: false,
          error: "消息不能为空"
        },
        { status: 400 }
      );
    }

    const deepseekKey = context.env.DEEPSEEK_API_KEY;
    const resendKey = context.env.RESEND_API_KEY;

    if (!deepseekKey) {
      return Response.json(
        {
          success: false,
          error: "DEEPSEEK_API_KEY 未配置"
        },
        { status: 500 }
      );
    }

    /*
     * =========================
     * 1. 调用 DeepSeek
     * =========================
     */

    const messages = [
      {
        role: "system",
        content:
          "你是摆渡心理企业旗舰版AI助手，提供温暖、专业、安全的心理支持。你不能替代医生进行诊断或治疗。遇到明显的自伤、自杀或他伤风险时，应建议用户立即联系当地紧急服务或专业危机干预机构。"
      }
    ];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (
          item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string"
        ) {
          messages.push({
            role: item.role,
            content: item.content
          });
        }
      }
    }

    messages.push({
      role: "user",
      content: message
    });

    const deepseekResponse = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + deepseekKey
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages
        })
      }
    );

    const deepseekData = await deepseekResponse.json();

    if (!deepseekResponse.ok) {
      return Response.json(
        {
          success: false,
          error:
            deepseekData?.error?.message ||
            "DeepSeek AI 服务暂时不可用"
        },
        { status: 500 }
      );
    }

    const answer =
      deepseekData?.choices?.[0]?.message?.content ||
      "AI暂时无法回复，请稍后再试。";

    /*
     * =========================
     * 2. 发送聊天记录到邮箱
     * =========================
     */

    if (resendKey) {
      try {
        const now = new Date().toLocaleString("zh-CN", {
          timeZone: "Asia/Shanghai"
        });

        let conversation = "";

        if (Array.isArray(history)) {
          for (const item of history) {
            if (!item || !item.content) continue;

            if (item.role === "user") {
              conversation +=
                "用户：\n" +
                item.content +
                "\n\n";
            }

            if (item.role === "assistant") {
              conversation +=
                "AI助手：\n" +
                item.content +
                "\n\n";
            }
          }
        }

        conversation +=
          "用户：\n" +
          message +
          "\n\n";

        conversation +=
          "AI助手：\n" +
          answer;

        const emailHtml = `
          <div style="font-family:Arial,'Microsoft YaHei',sans-serif;line-height:1.7;">
            <h2 style="color:#0077c8;">
              摆渡心理 AI助手聊天记录
            </h2>

            <p>
              <strong>时间：</strong>${now}
            </p>

            <hr>

            <div style="
              white-space:pre-wrap;
              background:#f5f9fc;
              padding:20px;
              border-radius:10px;
            ">
${escapeHtml(conversation)}
            </div>

            <hr>

            <p style="color:#888;font-size:13px;">
              本邮件由摆渡心理网站 AI助手自动发送。
            </p>
          </div>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + resendKey
          },
          body: JSON.stringify({
            from: "摆渡心理AI助手 <ai@qgzhj.com>",
            to: ["1907132646@qq.com"],
            subject: "【摆渡心理】AI助手聊天记录",
            html: emailHtml
          })
        });
      } catch (emailError) {
        /*
         * 邮件发送失败不影响AI正常回复
         */
        console.error("Email send failed:", emailError);
      }
    }

    /*
     * =========================
     * 3. 返回 AI 回复
     * =========================
     */

    return Response.json({
      success: true,
      reply: answer
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || "服务器异常"
      },
      { status: 500 }
    );
  }
}


/*
 * 防止聊天内容中的 HTML 注入邮件页面
 */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
