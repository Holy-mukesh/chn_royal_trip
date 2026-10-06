/* Illustrated, animated destination scenes (SVG). Used wherever a package has no photo.
   window.scene(name) returns an SVG string. Animations live in css/catalog.css (.sc-*). */
(function(){
  var uid = 0;

  var P = {
    snow:      {sky: ['#7fb4e6', '#dceefe'], sun: '#fff6d5', far: '#a9bfd8', mid: '#6f8fb0', near: '#2f5d50', ground: '#f4f8fc'},
    lake:      {sky: ['#f6b98a', '#fde3c4'], sun: '#fff1c9', far: '#8a93b8', mid: '#5b6b93', near: '#2f4a5c', water: ['#6f86b6', '#2b3f66']},
    desert:    {sky: ['#f59e5b', '#fde2b0'], sun: '#fff0c2', far: '#e3a05c', mid: '#d18240', near: '#b4642a'},
    palace:    {sky: ['#f08a78', '#fbd3b5'], sun: '#ffe9c4', far: '#c7778a', mid: '#9a5a6f', near: '#6b3a4f', water: ['#d7869a', '#6b3a4f']},
    beach:     {sky: ['#3fb6e8', '#c8f0ff'], sun: '#fffbe0', far: '#2a9d8f', mid: '#1f7a6e', water: ['#21c4c9', '#0b7c99'], sand: '#f6e3b4'},
    hills:     {sky: ['#f7c67a', '#fdf1d6'], sun: '#fff4d1', far: '#9ccf94', mid: '#5aa65a', near: '#2f7d3b'},
    temple:    {sky: ['#f26b3a', '#ffcf8a'], sun: '#ffe6a6', far: '#c4502a', mid: '#8a3a22', water: ['#e07a4a', '#5a2a1c'], sand: '#e8b27a'},
    monastery: {sky: ['#88c3e8', '#e9f6ff'], sun: '#fffbe6', far: '#b6c9d9', mid: '#6d8f7a', near: '#3a6047', ground: '#e8f1f7'},
    ladakh:    {sky: ['#2f8fd8', '#bfe4ff'], sun: '#fffbe6', far: '#c9a27a', mid: '#a5774f', near: '#7e5636', water: ['#1d7fc4', '#0b4f86']},
    river:     {sky: ['#a7d8f0', '#eef9ff'], sun: '#fff6d8', far: '#8fbf9a', mid: '#4f9a63', near: '#2d6e43', water: ['#7cc7d9', '#2f8aa0']},
    city:      {sky: ['#f7a76c', '#fde7cf'], sun: '#fff1d6', far: '#e9c7a8', mid: '#c99f7f', near: '#8f6a52'},
    pagoda:    {sky: ['#ff8e6e', '#ffd9a0'], sun: '#fff0c8', far: '#d97d5f', mid: '#a5503c', near: '#6e2f22', water: ['#e8996b', '#5e2a1e']}
  };

  function grad(id, c, vertical){
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical === false ? 1 : 0) + '" y2="' + (vertical === false ? 0 : 1) + '">' +
      '<stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>';
  }

  function clouds(){
    return '<g class="sc-cloud" fill="#fff" opacity=".85">' +
      '<g transform="translate(40 40)"><ellipse cx="0" cy="0" rx="26" ry="9"/><ellipse cx="14" cy="-6" rx="16" ry="9"/></g>' +
      '<g transform="translate(250 28)"><ellipse cx="0" cy="0" rx="22" ry="7"/><ellipse cx="-10" cy="-5" rx="12" ry="7"/></g></g>' +
      '<g class="sc-cloud slow" fill="#fff" opacity=".6"><g transform="translate(160 58)"><ellipse cx="0" cy="0" rx="30" ry="7"/></g></g>';
  }

  function birds(){
    return '<g class="sc-birds" fill="none" stroke="#2b2b2b" stroke-width="1.4" stroke-linecap="round" opacity=".55">' +
      '<path d="M300 60q4-4 8 0q4-4 8 0"/><path d="M322 50q3-3 6 0q3-3 6 0"/><path d="M286 48q3-3 6 0q3-3 6 0"/></g>';
  }

  function sun(c, x, y, r){
    return '<circle class="sc-sun" cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>' +
      '<circle class="sc-halo" cx="' + x + '" cy="' + y + '" r="' + (r * 1.9) + '" fill="' + c + '" opacity=".25"/>';
  }

  function ridge(color, d){ return '<path fill="' + color + '" d="' + d + '"/>'; }

  function snowPeaks(p){
    return ridge(p.far, 'M0 150L50 92L85 120L140 60L190 118L230 80L290 128L340 70L400 120V260H0Z') +
      '<path fill="#fff" d="M140 60L124 79L134 77L140 86L148 76L157 80ZM340 70L326 86L336 84L341 92L349 83L357 86ZM230 80L219 93L231 92L238 96Z"/>' +
      ridge(p.mid, 'M0 175L60 130L110 160L170 120L230 165L300 128L360 160L400 140V260H0Z');
  }

  function pines(color, y, n, gap, start){
    var s = '<g fill="' + color + '">';
    for (var i = 0; i < n; i++){
      var x = start + i * gap, h = 26 + (i * 7) % 14;
      s += '<path d="M' + x + ' ' + (y - h) + 'L' + (x - 9) + ' ' + y + 'H' + (x + 9) + 'Z"/>';
    }
    return s + '</g>';
  }

  function water(id, p, y){
    return '<rect x="0" y="' + y + '" width="400" height="' + (260 - y) + '" fill="url(#' + id + 'w)"/>' +
      '<g class="sc-shimmer" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5">' +
      '<path d="M60 ' + (y + 18) + 'h30M150 ' + (y + 30) + 'h44M250 ' + (y + 16) + 'h26M320 ' + (y + 40) + 'h36M100 ' + (y + 50) + 'h24"/></g>';
  }

  function flags(x1, y1, x2, y2){
    var cols = ['#2f6fd6', '#ffffff', '#d63a2f', '#2f9a4f', '#f2c230'], s = '<g class="sc-flags">';
    s += '<path d="M' + x1 + ' ' + y1 + 'Q' + ((x1 + x2) / 2) + ' ' + (Math.max(y1, y2) + 14) + ' ' + x2 + ' ' + y2 + '" stroke="#555" stroke-width=".8" fill="none"/>';
    for (var i = 1; i < 10; i++){
      var t = i / 10, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t + Math.sin(Math.PI * t) * 12;
      s += '<rect class="sc-flag" x="' + (x - 3) + '" y="' + y + '" width="6" height="9" fill="' + cols[i % 5] + '"/>';
    }
    return s + '</g>';
  }

  var draw = {
    snow: function(p, id){
      return snowPeaks(p) + '<path fill="' + p.ground + '" d="M0 210Q100 190 200 205T400 200V260H0Z"/>' +
        pines(p.near, 218, 7, 22, 12) + pines(p.near, 224, 6, 24, 250) +
        '<g class="sc-snow" fill="#fff">' + [20, 70, 130, 190, 240, 300, 350, 95, 270].map(function(x, i){
          return '<circle cx="' + x + '" cy="' + (20 + (i * 37) % 120) + '" r="' + (1.2 + i % 3 * .6) + '"/>';
        }).join('') + '</g>';
    },
    lake: function(p, id){
      return snowPeaks(p) + water(id, p, 180) +
        '<g opacity=".35" transform="translate(0 360) scale(1 -1)">' + ridge(p.mid, 'M0 175L60 130L110 160L170 120L230 165L300 128L360 160L400 140V180H0Z') + '</g>' +
        '<g class="sc-boat"><path fill="#4a2c1d" d="M140 214q40 10 80 0l-8 8h-64Z"/><path fill="#7a4a2e" d="M160 214v-12h40v12"/><path fill="#c0392b" d="M156 203h48l-4-6h-40Z"/><path stroke="#4a2c1d" stroke-width="1.5" d="M228 200l-14 26"/></g>' +
        pines(p.near, 186, 5, 18, 300);
    },
    desert: function(p, id){
      return sun(p.sun, 300, 90, 30) +
        ridge(p.far, 'M0 170Q80 140 160 165T320 150T400 160V260H0Z') +
        '<g fill="' + p.mid + '"><path d="M40 160h120v-30h10v-10h10v10h10v-10h10v10h10v-10h10v10h10v30h40v-24h10v-8h10v8h10v24h20v20H40Z"/></g>' +
        ridge(p.mid, 'M0 200Q100 170 200 195T400 185V260H0Z') +
        ridge(p.near, 'M0 230Q120 205 240 228T400 220V260H0Z') +
        '<g class="sc-camel" fill="#5a3418"><path d="M300 214c4-12 12-14 16-6c4-10 12-10 16 0h6c4 0 6 4 4 6l-4-1v18h-3v-14h-18v14h-3v-14c-6 0-10-1-14-3Z"/><path d="M342 213l6-10h4l-2 4Z"/></g>';
    },
    palace: function(p, id){
      return sun(p.sun, 90, 80, 24) + ridge(p.far, 'M0 170Q100 150 200 165T400 158V260H0Z') +
        '<g fill="' + p.mid + '"><path d="M110 178V128h180v50Z"/><path d="M130 128q20-34 40 0ZM230 128q20-34 40 0ZM180 128q20-44 40 0Z"/>' +
        '<rect x="96" y="110" width="14" height="68"/><rect x="290" y="110" width="14" height="68"/><path d="M96 110q7-16 14 0ZM290 110q7-16 14 0Z"/></g>' +
        '<g fill="' + p.sky[1] + '" opacity=".6"><path d="M140 178v-22q8-12 16 0v22ZM192 178v-26q8-12 16 0v26ZM244 178v-22q8-12 16 0v22Z"/></g>' +
        water(id, p, 178) + '<g opacity=".25" transform="translate(0 356) scale(1 -1)"><path fill="' + p.mid + '" d="M110 178V128h180v50Z"/></g>';
    },
    beach: function(p, id){
      return sun(p.sun, 320, 60, 22) + ridge(p.far, 'M0 150Q40 120 90 140T170 138L170 150Z') +
        water(id, p, 148) + '<path fill="' + p.sand + '" d="M0 215Q140 195 260 215T400 205V260H0Z"/>' +
        '<g class="sc-wave" fill="none" stroke="#fff" stroke-width="2.5" opacity=".75"><path d="M0 212Q140 192 260 212T400 202"/></g>' +
        '<g class="sc-palm"><path d="M80 250Q70 200 92 150" stroke="#6b4a2b" stroke-width="6" fill="none"/>' +
        '<g fill="#1f8a4c"><path d="M92 150q30-10 50 10q-28-4-50-10Z"/><path d="M92 150q-34-6-50 16q26-10 50-16Z"/><path d="M92 150q10-30 36-34q-20 14-36 34Z"/><path d="M92 150q-16-26-42-24q24 8 42 24Z"/></g></g>' +
        '<g class="sc-boat"><path fill="#fff" d="M230 176h50l-8 8h-36Z"/><path fill="#fff" d="M252 176v-28l16 26Z" opacity=".9"/></g>';
    },
    hills: function(p, id){
      var rows = '';
      for (var i = 0; i < 6; i++) rows += '<path d="M' + (-20 + i * 8) + ' ' + (205 + i * 9) + 'Q200 ' + (170 + i * 9) + ' 420 ' + (210 + i * 8) + '" />';
      return sun(p.sun, 200, 95, 26) + ridge(p.far, 'M0 160Q70 120 140 150T280 140T400 150V260H0Z') +
        '<g class="sc-mist" fill="#fff" opacity=".55"><ellipse cx="120" cy="160" rx="90" ry="10"/><ellipse cx="300" cy="150" rx="80" ry="8"/></g>' +
        ridge(p.mid, 'M0 190Q100 160 200 185T400 175V260H0Z') +
        ridge(p.near, 'M0 215Q200 175 400 210V260H0Z') +
        '<g fill="none" stroke="#1f5e2c" stroke-width="2" opacity=".45">' + rows + '</g>' +
        '<g class="sc-train"><rect x="0" y="0" width="22" height="12" rx="2" fill="#2a5aa8"/><rect x="25" y="0" width="22" height="12" rx="2" fill="#2a5aa8"/><rect x="50" y="-2" width="16" height="14" rx="2" fill="#333"/>' +
        '<rect x="56" y="-8" width="4" height="7" fill="#333"/><circle cx="6" cy="13" r="2.4" fill="#222"/><circle cx="17" cy="13" r="2.4" fill="#222"/><circle cx="31" cy="13" r="2.4" fill="#222"/><circle cx="42" cy="13" r="2.4" fill="#222"/><circle cx="58" cy="13" r="2.4" fill="#222"/></g>';
    },
    temple: function(p, id){
      var tiers = '';
      for (var i = 0; i < 6; i++){
        var w = 70 - i * 10, y = 178 - i * 16;
        tiers += '<rect x="' + (280 - w / 2) + '" y="' + (y - 16) + '" width="' + w + '" height="16"/>';
      }
      return sun(p.sun, 120, 110, 30) + water(id, p, 170) +
        '<g fill="' + p.mid + '">' + tiers + '<path d="M266 66h28l-14-16Z"/><circle cx="280" cy="48" r="3"/><rect x="232" y="170" width="96" height="14"/></g>' +
        '<path fill="' + p.sand + '" d="M0 222Q160 205 400 220V260H0Z"/>' +
        '<g class="sc-wave" fill="none" stroke="#ffe0b8" stroke-width="2" opacity=".7"><path d="M0 220Q160 203 400 218"/></g>';
    },
    monastery: function(p, id){
      return snowPeaks(p) + ridge(p.near, 'M0 200Q120 170 240 195T400 190V260H0Z') +
        '<g><rect x="150" y="150" width="100" height="44" fill="#f3efe6"/><rect x="150" y="150" width="100" height="10" fill="#a8322b"/>' +
        '<path fill="#5a3b2a" d="M140 150h120l-14-14h-92Z"/><rect x="186" y="118" width="28" height="20" fill="#f3efe6"/><path fill="#c9962b" d="M180 120h40l-20-14Z"/>' +
        '<g fill="#5a3b2a"><rect x="164" y="168" width="10" height="14"/><rect x="195" y="168" width="10" height="26"/><rect x="226" y="168" width="10" height="14"/></g></g>' +
        flags(20, 120, 140, 150) + flags(260, 150, 390, 118);
    },
    ladakh: function(p, id){
      return sun(p.sun, 330, 60, 20) +
        ridge(p.far, 'M0 150L60 100L110 130L170 80L230 130L290 92L350 128L400 104V260H0Z') +
        '<path fill="#fff" d="M170 80L160 92L170 90L176 96ZM290 92L281 103L292 101Z"/>' +
        ridge(p.mid, 'M0 180L70 140L140 170L210 135L280 172L350 146L400 165V260H0Z') +
        water(id, p, 196) + ridge(p.near, 'M0 236Q200 214 400 234V260H0Z') +
        '<g fill="#fff"><path d="M70 196h24v-6h-4v-8q-8-10-16 0v8h-4Z"/><rect x="80" y="166" width="4" height="10"/></g>' +
        flags(96, 172, 160, 190);
    },
    river: function(p, id){
      return sun(p.sun, 300, 70, 22) + ridge(p.far, 'M0 140Q60 100 120 130T240 115T400 130V260H0Z') +
        ridge(p.mid, 'M0 180Q60 140 140 170L140 260H0Z') + ridge(p.mid, 'M260 170Q330 140 400 160V260H260Z') +
        '<path fill="url(#' + id + 'w)" d="M140 170Q200 175 260 170L330 260H70Z"/>' +
        '<g class="sc-shimmer" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".55"><path d="M170 200h24M210 220h30M150 240h26M240 245h22"/></g>' +
        '<g stroke="#6b4a2b" stroke-width="2" fill="none"><path d="M120 150Q200 175 280 150"/><path d="M120 156Q200 181 280 156"/></g>' +
        '<g stroke="#6b4a2b" stroke-width="1"><path d="M150 160v8M175 165v8M200 167v8M225 165v8M250 160v8"/></g>' +
        pines(p.near, 200, 4, 22, 20) + pines(p.near, 196, 4, 22, 300);
    },
    city: function(p, id){
      return sun(p.sun, 200, 82, 34) + ridge(p.far, 'M0 190H400V260H0Z') +
        '<g fill="' + p.near + '"><rect x="130" y="150" width="140" height="40"/><path d="M168 150q32-70 64 0Z"/><rect x="198" y="88" width="4" height="10"/>' +
        '<path d="M140 150q10-22 20 0ZM240 150q10-22 20 0Z"/><rect x="110" y="104" width="7" height="86"/><rect x="283" y="104" width="7" height="86"/>' +
        '<path d="M108 104q5-10 11 0ZM281 104q5-10 11 0Z"/><path d="M188 190v-26q12-14 24 0v26Z" fill="' + p.sky[1] + '" opacity=".45"/></g>' +
        '<rect x="196" y="190" width="8" height="70" fill="#7fb2d8" opacity=".7"/>' +
        '<g fill="#3f6d3a">' + [30, 60, 330, 360].map(function(x){ return '<ellipse cx="' + x + '" cy="200" rx="14" ry="20"/>'; }).join('') + '</g>';
    },
    pagoda: function(p, id){
      function spire(x, h, w){ return '<path d="M' + (x - w) + ' 186L' + x + ' ' + (186 - h) + 'L' + (x + w) + ' 186Z"/>'; }
      return sun(p.sun, 90, 90, 26) + water(id, p, 186) +
        '<g fill="' + p.mid + '">' + spire(200, 110, 22) + spire(150, 70, 16) + spire(250, 70, 16) + spire(110, 46, 12) + spire(290, 46, 12) +
        '<rect x="100" y="178" width="200" height="10"/></g>' +
        '<g fill="#f2c230" opacity=".7"><circle cx="200" cy="120" r="3"/><circle cx="150" cy="140" r="2"/><circle cx="250" cy="140" r="2"/></g>';
    }
  };

  // Variants so packages sharing a scene still look different: sky mood + mirrored layout.
  var SKY = [null, ['#f7b267', '#fde4c3'], ['#5b4b8a', '#f4a261'], ['#4aa3df', '#d7efff']];

  window.scene = function(name, label, seed){
    var base = P[name] || P.hills, id = 'sc' + (++uid), body = draw[name] || draw.hills;
    var v = (seed || 0) % 4, p = base;
    if (SKY[v]){ p = {}; for (var k in base) p[k] = base[k]; p.sky = SKY[v]; }
    var flip = v === 1 || v === 3;
    var defs = '<defs>' + grad(id + 's', p.sky) + (p.water ? grad(id + 'w', p.water) : grad(id + 'w', ['#7cc7d9', '#2f8aa0'])) + '</defs>';
    var hasSun = /sun\(/.test(body.toString());
    return '<svg class="scene sc-' + name + '" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + (label || name) + ' illustration">' +
      defs + '<rect width="400" height="260" fill="url(#' + id + 's)"/>' +
      (hasSun ? '' : sun(p.sun, 320, 54, 18)) + clouds() + birds() +
      (flip ? '<g transform="translate(400 0) scale(-1 1)">' + body(p, id) + '</g>' : body(p, id)) + '</svg>';
  };
})();
