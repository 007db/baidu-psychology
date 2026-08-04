export async function onRequest(context){
return Response.json({
model:["DeepSeek","GPT"],
service:"AI心理助手",
status:"ready"
});
}