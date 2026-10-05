(function(){
  var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};

  // loader & hero entrance
  var loader=$('#loader'),hero=$('.hero'),nav=$('nav');
  document.body.style.overflow='hidden';
  setTimeout(function(){
    loader.classList.add('done');
    hero.classList.add('go');
    document.body.style.overflow='';
  }, 2900);

  // navbar scroll state
  function updateNav(){
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  addEventListener('scroll', updateNav, {passive: true});
  updateNav();

  // reveal rows + cta
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.15});

  $$('.row').forEach(function(r, i){
    r.style.transitionDelay=(i%4*.08)+'s';
    io.observe(r);
  });
  var cta=$('.cta');
  if(cta) io.observe(cta);

  // scroll-linked: sun parallax
  var sun=$('#sun'),ticking=false;
  function tick(){
    var y=scrollY,h=innerHeight;
    if(y<h*1.2 && sun){
      sun.style.marginBottom=(-y*.35)+'px';
      sun.style.opacity=Math.max(0,1-y/(h*.9));
      hero.style.backgroundPosition='0 '+(y/h*60)+'%';
    }
    ticking=false;
  }
  addEventListener('scroll',function(){
    if(!ticking){
      ticking=true;
      requestAnimationFrame(tick);
    }
  },{passive:true});
  tick();

  // cursor glow (eased)
  var g=$('#glow'),gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy;
  addEventListener('pointermove',function(e){
    tx=e.clientX;
    ty=e.clientY;
  });
  (function loop(){
    gx+=(tx-gx)*.08;
    gy+=(ty-gy)*.08;
    if(g) g.style.transform='translate('+gx+'px,'+gy+'px)';
    requestAnimationFrame(loop);
  })();

  // generic reveals + counters
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var t=e.target;
      t.classList.add('in');
      cio.unobserve(t);
      [].forEach.call(t.querySelectorAll('[data-n]'),function(el){
        var n=+el.dataset.n,s=performance.now();
        (function f(now){
          var p=Math.min(1,(now-s)/2200),v=Math.round(n*(1-Math.pow(1-p,4)));
          el.textContent=v.toLocaleString('en-IN')+(n==15200?'+':'');
          if(p<1) requestAnimationFrame(f);
        })(s);
      });
    });
  }, {threshold: 0.12});

  $$('.rv').forEach(function(el,i){
    el.style.transitionDelay=(i%4*.08)+'s';
    cio.observe(el);
  });

  // whatsapp form handler
  var form=$('#f');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f=e.target,t='Hello, I am '+f.n.value+'. Journey: '+f.j.value+'. '+f.m.value;
      window.open('https://wa.me/914428479000?text='+encodeURIComponent(t),'_blank');
    });
  }

  // magnetic button
  var m=$('#mag');
  if(m && m.parentNode){
    m.parentNode.addEventListener('pointermove',function(e){
      var b=m.getBoundingClientRect(),dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2);
      if(Math.hypot(dx,dy)<200) m.style.transform='translate('+dx*.35+'px,'+dy*.35+'px)';
      else m.style.transform='';
    });
    m.addEventListener('pointerleave',function(){
      m.style.transform='';
    });
  }
})();