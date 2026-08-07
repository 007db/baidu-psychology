export async function onRequestPost({request,env}){

const body=await request.json();

const user=await env.DB.prepare(
`SELECT id,username,name,role
FROM users
WHERE username=?
AND (password=? OR password_hash=?)`
)
.bind(
body.username,
body.password,
body.password
)
.first();

if(!user){
return Response.json({
success:false,
message:"登录失败"
},{status:401});
}

return Response.json({
success:true,
user,
token:"demo-jwt-token"
});

}
