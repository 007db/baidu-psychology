export async function onRequestPost(context) {

  try {

    const { request, env } = context;

    const body = await request.json();

    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({
          error:"请输入消息"
        }),
        {
          status:400,
          headers:{
            "Content-Type":"application/json"
          }
        }
      );
    }


    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method:"POST",
        headers:{
          "Authorization":
            `Bearer ${env.DEEPSEEK_API_KEY}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({

          model:"deepseek-chat",

          messages:[
            {
              role:"system",
              content:
              "你是摆渡心理AI助手，请提供温和、专业、安全的心理支持。"
            },
            {
              role:"user",
              content:message
            }
          ]

        })
      }
    );


    const data = await response.text();


    return new Response(data,{
      status:response.status,
      headers:{
        "Content-Type":"application/json"
      }
    });


  } catch(error){

    return new Response(
      JSON.stringify({

        error:"AI接口异常",
        detail:error.message

      }),
      {
        status:500,
        headers:{
          "Content-Type":"application/json"
        }
      }
    );

  }

}
