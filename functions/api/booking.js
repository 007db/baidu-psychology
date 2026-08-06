export async function onRequestPost({request,env}) {
const data=await request.json();

await env.BAIDU_PSYCHOLOGY_DB.prepare(
`INSERT INTO appointments(name,phone,message)
VALUES(?,?,?)`
).bind(
data.name,
data.phone,
data.message
).run();

return new Response('预约提交成功');
}
