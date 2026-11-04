
(async function(){
  const [reservations, books] = await Promise.all([
    LMS_DATA.fetchJSON('../data/reservations.json'),
    LMS_DATA.fetchJSON('../data/books.json')
  ]);
  const body = document.getElementById('adminResBody');
  body.innerHTML = reservations.map(r => {
    const b = books.find(x=>x.id===r.bookId) || {title:'Unknown'};
    return `<tr><td>${r.id}</td><td>${b.title}</td><td>${r.memberEmail}</td><td>${r.date}</td></tr>`;
  }).join('');
})();