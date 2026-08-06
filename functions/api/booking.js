export async function onRequestPost({request, env}) {

const data = await request.json();


await env.DB.prepare(
`
INSERT INTO appointments
(
name,
phone,
wechat,
type,
date,
time,
message
)

VALUES
(?,?,?,?,?,?,?)
`
)
.bind(

data.name,

data.phone,

data.wechat || "",

data.type || "",

data.date || "",

data.time || "",

data.message || ""

)
.run();


return Response.json({

success:true,

message:"预约提交成功"

});

}
