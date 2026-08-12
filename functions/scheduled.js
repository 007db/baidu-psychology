export async function scheduled(event, env, ctx) {


console.log("Cron开始执行");


// 查询10分钟前未发送记录

const sessions =
await env.DB.prepare(
`
SELECT *
FROM chat_sessions
WHERE email_sent=0
AND last_time <= datetime('now','-10 minutes')
`
)
.all();



console.log(
"待发送:",
sessions.results.length
);



for(const session of sessions.results){


const chats =
await env.DB.prepare(
`
SELECT role,content
FROM chats
WHERE session_id=?
ORDER BY id ASC
`
)
.bind(session.session_id)
.all();



let content="";


for(const item of chats.results){


content +=

`
${item.role==="user"?"用户":"摆渡心理AI助手"}：

${item.content}

`;

}



//发送邮件

const mail =
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


body:JSON.stringify({

from:

"摆渡心理AI助手 <ai@qgzhj.com>",


to:[

"1907132646@qq.com"

],


subject:

"【摆渡心理】AI心理助手聊天记录",


text:content


})


}

);



console.log(
"邮件结果:",
await mail.text()
);



//标记已发送

await env.DB.prepare(
`
UPDATE chat_sessions
SET email_sent=1
WHERE id=?
`
)
.bind(session.id)
.run();



}



}
