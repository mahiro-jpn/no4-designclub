(function(){
  var els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in')});
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  },{threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){io.observe(e)});
})();

/* ---------- side nav: active section highlight ---------- */
(function(){
  var dots = document.querySelectorAll('.side-nav .dot');
  if(!dots.length || !('IntersectionObserver' in window)) return;
  var map = {};
  dots.forEach(function(d){ map[d.getAttribute('href').slice(1)] = d; });
  var sections = Object.keys(map).map(function(id){ return document.getElementById(id); }).filter(Boolean);
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        dots.forEach(function(d){ d.classList.remove('active'); });
        map[en.target.id].classList.add('active');
      }
    });
  },{threshold:0.5});
  sections.forEach(function(s){ io.observe(s); });
})();

/* ---------- PC-only interactive flourishes ---------- */
(function(){
  var isPC = window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:1101px)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!isPC || reduceMotion) return;
  document.documentElement.classList.add('has-fine-cursor');

  /* カーソル追従スポットライト：暗い面（ヒーロー写真・カテゴリカード）にマウスを近づけると光が差し込む */
  document.querySelectorAll('.hero-noir, .cat-card').forEach(function(el){
    var raf = null, lastEvt = null;
    function apply(){
      if(!lastEvt) return;
      var r = el.getBoundingClientRect();
      var x = ((lastEvt.clientX - r.left) / r.width) * 100;
      var y = ((lastEvt.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--sx', x+'%');
      el.style.setProperty('--sy', y+'%');
      raf = null;
    }
    el.addEventListener('pointermove', function(e){
      lastEvt = e;
      if(raf) return;
      raf = requestAnimationFrame(apply);
    });
    el.addEventListener('pointerenter', function(){ el.classList.add('spot-active'); });
    el.addEventListener('pointerleave', function(){ el.classList.remove('spot-active'); });
  });

  /* 3D tilt on frame mockups */
  document.querySelectorAll('.browser,.phone,.film').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left)/r.width - 0.5;
      var py = (e.clientY - r.top)/r.height - 0.5;
      el.style.transform = 'perspective(1200px) rotateY('+(px*5)+'deg) rotateX('+(py*-5)+'deg) translateZ(4px)';
    });
    el.addEventListener('mouseleave', function(){
      el.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });
})();
