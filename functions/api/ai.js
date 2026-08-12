export async function onRequestPost(context) {

  const { request, env } = context;


  try {


    // ============================
    // 1. 检查 DeepSeek Key
    // ============================

    if (!env.DEEPSEEK_API_KEY) {

      return Response.json(
        {
          success:false,
          error:"DEEPSEEK_API_KEY 未配置"
        },
        {
          status:500
        }
      );

    }



    // ============================
    // 2. 获取请求参数
    // ============================

    const body =
      await request.json();


    const message =
      body?.message?.trim();


    const sessionId =
      body?.sessionId ||
      crypto.randomUUID();



    if(!message){

      return Response.json(
        {
          success:false,
          error:"请输入咨询内容"
        },
        {
          status:400
        }
      );

    }




    // ============================
    // 3. 调用 DeepSeek
    // ============================

    const aiResponse =
      await fetch(
        "https://api.deepseek.com/chat/completions",
        {

          method:"POST",

          headers:{

            "Authorization":
              "Bearer " +
              env.DEEPSEEK_API_KEY,

            "Content-Type":
              "application/json"

          },


          body:JSON.stringify({

            model:
              "deepseek-chat",


            messages:[

              {
                role:"system",

                content:
                "你是摆渡心理AI助手，为用户提供温和、安全、专业的心理支持。不要进行医疗诊断，不替代专业咨询。遇到危机情况建议寻求专业帮助。"
              },


              {
                role:"user",

                content:
                  message
              }

            ],


            temperature:
              0.7

          })

        }
      );



    const aiData =
      await aiResponse.json();



    if(!aiResponse.ok){


      console.error(
        "DeepSeek错误:",
        aiData
      );


      return Response.json(
        {

          success:false,

          error:
            aiData?.error?.message ||
            "AI服务请求失败"

        },
        {
          status:502
        }
      );

    }




    const reply =
      aiData
      ?.choices
      ?.[0]
      ?.message
      ?.content
      ||
      "";





    if(!reply){


      return Response.json(
        {

          success:false,

          error:
          "AI没有返回内容"

        },
        {
          status:500
        }
      );

    }





    // ============================
    // 4. 保存聊天记录(D1)
    // ============================

    try {


      if(env.DB){


        await env.DB.prepare(

          `
          INSERT INTO chats
          (
          session_id,
          role,
          content
          )

          VALUES
          (?,?,?)
          `

        )
        .bind(

          sessionId,

          "user",

          message

        )
        .run();





        await env.DB.prepare(

          `
          INSERT INTO chats
          (
          session_id,
          role,
          content
          )

          VALUES
          (?,?,?)
          `

        )
        .bind(

          sessionId,

          "assistant",

          reply

        )
        .run();






        await env.DB.prepare(

          `
          INSERT INTO chat_sessions
          (
          session_id,
          last_time,
          email_sent
          )

          VALUES
          (?,datetime('now'),0)

          ON CONFLICT(session_id)

          DO UPDATE SET

          last_time=datetime('now')
          `

        )
        .bind(

          sessionId

        )
        .run();



      }


    }

    catch(dbError){


      console.error(

        "D1保存失败:",
        dbError.message

      );

      // 注意：
      // 数据库失败不影响AI聊天

    }





    // ============================
    // 5. 返回前端
    // ============================

    return Response.json(

      {

        success:true,

        reply:reply,

        sessionId:sessionId

      }

    );





  }

  catch(error){


    console.error(

      "AI接口异常:",
      error

    );



    return Response.json(

      {

        success:false,

        error:
          error?.message ||
          "AI服务暂时异常"

      },

      {

        status:500

      }

    );


  }


}
