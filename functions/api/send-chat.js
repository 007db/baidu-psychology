export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // ==========================================
    // 1. 检查 Resend API Key
    // ==========================================

    if (!env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY 未配置");

      return Response.json(
        {
          success: false,
          error: "RESEND_API_KEY 未配置"
        },
        {
          status: 500
        }
      );
    }

    // ==========================================
    // 2. 获取聊天记录
    // ==========================================

    const body = await request.json();

    const history = Array.isArray(body?.history)
      ? body.history
      : [];

    if (history.length === 0) {
      return Response.json(
        {
          success: false,
          error: "没有可发送的聊天记录"
        },
        {
          status: 400
        }
      );
    }

    // ==========================================
    // 3. 生成聊天记录
    // ==========================================

    let conversation = "";

    for (const item of history) {
      if (
        !item ||
        typeof item.content !== "string"
      ) {
        continue;
      }

      const content = item.content.trim();

      if (!content) {
        continue;
      }

      if (item.role === "user") {
        conversation +=
          "用户：\n" +
          content +
          "\n\n";
      }

      else if (item.role === "assistant") {
        conversation +=
          "摆渡心理AI助手：\n" +
          content +
          "\n\n";
      }
    }

    if (!conversation.trim()) {
      return Response.json(
        {
          success: false,
          error: "聊天记录为空"
        },
        {
          status: 400
        }
      );
    }

    // ==========================================
    // 4. 当前时间
    // ==========================================

    const now = new Date().toLocaleString(
      "zh-CN",
      {
        timeZone: "Asia/Shanghai"
      }
    );

    // ==========================================
    // 5. HTML安全转义
    // ==========================================

    const safeConversation =
      escapeHtml(conversation);

    const safeTime =
      escapeHtml(now);

    // ==========================================
    // 6. 调用 Resend
    // ==========================================

    console.log(
      "开始发送AI聊天记录到Resend"
    );

    const emailResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${env.RESEND_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          from:
            "摆渡心理AI助手 <ai@qgzhj.com>",

          to:
            [
              "1907132646@qq.com"
            ],

          subject:
            "【摆渡心理】AI心理助手聊天记录",

          html: `
<!doctype html>

<html lang="zh-CN">

<head>

<meta charset="UTF-8">

<title>摆渡心理AI聊天记录</title>

</head>

<body style="
margin:0;
padding:20px;
background:#f3f9ff;
font-family:
Arial,
'Microsoft YaHei',
sans-serif;
">

<div style="
max-width:700px;
margin:auto;
background:#ffffff;
border-radius:15px;
padding:25px;
">

<h2 style="
color:#0077c8;
margin-top:0;
">

摆渡心理
AI心理助手聊天记录

</h2>

<p style="
color:#666;
">

对话结束时间：

${safeTime}

</p>

<hr>

<div style="
white-space:pre-wrap;
line-height:1.8;
font-size:15px;
color:#333;
background:#f7fbff;
padding:20px;
border-radius:10px;
">

${safeConversation}

</div>

<hr>

<p style="
color:#999;
font-size:13px;
line-height:1.6;
">

本邮件由摆渡心理网站
AI心理助手自动发送。

<br>

聊天记录仅在用户主动点击
“结束对话并发送记录”后发送。

</p>

</div>

</body>

</html>
`
        })
      }
    );

    // ==========================================
    // 7. 读取 Resend 返回
    // ==========================================

    const emailText =
      await emailResponse.text();

    let emailResult = {};

    try {
      emailResult =
        JSON.parse(emailText);
    }
    catch {
      emailResult = {
        raw: emailText
      };
    }

    console.log(
      "Resend返回状态:",
      emailResponse.status
    );

    console.log(
      "Resend返回内容:",
      emailResult
    );

    // ==========================================
    // 8. Resend失败
    // ==========================================

    if (!emailResponse.ok) {

      return Response.json(
        {
          success: false,

          error:
            emailResult?.message ||
            emailResult?.error ||
            "Resend发送失败",

          resend:
            emailResult
        },
        {
          status: 502
        }
      );
    }

    // ==========================================
    // 9. 成功
    // ==========================================

    return Response.json({

      success: true,

      message:
        "聊天记录发送成功",

      emailId:
        emailResult?.id || null

    });

  }

  catch (error) {

    console.error(
      "发送聊天记录异常:",
      error
    );

    return Response.json(
      {
        success: false,

        error:
          error?.message ||
          "发送聊天记录失败"
      },
      {
        status: 500
      }
    );
  }
}


// ==========================================
// HTML安全转义
// ==========================================

function escapeHtml(text) {

  return String(text)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}
