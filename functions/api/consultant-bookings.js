export async function onRequestGet({request,env}){


const url=new URL(request.url);


const name=url.searchParams.get("name");



const {results}=await env.DB.prepare(

`
SELECT *

FROM appointments

WHERE consultant=?

ORDER BY id DESC
`

)
.bind(name)
.all();



return Response.json({

success:true,

data:results

});


}
