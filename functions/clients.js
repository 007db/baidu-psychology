export async function onRequestGet({env}){

const result = await env.DB.prepare(
'SELECT * FROM clients ORDER BY id DESC'
).all();

return Response.json({
success:true,
data:result.results
});

}
