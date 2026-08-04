export async function onRequest(){
return Response.json({
dashboard:"online",
services:["booking","ai","member"]
});
}