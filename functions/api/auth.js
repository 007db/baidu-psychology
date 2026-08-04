export async function onRequest(){
return Response.json({auth:"JWT-ready"});
}