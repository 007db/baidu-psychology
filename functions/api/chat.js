export async function onRequestPost(context){
const data=await context.request.json();
return Response.json({reply:"感谢分享，你可以先关注自己的情绪变化。",question:data.message});
}