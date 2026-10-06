/* Renders the package catalogue: theme circles, state tabs + carousel,
   destination grid and the package detail sheet. Data lives in packages.js. */
(function(){
  var $ = function(s, c){ return (c || document).querySelector(s); };
  var $$ = function(s, c){ return [].slice.call((c || document).querySelectorAll(s)); };
  var PK = window.PACKAGES || [], ST = window.STATES || [], TH = window.THEMES || [];
  var PHONE = '914428479000', TEL = '+914428479000';
  var byId = {}; PK.forEach(function(p){ byId[p.id] = p; });
  var stateName = {}; ST.forEach(function(s){ stateName[s.id] = s.name; });

  function inr(n){ return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function off(p){ return p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0; }
  function nights(p){ return p.days - 1; }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function seed(s){ var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function media(p, cls){
    return p.img ? '<img class="' + (cls || '') + '" src="' + p.img + '" alt="' + esc(p.title) + '" loading="lazy">' : scene(p.scene, p.title, seed(p.id));
  }

  var ICON = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    manager: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7M9 14l3 4 3-4"/>',
    hotel: '<path d="M4 21V5h10v16M14 9h6v12M7 8h2M7 12h2M7 16h2M17 13h1M17 17h1"/>',
    meals: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 1-3 4-3 7h3v11"/>',
    transport: '<path d="M5 16V11l2-5h10l2 5v5M3 16h18M7 19v-3M17 19v-3"/>',
    sight: '<circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>',
    plane: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>'
  };
  function ic(n){ return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; }

  /* ---------- tour cards ---------- */
  function card(p, i){
    var o = off(p);
    return '<article class="tcard" style="--i:' + i + '" data-open="' + p.id + '" tabindex="0" role="button" aria-label="' + esc(p.title) + ', ' + p.days + ' days, from ' + inr(p.price) + '">' +
      '<div class="tc-media">' + media(p) +
        '<span class="tc-state">' + esc(stateName[p.state]) + '</span>' +
        (o ? '<span class="tc-off">' + o + '% OFF</span>' : '') +
        '<span class="tc-glare"></span></div>' +
      '<div class="tc-body"><h4>' + esc(p.title) + '</h4>' +
        '<p class="tc-dur">' + ic('clock') + p.days + ' Days ' + nights(p) + ' Nights</p>' +
        '<p class="tc-route">' + esc(p.route) + '</p></div>' +
      '<div class="tc-bar"><span class="tc-price">' + (p.mrp ? '<s>' + inr(p.mrp) + '</s>' : '') + inr(p.price) + '</span>' +
        '<a class="tc-call" href="tel:' + TEL + '" aria-label="Call about ' + esc(p.title) + '" data-stop>' + ic('phone') + '</a></div>' +
    '</article>';
  }

  /* ---------- theme circles ---------- */
  var themeWrap = $('#theme-grid');
  if (themeWrap){
    themeWrap.innerHTML = TH.map(function(t, i){
      var n = PK.filter(function(p){ return p.themes.indexOf(t.id) > -1; }).length;
      return '<button type="button" class="theme rv" data-theme="' + t.id + '" style="--i:' + i + '">' +
        '<span class="theme-art">' + scene(t.scene, t.id) +
          (t.img ? '<img src="' + t.img + '" alt="' + esc(t.id) + ' trips" loading="lazy" onload="this.classList.add(\'ok\')" onerror="this.remove()">' : '') + '</span>' +
        '<b>' + t.id + '</b><small>' + n + ' packages</small></button>';
    }).join('');
  }

  /* ---------- state tabs + carousel ---------- */
  var tabs = $('#state-tabs'), track = $('#tour-track'), heading = $('#tour-heading'), search = $('#tour-search');
  var mode = {type: 'state', value: ST[0] && ST[0].id};

  function list(){
    if (mode.type === 'state') return PK.filter(function(p){ return p.state === mode.value; });
    if (mode.type === 'theme') return PK.filter(function(p){ return p.themes.indexOf(mode.value) > -1; });
    var q = mode.value.toLowerCase();
    return PK.filter(function(p){
      return (p.title + ' ' + p.route + ' ' + stateName[p.state] + ' ' + p.themes.join(' ')).toLowerCase().indexOf(q) > -1;
    });
  }

  function render(){
    if (!track) return;
    var items = list();
    var label = mode.type === 'state' ? 'Best Seller ' + stateName[mode.value]
      : mode.type === 'theme' ? mode.value + ' packages'
      : 'Results for “' + mode.value + '”';
    heading.innerHTML = '<span>' + esc(label) + '</span><em>' + items.length + ' package' + (items.length === 1 ? '' : 's') + '</em>' +
      (mode.type !== 'state' ? '<button type="button" class="chip-clear" id="clear-filter">Clear ' + ic('x') + '</button>' : '');
    track.innerHTML = items.length ? items.map(card).join('')
      : '<p class="empty">No packages match. Try another place or <a href="#begin">ask us to plan one</a>.</p>';
    track.scrollLeft = 0;
    $$('.tab', tabs).forEach(function(t){
      var on = mode.type === 'state' && t.dataset.state === mode.value;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', on);
    });
    var c = $('#clear-filter');
    if (c) c.addEventListener('click', function(){ setMode('state', ST[0].id); if (search) search.value = ''; });
    arrows();
    tiltBind();
    playScenes();
  }

  function setMode(type, value){ mode = {type: type, value: value}; render(); }

  if (tabs){
    tabs.innerHTML = ST.map(function(s){
      return '<button type="button" role="tab" class="tab" data-state="' + s.id + '">' + esc(s.name) + '</button>';
    }).join('');
    tabs.addEventListener('click', function(e){
      var t = e.target.closest('.tab'); if (!t) return;
      if (search) search.value = '';
      setMode('state', t.dataset.state);
      t.scrollIntoView({block: 'nearest', inline: 'center', behavior: 'smooth'});
    });
  }

  if (search){
    var timer;
    search.addEventListener('input', function(){
      clearTimeout(timer);
      timer = setTimeout(function(){
        var v = search.value.trim();
        if (v) setMode('search', v); else setMode('state', ST[0].id);
      }, 180);
    });
  }

  function goTheme(t){
    if (search) search.value = '';
    setMode('theme', t);
    $('#destinations').scrollIntoView({behavior: 'smooth'});
  }
  if (themeWrap) themeWrap.addEventListener('click', function(e){
    var b = e.target.closest('.theme'); if (b) goTheme(b.dataset.theme);
  });

  // arrows + drag
  var prev = $('#tour-prev'), next = $('#tour-next');
  function step(){ var c = $('.tcard', track); return c ? (c.offsetWidth + 20) * 2 : 300; }
  function arrows(){
    if (!track || !prev) return;
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
  }
  if (prev){
    prev.addEventListener('click', function(){ track.scrollBy({left: -step(), behavior: 'smooth'}); });
    next.addEventListener('click', function(){ track.scrollBy({left: step(), behavior: 'smooth'}); });
    track.addEventListener('scroll', arrows, {passive: true});
    addEventListener('resize', arrows);
  }
  if (track){
    var down = false, sx = 0, sl = 0, moved = 0;
    track.addEventListener('pointerdown', function(e){
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = e.clientX; sl = track.scrollLeft;
    });
    addEventListener('pointermove', function(e){
      if (!down) return;
      var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      if (moved > 5){ track.classList.add('dragging'); track.scrollLeft = sl - dx; }
    });
    addEventListener('pointerup', function(){
      down = false;
      setTimeout(function(){ track.classList.remove('dragging'); }, 0);
    });
    track.addEventListener('click', function(e){ if (moved > 5){ e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ---------- destinations grid ---------- */
  var places = $('#place-grid');
  if (places){
    places.innerHTML = ST.map(function(s, i){
      var items = PK.filter(function(p){ return p.state === s.id; });
      var min = Math.min.apply(null, items.map(function(p){ return p.price; }));
      var photo = items.filter(function(p){ return p.img; })[0];
      var top = items.slice().sort(function(a, b){ return a.price - b.price; }).slice(0, 3);
      return '<button type="button" class="place rv" data-state="' + s.id + '" style="--i:' + i + '">' +
        '<span class="place-art">' + (photo ? media(photo) : scene(s.scene, s.name, i).replace('xMidYMid slice', 'xMidYMax slice')) + '</span>' +
        '<span class="place-num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="place-count">' + items.length + ' tours</span>' +
        '<span class="place-info"><b>' + esc(s.name) + '</b>' +
          '<span class="place-from">Starting from <strong>' + inr(min) + '</strong></span>' +
          '<span class="place-more"><span class="place-list">' + top.map(function(p){
            return '<span>' + esc(p.title) + '<i class="pl-meta">' + p.days + 'D \u00B7 ' + inr(p.price) + '</i></span>';
          }).join('') + '</span></span>' +
          '<span class="place-cta">View Tours <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '</span></button>';
    }).join('');
    places.addEventListener('click', function(e){
      var b = e.target.closest('.place'); if (!b) return;
      if (search) search.value = '';
      setMode('state', b.dataset.state);
      $('#destinations').scrollIntoView({behavior: 'smooth'});
    });
  }

  /* ---------- detail sheet ---------- */
  var sheet = $('#sheet'), body = $('#sheet-body'), lastFocus = null, pushed = false;
  var DEF = {
    inc: function(p){ return [p.arrive + ' pickup and drop', 'Hotel accommodation as per the package', 'Daily breakfast and dinner', 'All transfers and sightseeing by private vehicle', 'Driver allowance, tolls, parking and fuel']; },
    exc: ['Flights and train tickets', 'Lunch, unless mentioned', 'Entry tickets, camera fees and activities unless mentioned', 'Personal expenses such as laundry, phone and tips', 'GST and government taxes as applicable', 'Travel insurance'],
    prep: ['Carry an original government photo ID for every traveller.', 'Book flights or trains only after we confirm your dates.', 'Pack for the season. We send a packing list with your confirmation.'],
    stay: ['Handpicked 3-star deluxe hotels (upgrades on request)', 'Comfortable rooms with modern amenities', 'Wi-Fi where the hotel provides it', 'Central locations close to markets and sights', 'Hotels chosen on guest ratings, cleanliness and service'],
    car: ['Private air-conditioned car or SUV for your group', 'Experienced local driver who knows the route', 'AC may be switched off on steep hill roads', 'Larger groups travel in a Tempo Traveller'],
    policy: ['Prices are per person and change with travel dates, hotel category and group size.', 'Your booking is confirmed once the advance payment is received.', 'Cancellation charges depend on how close to departure you cancel; the full policy is shared with your quote.', 'Itineraries may change because of weather, road conditions or local restrictions.', 'Check-in and check-out times follow each hotel\'s policy.'],
    why: ['One point of contact from booking to return', 'Private cab with an experienced driver', 'Breakfast and dinner included in the price', 'Changes to dates and hotels before travel']
  };

  function li(arr, icon){ return '<ul class="ticks">' + arr.map(function(t){ return '<li>' + ic(icon || 'plane') + esc(t) + '</li>'; }).join('') + '</ul>'; }

  function detail(p){
    var o = off(p);
    var inc = (p.inc || []).concat(DEF.inc(p)), exc = (p.exc || []).concat(DEF.exc), prep = (p.prep || []).concat(DEF.prep);
    var icons = (p.tm ? [['manager', 'Tour Manager']] : []).concat([['hotel', 'Hotel'], ['meals', 'Meals'], ['transport', 'Transport'], ['sight', 'Sight Seeing']]);
    var today = new Date(); today.setDate(today.getDate() + 3);
    var min = today.toISOString().slice(0, 10);
    return '<div class="sh-hero">' + media(p).replace('xMidYMid slice', 'xMidYMax slice') +
        '<div class="sh-hero-txt"><div class="sh-tags">' + p.themes.map(function(t){ return '<span>' + t + '</span>'; }).join('') + '</div>' +
        '<h2 id="sheet-title">' + esc(p.title) + '</h2><p>' + esc(p.route) + '</p></div></div>' +
      '<div class="sh-grid"><div class="sh-main">' +
        '<div class="sh-dur">' + ic('clock') + '<div><b>Duration</b><span>' + p.days + ' Days / ' + nights(p) + ' Nights</span></div></div>' +
        '<h3>Tour Include</h3><div class="sh-icons">' + icons.map(function(x){ return '<span>' + ic(x[0]) + x[1] + '</span>'; }).join('') + '</div>' +
        '<div class="sh-two"><div><h3>Tour Highlights</h3>' + li(p.highlights) + '</div>' +
        '<div><h3>Why travel with us</h3>' + li(DEF.why) + '</div></div>' +
        '<div class="sh-tabs" role="tablist">' + ['Itinerary', 'Tour Details', 'Tour Information', 'Policy & Terms'].map(function(t, i){
          return '<button type="button" role="tab" class="' + (i ? '' : 'on') + '" data-tab="' + i + '">' + t + '</button>';
        }).join('') + '</div>' +
        '<div class="sh-pane on" data-pane="0"><div class="sh-pane-head"><h3>Itinerary <small>(Day wise)</small></h3><button type="button" class="link" data-all>View all days</button></div>' +
          '<ol class="days">' + p.itinerary.map(function(d, i){
            return '<li class="' + (i ? '' : 'open') + '"><button type="button" class="day-h">' + ic('plane') + '<span>Day ' + (i + 1) + ': ' + esc(d[0]) + '</span><i></i></button>' +
              '<div class="day-b"><p>' + esc(d[1]) + '</p></div></li>';
          }).join('') + '</ol></div>' +
        '<div class="sh-pane" data-pane="1"><h3>Tour Details <small>Best facilities with no added cost</small></h3>' +
          sub('d', [['Accommodation Details', li(DEF.stay)], ['Transportation', li(DEF.car)]]) + '</div>' +
        '<div class="sh-pane" data-pane="2"><h3>Tour Information <small>Read this to prepare for your tour</small></h3>' +
          sub('i', [['Tour Inclusions', li(inc, 'check')], ['Tour Exclusions', li(exc, 'x')], ['Advance preparation', li(prep)]]) + '</div>' +
        '<div class="sh-pane" data-pane="3"><h3>Policy &amp; Terms</h3>' + li(DEF.policy) + '</div>' +
      '</div>' +
      '<aside class="sh-side"><div class="book">' +
        (o ? '<span class="book-off">' + o + '% OFF</span>' : '') +
        '<small>Starts from</small>' + (p.mrp ? '<s>' + inr(p.mrp) + '</s>' : '') + '<b class="book-price">' + inr(p.price) + '</b><small>per person</small>' +
        '<h4>Booking Summary</h4>' +
        '<label class="book-row">Dept. date<input type="date" id="b-date" min="' + min + '"></label>' +
        '<div class="book-row">Guests<span class="qty"><button type="button" data-q="-1" aria-label="Fewer guests">−</button><output id="b-qty">2</output><button type="button" data-q="1" aria-label="More guests">+</button></span></div>' +
        '<div class="book-total"><span>Total price</span><b id="b-total"></b></div>' +
        '<div class="book-pay"><span>Pay now (30%)</span><b id="b-pay"></b></div>' +
        '<a class="book-cta" id="b-enq" href="#" target="_blank" rel="noopener">Enquire Now</a>' +
        '<a class="book-call" href="tel:' + TEL + '">' + ic('phone') + 'Call +91 44 2847 9000</a>' +
      '</div></aside></div>';
  }

  function sub(k, items){
    return '<div class="subtabs">' + items.map(function(x, i){
      return '<button type="button" class="' + (i ? '' : 'on') + '" data-sub="' + k + i + '">' + x[0] + '</button>';
    }).join('') + '</div>' + items.map(function(x, i){
      return '<div class="subpane' + (i ? '' : ' on') + '" data-subpane="' + k + i + '">' + x[1] + '</div>';
    }).join('');
  }

  function wire(p){
    var qty = 2, out = $('#b-qty'), date = $('#b-date');
    function update(){
      out.textContent = qty;
      var total = p.price * qty;
      $('#b-total').innerHTML = (p.mrp ? '<s>' + inr(p.mrp * qty) + '</s>' : '') + inr(total);
      $('#b-pay').textContent = inr(total * .3);
      var msg = 'Hello Chennai Royal Vacation, I would like to enquire about "' + p.title + '" (' + p.days + 'D/' + nights(p) + 'N). Guests: ' + qty +
        (date.value ? '. Departure: ' + date.value : '') + '. Quoted total: ' + inr(total) + '.';
      $('#b-enq').href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    }
    body.addEventListener('click', function(e){
      var q = e.target.closest('[data-q]');
      if (q){ qty = Math.min(20, Math.max(1, qty + +q.dataset.q)); update(); out.classList.remove('bump'); void out.offsetWidth; out.classList.add('bump'); }
      var t = e.target.closest('[data-tab]');
      if (t){
        $$('[data-tab]', body).forEach(function(x){ x.classList.toggle('on', x === t); });
        $$('.sh-pane', body).forEach(function(x){ x.classList.toggle('on', x.dataset.pane === t.dataset.tab); });
      }
      var s = e.target.closest('[data-sub]');
      if (s){
        var k = s.dataset.sub.charAt(0);
        $$('[data-sub^="' + k + '"]', body).forEach(function(x){ x.classList.toggle('on', x === s); });
        $$('[data-subpane^="' + k + '"]', body).forEach(function(x){ x.classList.toggle('on', x.dataset.subpane === s.dataset.sub); });
      }
      var d = e.target.closest('.day-h');
      if (d) d.parentNode.classList.toggle('open');
      var all = e.target.closest('[data-all]');
      if (all){
        var days = $$('.days li', body), open = days.every(function(x){ return x.classList.contains('open'); });
        days.forEach(function(x){ x.classList.toggle('open', !open); });
        all.textContent = open ? 'View all days' : 'Collapse days';
      }
    });
    date.addEventListener('change', update);
    update();
  }

  function open(id, push){
    var p = byId[id]; if (!p || !sheet) return;
    lastFocus = document.activeElement;
    var fresh = body.cloneNode(false); body.parentNode.replaceChild(fresh, body); body = fresh;
    body.innerHTML = detail(p);
    wire(p);
    sheet.hidden = false;
    document.documentElement.classList.add('locked');
    requestAnimationFrame(function(){ sheet.classList.add('show'); });
    $('.sheet-panel', sheet).scrollTop = 0;
    $('.sheet-close', sheet).focus({preventScroll: true});
    pushed = push !== false;
    if (pushed) history.pushState({pkg: id}, '', '#package=' + id);
    playScenes();
  }

  function close(pop){
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('show');
    document.documentElement.classList.remove('locked');
    setTimeout(function(){ sheet.hidden = true; }, 350);
    if (pop !== true && /^#package=/.test(location.hash)){
      if (pushed) history.back(); else history.replaceState(null, '', location.pathname + location.search);
    }
    pushed = false;
    if (lastFocus) lastFocus.focus({preventScroll: true});
  }

  document.addEventListener('click', function(e){
    if (e.target.closest('[data-stop]')) return;
    var o = e.target.closest('[data-open]');
    if (o){ e.preventDefault(); open(o.dataset.open); }
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') close();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.tcard')){ e.preventDefault(); open(e.target.dataset.open); }
  });
  if (sheet){
    $$('[data-close]', sheet).forEach(function(b){ b.addEventListener('click', function(){ close(); }); });
  }
  addEventListener('popstate', function(){
    var m = location.hash.match(/^#package=(.+)$/);
    if (m) open(m[1], false); else close(true);
  });

  /* ---------- 3D tilt on cards ---------- */
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tiltBind(){
    if (!fine) return;
    $$('.tcard:not([data-tilt]), .place:not([data-tilt])').forEach(function(c){
      c.setAttribute('data-tilt', '');
      c.addEventListener('pointermove', function(e){
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
        c.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
        c.style.setProperty('--gx', ((x + .5) * 100).toFixed(0) + '%');
        c.style.setProperty('--gy', ((y + .5) * 100).toFixed(0) + '%');
      });
      c.addEventListener('pointerleave', function(){ c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); });
    });
  }

  /* ---------- run scene animations only while on screen ---------- */
  var sio = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ e.target.classList.toggle('play', e.isIntersecting); });
  }, {rootMargin: '80px'}) : null;
  function playScenes(){
    $$('svg.scene:not([data-seen])').forEach(function(s){
      s.setAttribute('data-seen', '');
      if (sio) sio.observe(s); else s.classList.add('play');
    });
  }

  render();
  playScenes();
  var m = location.hash.match(/^#package=(.+)$/);
  if (m) open(m[1], false);
})();
