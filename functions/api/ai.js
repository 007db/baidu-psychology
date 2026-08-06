export async function onRequestPost(context) {

  try {

    const { request, env } = context;


    // 检查 DeepSeek Key 是否存在
    console.log(
      "DeepSeek Key 是否存在:",
      !!env.DEEPSEEK_API_KEY
    );


    if (!env.DEEPSEEK_API_KEY) {

      return new Response(
        JSON.stringify({
          error: "DEEPSEEK_API_KEY 未配置"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    }


    const { message } = await request.json();


    if (!message) {

      return new Response(
        JSON.stringify({
          error: "请输入咨询内容"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    }



    const response = await fetch(
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

          model: "deepseek-chat",


          messages: [

            {
              role: "system",

              content:
              "你是摆渡心理AI助手，为用户提供温和、专业、安全的心理支持。不要进行医疗诊断，不替代专业心理咨询。遇到危机风险时，建议用户寻求专业帮助。"
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



    const result = await response.text();



    return new Response(
      result,
      {

        status: response.status,

        headers: {

          "Content-Type":
          "application/json"

        }

      }
    );



  } catch (error) {


    console.error(
      "AI接口错误:",
      error
    );


    return new Response(

      JSON.stringify({

        error:
        "AI服务暂时异常",

        detail:
        error.message

      }),

      {

        status: 500,

        headers: {

          "Content-Type":
          "application/json"

        }

      }

    );

  }

}
