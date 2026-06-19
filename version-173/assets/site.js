(function(){
  const menu=document.querySelector('[data-menu]');
  const panel=document.querySelector('[data-mobile]');
  if(menu&&panel){menu.addEventListener('click',function(){panel.classList.toggle('open')})}
  document.querySelectorAll('[data-search-form]').forEach(function(form){
    form.addEventListener('submit',function(e){
      const input=form.querySelector('input');
      const q=input?input.value.trim():'';
      if(q){e.preventDefault();location.href='search.html?q='+encodeURIComponent(q)}
    })
  });
  const slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  const dots=[].slice.call(document.querySelectorAll('.hero-dot'));
  if(slides.length){
    let current=0;
    const show=function(i){slides[current].classList.remove('active');if(dots[current])dots[current].classList.remove('active');current=(i+slides.length)%slides.length;slides[current].classList.add('active');if(dots[current])dots[current].classList.add('active')};
    dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i)})});
    setInterval(function(){show(current+1)},5000);
  }
  const filterInput=document.querySelector('[data-filter-input]');
  const filterSelect=document.querySelector('[data-filter-select]');
  const cards=[].slice.call(document.querySelectorAll('[data-card]'));
  const apply=function(){
    const q=filterInput?filterInput.value.trim().toLowerCase():'';
    const y=filterSelect?filterSelect.value:'';
    cards.forEach(function(card){
      const text=(card.getAttribute('data-search')||'').toLowerCase();
      const year=card.getAttribute('data-year')||'';
      const ok=(!q||text.indexOf(q)>-1)&&(!y||year===y);
      card.classList.toggle('hide',!ok);
    })
  };
  if(filterInput){filterInput.addEventListener('input',apply)}
  if(filterSelect){filterSelect.addEventListener('change',apply)}
  if(filterInput){
    const params=new URLSearchParams(location.search);
    const q=params.get('q');
    if(q){filterInput.value=q;apply()}
  }
})();