export async function onRequestGet({env}){


const {results}=await env.DB.prepare(

`
SELECT 
id,
name,
username

FROM users

WHERE role='consultant'

`

)
.all();



return Response.json({

success:true,

data:results

});


}
