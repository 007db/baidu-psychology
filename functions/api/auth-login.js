export async function onRequestPost(context){
const {username,password}=await context.request.json();
if(username==="admin" && password==="admin123"){
return Response.json({
success:true,
token:"jwt-demo-token",
role:"super_admin"
});
}
return Response.json({success:false});
}
