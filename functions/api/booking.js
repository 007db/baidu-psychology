export async function onRequest(context){
return Response.json({
success:true,
message:"预约已提交",
});
}