export async function onRequest(){
return Response.json({
page:1,
total:0,
users:[]
});
}
