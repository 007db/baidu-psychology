export async function onRequest(){
return Response.json({multiTenant:true,message:"集团租户系统"});
}