export async function onRequest(context){
return Response.json({
provider:"DeepSeek",
status:"ready",
message:"AI心理服务接口已连接"
});
}