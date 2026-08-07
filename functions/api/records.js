// =====================================================
// 摆渡心理 V9.0
// functions/api/records.js
//
// 查询咨询记录
// Cloudflare Pages Functions + D1
// =====================================================


export async function onRequestGet({request,env}){


try{


const url = new URL(request.url);


const consultant =
url.searchParams.get("consultant");



let sql = `

SELECT

*

FROM consultation_records

`;



let stmt;



if(consultant){


sql += `

WHERE consultant = ?

ORDER BY id DESC

`;


stmt = env.DB.prepare(sql)
.bind(consultant);


}else{


sql += `

ORDER BY id DESC

`;


stmt = env.DB.prepare(sql);


}




const {results} =
await stmt.all();





return Response.json({


success:true,


data:results


});





}catch(error){


return Response.json({

success:false,

message:error.message

},500);



}



}
