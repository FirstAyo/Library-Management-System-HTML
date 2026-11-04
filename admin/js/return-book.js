
(function(){
  const form = document.getElementById('returnForm');
  const msg = document.getElementById('returnMsg');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const id = parseInt(document.getElementById('loanId').value,10);
    const ret = document.getElementById('returned').value === 'true';
    const overlay = LMS_DATA.readExtras('loans_extra');
    const idx = overlay.findIndex(l => l.id === id);
    if(idx >= 0){ overlay[idx].returned = ret; LMS_DATA.saveExtras('loans_extra', overlay); msg.textContent = 'Updated in local overlay.'; }
    else { msg.textContent = 'Loan not found in demo overlay.'; }
  });
})();