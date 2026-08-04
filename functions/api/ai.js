export async function onRequest(context){
return Response.json({
provider:"DeepSeek",
status:"ready",
features:["emotion-analysis","stress-report","assistant"]
});
}