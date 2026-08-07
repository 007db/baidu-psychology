async function api(url){
const r=await fetch(url);
return await r.json();
}

async function load(){

const admin=await api('/api/admin');

if(admin.success){
statistics.innerHTML=`
<div class="card">用户 ${admin.statistics.users}</div>
<div class="card">咨询师 ${admin.statistics.consultants}</div>
<div class="card">预约 ${admin.statistics.appointments}</div>
<div class="card">记录 ${admin.statistics.records}</div>`;
}


const appointments=await api('/api/appointments');
appointmentList.innerHTML=(appointments.data||[]).map(x=>`
<tr>
<td>${x.id}</td>
<td>${x.name||''}</td>
<td>${x.consultant||''}</td>
<td>${x.appointment_time||''}</td>
<td>${x.status||''}</td>
</tr>`).join('');


const clients=await api('/api/clients');
clientList.innerHTML=(clients.data||[]).map(x=>`
<tr>
<td>${x.id}</td>
<td>${x.name||''}</td>
<td>${x.phone||''}</td>
<td>${x.occupation||''}</td>
</tr>`).join('');


const records=await api('/api/records');
recordList.innerHTML=(records.data||[]).map(x=>`
<tr>
<td>${x.id}</td>
<td>${x.title||''}</td>
<td>${x.content||''}</td>
</tr>`).join('');

}

load();
