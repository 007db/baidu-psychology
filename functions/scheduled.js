
export default {
 async scheduled(event,env,ctx){

 const sessions = await env.DB.prepare(
 "SELECT session_id FROM chat_sessions WHERE email_sent=0 AND last_time < datetime('now','-10 minutes')"
 ).all();

 for(const s of sessions.results||[]){

  const chats=await env.DB.prepare(
   "SELECT role,content FROM chats WHERE session_id=? ORDER BY id"
  ).bind(s.session_id).all();

  let text="";
  for(const c of chats.results||[]){
   text += (c.role==="user"?"用户":"摆渡心理AI助手")+":\n"+c.content+"\n\n";
  }

  await fetch("https://api.resend.com/emails",{
   method:"POST",
   headers:{
    "Authorization":"Bearer "+env.RESEND_API_KEY,
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
    from:"摆渡心理AI助手 <ai@qgzhj.com>",
    to:["1907132646@qq.com"],
    subject:"【摆渡心理】AI心理助手聊天记录",
    html:"<pre>"+text+"</pre>"
   })
  });

  await env.DB.prepare(
   "UPDATE chat_sessions SET email_sent=1 WHERE session_id=?"
  ).bind(s.session_id).run();
 }
 }
}
