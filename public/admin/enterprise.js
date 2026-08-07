async function get(url){
return fetch(url).then(r=>r.json());
}

async function init(){

let s=await get('/api/admin');
stats.innerHTML=`
<div class="card">用户:${s.statistics.users}</div>
<div class="card">咨询师:${s.statistics.consultants}</div>
<div class="card">预约:${s.statistics.appointments}</div>
<div class="card">记录:${s.statistics.records}</div>`;

let a=await get('/api/appointments');
appointments.innerHTML=(a.data||[]).map(x=>`
<tr>
<td>${x.id}</td>
<td>${x.name}</td>
<td>${x.consultant||''}</td>
<td>${x.status||''}</td>
<td><button>查看</button></td>
</tr>`).join('');

let c=await get('/api/clients');
clients.innerHTML=(c.data||[]).map(x=>`
<tr>
<td>${x.id}</td>
<td>${x.name}</td>
<td>${x.phone||''}</td>
<td>${x.notes||''}</td>
</tr>`).join('');

let r=await get('/api/records');
records.innerHTML=(r.data||[]).map(x=>`
<tr>
<td>${x.id}</td>
<td>${x.title}</td>
<td>${x.content}</td>
</tr>`).join('');

}
init();
