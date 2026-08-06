export async function onRequest({env}) {
const result=await env.BAIDU_PSYCHOLOGY_DB.prepare(
'SELECT * FROM appointments ORDER BY id DESC'
).all();

return new Response(JSON.stringify(result.results),{
headers:{'Content-Type':'application/json'}
});
}
