export async function onRequestPost(context){

const data=await context.request.json();

await context.env.DB.prepare(
`INSERT INTO appointments(name,phone) VALUES(?,?)`
).bind(data.name,data.phone).run();

return Response.json({
success:true,
message:"预约提交成功"
});

}
