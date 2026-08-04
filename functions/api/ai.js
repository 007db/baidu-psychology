export async function onRequest(context){
const key=context.env.DEEPSEEK_API_KEY;
return Response.json({
model:"DeepSeek",
connected:!!key,
message:"AI心理接口"
});
}