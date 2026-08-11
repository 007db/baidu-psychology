export async function onRequestPost(context) {

  try {

    const { message, history = [] } =
      await context.request.json();


    // ==============================
    // 1. 检查用户消息
    // ==============================

    if (!message || !String(message).trim()) {

      return Response.json({
        success: false,
        error: "消息不能为空"
      }, {
        status: 400
      });

    }


    // ==============================
    // 2. 获取 Cloudflare 环境变量
    // ==============================

    const deepseekKey =
      context.env.DEEPSEEK_API_KEY;

    const resendKey =
      context.env.RESEND_API_KEY;


    if (!deepseekKey) {

      return Response.json({
        success: false,
        error: "Cloudflare 没有找到 DEEPSEEK_API_KEY，请检查 Variables and Secrets。"
      }, {
        status: 500
      });

    }


    // ==============================
    // 3. 组装多轮聊天记录
    // ==============================

    const messages = [

      {
        role: "system",
        content:
          "你是摆渡心理AI助手，提供温暖、专业、安全的心理支持。你不能替代医生进行诊断或治疗。遇到明显的自伤、自杀或他伤风险时，应建议用户立即寻求当地紧急服务或专业危机干预机构。回答使用简体中文。"
      }

    ];


    if (Array.isArray(history)) {

      for (const item of history) {

        if (
          item &&
          (item.role === "user" ||
           item.role === "assistant") &&
          typeof item.content === "string" &&
          item.content.trim()
        ) {

          messages.push({

            role: item.role,

            content: item.content

          });

        }

      }

    }


    // 当前用户问题

    messages.push({

      role: "user",

      content: String(message).trim()

    });


    // ==============================
    // 4. 调用 DeepSeek
    // ==============================

    const deepseekResponse =
      await fetch(
        "https://api.deepseek.com/chat/completions",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            "Authorization":
              "Bearer " + deepseekKey

          },

          body: JSON.stringify({

            model: "deepseek-chat",

            messages: messages,

            stream: false

          })

        }
      );


    // ==============================
    // 5. 读取 DeepSeek 返回
    // ==============================

    const deepseekText =
      await deepseekResponse.text();


    let deepseekData;


    try {

      deepseekData =
        JSON.parse(deepseekText);

    }
    catch {

      return Response.json({

        success: false,

        error:
          "DeepSeek返回的数据不是有效JSON：" +
          deepseekText.substring(0, 500)

      }, {

        status: 502

      });

    }


    // ==============================
    // 6. 检查 DeepSeek HTTP 状态
    // ==============================

    if (!deepseekResponse.ok) {

      const apiError =
        deepseekData?.error?.message ||
        deepseekData?.message ||
        "DeepSeek API 调用失败";


      return Response.json({

        success: false,

        error:
          "DeepSeek错误：" +
          apiError

      }, {

        status: 502

      });

    }


    // ==============================
    // 7. 获取 AI 回复
    // ==============================

    const answer =
      deepseekData
        ?.choices
        ?.[0]
        ?.message
        ?.content;


    if (
      !answer ||
      !String(answer).trim()
    ) {

      return Response.json({

        success: false,

        error:
          "DeepSeek返回成功，但没有返回AI文字内容。"

      }, {

        status: 502

      });

    }


    // ==============================
    // 8. 异步发送聊天记录到邮箱
    // ==============================

    if (resendKey) {

      try {

        const now =
          new Date().toLocaleString(
            "zh-CN",
            {
              timeZone:
                "Asia/Shanghai"
            }
          );


        let conversation = "";


        /*
         * 之前的聊天记录
         */

        if (Array.isArray(history)) {

          for (const item of history) {

            if (
              !item ||
              !item.content
            ) {
              continue;
            }


            if (
              item.role === "user"
            ) {

              conversation +=
                "用户：\n" +
                item.content +
                "\n\n";

            }


            if (
              item.role === "assistant"
            ) {

              conversation +=
                "AI助手：\n" +
                item.content +
                "\n\n";

            }

          }

        }


        /*
         * 当前用户消息
         */

        conversation +=
          "用户：\n" +
          message +
          "\n\n";


        /*
         * 当前AI回复
         */

        conversation +=
          "AI助手：\n" +
          answer;


        /*
         * 发送邮件
         */

        await fetch(
          "https://api.resend.com/emails",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              "Authorization":
                "Bearer " +
                resendKey

            },

            body: JSON.stringify({

              from:
                "摆渡心理AI助手 <ai@qgzhj.com>",

              to:
                ["1907132646@qq.com"],

              subject:
                "【摆渡心理】AI助手聊天记录",

              html:
                `
                <div style="
                  font-family:
                  Arial,
                  'Microsoft YaHei',
                  sans-serif;
                  line-height:1.7;
                ">

                  <h2 style="
                    color:#0077c8;
                  ">
                    摆渡心理 AI助手聊天记录
                  </h2>

                  <p>
                    <strong>
                      时间：
                    </strong>
                    ${escapeHtml(now)}
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

                  <p style="
                    color:#888;
                    font-size:13px;
                  ">
                    本邮件由摆渡心理网站
                    AI助手自动发送。
                  </p>

                </div>
                `

            })

          }

        );

      }
      catch (emailError) {

        /*
         * 邮件失败不影响AI回复
         */

        console.error(
          "Resend邮件发送失败：",
          emailError
        );

      }

    }


    // ==============================
    // 9. 返回 AI 回复给前端
    // ==============================

    return Response.json({

      success: true,

      reply:
        String(answer).trim()

    });


  }
  catch (error) {

    console.error(
      "AI API Error:",
      error
    );


    return Response.json({

      success: false,

      error:
        "服务器发生错误：" +
        (
          error?.message ||
          "未知错误"
        )

    }, {

      status: 500

    });

  }

}


/*
 * ====================================
 * HTML 转义
 * ====================================
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
