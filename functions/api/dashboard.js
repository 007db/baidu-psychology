export async function onRequest(){
return Response.json({
users:0,
members:0,
bookings:0,
ai_sessions:0,
companies:0
});
}