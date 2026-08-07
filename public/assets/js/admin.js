async function loadData(api,target){
 const r=await fetch(api);
 const d=await r.json();
 document.getElementById(target).innerText=JSON.stringify(d);
}
console.log('Admin V9.0');