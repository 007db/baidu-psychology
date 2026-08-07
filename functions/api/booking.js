export async function onRequestPost({ request, env }) {

try {

const data = await request.json();


const appointmentTime =
`${data.date || ""} ${data.time || ""}`;



await env.DB.prepare(

`
INSERT INTO appointments
(
name,
phone,
wechat,
type,
appointment_time,
message,
status
)

VALUES
(?,?,?,?,?,?,?)
`

)
.bind(

data.name || "",

data.phone || "",

data.wechat || "",

data.type || "",

appointmentTime,

data.message || "",

"待处理"

)

.run();



return Response.json({

success:true,

message:"预约提交成功"

});


}

catch(error){


return Response.json({

success:false,

error:error.message

},

{
status:500
}

);


}

}
