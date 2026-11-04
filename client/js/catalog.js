
(async function(){
  const books = await LMS_DATA.fetchJSON('../data/books.json');
  const extra = LMS_DATA.readExtras('books_extra');
  const all = books.concat(extra);
  const categories = ['All'].concat([...new Set(all.map(b=>b.category))]);
  const sel = document.getElementById('category');
  sel.innerHTML = categories.map(c=>`<option>${c}</option>`).join('');
  function render(items){
    const el = document.getElementById('catalog');
    el.innerHTML = items.map(b => `
      <div class="card">
        <div class="small">${b.category} • ${b.year}</div>
        <h3>${b.title}</h3>
        <div class="small">by ${b.author}</div>
        <div class="space"></div>
        <div class="flex">
          <span class="badge ${b.available>0?'ok':'danger'}">${b.available>0?b.available+' available':'unavailable'}</span>
          <a class="btn" href="book-details.html?id=${b.id}">Details</a>
        </div>
      </div>
    `).join('');
  }
  function filter(){
    const q = $('#search').val().toLowerCase();
    const c = $('#category').val();
    const items = all.filter(b =>
      (c === 'All' || b.category === c) &&
      (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
    );
    render(items);
  }
  $('#search').on('input', filter);
  $('#category').on('change', filter);
  render(all);
})();
