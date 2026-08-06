export async function onRequest(){
return Response.json({
provider:"DeepSeek",
mode:"stream-chat",
status:"ready"
});
}