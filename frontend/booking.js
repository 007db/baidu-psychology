async function submitBooking(){
const data={
name:document.getElementById("name").value,
phone:document.getElementById("phone").value
};
const res=await fetch("/api/booking",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
});
alert((await res.json()).message);
}
