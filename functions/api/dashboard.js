export async function onRequest(){
return Response.json({
groups:0,
companies:0,
users:0,
orders:0,
ai_sessions:0
});
}