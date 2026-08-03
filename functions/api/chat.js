export async function onRequestPost(context){
const {message}=await context.request.json();
const key=context.env.DEEPSEEK_API_KEY;
const res=await fetch("https://api.deepseek.com/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+key
},
body:JSON.stringify({
model:"deepseek-chat",
messages:[
{role:"system",content:"你是摆渡心理AI助手，提供温暖心理支持，不替代专业诊断。"},
{role:"user",content:message}
]
})
});
const data=await res.json();
return Response.json({
reply:data.choices?.[0]?.message?.content || "暂无回复"
});
}
