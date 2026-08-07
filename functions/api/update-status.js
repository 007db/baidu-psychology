export async function onRequestPost({request,env}){


const data =
await request.json();



await env.DB.prepare(

`
UPDATE appointments
SET status=?
WHERE id=?

`

)
.bind(

data.status,

data.id

)
.run();



return Response.json({

success:true

});


}
