export async function onRequest(){
return Response.json({
status:"payment-api-ready"
});
}