export function checkRole(user,roles=[]){
return user && roles.includes(user.role);
}
