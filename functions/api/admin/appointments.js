export async function onRequestGet(c){
const rows=await c.env.BAIDU_PSYCHOLOGY_DB
.prepare('SELECT * FROM appointments ORDER BY id DESC')
.all();
return Response.json(rows);
}