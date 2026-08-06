export async function onRequest(){
return Response.json({
users:0,
members:0,
companies:0,
consultants:0,
orders:0,
ai_sessions:0
});
}