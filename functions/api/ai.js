export async function onRequest(context){
return Response.json({
provider:"DeepSeek",
stream:true,
status:"ready"
});
}