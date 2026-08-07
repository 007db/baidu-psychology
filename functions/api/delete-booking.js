export async function onRequestPost({request,env}){


const data =
await request.json();



await env.DB.prepare(

`
DELETE FROM appointments
WHERE id=?

`

)
.bind(
data.id
)
.run();



return Response.json({

success:true

});


}
