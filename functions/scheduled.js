export default {


async scheduled(event, env, ctx){


console.log(
"===== Cron开始执行 ====="
);



if(!env.RESEND_API_KEY){

console.error(
"没有配置 RESEND_API_KEY"
);

return;

}



// 查询10分钟前未发送

const sessions =
await env.DB.prepare(
`
SELECT *
FROM chat_sessions
WHERE email_sent=0
AND last_time <= datetime('now','+8 hours','-10 minutes')
`
)
.all();



console.log(
"发现待发送:",
sessions.results.length
);



for(const session of sessions.results){


try{


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
!chats.results.length
){

console.log(
"无聊天内容:",
session.session_id
);

continue;

}



let content =
"摆渡心理 AI聊天记录\n\n";



for(const item of chats.results){


content +=

`${item.role==="user"
?"用户"
:"摆渡心理AI助手"}：

${item.content}

`;

}



console.log(
"准备发送:",
session.session_id
);



const mail =
await fetch(

"https://api.resend.com/emails",

{

method:"POST",

headers:{

Authorization:
"Bearer "+
env.RESEND_API_KEY,

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


text:
content


})


}

);



const result =
await mail.text();



console.log(
"Resend:",
mail.status,
result
);



if(mail.ok){


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
"发送成功:",
session.session_id
);


}

else{


console.error(
"发送失败，保留重试"
);


}



}
catch(e){


console.error(
"处理失败:",
e
);


}



}



console.log(
"===== Cron结束 ====="
);



}


};
