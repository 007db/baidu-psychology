export async function onRequest(){
return Response.json({
users:0,
orders:0,
bookings:0,
companies:0,
sessions:0
});
}