export async function onRequestGet() {
  return Response.json({
    success:true,
    data:[]
  });
}

export async function onRequestPost() {
  return Response.json({
    success:true,
    message:"咨询记录保存成功"
  });
}
