/*
 * Stage-local visual director. The slide engine owns dialogue, choices, map rail,
 * title card, and backgrounds; this file only composes #actors, #visualObjects,
 * and #effects for a cut.
 *
 * CSS animation/state hooks used here:
 * walk-in, walk-exit, walk-cycle, front-pop, pointing, flashback, vignette,
 * dash-in, clash, counterstep, spin-flight, dust-pop, eagle-bounce,
 * dragon-loom, dragon-big, dragon-struggle, push-one, push-two, impact-third,
 * dragon-flight, sparkle, badge-rise, proud-bounce, question, await-choice,
 * heart-rise, petal-rise, seat-pop, head-tilt, negotiation-card, lock-shine,
 * nod, eye-lines, pov-line, lower-to-match, group-arrive, network-lines,
 * lock-drop, card-flip, stamp-message, screen, data-alert, pointer-wag,
 * blink-alert, listening-dots, team-nod, face-low, presentation-line,
 * team-cheer, flower-rain, pie-scene, pie-whole, pie-slice, hand-pull,
 * hand-return, discuss, clock-zoom, chief-walk, stamp-strike, screen-shake,
 * temperature-rise, red-vignette, door-scene, door-opening, leaf-drift,
 * speech-flip, hourglass-big, waiting, is-complete, check-pop, whatif-scene,
 * whatif-anger, rattle, red-faced, frozen, grayscale, sad, retreat.
 */
