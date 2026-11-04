
(function(){
  async function fetchJSON(path){ const res = await fetch(path); if(!res.ok) throw new Error('Failed to load ' + path); return await res.json(); }
  function readExtras(key){ try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; } }
  function saveExtras(key, arr){ localStorage.setItem(key, JSON.stringify(arr || [])); }
  window.LMS_DATA = { fetchJSON, readExtras, saveExtras };
})();
