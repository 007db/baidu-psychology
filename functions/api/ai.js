export async function onRequest(context){
let body={};
try{body=await context.request.json()}catch(e){}
return Response.json({
success:true,
provider:"DeepSeek",
reply:"AI心理助手已连接",
input:body.message||""
});
}