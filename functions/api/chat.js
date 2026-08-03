export async function onRequestPost(context){
const {message}=await context.request.json();

const apiKey=context.env.DEEPSEEK_API_KEY;

const response=await fetch("https://api.deepseek.com/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+apiKey
},
body:JSON.stringify({
model:"deepseek-chat",
messages:[
{role:"system",content:"你是一名温暖专业的AI心理陪伴助手，不替代医生。"},
{role:"user",content:message}
]
})
});

const data=await response.json();

return Response.json({
reply:data.choices?.[0]?.message?.content || "暂时无法回复"
});
}
