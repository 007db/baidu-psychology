export async function onRequestPost({ request, env }) {

try {


const data = await request.json();



const result = await env.DB.prepare(

`
INSERT INTO appointments
(
name,
phone,
wechat,
type,
date,
time,
message,
status
)

VALUES
(?,?,?,?,?,?,?,'待处理')

`

)
.bind(

data.name || "",

data.phone || "",

data.wechat || "",

data.type || "",

data.date || "",

data.time || "",

data.message || ""

)

.run();



return Response.json({

success:true,

id:result.meta.last_row_id,

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

});


}


}
