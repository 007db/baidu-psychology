export async function onRequestGet({env}) {


try {


const {results} = await env.DB.prepare(

`
SELECT *
FROM appointments
ORDER BY id DESC
`

)
.all();



return Response.json({

success:true,

data:results

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
