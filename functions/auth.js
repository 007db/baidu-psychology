export async function onRequestPost({request,env}){

const {username,password}=await request.json();

const user=await env.DB.prepare(
`SELECT id,username,name,role FROM users
WHERE username=?
AND (password=? OR password_hash=?)`
)
.bind(username,password,password)
.first();

if(!user){
return Response.json({success:false,message:"账号密码错误"},{status:401});
}

return Response.json({
success:true,
token:"enterprise-token-demo",
user
});
}
