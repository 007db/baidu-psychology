export async function onRequest(context){
let data={};
try{data=await context.request.json()}catch(e){}
return Response.json({
provider:"DeepSeek",
status:"connected",
message:"AI心理助手运行正常",
input:data.message||""
});
}