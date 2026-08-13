export async function scheduled(event, env, ctx) {

  console.log("===== Cron开始执行 =====");


  if (!env.RESEND_API_KEY) {

    console.error(
      "错误：没有配置 RESEND_API_KEY"
    );

    return;

  }


  if (!env.DB) {

    console.error(
      "错误：D1数据库没有绑定 DB"
    );

    return;

  }



  // 查询10分钟前结束的聊天

  const sessions =
    await env.DB.prepare(
`
SELECT *
FROM chat_sessions
WHERE email_sent = 0
AND last_time <= datetime('now','-10 minutes')
`
    )
    .all();



  console.log(
    "待发送数量:",
    sessions.results.length
  );



  if(!sessions.results.length){

    console.log(
      "没有需要发送的聊天"
    );

    return;

  }



  for (const session of sessions.results) {


    try {


      const chats =
        await env.DB.prepare(
`
SELECT role,content
FROM chats
WHERE session_id=?
ORDER BY id ASC
`
        )
        .bind(
          session.session_id
        )
        .all();



      if(
        !chats.results ||
        chats.results.length===0
      ){

        console.log(
          "没有聊天内容:",
          session.session_id
        );

        continue;

      }



      let emailContent =
`
摆渡心理 AI 助手聊天记录

====================

`;



      for(const chat of chats.results){


        emailContent +=

`${chat.role==="user"
?"用户"
:"摆渡心理AI助手"}

${chat.content}


`;

      }



      console.log(
        "开始发送:",
        session.session_id
      );



      const response =
        await fetch(
          "https://api.resend.com/emails",
          {

            method:"POST",

            headers:{

              "Authorization":
              "Bearer "+env.RESEND_API_KEY,

              "Content-Type":
              "application/json"

            },


            body:
            JSON.stringify({

              from:
              "摆渡心理AI助手 <ai@qgzhj.com>",


              to:[
                "1907132646@qq.com"
              ],


              subject:
              "【摆渡心理】AI心理助手聊天记录",


              text:
              emailContent


            })


          }
        );



      const result =
        await response.text();



      console.log(
        "Resend返回:",
        response.status,
        result
      );



      if(response.ok){


        await env.DB.prepare(
`
UPDATE chat_sessions
SET email_sent=1
WHERE id=?
`
        )
        .bind(
          session.id
        )
        .run();



        console.log(
          "邮件发送成功:",
          session.session_id
        );


      }
      else{


        console.error(
          "邮件发送失败，等待下次重试"
        );


      }



    }
    catch(error){


      console.error(
        "处理异常:",
        error
      );


    }


  }



  console.log(
    "===== Cron执行结束 ====="
  );


}
