
export async function onRequestPost({request,env}) {
 const body = await request.json();
 const {message,sessionId}=body;

 if(!message){
  return Response.json({success:false,error:"请输入内容"});
 }

 const r=await fetch("https://api.deepseek.com/chat/completions",{
  method:"POST",
  headers:{
   "Authorization":`Bearer ${env.DEEPSEEK_API_KEY}`,
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   model:"deepseek-chat",
   messages:[
    {role:"system",content:"你是摆渡心理AI助手，提供温和、安全的心理支持。"},
    {role:"user",content:message}
   ],
   temperature:0.7
  })
 });

 const data=await r.json();
 const reply=data.choices?.[0]?.message?.content || "";

 if(env.DB){
  await env.DB.prepare(
   "INSERT INTO chats(session_id,role,content) VALUES(?,?,?)"
  ).bind(sessionId,"user",message).run();

  await env.DB.prepare(
   "INSERT INTO chats(session_id,role,content) VALUES(?,?,?)"
  ).bind(sessionId,"assistant",reply).run();

  await env.DB.prepare(
   "INSERT INTO chat_sessions(session_id,last_time,email_sent) VALUES(?,datetime('now'),0) ON CONFLICT(session_id) DO UPDATE SET last_time=datetime('now')"
  ).bind(sessionId).run();
 }

 return Response.json({success:true,reply});
}
