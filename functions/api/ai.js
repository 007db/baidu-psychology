export async function onRequestPost({request,env}) {
 const {message}=await request.json();

 const response=await fetch(
 'https://api.deepseek.com/chat/completions',
 {
 method:'POST',
 headers:{
  'Authorization':'Bearer '+env.DEEPSEEK_API_KEY,
  'Content-Type':'application/json'
 },
 body:JSON.stringify({
  model:'deepseek-chat',
  messages:[
   {role:'system',content:'你是摆渡心理AI助手，请提供温和专业的心理支持。'},
   {role:'user',content:message}
  ]
 })
 });

 return new Response(await response.text(),{
 headers:{'Content-Type':'application/json'}
 });
}
