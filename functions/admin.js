export async function onRequestGet() {
  return Response.json({
    success:true,
    role:"admin",
    permissions:[
      "appointments",
      "records",
      "clients",
      "statistics"
    ]
  });
}
