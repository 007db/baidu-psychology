export async function onRequest(){
return Response.json({provider:"DeepSeek",mode:"group-service",stream:true});
}