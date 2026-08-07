export async function onRequestPost(context) {
  const { request } = context;
  return Response.json({
    success: true,
    message: "JWT登录接口占位",
    token: "demo-jwt-token"
  });
}
