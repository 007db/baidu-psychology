export async function onRequestPost(c){
const d=await c.request.json();
const row=await c.env.BAIDU_PSYCHOLOGY_DB
.prepare('SELECT * FROM admin_users WHERE username=? AND password=?')
.bind(d.username,d.password).first();

if(row){
return Response.json({success:true,role:row.role});
}
return Response.json({success:false});
}