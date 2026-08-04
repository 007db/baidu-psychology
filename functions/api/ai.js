export async function onRequest(context){
return Response.json({
provider:"DeepSeek",
status:"ready",
service:"AI心理助手"
});
}