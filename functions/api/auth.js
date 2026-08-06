export async function onRequest(){
return Response.json({auth:"jwt-ready",version:"7.5"});
}