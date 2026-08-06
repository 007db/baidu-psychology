export async function onRequestPost(context){
const body=await context.request.json();
const key=context.env.DEEPSEEK_API_KEY;
const res=await fetch("https://api.deepseek.com/chat/completions",{
method:"POST",
headers:{
"Authorization":"Bearer "+key,
"Content-Type":"application/json"
},
body:JSON.stringify({
model:"deepseek-chat",
messages:[{role:"user",content:body.message}]
})
});
return new Response(await res.text(),{
headers:{"Content-Type":"application/json"}
});
}