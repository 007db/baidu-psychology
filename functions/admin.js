export async function onRequestGet({env}){

const users=await env.DB.prepare(
"SELECT COUNT(*) total FROM users"
).first();

const consultants=await env.DB.prepare(
"SELECT COUNT(*) total FROM consultants"
).first();

const appointments=await env.DB.prepare(
"SELECT COUNT(*) total FROM appointments"
).first();

const records=await env.DB.prepare(
"SELECT COUNT(*) total FROM records"
).first();

return Response.json({
success:true,
statistics:{
users:users.total,
consultants:consultants.total,
appointments:appointments.total,
records:records.total
}
});

}
