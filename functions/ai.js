export async function onRequestPost(context) {
  const body = await context.request.json().catch(()=>({}));
  return Response.json({
    success: true,
    provider: "DeepSeek",
    reply: "AI心理助手接口已连接",
    input: body.message || ""
  });
}
