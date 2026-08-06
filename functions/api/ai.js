export async function onRequestPost(c){
const d=await c.request.json();
const res=await fetch('https://api.deepseek.com/chat/completions',{
method:'POST',
headers:{
'Authorization':'Bearer '+c.env.DEEPSEEK_API_KEY,
'Content-Type':'application/json'
},
body:JSON.stringify({
model:'deepseek-chat',
messages:[{role:'user',content:d.message}]
})
});
return new Response(await res.text());
}