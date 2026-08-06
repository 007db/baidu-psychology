export async function onRequestPost(context){
const d=await context.request.json();
await context.env.BAIDU_PSYCHOLOGY_DB.prepare(
"INSERT INTO appointments(name,phone,type,message) VALUES(?,?,?,?)"
).bind(d.name,d.phone,d.type,d.message).run();

return Response.json({
success:true,
message:"预约提交成功"
});
}