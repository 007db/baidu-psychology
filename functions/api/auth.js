export async function onRequest(){
return Response.json({success:true,token:"jwt-ready"});
}