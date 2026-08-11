export async function onRequestPost(context) {

  try {

    const { request, env } = context;


    // ==========================================
    // 1. 检查 DeepSeek API Key
    // ==========================================

    if (!env.DEEPSEEK_API_KEY) {

      return Response.json(
        {
          success: false,
          error: "DEEPSEEK_API_KEY 未配置"
        },
        {
          status: 500
        }
      );

    }


    // ==========================================
    // 2. 获取请求数据
    // ==========================================

    const body =
      await request.json();


    const message =
      body?.message?.trim() || "";


    const history =
      Array.isArray(body?.history)
        ? body.history
        : [];


    const endConversation =
      body?.endConversation === true;


    // ==========================================
    // 3. 如果是结束对话
    // ==========================================

    if (endConversation) {

      /*
       * 结束对话时，不再调用 DeepSeek。
       *
       * 直接把整段聊天记录发送到邮箱。
       */

      if (!env.RESEND_API_KEY) {

        return Response.json(
          {
            success: false,
            error:
              "RESEND_API_KEY 未配置，无法发送聊天记录"
          },
          {
            status: 500
          }
        );

      }


      if (
        !Array.isArray(history) ||
        history.length === 0
      ) {

        return Response.json(
          {
            success: false,
            error:
              "当前没有可发送的聊天记录"
          },
          {
            status: 400
          }
        );

      }


      // ========================================
      // 组装聊天记录
      // ========================================

      let conversation = "";


      for (const item of history) {

        if (
          !item ||
          typeof item.content !== "string"
        ) {

          continue;

        }


        const content =
          item.content.trim();


        if (!content) {

          continue;

        }


        if (item.role === "user") {

          conversation +=
            "用户：\n" +
            content +
            "\n\n";

        }


        else if (
          item.role === "assistant"
        ) {

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
            error:
              "聊天记录为空，无法发送"
          },
          {
            status: 400
          }
        );

      }


      // ========================================
      // 当前时间
      // ========================================

      const now =
        new Date().toLocaleString(
          "zh-CN",
          {
            timeZone:
              "Asia/Shanghai"
          }
        );


      // ========================================
      // HTML 安全转义
      // ========================================

      const safeConversation =
        escapeHtml(conversation);


      const safeTime =
        escapeHtml(now);


      // ========================================
      // 发送到 Resend
      // ========================================

      const emailResponse =
        await fetch(
          "https://api.resend.com/emails",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              "Authorization":
                "Bearer " +
                env.RESEND_API_KEY

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

              html:
                `
                <!doctype html>

                <html lang="zh-CN">

                <head>

                  <meta charset="UTF-8">

                  <title>
                    摆渡心理AI聊天记录
                  </title>

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


      // ========================================
      // 读取 Resend 返回
      // ========================================

      const emailResult =
        await emailResponse.json();


      if (!emailResponse.ok) {

        console.error(
          "Resend发送失败:",
          emailResult
        );


        return Response.json(
          {
            success: false,

            error:
              emailResult?.message ||
              emailResult?.error ||
              "聊天记录发送失败"
          },
          {
            status: 502
          }
        );

      }


      // ========================================
      // 邮件发送成功
      // ========================================

      return Response.json({

        success: true,

        message:
          "聊天记录已成功发送到工作邮箱"

      });

    }


    // ==========================================
    // 4. 正常AI聊天
    // ==========================================

    if (!message) {

      return Response.json(
        {
          success: false,
          error: "请输入咨询内容"
        },
        {
          status: 400
        }
      );

    }


    // ==========================================
    // 5. 调用 DeepSeek
    // ==========================================

    const response =
      await fetch(
        "https://api.deepseek.com/chat/completions",
        {

          method: "POST",

          headers: {

            "Authorization":
              `Bearer ${env.DEEPSEEK_API_KEY}`,

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            model:
              "deepseek-chat",

            messages: [

              {
                role:
                  "system",

                content:
                  "你是摆渡心理AI助手，为用户提供温和、专业、安全的心理支持。不要进行医疗诊断，不替代专业心理咨询。遇到明显危机风险时，应建议用户及时寻求专业帮助。"
              },


              {
                role:
                  "user",

                content:
                  message
              }

            ],

            temperature:
              0.7

          })

        }
      );


    // ==========================================
    // 6. 读取 DeepSeek 返回
    // ==========================================

    const result =
      await response.json();


    if (!response.ok) {

      console.error(
        "DeepSeek API错误:",
        result
      );


      return Response.json(
        {
          success: false,

          error:
            result?.error?.message ||
            `DeepSeek API 请求失败，HTTP ${response.status}`
        },
        {
          status:
            response.status
        }
      );

    }


    // ==========================================
    // 7. 提取 AI 回复
    // ==========================================

    const reply =
      result
        ?.choices
        ?.[0]
        ?.message
        ?.content || "";


    if (!reply) {

      console.error(
        "DeepSeek没有返回AI内容:",
        result
      );


      return Response.json(
        {
          success: false,
          error:
            "DeepSeek没有返回AI回复"
        },
        {
          status: 500
        }
      );

    }


    // ==========================================
    // 8. 返回 AI 回复
    // ==========================================

    return Response.json({

      success:
        true,

      reply:
        reply

    });

  }


  catch (error) {

    console.error(
      "AI接口错误:",
      error
    );


    return Response.json(
      {
        success: false,

        error:
          error?.message ||
          "AI服务暂时异常"
      },
      {
        status: 500
      }
    );

  }

}


/*
 * ==========================================
 * HTML安全转义
 * ==========================================
 */

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
