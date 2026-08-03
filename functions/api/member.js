export async function onRequest(context){
return new Response(JSON.stringify({
name:"测试用户",
level:"普通会员"
}),{
headers:{"content-type":"application/json"}
});
}