(function(){
  const token = localStorage.getItem('token');
  const path = location.pathname;
  const isAdminPage = path.includes('admin.html') || path.includes('admin-dashboard') || path.includes('admin-');
  if(isAdminPage && !token){
    location.href='/admin-login.html';
  }
  window.AdminAuth={
    token,
    logout:function(){localStorage.removeItem('token');location.href='/admin-login.html';},
    headers:function(){return {'Authorization':'Bearer '+localStorage.getItem('token'),'Content-Type':'application/json'};}
  };
})();
