export async function onRequestPost(c){
const d=await c.request.json();
await c.env.BAIDU_PSYCHOLOGY_DB
.prepare('INSERT INTO appointments(name,phone) VALUES(?,?)')
.bind(d.name,d.phone).run();
return Response.json({success:true});
}