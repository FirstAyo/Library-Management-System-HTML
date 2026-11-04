
(function(){
  const user = LMS_AUTH.currentUser();
  const el = document.getElementById('profile');
  if(user){
    el.innerHTML = `<p><strong>Name:</strong> ${user.name}</p><p><strong>Email:</strong> ${user.email}</p>`;
  }
})();