export async function onRequest(){
return new Response(JSON.stringify({
score:72,
suggestion:"建议安排心理疏导"
}),{headers:{"content-type":"application/json"}});
}