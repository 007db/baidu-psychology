export async function onRequest(){
return Response.json({
risk:"analysis-ready",
level:"normal"
});
}