(function () {
  'use strict';

  var renderEpoch = 0;
  var DEFAULT_HEIGHT = {
    vietnam: 420,
    chief: 450,
    china: 520,
    france: 480,
    usa: 500
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cutId(cut) {
    return typeof cut === 'string' ? cut : (cut && (cut.id || cut.cutId)) || '';
  }

  function character(key) {
    return (window.CHARACTERS && window.CHARACTERS[key]) || {};
  }

  function imageFor(key, view) {
    var entry = character(key);
    var views = entry.views || entry.images || entry.view || {};
    return views[view] || entry[view] || views.front || entry.front || '';
  }

  function heightFor(key, requested) {
    var entry = character(key);
    return requested || entry.height || entry.defaultHeight || DEFAULT_HEIGHT[key] || 420;
  }

  /**
   * A character is always anchored at its bottom centre. CSS owns translateX(-50%)
   * so the stage positions remain in 1920px coordinates.
   */
  function actor(key, view, x, floor, height, classes, label, id) {
    x = x == null ? 960 : x;
    floor = floor == null ? 860 : floor;
    height = heightFor(key, height);
    classes = classes || '';
    // everyone is drawn bigger; standing actors drop lower so only the upper body shows above the dialogue box
    if (classes.indexOf('gloom-actor') === -1) {
      var invader = key === 'france' || key === 'usa' || key === 'china';
      var seatedLike = classes.indexOf('at-table') !== -1 || classes.indexOf('seated') !== -1;
      var walking = classes.indexOf('walk') !== -1;
      var standing = floor <= 900 && !seatedLike && classes.indexOf('standing-presenter') === -1;
      var big = invader ? 0.87 : (height >= 540 ? 1.53 : (seatedLike ? 1.6 : (walking ? 1.5 : 2.1)));
      if (classes.indexOf('group-arrive') !== -1) { big = 2.05 * 0.9; floor += 335; }   // 2-06: upper body, bigger
      else if (classes.indexOf('at-table') !== -1) big = 1.85;
      if (classes.indexOf('standing-presenter') !== -1) { big = 1.85 * 0.85 * (400 / 470); floor = 1020; }   // presenter: same size and head height as the girls (his sprite box is taller)
      else if (key === 'chief' && classes.indexOf('chief-walk') !== -1) { big = 1.6; floor += 70; }   // stamp page (4-03): size kept, 1cm lower
      else if (key === 'chief' && classes.indexOf('at-table') !== -1) { big = 1.85 * 0.85; floor += 170; }
      if (key === 'chief' && classes.indexOf('smile') !== -1) floor -= 50;   // pizza page (3-07): chief ~0.7cm higher   // same size and head height as the girls beside him
      if (key === 'girl2' || key === 'girl3') big *= 0.9;
      if (key === 'chief' && height >= 540 && classes.indexOf('standing-presenter') === -1) floor += 100;   // ending: chief head level with the girl
      big *= 1.25;   // global size bump
      // girls sitting behind the meeting table: 0.85x and 1cm lower
      if (classes.indexOf('at-table') !== -1 && key !== 'chief') { big *= 0.85; floor += 70; }
      // standing Vietnamese girl in the plaza slides (1-01, fights, question, choices...): 0.9x
      if (key === 'vietnam' && standing && !walking && height < 540) big *= 0.9;
      height = Math.round(height * big);
      if (standing) floor += walking ? 110 : (invader ? 250 : 420);
      // the France / USA / China fights: same size and crop as before, everyone just sits ~0.5cm higher
      if (classes.indexOf('fight-') !== -1) floor -= 35;
      // the invaders now strike at the girl's head height instead of her feet
      if (invader && classes.indexOf('fight-i') !== -1) floor = 640;
    }
    var source = imageFor(key, view);
    var identifier = id ? ' id="' + esc(id) + '"' : '';
    var labelMarkup = label ? '<span class="actor-label">' + esc(label) + '</span>' : '';
    return '<div' + identifier + ' class="actor ' + esc(classes) + '" data-character="' + esc(key) +
      '" data-key="' + esc(key) + '" data-view="' + esc(view) +
      '" style="left:' + x + 'px;top:' + (floor - height) + 'px;height:' + height + 'px;">' +
      '<span class="ground-shadow" aria-hidden="true"></span>' +
      '<img draggable="false" src="' + esc(source) + '" alt="" />' + labelMarkup + '</div>';
  }

  function fallbackSVG(name) {
    var common = 'viewBox="0 0 100 100" aria-hidden="true" focusable="false"';
    var icons = {
      lock: '<svg ' + common + '><path class="lock-shackle" d="M30 49V34a20 20 0 0 1 40 0v15" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><rect x="19" y="46" width="62" height="42" rx="9" fill="#f4bd4f"/><circle cx="50" cy="65" r="5" fill="#76533e"/><path d="M50 70v9" stroke="#76533e" stroke-width="5" stroke-linecap="round"/></svg>',
      medal: '<svg ' + common + '><path d="M31 12h17l3 34-19 4zM52 12h17l19 38-19-4z" fill="#f29a9a"/><circle cx="50" cy="64" r="25" fill="#f5c84c"/><path d="m50 46 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="#fff5be"/></svg>',
      flower: '<svg ' + common + '><path d="M50 88V53" stroke="#5a9f64" stroke-width="7" stroke-linecap="round"/><path d="M48 68c-19-2-21-15-7-17 8-1 10 8 7 17zM53 75c16-8 24 1 14 10-7 6-14-1-14-10z" fill="#79b969"/><g fill="#ff9fbd"><circle cx="50" cy="30" r="14"/><circle cx="32" cy="41" r="14"/><circle cx="39" cy="20" r="14"/><circle cx="61" cy="20" r="14"/><circle cx="68" cy="41" r="14"/></g><circle cx="50" cy="31" r="10" fill="#ffd35f"/></svg>',
      'pie8-slices': '<svg class="pie-whole" ' + common + '><circle cx="50" cy="50" r="38" fill="#efb65e"/><g class="pie-slice" stroke="#fff4d9" stroke-width="2"><path d="M50 50 50 12A38 38 0 0 1 77 23z"/><path d="M50 50 77 23A38 38 0 0 1 88 50z"/><path d="M50 50 88 50A38 38 0 0 1 77 77z"/><path d="M50 50 77 77A38 38 0 0 1 50 88z"/><path d="M50 50 50 88A38 38 0 0 1 23 77z"/><path d="M50 50 23 77A38 38 0 0 1 12 50z"/><path d="M50 50 12 50A38 38 0 0 1 23 23z"/><path d="M50 50 23 23A38 38 0 0 1 50 12z"/></g><circle cx="50" cy="50" r="5" fill="#fff0bf"/></svg>',
      clock: '<svg ' + common + '><circle cx="50" cy="50" r="39" fill="#fff4de" stroke="#a97960" stroke-width="6"/><g stroke="#a97960" stroke-width="3"><path d="M50 16v7M50 77v7M16 50h7M77 50h7"/></g><path class="clock-hand" d="M50 50V27M50 50l18 12" stroke="#d2766d" stroke-width="5" stroke-linecap="round"/></svg>',
      stamp: '<svg ' + common + '><path d="M38 15h24l4 29 17 16v14H17V60l17-16z" fill="#d77268"/><path d="M31 79h38v10H31z" fill="#a84e4c"/><circle cx="50" cy="29" r="11" fill="#f39b91"/></svg>',
      heart: '<svg ' + common + '><path d="M50 84 18 54C1 36 15 13 34 20c7 3 13 11 16 17 4-7 10-14 17-17 19-7 33 16 16 34z" fill="#f48ca4"/></svg>',
      star: '<svg ' + common + '><path d="m50 8 10 29 31 1-25 18 9 30-25-18-25 18 9-30L9 38l31-1z" fill="#ffe072" stroke="#e9ae4c" stroke-width="3"/></svg>',
      teacup: '<svg ' + common + '><path d="M19 37h51v22A22 22 0 0 1 48 81 22 22 0 0 1 26 59z" fill="#cfe7df" stroke="#6aa39b" stroke-width="4"/><path d="M70 43h9a12 12 0 0 1 0 24h-8" fill="none" stroke="#6aa39b" stroke-width="5"/><path d="M14 84h65" stroke="#b77f5e" stroke-width="5" stroke-linecap="round"/><path d="M36 28c-8-9 7-11 0-20M55 28c-8-9 7-11 0-20" fill="none" stroke="#fff9e7" stroke-width="4"/></svg>',
      graph: '<svg ' + common + '><rect x="10" y="12" width="80" height="76" rx="6" fill="#fbf5e9" stroke="#7899aa" stroke-width="4"/><path d="M25 74V48h13v26M44 74V31h13v43M63 74V19h13v55" fill="#8bbdd0"/><path d="M20 75h61" stroke="#6a7f8e" stroke-width="4"/></svg>',
      anger: '<svg ' + common + '><path d="M16 14 44 40 33 6M84 14 56 40 67 6M16 86l28-26-11 34M84 86 56 60l11 34" fill="none" stroke="#ed6e62" stroke-width="9" stroke-linecap="round"/></svg>',
      sweat: '<svg ' + common + '><path d="M50 10C40 29 28 43 28 57a22 22 0 0 0 44 0C72 43 60 29 50 10z" fill="#82cde3"/><circle cx="43" cy="55" r="5" fill="#dfffff" opacity=".8"/></svg>',
      door: '<svg ' + common + '><rect x="17" y="9" width="66" height="82" rx="4" fill="#dca67b" stroke="#98644f" stroke-width="5"/><path d="M50 10v80" stroke="#a97158" stroke-width="3"/><circle cx="64" cy="52" r="4" fill="#f5d66d"/></svg>',
      hand: '<svg ' + common + '><path d="M24 83c-7-13-7-30 2-38l8-8V18c0-9 12-9 12 0v16-23c0-9 12-9 12 0v22-18c0-9 12-9 12 0v22-13c0-8 11-8 11 1v25c0 20-12 35-31 35z" fill="#f4c9a9" stroke="#b88672" stroke-width="4"/></svg>',
      certificate: '<svg ' + common + '><rect x="14" y="18" width="72" height="63" rx="5" fill="#fff8df" stroke="#bf9564" stroke-width="4"/><path d="M28 35h44M28 46h36M28 57h28" stroke="#bcaa85" stroke-width="4" stroke-linecap="round"/><circle cx="69" cy="65" r="10" fill="#e88a79"/></svg>',
      teapot: '<svg ' + common + '><path d="M23 48c0-20 12-31 28-31 20 0 31 14 29 34-1 20-11 28-29 28-19 0-28-11-28-31z" fill="#b7ddd3" stroke="#60988f" stroke-width="4"/><path d="M25 47 8 40 6 55l20 5M78 43c19-12 21 12 3 16" fill="none" stroke="#60988f" stroke-width="5"/><path d="M43 16c-5-9 8-11 2-18" fill="none" stroke="#fff9e6" stroke-width="4"/></svg>',
      hourglass: '<svg ' + common + '><path d="M22 12h56M22 88h56" stroke="#9b725b" stroke-width="8" stroke-linecap="round"/><path d="M30 17c0 27 14 25 20 33 6-8 20-6 20-33M30 83c0-27 14-25 20-33 6 8 20 6 20 33" fill="#fcf5df" stroke="#9b725b" stroke-width="4"/><path class="sand-upper" d="M37 23h26L50 44z" fill="#e8bb63"/><path class="sand-lower" d="m38 77 12-19 12 19z" fill="#e8bb63"/><path class="sand-stream" d="M50 42v18" stroke="#e8bb63" stroke-width="4"/></svg>',
      document: '<svg ' + common + '><path d="M22 10h42l17 17v63H22z" fill="#fff8e8" stroke="#b89575" stroke-width="4"/><path d="M64 10v18h17M34 43h34M34 55h34M34 67h22" stroke="#b9a384" stroke-width="4" stroke-linecap="round"/></svg>',
      pointer: '<svg ' + common + '><path d="m17 84 60-59" stroke="#a87b59" stroke-width="7" stroke-linecap="round"/><path d="m76 25 11-12-16 4z" fill="#d66d61"/></svg>',
      snowflake: '<svg ' + common + '><g stroke="#95c9e2" stroke-width="6" stroke-linecap="round"><path d="M50 12v76M17 31l66 38M17 69l66-38"/><path d="m50 12-7 9m7-9 7 9M50 88l-7-9m7 9 7-9"/></g></svg>',
      cloud: '<svg ' + common + '><path d="M19 73h61c18 0 18-25 0-25-4-23-34-24-40-5C16 40 7 57 19 73z" fill="#9aa9b3"/></svg>',
      leaf: '<svg ' + common + '><path d="M13 78C16 28 48 10 88 15 83 55 57 84 13 78z" fill="#82b86f"/><path d="M20 72 76 25" stroke="#e3f0d7" stroke-width="4"/></svg>',
      check: '<svg ' + common + '><circle cx="50" cy="50" r="38" fill="#85c782"/><path d="m28 51 14 15 31-34" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      plates: '<svg ' + common + '><ellipse cx="50" cy="65" rx="35" ry="17" fill="#f7f1dc" stroke="#c0a488" stroke-width="4"/><ellipse cx="50" cy="58" rx="28" ry="12" fill="#f9d49e"/></svg>',
      chair: '<svg ' + common + '><path d="M28 47h44v26H28zM27 15h46v32H27zM34 73l-6 17M67 73l6 17" fill="#bd8a67" stroke="#815b47" stroke-width="5" stroke-linejoin="round"/></svg>',
      performance: '<svg ' + common + '><path d="M17 75h66" stroke="#7899aa" stroke-width="5"/><path d="M24 65 43 48l14 7 20-26" fill="none" stroke="#85bcca" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      price: '<svg ' + common + '><path d="M18 19h46l19 19-45 45-19-19z" fill="#f2c973"/><circle cx="56" cy="30" r="6" fill="#fff5d6"/><text x="35" y="65" font-size="26" fill="#9c7654">₩</text></svg>',
      quality: '<svg ' + common + '><circle cx="50" cy="50" r="30" fill="#9dcbab"/><path d="m36 51 9 10 20-23" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      meetingtable: '<svg ' + common + '><ellipse cx="50" cy="46" rx="43" ry="22" fill="#c78e69"/><path d="M23 52 16 88M77 52l7 36" stroke="#875d4a" stroke-width="8" stroke-linecap="round"/><ellipse cx="50" cy="42" rx="34" ry="13" fill="#e1ad82"/></svg>'
    };
    return icons[name] || '<svg ' + common + '><circle cx="50" cy="50" r="36" fill="#f2c4a8"/></svg>';
  }

  function worldMarkup(name, opts) {
    try {
      var world = window.WORLD;
      var output = world && typeof world.prop === 'function' ? world.prop(name, opts || {}) : '';
      if (typeof output === 'string') return output;
      if (output && output.outerHTML) return output.outerHTML;
    } catch (error) {
      // Stage rendering must remain usable while a world prop is being revised.
    }
    return fallbackSVG(name);
  }

  function prop(name, options) {
    options = options || {};
    var x = options.x == null ? 960 : options.x;
    var y = options.y == null ? 540 : options.y;
    var size = options.size == null ? 120 : options.size;
    var classes = options.classes || '';
    var id = options.id ? ' id="' + esc(options.id) + '"' : '';
    var label = options.label ? '<span class="prop-label">' + esc(options.label) + '</span>' : '';
    return '<div' + id + ' class="prop ' + esc(classes) + '" data-prop="' + esc(name) +
      '" style="left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;transform:translate(-50%,-50%);">' +
      worldMarkup(name, options) + label + '</div>';
  }

  function effect(type, x, y, classes, text) {
    var symbols = {
      star: 'star', starburst: 'star', heart: 'heart', petal: 'flower', sparkle: 'star',
      anger: 'anger', sweat: 'sweat', snow: 'snowflake', leaf: 'leaf', check: 'check',
      dust: 'cloud', wind: 'cloud', impact: 'star', cloud: 'cloud'
    };
    var content = text ? '<span>' + esc(text) + '</span>' : fallbackSVG(symbols[type] || type);
    return '<div class="effect ' + esc(type + ' ' + (classes || '')) +
      '" style="left:' + x + 'px;top:' + y + 'px;">' + content + '</div>';
  }

  function bubble(text, x, y, classes) {
    return '<div class="npc-bubble ' + esc(classes || '') + '" style="left:' + x + 'px;top:' + y + 'px;">' + esc(text).replace(/\[\[(.+?)\]\]/g, '<b class="kw">$1</b>') + '</div>';
  }

  function svgMarkup(markup, classes) {
    return '<svg class="' + esc(classes || '') + '" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">' + markup + '</svg>';
  }

  function setActorView(id, key, view) {
    var node = document.getElementById(id);
    if (!node) return;
    node.dataset.view = view;
    var image = node.querySelector('img');
    if (image) image.src = imageFor(key, view);
  }

  function addClass(id, classes) {
    var node = document.getElementById(id);
    if (node) node.classList.add.apply(node.classList, classes.split(' '));
  }

  function removeClass(id, classes) {
    var node = document.getElementById(id);
    if (node) node.classList.remove.apply(node.classList, classes.split(' '));
  }

  function schedule(ctx, epoch, fn, ms) {
    if (!ctx || typeof ctx.later !== 'function') return;
    ctx.later(function () {
      if (epoch === renderEpoch) fn();
    }, ms);
  }

  function play(ctx, kind, epoch, delay) {
    var invoke = function () {
      if (epoch === renderEpoch && ctx && typeof ctx.sound === 'function') ctx.sound(kind);
    };
    if (delay) schedule(ctx, epoch, invoke, delay);
    else invoke();
  }

  var FLOOR = 785;          // standing floor: keeps feet above the dialogue box
  var TABLE_EDGE = 765;     // far edge of the meeting table in the background art (stage px)

  function seating(x, key, classes, id, view) {
    return actor(key || 'vietnam', view || 'front', x, 770, 440, 'seated ' + (classes || ''), '', id);
  }

  /** Person sitting/standing behind the 3D table: only the part above the tabletop shows. */
  function atTable(key, view, x, h, classes, id) {
    // 'shy' and 'shock' are bust-only artwork: keep the whole bust above the tabletop
    var bust = view === 'shy';
    return actor(key, view, x, Math.round(TABLE_EDGE + (bust ? 45 : h * 0.4)), h, 'at-table ' + (classes || ''), '', id);
  }

  function teaTable() {
    return [];
  }

  function negotiationCards(extraClass) {
    var cards = [
      ['performance', 820, '성능'],
      ['price', 960, '가격'],
      ['quality', 1100, '품질']
    ];
    return cards.map(function (item, index) {
      return prop(item[0], {
        x: item[1], y: 655, size: 140,
        classes: 'negotiation-card card-' + (index + 1) + ' ' + (extraClass || ''),
        label: item[2], id: 'negotiation-card-' + (index + 1)
      });
    });
  }

  function exitWalk() {
    return [
      actor('vietnam', 'walk_side', 960, FLOOR, 430, 'walk-exit walk-cycle', '', 'scene-v'),
      effect('dust', 865, FLOOR - 18, 'dust-pop'),
      effect('dust', 1050, FLOOR - 15, 'dust-pop delay-2')
    ];
  }

  function meetingTeam(views, classes) {
    var v = views || ['clip', 'wonder', 'clip'];
    return [
      atTable('vietnam', v[0], 520, 400, classes, 'scene-v'),
      atTable('girl2', v[1], 780, 400, (classes || ''), 'scene-v2'),
      atTable('girl3', v[2], 1040, 400, (classes || ''), 'scene-v3')
    ];
  }

  function meetingRoomBase() {
    return [
      '<div id="graph-screen" class="prop graph-screen" data-prop="graph" style="transform:translate(-50%,-50%)">' +
        '<svg viewBox="0 0 600 240" preserveAspectRatio="none" role="img" aria-label="수치 없는 세 막대 그래프">' +
          '<defs><linearGradient id="graph-bar" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#93b89a"/><stop offset="1" stop-color="#688c73"/></linearGradient></defs>' +
          '<rect x="0" y="0" width="600" height="240" rx="8" fill="#f6f4e9"/>' +
          '<path d="M75 37V204H546" fill="none" stroke="#6f8273" stroke-width="4" stroke-linecap="round"/>' +
          '<rect x="128" y="125" width="72" height="77" rx="3" fill="url(#graph-bar)"/>' +
          '<rect x="260" y="86" width="72" height="116" rx="3" fill="url(#graph-bar)"/>' +
          '<rect x="392" y="109" width="72" height="93" rx="3" fill="url(#graph-bar)"/>' +
          '<path d="M143 90 235 53 324 76 451 37 511 56" fill="none" stroke="#d39b82" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg></div>'
    ];
  }

  /** Top-view pizza: 8 slices, each with its own toppings, so the slices can be shared out. */
  function pizzaSVG() {
    var cx = 100, cy = 100;
    function pt(r, a) {
      var t = a * Math.PI / 180;
      return (cx + r * Math.cos(t)).toFixed(1) + ' ' + (cy + r * Math.sin(t)).toFixed(1);
    }
    var slices = '';
    for (var k = 0; k < 8; k++) {
      var a0 = -112.5 + k * 45, a1 = a0 + 45, mid = a0 + 22.5;
      var wedge = 'M' + cx + ' ' + cy + 'L' + pt(80, a0) + 'A80 80 0 0 1 ' + pt(80, a1) + 'Z';
      var crust = 'M' + pt(80, a0) + 'A80 80 0 0 1 ' + pt(80, a1) + 'L' + pt(93, a1) + 'A93 93 0 0 0 ' + pt(93, a0) + 'Z';
      var pep = pt(52, mid).split(' '), pep2 = pt(70, mid + (k % 2 ? 9 : -9)).split(' ');
      var green = pt(34, mid + 10), corn1 = pt(64, mid - 12).split(' '), corn2 = pt(40, mid - 14).split(' ');
      var ham = pt(72, mid + 4).split(' ');
      slices += '<g class="pie-slice slice-' + k + '" style="transform-origin:100px 100px">' +
        '<path d="' + wedge + '" fill="#f7d67e" stroke="#c98d3c" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="' + crust + '" fill="#e2a04a" stroke="#c98d3c" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M' + pt(76, mid - 15) + 'Q' + pt(78, mid) + ' ' + pt(76, mid + 15) + '" fill="none" stroke="#fff2b8" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
        '<circle cx="' + pep[0] + '" cy="' + pep[1] + '" r="10.5" fill="#d4443a" stroke="#a82f2a" stroke-width="1.5"/>' +
        '<circle cx="' + (+pep[0] - 3) + '" cy="' + (+pep[1] - 2) + '" r="1.7" fill="#a82f2a"/><circle cx="' + (+pep[0] + 3) + '" cy="' + (+pep[1] + 3) + '" r="1.7" fill="#a82f2a"/>' +
        '<circle cx="' + pep2[0] + '" cy="' + pep2[1] + '" r="7.5" fill="#d4443a" stroke="#a82f2a" stroke-width="1.2"/>' +
        '<path d="M' + green + 'q6 -5 11 1" fill="none" stroke="#5aa24b" stroke-width="4.5" stroke-linecap="round"/>' +
        '<circle cx="' + corn1[0] + '" cy="' + corn1[1] + '" r="3.2" fill="#ffd84a"/><circle cx="' + corn2[0] + '" cy="' + corn2[1] + '" r="3.2" fill="#ffd84a"/>' +
        '<rect x="' + (+ham[0] - 4) + '" y="' + (+ham[1] - 4) + '" width="8" height="8" rx="1.5" fill="#f2a2a6" transform="rotate(' + (mid * 2) + ' ' + ham[0] + ' ' + ham[1] + ')"/>' +
        '</g>';
    }
    return '<svg viewBox="0 0 200 200" aria-hidden="true" class="pizza-svg">' +
      '<g class="pizza-tray"><circle cx="100" cy="100" r="98" fill="#3b2f2a" stroke="#e5be78" stroke-width="3"/>' +
      '<circle cx="100" cy="100" r="95" fill="none" stroke="#6b554a" stroke-width="2" stroke-dasharray="3 6"/></g>' +
      slices + '</svg>';
  }

  /** Heavy storm cloud used by every "다른 선택을 했다면…" scene. */
  function stormCloud(x, y, w, classes) {
    return '<div class="storm-cloud ' + esc(classes || '') + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px">' +
      '<svg viewBox="0 0 300 170" aria-hidden="true"><path d="M60 128c-34 0-52-26-38-50 8-14 26-20 42-14 6-30 38-48 68-38 18 6 28 18 32 30 30-8 62 10 60 38-1 20-18 34-40 34z" fill="#4c5560"/>' +
      '<path d="M78 98c-8-18 6-34 24-34M200 84c14-10 34 0 36 16" fill="none" stroke="#6a7480" stroke-width="6" stroke-linecap="round"/>' +
      '<path class="bolt" d="M156 96l-18 30 20-5-9 22 28-34-20 5 11-19z" fill="#ffe27a" stroke="#fff6bd" stroke-width="2"/></svg>' +
      '<i class="rain r1"></i><i class="rain r2"></i><i class="rain r3"></i><i class="rain r4"></i><i class="rain r5"></i></div>';
  }

  function sceneFor(id) {
    var actors = [];
    var objects = [];
    var effects = [];

    switch (id) {
      case '0-01':
        break;
      case '0-02':
        actors.push(actor('vietnam', 'walk_side', 960, FLOOR + 70, 430, 'walk-in-r walk-cycle', '', 'scene-v'));
        effects.push(effect('dust', 300, FLOOR - 15, 'dust-pop'));
        break;
      case '0-03':
        actors.push(actor('vietnam', 'clap', 960, FLOOR + 70, 430, 'pointing walk-size', '', 'scene-v'));
        break;
      case '0-04':
        actors = exitWalk();
        break;

      case '1-01':
        actors.push(actor('vietnam', 'cheer', 960, FLOOR - 70, 430, 'front-pop proud-stance', '', 'scene-v'));
        break;

      /* 1-02 ~ 1-04: France -> USA -> China, the order used in the lecture (13p). */
      case '1-02':
        actors.push(
          actor('vietnam', 'stop', 960, FLOOR, 430, 'fight-v fight-s-pos', '', 'scene-v'),
          actor('france', 'charge', 690, FLOOR, 410, 'fight-i fight-s-pos', '(회상) 프랑스', 'scene-france')
        );
        effects = fightEffects(1, 855);
        break;
      case '1-03':
        actors.push(
          actor('vietnam', 'stop', 960, FLOOR, 430, 'fight-v fight-s-pos', '', 'scene-v'),
          actor('usa', 'charge', 680, FLOOR, 385, 'fight-i fight-s-pos', '(회상) 미국', 'scene-usa')
        );
        effects = fightEffects(1, 845);
        break;
      case '1-04':
        actors.push(
          actor('vietnam', 'stop', 960, FLOOR, 430, 'fight-v fight-s-neg', '', 'scene-v'),
          actor('china', 'charge', 1230, FLOOR, 440, 'reflect fight-i fight-s-neg', '(회상) 중국', 'scene-dragon')
        );
        effects = fightEffects(-1, 1090);
        break;

      case '1-05':
        actors.push(actor('vietnam', 'cheer', 960, FLOOR, 430, 'proud-bounce', '', 'scene-v'));
        objects.push(prop('medal', { x: 960, y: 330, size: 210, classes: 'badge-rise', label: '자긍심' }));
        effects.push(
          effect('sparkle', 845, 330, 'badge-sparkle'),
          effect('sparkle', 1075, 300, 'badge-sparkle delay-2'),
          effect('sparkle', 990, 200, 'badge-sparkle delay-3')
        );
        break;
      case '1-06':
        actors.push(actor('vietnam', 'sulk', 960, FLOOR - 140, 430, 'front-pop', '', 'scene-v'));
        effects.push(bubble('?', 1130, 190, 'comic question'));
        break;
      case '1-07':
        actors.push(actor('vietnam', 'sulk', 960, FLOOR - 140, 430, 'await-choice', '', 'scene-v'));
        effects.push(bubble('…', 1125, 210, 'soft awaiting'));
        break;
      case '1-08':
        actors.push(actor('vietnam', 'clap', 960, FLOOR, 430, 'proud-bounce bounce-twice', '', 'scene-v'));
        effects.push(
          effect('heart', 830, 390, 'heart-rise'), effect('heart', 960, 300, 'heart-rise delay-2'),
          effect('heart', 1090, 390, 'heart-rise delay-3'), effect('petal', 760, 470, 'petal-rise'),
          effect('petal', 1150, 455, 'petal-rise delay-2'), effect('petal', 1000, 250, 'petal-rise delay-3')
        );
        break;
      case '1-09':
        break;
      case '1-10':
        actors = exitWalk();
        break;

      case '2-01':
        actors.push(actor('vietnam', 'bow', 960, 770 + 143, 440, 'seated seat-pop', '', 'scene-v'));   // lowered so the joined hands sit ~0.5cm above the lock
        objects = teaTable().concat(negotiationCards());
        objects.push(prop('lock', { x: 960, y: 610, size: 190, classes: 'large-lock lock-shine', id: 'trust-lock' }));
        break;
      case '2-02':
        actors.push(actor('vietnam', 'surprise', 960, 770 + 143, 440, 'seated head-tilt', '', 'scene-v'));
        objects = teaTable().concat(negotiationCards());
        objects.push(prop('lock', { x: 960, y: 610, size: 190, classes: 'large-lock lock-shine', id: 'trust-lock' }));
        effects.push(bubble('?', 1290, 330, 'comic question'));
        break;
      case '2-03':
        actors.push(actor('vietnam', 'surprise', 960, 770 + 143, 440, 'seated await-choice', '', 'scene-v'));
        objects = teaTable().concat(negotiationCards());
        objects.push(prop('lock', { x: 960, y: 610, size: 190, classes: 'large-lock', id: 'trust-lock' }));
        effects.push(bubble('…', 1290, 340, 'soft awaiting'));
        break;
      case '2-04':
        actors.push(actor('vietnam', 'clap', 960, 770 + 143, 440, 'seated nod', '', 'scene-v'));
        objects = teaTable().concat(negotiationCards());
        objects.push(
          prop('certificate', { x: 825, y: 585, size: 150, classes: 'certificate-drop' }),
          prop('medal', { x: 1090, y: 575, size: 125, classes: 'medal-sparkle' }),
          prop('lock', { x: 960, y: 610, size: 190, classes: 'large-lock trust-30', id: 'trust-lock' })
        );
        effects.push(effect('heart', 1420, 155, 'gauge-heart-fill'));
        break;
      case '2-04b':
        break;
      case '2-05':
        actors.push(actor('vietnam', 'bow', 960, 770 + 143, 440, 'seated head-tilt', '', 'scene-v'));
        objects = teaTable();
        objects.push(prop('lock', { x: 960, y: 610, size: 170, classes: 'large-lock trust-60' }));
        effects.push(
          bubble('♡', 1290, 340, 'small question')
        );
        break;
      case '2-06':
        actors.push(
          seating(560, 'vietnam', 'group-arrive', 'scene-v', 'cheer'),
          seating(960, 'girl2', 'group-arrive', 'scene-v2', 'toast'),
          seating(1360, 'girl3', 'group-arrive', 'scene-v3', 'clap')
        );
        objects = teaTable();
        objects.push(
          prop('plates', { x: 830, y: 690, size: 115, classes: 'shared-plates' }),
          prop('plates', { x: 1090, y: 690, size: 115, classes: 'shared-plates' }),
          prop('teacup', { x: 770, y: 680, size: 65, classes: 'tea-cup toast-left' }),
          prop('teacup', { x: 1150, y: 680, size: 65, classes: 'tea-cup toast-right' })
        );
        effects.push(
          svgMarkup('<path d="M560 645 960 620 1360 645 960 742Z"/><circle cx="560" cy="645" r="16"/><circle cx="960" cy="620" r="16"/><circle cx="1360" cy="645" r="16"/><circle cx="960" cy="742" r="14"/>', 'network-lines'),
        );
        break;
      case '2-07':
        actors.push(actor('vietnam', 'cheer', 960, 770 + 140, 440, 'seated nod happy', '', 'scene-v'));   // 2cm lower
        objects = teaTable().concat(negotiationCards('card-flip'));
        objects.push(prop('lock', { x: 960, y: 610, size: 190, classes: 'large-lock lock-drop', id: 'trust-lock' }));
        effects.push(
          effect('heart', 1430, 155, 'gauge-heart-fill burst'),
          effect('sparkle', 820, 480, 'card-sparkle'), effect('sparkle', 1100, 480, 'card-sparkle delay-2')
        );
        break;
      case '2-08':
        actors = exitWalk();
        break;

      case '3-01':
        actors = meetingTeam(['wait', 'clap', 'front_calm'], 'front-facing');
        actors.push(actor('chief', 'point', 1700, 840, 470, 'standing-presenter', '', 'scene-chief'));
        actors = meetingRoomBase().concat(actors);
        break;
      case '3-02':
        actors = meetingTeam(['sad', 'wait', 'surprise'], 'listening');
        actors.push(actor('chief', 'point', 1700, 840, 470, 'standing-presenter', '', 'scene-chief'));
        actors = meetingRoomBase().concat(actors);
        break;
      case '3-03':
        actors = meetingTeam(['sulk', 'surprise', 'wait'], 'still');
        actors.push(actor('chief', 'point', 1700, 840, 470, 'standing-presenter', '', 'scene-chief'));
        actors = meetingRoomBase().concat(actors);
        break;
      case '3-04':
        actors = meetingTeam(['bow', 'clap', 'front_calm'], 'team-nod');
        actors.push(atTable('chief', 'arms_smile', 1400, 470, 'team-nod', 'scene-chief'));
        effects.push('<div class="listening-dots">경청 중<span>…</span></div>', effect('heart', 1430, 155, 'gauge-heart-fill'));
        break;
      case '3-04b':
        break;
      case '3-05':
        actors = meetingTeam(['sulk', 'front_calm', 'surprise'], 'presentation-line');
        actors.push(atTable('chief', 'arms_smile', 1400, 470, 'presentation-line', 'scene-chief'));
        break;
      case '3-06':
        actors = meetingTeam(['cheer', 'clap', 'toast'], 'team-cheer');
        actors.push(atTable('chief', 'clap', 1400, 470, 'team-cheer', 'scene-chief'));
        effects.push(effect('flower', 430, 230, 'flower-rain'), effect('flower', 730, 190, 'flower-rain delay-2'), effect('flower', 1060, 180, 'flower-rain delay-3'), effect('flower', 1390, 240, 'flower-rain delay-4'));
        break;
      case '3-07':
        actors.push(
          atTable('vietnam', 'clap', 700, 400, 'smile', 'scene-v'),
          atTable('chief', 'arms_smile', 1260, 400, 'smile', 'scene-chief')
        );
        objects.push(
          '<div id="sharing-pie" class="prop pie-scene pizza-prop" data-prop="pizza">' + pizzaSVG() + '</div>',
          prop('hand', { x: 1230, y: 940, size: 170, classes: 'hand-pull', id: 'pie-hand' })
        );
        effects.push('<div class="pie-percent">100%</div>', effect('heart', 600, 360, 'heart-rise'));
        break;
      case '3-08':
        actors = exitWalk();
        break;

      case '4-01':
        actors = meetingTeam(['bow', 'wait', 'front_calm'], 'discuss-ready');
        actors.push(atTable('chief', 'arms_smile', 1400, 470, 'front-facing', 'scene-chief'));
        objects.push(prop('document', { x: 960, y: 940, size: 170, classes: 'proposal-document' }), prop('clock', { x: 1660, y: 300, size: 170, classes: 'wall-clock' }));
        break;
      case '4-02':
        actors = meetingTeam(['sad', 'wait', 'surprise'], 'discuss');
        actors.push(atTable('chief', 'arms_smile', 1400, 470, 'discuss', 'scene-chief'));
        objects.push(prop('document', { x: 960, y: 940, size: 155, classes: 'proposal-document' }), prop('clock', { x: 1510, y: 315, size: 260, classes: 'wall-clock clock-zoom' }));
        effects.push(bubble('…', 430, 330, 'whisper one'), bubble('…', 760, 330, 'whisper two'), bubble('…', 1090, 330, 'whisper three'));
        break;
      case '4-03':
        actors = meetingTeam(['bow', 'front_calm', 'surprise'], 'team-nod');
        actors.push(atTable('chief', 'stamp', 1400, 470, 'chief-walk', 'scene-chief'));
        objects.push(prop('document', { x: 960, y: 940, size: 160, classes: 'proposal-document' }), prop('stamp', { x: 1030, y: 900, size: 160, classes: 'stamp-strike' }));
        effects.push(effect('impact', 960, 930, 'stamp-impact', '쿵!'));
        break;
      case '4-04':
        actors.push(atTable('vietnam', 'wait', 960, 430, 'temperature-rise uneasy', 'scene-v'));
        objects.push(prop('clock', { x: 1450, y: 300, size: 230, classes: 'wall-clock fast-tick' }));
        effects.push(effect('sweat', 1080, 400, 'sweat-drop'), effect('sweat', 1130, 440, 'sweat-drop delay-2'), '<div class="temperature-rise thermometer"><i></i><i></i><i></i></div>');
        break;
      case '4-05':
        actors.push(actor('vietnam', 'walk_side', 770, FLOOR + 70, 430, 'door-walk walk-cycle', '', 'scene-v'));
        effects.push(effect('leaf', 1260, 355, 'leaf-drift'), effect('leaf', 1510, 430, 'leaf-drift delay-2'), effect('leaf', 1680, 300, 'leaf-drift delay-3'), effect('wind', 1460, 500, 'balcony-wind'));
        break;
      case '4-06':
        actors.push(atTable('vietnam', 'wait', 960, 430, 'front-pop worried', 'scene-v'));
        effects.push(bubble('어.. 문제가 있어보여\n다시 검토해볼게요..', 1330, 300, 'problem-bubble'), effect('sweat', 800, 400, 'single-sweat'), effect('sweat', 730, 470, 'single-sweat delay-2'));
        break;
      case '4-07':
        actors.push(atTable('vietnam', 'clap', 960, 420, 'relieved-bounce', 'scene-v'));
        effects.push(bubble('‘문제가 있다’라는 표현은 핑계를 대는 경우\n[[신뢰를 보여주는 것이 중요]]', 1380, 270, 'speech-flip insight'), effect('heart', 1090, 290, 'heart-rise'));
        break;
      case '4-08':
        actors.push(
          atTable('vietnam', 'sulk', 640, 400, 'waiting', 'scene-v'),
          atTable('girl2', 'front_calm', 870, 400, 'waiting', 'scene-v2'),
          atTable('girl3', 'wait', 1080, 400, 'waiting', 'scene-v3'),
          atTable('chief', 'arms_smile', 1400, 470, 'waiting', 'scene-chief')
        );
        objects.push(prop('hourglass', { x: 960, y: 330, size: 300, classes: 'hourglass-big', id: 'patience-hourglass' }));
        effects.push('<div id="patience-check" class="patience-check"></div>');
        break;
      case '4-09':
        actors = exitWalk();
        break;

      case '5-01':
      case '5-02':
        break;
      case '5-03':
        actors.push(
          actor('vietnam', 'cheer', 700, FLOOR, 560, 'front-pop wave', '', 'scene-v'),
          actor('chief', 'clap', 1210, FLOOR, 560, 'gentle-bob', '', 'scene-chief')
        );
        effects.push(effect('star', 330, 330, 'map-star'), effect('star', 1590, 330, 'map-star delay-2'), effect('heart', 960, 330, 'heart-rise'));
        break;
      case '5-04':
        actors.push(
          actor('vietnam', 'cheer', 700, FLOOR, 560, 'wave gentle-bob', '', 'scene-v'),
          actor('chief', 'wave', 1210, FLOOR, 560, 'proud-bounce', '', 'scene-chief')
        );
        effects.push(
          effect('heart', 520, 520, 'heart-rise'), effect('heart', 960, 470, 'heart-rise delay-2'), effect('heart', 1380, 520, 'heart-rise delay-3'),
          effect('petal', 380, 470, 'petal-rise'), effect('petal', 1560, 470, 'petal-rise delay-2'), effect('petal', 960, 520, 'petal-rise delay-3'),
          effect('star', 250, 330, 'map-star'), effect('star', 1670, 330, 'map-star delay-2'), effect('sparkle', 960, 420, 'finish-sparkle')
        );
        break;
      default:
        break;
    }


    return { actors: actors, objects: objects, effects: effects };
  }

  function effectAt(type, x, y, classes, delay) {
    return effect(type, x, y, classes).replace('style="', 'style="animation-delay:' + delay + 's;');
  }

  /** Impacts for the three recall fights; timings match @keyframes fightV / fightI (4.8s). */
  function fightEffects(s, cx) {
    var out = [];
    out.push(effect('dust', cx - s * 150, FLOOR - 15, 'dust-pop'));
    out.push(effectAt('sweat', cx + s * 60, 470, 'fight-sweat', 1.6));
    return out;
  }

  function scheduleCut(id, ctx, epoch) {
    switch (id) {
      case '0-02':
        schedule(ctx, epoch, function () {
          setActorView('scene-v', 'vietnam', 'cheer');
          removeClass('scene-v', 'walk-in-r walk-cycle');
          addClass('scene-v', 'front-pop wave');
        }, 900);
        play(ctx, 'next', epoch, 180);
        break;
      case '1-02':
      case '1-03':
      case '1-04':
        [580, 1550, 2450].forEach(function (ms) { play(ctx, 'impact', epoch, ms); });
        play(ctx, 'wind', epoch, 3550);
        (function () {
          var inv = id === '1-02' ? 'scene-france' : id === '1-03' ? 'scene-usa' : 'scene-dragon';
          var key = id === '1-02' ? 'france' : id === '1-03' ? 'usa' : 'china';
          [[550, 'push'], [1500, 'struggle'], [2400, 'push'], [3400, 'fly']].forEach(function (st) {
            schedule(ctx, epoch, function () { setActorView(inv, key, st[1]); }, st[0]);
          });
        }());
        schedule(ctx, epoch, function () { setActorView('scene-v', 'vietnam', 'cheer'); }, 3550);
        play(ctx, 'star', epoch, 4200);
        break;
      case '1-05':
        play(ctx, 'star', epoch, 260);
        play(ctx, 'star', epoch, 620);
        play(ctx, 'star', epoch, 980);
        break;
      case '1-08':
        play(ctx, 'success', epoch, 160);
        break;
      case '2-01':
        play(ctx, 'next', epoch, 250);
        break;
      case '2-04':
        play(ctx, 'success', epoch, 480);
        break;
      case '2-05':
        schedule(ctx, epoch, function () { addClass('scene-v', 'eye-level-met'); }, 920);
        play(ctx, 'success', epoch, 1020);
        break;
      case '2-06':
        play(ctx, 'next', epoch, 450);
        break;
      case '2-07':
        play(ctx, 'success', epoch, 210);
        play(ctx, 'star', epoch, 700);
        break;
      case '3-02':
        play(ctx, 'tick', epoch, 240);
        break;
      case '3-04':
        play(ctx, 'success', epoch, 550);
        break;
      case '3-06':
        play(ctx, 'success', epoch, 430);
        break;
      case '3-07':
        // greedy grab (100%) -> hand gives it back -> the pizza is shared 50:50
        play(ctx, 'impact', epoch, 700);
        schedule(ctx, epoch, function () {
          addClass('sharing-pie', 'pizza-greedy');
          addClass('pie-hand', 'hand-grab');
        }, 600);
        schedule(ctx, epoch, function () {
          removeClass('sharing-pie', 'pizza-greedy');
          removeClass('pie-hand', 'hand-grab');
          addClass('sharing-pie', 'pizza-return');
          addClass('pie-hand', 'hand-release');
        }, 2200);
        schedule(ctx, epoch, function () {
          addClass('sharing-pie', 'pizza-share');
          var pct = document.querySelector('.pie-percent');
          if (pct) { pct.textContent = '50 : 50'; pct.classList.add('shared'); }
        }, 3400);
        play(ctx, 'success', epoch, 3500);
        break;
      case '4-02':
        play(ctx, 'tick', epoch, 360);
        play(ctx, 'tick', epoch, 900);
        play(ctx, 'tick', epoch, 1480);
        break;
      case '4-03':
        schedule(ctx, epoch, function () {
          var documentProp = document.querySelector('.proposal-document');
          if (documentProp) documentProp.classList.add('stamped');
        }, 780);
        play(ctx, 'impact', epoch, 760);
        break;
      case '4-04':
        play(ctx, 'tick', epoch, 350);
        play(ctx, 'tick', epoch, 700);
        play(ctx, 'tick', epoch, 1050);
        break;
      case '4-05':
        play(ctx, 'wind', epoch, 700);
        break;
      case '4-08':
        play(ctx, 'tick', epoch, 0);
        play(ctx, 'tick', epoch, 1100);
        play(ctx, 'tick', epoch, 2200);
        play(ctx, 'tick', epoch, 3300);
        schedule(ctx, epoch, function () {
          addClass('patience-hourglass', 'is-complete');
          var check = document.getElementById('patience-check');
          if (check) check.innerHTML = fallbackSVG('check');
          if (check) check.classList.add('check-pop');
        }, 4500);
        play(ctx, 'success', epoch, 4520);
        break;
      case '5-03':
        play(ctx, 'star', epoch, 300);
        play(ctx, 'success', epoch, 900);
        break;
      case '5-04':
        play(ctx, 'success', epoch, 200);
        play(ctx, 'star', epoch, 700);
        play(ctx, 'star', epoch, 1300);
        break;
      default:
        break;
    }
  }

  function render(cut, ctx) {
    var id = cutId(cut);
    var epoch = ++renderEpoch;
    var scene = sceneFor(id);
    var actors = document.getElementById('actors');
    var objects = document.getElementById('visualObjects');
    var effects = document.getElementById('effects');

    // These are intentional direct replacements: every cut starts with a clean stage.
    if (actors) {
      var chairs = '';
      if (id.indexOf('2-') === 0 && id !== '2-08') {
        var seats = id === '2-06' ? [480, 960, 1440] : [960];
        chairs = seats.map(function (x) { return prop('chair', {x:x,y:645,size:270,classes:'seat-chair'}); }).join('');
      }
      actors.innerHTML = chairs + scene.actors.join('');
    }
    if (objects) {
      objects.innerHTML = scene.objects.join('');
      objects.querySelectorAll('.tea-table > svg, .long-meeting-table > svg').forEach(function (table) { table.setAttribute('preserveAspectRatio', 'none'); });
    }
    if (effects) effects.innerHTML = scene.effects.join('');

    scheduleCut(id, ctx || {}, epoch);
  }

  /** "다른 선택을 했다면…": a dark, rainy, clearly-wrong-choice scene (stage coordinates, 1920x1080). */
  function whatIf(cut, ctx) {
    var id = cutId(cut);
    var actors = [];
    var objects = [];
    var effects = [];
    var storm = '';

    switch (id) {
      case '1-09':
        actors.push(actor('vietnam', 'sad', 960, 910, 600, 'gloom-actor drooping', '', 'whatif-v'));
        storm = stormCloud(960, 150, 440, 'big');
        effects.push(effect('anger', 1290, 400, 'whatif-mark huge'), '<div class="gloom-bubble" style="left:1330px;top:600px">…</div>');
        break;
      case '2-04b':
        actors.push(actor('vietnam', 'surprise', 640, 910, 600, 'gloom-actor drooping', '', 'whatif-v'));
        objects.push(
          prop('lock', { x: 1280, y: 520, size: 430, classes: 'large-lock rattle rattle-three whatif-lock', id: 'whatif-lock' }),
          prop('price', { x: 1000, y: 700, size: 200, classes: 'whatif-card' }),
          prop('performance', { x: 1560, y: 720, size: 190, classes: 'whatif-card' })
        );
        storm = stormCloud(640, 150, 440, 'big');
        effects.push('<div class="fight-pop huger gloom-pop" style="left:1280px;top:250px;animation-delay:.3s">덜컹! 덜컹!</div>');
        break;
      case '3-04b':
        actors.push(
          actor('chief', 'embarrassed', 960, 930, 720, 'red-faced gloom-actor face-low', '', 'whatif-chief'),
          actor('girl2', 'sad', 420, 880, 500, 'frozen grayscale gloom-actor', '', 'whatif-v1'),
          actor('girl3', 'sad', 1500, 880, 500, 'frozen grayscale gloom-actor', '', 'whatif-v2')
        );
        storm = stormCloud(960, 140, 440, 'big') + stormCloud(420, 330, 320, 'small') + stormCloud(1500, 330, 320, 'small');
        objects.push('<div class="face-gauge low"><small>수석대표 체면</small><b>100% → 30%</b></div>');
        effects.push(effect('sweat', 770, 470, 'sweat-drop big'), effect('sweat', 1170, 480, 'sweat-drop big delay-2'), effect('snow', 300, 760, 'freeze big'), effect('snow', 1620, 760, 'freeze big delay-2'));
        break;
      case '3-06':
        actors.push(
          actor('vietnam', 'surprise', 480, 910, 580, 'gloom-actor awkward-sweat', '', 'whatif-v'),
          actor('girl2', 'sad', 900, 880, 480, 'sad grayscale gloom-actor', '', 'whatif-v2'),
          actor('girl3', 'sad', 1250, 880, 480, 'sad grayscale gloom-actor', '', 'whatif-v3'),
          actor('chief', 'down', 1580, 880, 510, 'sad grayscale gloom-actor', '', 'whatif-chief')
        );
        objects.push(prop('flower', { x: 700, y: 640, size: 240, classes: 'solo-bouquet' }));
        storm = stormCloud(900, 290, 340, 'small') + stormCloud(1250, 290, 340, 'small') + stormCloud(1580, 290, 340, 'small');
        break;
      case '4-07':
        actors.push(actor('vietnam', 'sad', 960, 910, 600, 'gloom-actor drooping', '', 'whatif-v'));
        storm = stormCloud(960, 150, 440, 'big');
        effects.push('<div class="gloom-bubble" style="left:1330px;top:600px">…</div>', effect('wind', 650, 700, 'chill-wind'));
        break;
      default:
        break;
    }

    return '<div class="whatif-scene" data-whatif="' + esc(id) + '">' +
      '<div class="storm-bg"><i class="flash"></i><span class="drizzle"></span></div>' +
      '<div class="whatif-actors">' + actors.join('') + '</div>' +
      '<div class="whatif-objects">' + objects.join('') + '</div>' +
      '<div class="storm-layer">' + storm + '</div>' +
      '<div class="whatif-effects">' + effects.join('') + '</div></div>';
  }

  window.SCENE_VIEW = {
    render: render,
    whatIf: whatIf
  };
}());
