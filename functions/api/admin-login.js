export async function onRequestPost(context){
const d=await context.request.json();
return Response.json({success:d.username==="admin"&&d.password==="admin123",role:"super_admin"});
}