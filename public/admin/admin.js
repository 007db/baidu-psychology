async function load(){

let s=await fetch('/api/admin').then(r=>r.json());
document.getElementById('stats').innerHTML =
JSON.stringify(s.statistics);

let a=await fetch('/api/appointments').then(r=>r.json());
appointmentList.innerHTML=a.data.map(x =>
`<tr><td>${x.id}</td><td>${x.name}</td><td>${x.status}</td></tr>`
).join('');

let c=await fetch('/api/clients').then(r=>r.json());
clientList.innerHTML=c.data.map(x =>
`<tr><td>${x.id}</td><td>${x.name}</td><td>${x.phone||''}</td></tr>`
).join('');

let r=await fetch('/api/records').then(r=>r.json());
recordList.innerHTML=r.data.map(x =>
`<tr><td>${x.id}</td><td>${x.title}</td></tr>`
).join('');

}
load();
