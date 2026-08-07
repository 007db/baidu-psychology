export async function onRequestGet() {
  return Response.json({
    success: true,
    data: []
  });
}

export async function onRequestPost(context) {
  return Response.json({
    success:true,
    message:"预约创建成功"
  });
}
