export async function onRequestPost({request,env}){


try{


const {
appointment_id,
consultant
}=await request.json();



await env.DB.prepare(

`
UPDATE appointments

SET consultant=?

WHERE id=?

`

)
.bind(
consultant,
appointment_id
)
.run();



return Response.json({

success:true,

message:"咨询师分配成功"

});



}catch(e){


return Response.json({

success:false,

message:e.message

},{
status:500
});


}


}
