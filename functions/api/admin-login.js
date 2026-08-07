export async function onRequestPost({request,env}){


try{


const {
username,
password
}=await request.json();



const admin =
await env.DB.prepare(

`
SELECT *
FROM admins
WHERE username=?
AND password=?
`

)
.bind(
username,
password
)
.first();



if(!admin){

return Response.json({

success:false,

message:"账号或密码错误"

});

}



return Response.json({

success:true,

user:{
username:admin.username,
role:admin.role
}

});


}


catch(error){


return Response.json({

success:false,

error:error.message

},{
status:500
});


}


}
