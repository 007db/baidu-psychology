export async function onRequestGet({env}){


try{


const total =
await env.DB.prepare(

`
SELECT COUNT(*) count
FROM appointments
`

)
.first();



const pending =
await env.DB.prepare(

`
SELECT COUNT(*) count
FROM appointments
WHERE status='待处理'
`

)
.first();



const completed =
await env.DB.prepare(

`
SELECT COUNT(*) count
FROM appointments
WHERE status='已完成'
`

)
.first();



const today =
await env.DB.prepare(

`
SELECT COUNT(*) count
FROM appointments
WHERE date(created_at)=date('now')
`

)
.first();



return Response.json({

success:true,

data:{

total:total.count,

pending:pending.count,

completed:completed.count,

today:today.count

}

});


}catch(error){


return Response.json({

success:false,

error:error.message

},{
status:500
});


}


}
