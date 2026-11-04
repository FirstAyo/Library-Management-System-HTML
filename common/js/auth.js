
(function(){
  const ROLE_KEY = 'lms_role';
  const USER_KEY = 'lms_user';

  function login(email, password){
    if(email === 'admin@demo.com' && password === 'admin123'){
      localStorage.setItem(ROLE_KEY, 'admin');
      localStorage.setItem(USER_KEY, JSON.stringify({email, name:'Demo Admin'}));
      return {ok:true, role:'admin'};
    }
    if(email === 'user@demo.com' && password === 'user123'){
      localStorage.setItem(ROLE_KEY, 'user');
      localStorage.setItem(USER_KEY, JSON.stringify({email, name:'Demo User'}));
      return {ok:true, role:'user'};
    }
    return {ok:false, error:'Invalid credentials'};
  }
  function logout(){ localStorage.removeItem(ROLE_KEY); localStorage.removeItem(USER_KEY); }
  function role(){ return localStorage.getItem(ROLE_KEY); }
  function currentUser(){ try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch(e){ return null; } }
  function requireLogin(roleRequired){
    const r = role();
    if(!r){
      location.href = (location.pathname.includes('/admin/') || location.pathname.includes('/client/')) ? '../login.html' : './login.html';
      return false;
    }
    if(roleRequired && r !== roleRequired){ location.href = '../client/home.html'; return false; }
    return true;
  }
  window.LMS_AUTH = { login, logout, role, currentUser, requireLogin };
})();
