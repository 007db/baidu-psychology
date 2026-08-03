export async function onRequestPost(context){
const data=await context.request.json();
return Response.json({success:true,message:"注册成功",user:data});
}