export async function onRequestPost({request,env}){


try{


const {
username,
password
}=await request.json();



const user =
await env.DB.prepare(

`
SELECT 
id,
username,
name,
role,
phone

FROM users

WHERE username=?
AND password=?
AND role='consultant'

`

)
.bind(

username,

password

)
.first();



if(!user){


return Response.json({

success:false,

message:"账号或密码错误"

});


}



return Response.json({

success:true,

user:user

});



}

catch(error){


return Response.json({

success:false,

message:error.message

},{
status:500
});


}


}
