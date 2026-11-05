/* Original editable SVG illustration library for Viet Village. */
(function () {
  'use strict';

  var C = {
    ink: '#405650', deepInk: '#314641', cream: '#fff9ef', paper: '#fffdf8',
    sky: '#d9eef0', mint: '#b9d9c6', sage: '#86ad8d', leaf: '#5f9172',
    moss: '#47765f', peach: '#e7a38f', rose: '#eec0b5', blush: '#f4d6c9',
    gold: '#e1b969', sand: '#e8cf9f', stone: '#c7b8a4', wood: '#9a7053',
    woodLight: '#c9956e', blue: '#b9dce0', lavender: '#c6bddb'
  };

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function svg(content, label) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(label) + '">' + content + '</svg>';
  }

  function defs(p) {
    return '<defs>' +
      '<linearGradient id="' + p + '-sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#cfe8ed"/><stop offset=".55" stop-color="#f9dfc2"/><stop offset="1" stop-color="#f2d4bd"/></linearGradient>' +
      '<linearGradient id="' + p + '-grass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b8d5a7"/><stop offset="1" stop-color="#6f9c75"/></linearGradient>' +
      '<linearGradient id="' + p + '-hill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d6e6ba"/><stop offset="1" stop-color="#8fb183"/></linearGradient>' +
      '<linearGradient id="' + p + '-plaster" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff7e8"/><stop offset="1" stop-color="#eed7bc"/></linearGradient>' +
      '<linearGradient id="' + p + '-wood" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c28b62"/><stop offset="1" stop-color="#815743"/></linearGradient>' +
      '<linearGradient id="' + p + '-stone" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eee3d0"/><stop offset="1" stop-color="#bfb09d"/></linearGradient>' +
      '<linearGradient id="' + p + '-glass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d8f2f3" stop-opacity=".88"/><stop offset="1" stop-color="#84b9be" stop-opacity=".72"/></linearGradient>' +
      '<linearGradient id="' + p + '-warm" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f7e0aa"/><stop offset=".55" stop-color="#e7a46e"/><stop offset="1" stop-color="#b86d55"/></linearGradient>' +
      '<radialGradient id="' + p + '-lamp"><stop stop-color="#fff8ca"/><stop offset=".38" stop-color="#f6cb7d" stop-opacity=".7"/><stop offset="1" stop-color="#f6cb7d" stop-opacity="0"/></radialGradient>' +
      '<pattern id="' + p + '-paper" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M3 5l3-1M17 9l2 1M8 21l2-2M25 20l1 1" stroke="#405650" stroke-opacity=".08" stroke-width="1" stroke-linecap="round"/></pattern>' +
      '<pattern id="' + p + '-wallpaper" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M17 5c-9 9-9 15 0 24 9-9 9-15 0-24ZM5 17c9-9 15-9 24 0-9 9-15 9-24 0Z" fill="none" stroke="#b47c68" stroke-opacity=".22" stroke-width="2"/></pattern>' +
      '<pattern id="' + p + '-woodgrain" width="72" height="32" patternUnits="userSpaceOnUse"><path d="M0 8c18-7 35 7 72-1M0 22c22 8 41-8 72 2" fill="none" stroke="#704a3c" stroke-opacity=".18" stroke-width="2"/></pattern>' +
      '<pattern id="' + p + '-cobble" width="112" height="72" patternUnits="userSpaceOnUse"><path d="M0 16q28-19 56 0t56 0M0 52q28-20 56 0t56 0M28 0v16M84 16v36M28 52v20" fill="none" stroke="#ae9d8a" stroke-width="4" opacity=".64"/></pattern>' +
      '<filter id="' + p + '-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="9" flood-color="#405650" flood-opacity=".2"/></filter>' +
      '<filter id="' + p + '-soft" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="13"/></filter>' +
      '<filter id="' + p + '-inner" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"/><feOffset dy="5" result="offset"/><feComposite in="SourceGraphic" in2="offset" operator="arithmetic" k2="1" k3="-.35"/></filter>' +
      '<clipPath id="' + p + '-plaza-clip"><ellipse cx="960" cy="725" rx="842" ry="211"/></clipPath>' +
      '</defs>';
  }

  function texture(p, opacity) {
    return '<rect width="1920" height="1080" fill="url(#' + p + '-paper)" opacity="' + (opacity == null ? '.42' : opacity) + '" pointer-events="none"/>';
  }

  function cloud(x, y, s, opacity) {
    return '<g class="cloud-drift" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fffdf7" opacity="' + (opacity == null ? '.84' : opacity) + '"><path d="M0 47c4-20 24-30 43-21C52 1 95 6 100 32c19-17 55-4 57 21H0c-11-2-11-5 0-6Z"/><path d="M34 43c5-10 19-14 30-4 8-14 30-12 38 4" fill="none" stroke="#e9e8db" stroke-width="4" stroke-linecap="round" opacity=".8"/></g>';
  }

  function cloudBank() {
    return cloud(125, 170, 1.13, .72) + cloud(675, 105, .72, .65) + cloud(1365, 152, 1.05, .74) + cloud(1720, 252, .58, .55);
  }

  function hills(p, horizon) {
    horizon = horizon || 500;
    return '<rect width="1920" height="1080" fill="url(#' + p + '-sky)"/>' +
      '<circle cx="1585" cy="232" r="84" fill="#fff1b9" opacity=".62"/><circle cx="1585" cy="232" r="112" fill="none" stroke="#fff2c8" stroke-width="3" opacity=".47"/>' +
      '<path d="M0 ' + (horizon + 72) + 'C168 ' + (horizon - 28) + ' 338 ' + (horizon + 4) + ' 524 ' + (horizon - 55) + 'C735 ' + (horizon - 123) + ' 866 ' + (horizon - 2) + ' 1074 ' + (horizon - 70) + 'C1270 ' + (horizon - 133) + ' 1450 ' + (horizon - 18) + ' 1668 ' + (horizon - 88) + 'C1770 ' + (horizon - 123) + ' 1851 ' + (horizon - 70) + ' 1920 ' + (horizon - 112) + 'V' + (horizon + 250) + 'H0Z" fill="#d5e2bd"/>' +
      '<path d="M0 ' + (horizon + 140) + 'C170 ' + (horizon + 36) + ' 330 ' + (horizon + 138) + ' 505 ' + (horizon + 58) + 'C706 ' + (horizon - 34) + ' 852 ' + (horizon + 93) + ' 1054 ' + (horizon + 20) + 'C1250 ' + (horizon - 42) + ' 1398 ' + (horizon + 103) + ' 1594 ' + (horizon + 33) + 'C1736 ' + (horizon - 18) + ' 1840 ' + (horizon + 12) + ' 1920 ' + (horizon - 14) + 'V' + (horizon + 310) + 'H0Z" fill="url(#' + p + '-hill)"/>' +
      '<path d="M0 ' + (horizon + 192) + 'C202 ' + (horizon + 133) + ' 379 ' + (horizon + 203) + ' 594 ' + (horizon + 137) + 'C796 ' + (horizon + 75) + ' 921 ' + (horizon + 195) + ' 1136 ' + (horizon + 132) + 'C1307 ' + (horizon + 82) + ' 1497 ' + (horizon + 189) + ' 1692 ' + (horizon + 132) + 'C1796 ' + (horizon + 102) + ' 1887 ' + (horizon + 150) + ' 1920 ' + (horizon + 137) + 'V' + (horizon + 340) + 'H0Z" fill="#74a278" opacity=".73"/>';
  }

  function tree(x, y, s, p, tint) {
    tint = tint || '#76a27a';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)">' +
      '<ellipse cx="62" cy="187" rx="55" ry="15" fill="#405650" opacity=".16"/>' +
      '<path d="M54 186V105q-16-10-27-29M62 129q17-22 25-47M62 153q-24-14-36-31" fill="none" stroke="#95664c" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M45 102C8 108-8 76 17 55 1 27 38 5 58 28 72-7 115 11 110 42c34 6 35 49 8 62 11 31-31 55-54 30-22 29-63 1-45-32 8 6 16 6 26 0Z" fill="' + tint + '" stroke="#405650" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M21 64q12-15 26-3M67 39q17-14 28 2M71 101q16 12 29 0M32 95q11 8 22-2" fill="none" stroke="#cbe0b4" stroke-width="5" stroke-linecap="round" opacity=".82"/>' +
      '<circle cx="39" cy="78" r="4" fill="#f1cc83" opacity=".75"/><circle cx="85" cy="65" r="4" fill="#f1cc83" opacity=".75"/>' +
      '</g>';
  }

  function pine(x, y, s, p) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><ellipse cx="45" cy="170" rx="43" ry="11" fill="#405650" opacity=".14"/><path d="M45 161V69" stroke="#8d624a" stroke-width="15" stroke-linecap="round"/><path d="M45 10 12 74h19L3 119h29L0 160h90l-32-41h29L59 74h19Z" fill="#4f7c68" stroke="#405650" stroke-width="4" stroke-linejoin="round"/><path d="M45 29v101M21 104h48M13 146h66" stroke="#86ad8d" stroke-width="4" opacity=".7"/></g>';
  }

  function flowers(x, y, count, scale) {
    var out = '<g transform="translate(' + x + ' ' + y + ') scale(' + (scale || 1) + ')">';
    var colors = ['#f1b6ad', '#fff1b8', '#cab9e0', '#f4d4a0', '#ffe3ee'];
    for (var i = 0; i < count; i++) {
      var px = (i * 47) % 310 + (i % 2) * 8;
      var py = (i * 29) % 72 + (i % 3) * 6;
      var col = colors[i % colors.length];
      out += '<path d="M' + px + ' ' + (py + 11) + 'v17" stroke="#5f9172" stroke-width="3" stroke-linecap="round"/><path d="M' + px + ' ' + py + 'c-13-14-23 7-9 12-14 10 4 23 10 10 8 13 24-2 11-10 12-7 4-26-9-12-1-4-2-5-3-7Z" fill="' + col + '" stroke="#405650" stroke-width="1.8"/><circle cx="' + px + '" cy="' + (py + 10) + '" r="3" fill="#e3ad63"/>';
    }
    return out + '</g>';
  }

  function fence(x, y, width, s) {
    s = s || 1;
    var rails = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" stroke-linecap="round" stroke-linejoin="round"><path d="M0 30H' + width + 'M0 59H' + width + '" stroke="#a27054" stroke-width="9"/>';
    for (var i = 0; i <= width; i += 54) rails += '<path d="M' + i + ' 76V10l10-13 10 13v66Z" fill="#d0a078" stroke="#405650" stroke-width="3"/>';
    return rails + '</g>';
  }

  function lamp(x, y, s, p) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><ellipse cx="32" cy="54" rx="58" ry="58" fill="url(#' + p + '-lamp)" opacity=".55"/><path d="M29 174V59q0-26 24-26h20" fill="none" stroke="#466659" stroke-width="9" stroke-linecap="round"/><path d="M52 31h45l-7 52H58Z" fill="#8e654e" stroke="#405650" stroke-width="4" stroke-linejoin="round"/><path d="M62 39h26v32H62Z" fill="#ffefad"/><path d="M19 175h24" stroke="#405650" stroke-width="9" stroke-linecap="round"/></g>';
  }

  function planter(x, y, s, p) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><path d="M9 60h85L82 112H20Z" fill="#d58e77" stroke="#405650" stroke-width="4" stroke-linejoin="round"/><path d="M17 60c-18-39 27-61 42-34 15-29 57-4 34 22 33 13 1 52-21 30-20 25-53 1-33-18-13 8-22 4-22 0Z" fill="#6f9c75" stroke="#405650" stroke-width="3"/><path d="M37 45q10-9 20 0M65 48q10-8 17 2" fill="none" stroke="#d7e6b9" stroke-width="4" stroke-linecap="round"/></g>';
  }

  function bench(x, y, s, p) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><path d="M7 53h145v21H7Z" fill="#bd865f" stroke="#405650" stroke-width="4"/><path d="M14 15h132v32H14Z" fill="#d5a175" stroke="#405650" stroke-width="4"/><path d="M30 74v36M132 74v36" stroke="#805440" stroke-width="8" stroke-linecap="round"/><path d="M22 26h116" stroke="#f0c28e" stroke-width="3" opacity=".7"/></g>';
  }

  function signpost(x, y, s, p) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><path d="M59 174V42" stroke="#86593f" stroke-width="14" stroke-linecap="round"/><path d="M56 50 5 31l15 42 36 1Z" fill="#d3a176" stroke="#405650" stroke-width="4" stroke-linejoin="round"/><path d="M63 84l70-22-18 42-52 7Z" fill="#c58a63" stroke="#405650" stroke-width="4" stroke-linejoin="round"/><path d="M51 119 13 139l27 20 19-19Z" fill="#dcb080" stroke="#405650" stroke-width="4" stroke-linejoin="round"/><circle cx="59" cy="48" r="4" fill="#f4d8a5"/><circle cx="63" cy="83" r="4" fill="#f4d8a5"/></g>';
  }

  function cottageBase(x, y, w, h, body, roofColor, p) {
    var door = x + w * .43;
    var windowW = Math.max(35, w * .17);
    return '<g filter="url(#' + p + '-shadow)"><ellipse cx="' + (x + w / 2) + '" cy="' + (y + h + 11) + '" rx="' + (w * .53) + '" ry="14" fill="#405650" opacity=".13"/><path d="M' + x + ' ' + (y + 54) + 'Q' + x + ' ' + (y + 37) + ' ' + (x + 17) + ' ' + (y + 37) + 'H' + (x + w - 17) + 'Q' + (x + w) + ' ' + (y + 37) + ' ' + (x + w) + ' ' + (y + 54) + 'V' + (y + h) + 'H' + x + 'Z" fill="' + body + '" stroke="#405650" stroke-width="5" stroke-linejoin="round"/><path d="M' + (x - 17) + ' ' + (y + 55) + 'L' + (x + w / 2) + ' ' + (y - 40) + 'L' + (x + w + 17) + ' ' + (y + 55) + 'Z" fill="' + roofColor + '" stroke="#405650" stroke-width="5" stroke-linejoin="round"/><path d="M' + (x + 14) + ' ' + (y + 52) + 'L' + (x + w / 2) + ' ' + (y - 24) + 'L' + (x + w - 14) + ' ' + (y + 52) + '" fill="none" stroke="#f6d7b0" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/><path d="M' + door + ' ' + (y + h) + 'v-70q0-22 ' + (w * .14) + '-22t' + (w * .14) + ' 22v70" fill="#936249" stroke="#405650" stroke-width="4"/><circle cx="' + (door + w * .22) + '" cy="' + (y + h - 34) + '" r="4" fill="#f5d484"/><path d="M' + (x + w * .13) + ' ' + (y + h * .45) + 'h' + windowW + 'v' + (h * .22) + 'h-' + windowW + 'ZM' + (x + w * .7) + ' ' + (y + h * .45) + 'h' + windowW + 'v' + (h * .22) + 'h-' + windowW + 'Z" fill="#bce0df" stroke="#405650" stroke-width="3"/><path d="M' + (x + w * .13 + windowW / 2) + ' ' + (y + h * .45) + 'v' + (h * .22) + 'M' + (x + w * .13) + ' ' + (y + h * .56) + 'h' + windowW + 'M' + (x + w * .7 + windowW / 2) + ' ' + (y + h * .45) + 'v' + (h * .22) + 'M' + (x + w * .7) + ' ' + (y + h * .56) + 'h' + windowW + '" stroke="#405650" stroke-width="2" opacity=".68"/><path d="M' + (x + 12) + ' ' + (y + h - 18) + 'q20-12 40 0M' + (x + w - 52) + ' ' + (y + h - 18) + 'q20-12 40 0" fill="none" stroke="#cf9c70" stroke-width="4" opacity=".65"/></g>';
  }

  function cottageDetail(x, y, w, h, roofColor, p) {
    var door = x + w * .43;
    var doorW = w * .28;
    var leftWindow = x + w * .13;
    var rightWindow = x + w * .7;
    var windowW = Math.max(35, w * .17);
    var windowY = y + h * .45;
    var windowH = h * .22;
    var hasIvy = roofColor === '#7b9c85' || roofColor === '#78a17d' || roofColor === '#7e9d8e' || roofColor === '#7f9d8d';
    var ivy = hasIvy ? '<path d="M' + (x + 20) + ' ' + (y + h - 21) + 'q-10-27 10-43t2-29M' + (x + 23) + ' ' + (y + h - 56) + 'q12-11 24 1M' + (x + 16) + ' ' + (y + h - 39) + 'q11-10 23 1" fill="none" stroke="#568060" stroke-width="5" stroke-linecap="round"/><path d="M' + (x + 23) + ' ' + (y + h - 82) + 'q-12-9-15 4 12 8 15-4ZM' + (x + 19) + ' ' + (y + h - 51) + 'q-12-9-15 4 12 8 15-4ZM' + (x + 36) + ' ' + (y + h - 62) + 'q10-10 15 2-9 8-15-2Z" fill="#83aa75" stroke="#405650" stroke-width="2"/>' : '';
    return '<path d="M' + (x + w * .72) + ' ' + (y - 23) + 'h' + (w * .12) + 'v' + (h * .34) + 'h-' + (w * .12) + 'Z" fill="#b97863" stroke="#405650" stroke-width="4" stroke-linejoin="round"/><path d="M' + (x + w * .71) + ' ' + (y - 22) + 'h' + (w * .14) + '" stroke="#f4c99c" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + (x + 19) + ' ' + (y + 48) + 'H' + (x + w - 19) + 'M' + (x + 38) + ' ' + (y + 30) + 'H' + (x + w - 38) + 'M' + (x + 61) + ' ' + (y + 11) + 'H' + (x + w - 61) + '" fill="none" stroke="#f4c99c" stroke-opacity=".48" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M' + (door + doorW / 2) + ' ' + (y + h - 87) + 'v' + (h * .34) + 'M' + (door + 9) + ' ' + (y + h - 49) + 'h' + (doorW - 18) + '" fill="none" stroke="#c58a62" stroke-width="3" opacity=".82"/><path d="M' + (door - 15) + ' ' + (y + h + 2) + 'h' + (doorW + 30) + 'l-10 13h-' + (doorW + 10) + 'Z" fill="#d7b080" stroke="#405650" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M' + (leftWindow - 7) + ' ' + (windowY + windowH - 4) + 'h' + (windowW + 14) + 'l-6 17h-' + windowW + 'Z M' + (rightWindow - 7) + ' ' + (windowY + windowH - 4) + 'h' + (windowW + 14) + 'l-6 17h-' + windowW + 'Z" fill="#bd805f" stroke="#405650" stroke-width="2"/><path d="M' + (leftWindow + 4) + ' ' + (windowY + windowH + 1) + 'q8-13 15 0q9-14 17 0 M' + (rightWindow + 4) + ' ' + (windowY + windowH + 1) + 'q8-13 15 0q9-14 17 0" fill="none" stroke="#6b966c" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M' + (door + doorW / 2) + ' ' + (y + h - 97) + 'v-13M' + (door + doorW / 2 - 11) + ' ' + (y + h - 109) + 'q11-10 22 0l-4 17h-14Z" fill="#d98c67" stroke="#405650" stroke-width="3" stroke-linejoin="round"/><path d="M' + (door + doorW / 2 - 5) + ' ' + (y + h - 101) + 'h10" stroke="#fff0a7" stroke-width="4" stroke-linecap="round"/>' + ivy;
  }

  function cottage(x, y, w, h, body, roofColor, p) {
    return cottageBase(x, y, w, h, body, roofColor, p).replace('</g>', cottageDetail(x, y, w, h, roofColor, p) + '</g>');
  }

  function entrance() {
    var p = 'entrance-v2';
    return svg(defs(p) + hills(p, 438) + cloudBank() +
      '<path d="M0 696C220 644 377 711 555 666c190-49 312 24 492-35 204-67 342 31 532-31 150-49 240 1 341-35v215H0Z" fill="url(#' + p + '-grass)"/>' +
      '<path d="M0 794C230 749 432 794 618 763c185-30 289-4 413-55 126-51 311 35 447 1 149-37 282 3 442-31V1080H0Z" fill="#78a27c"/>' +
      '<path d="M783 1080C806 927 842 853 908 787c49-50 26-106-30-151-39-31-35-58-2-83h164c30 29 37 61-6 89-62 42-72 98-28 140 74 71 121 159 137 298Z" fill="#d6b47d" stroke="#b38a62" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M835 973c74-19 141-15 227 5M838 893c68-16 133-13 211 5M857 816c54-10 102-6 163 7" fill="none" stroke="#eddbab" stroke-width="8" opacity=".75"/>' +
      cottage(205, 406, 260, 230, '#fff0da', '#d88772', p) + cottage(505, 452, 215, 190, '#f4c7b4', '#78a17d', p) + cottage(1288, 425, 246, 223, '#fff7e9', '#7e9d8e', p) + cottage(1532, 473, 192, 173, '#f2cbb5', '#d88875', p) +
      tree(48, 444, 1.32, p) + pine(169, 463, .96, p) + tree(1730, 432, 1.3, p, '#6f9875') + pine(1635, 496, .9, p) +
      fence(36, 657, 348, .9) + fence(1504, 661, 360, .9) + signpost(644, 593, .92, p) + lamp(404, 570, .82, p) + lamp(1486, 565, .82, p) +
      planter(246, 643, .72, p) + planter(1590, 640, .72, p) + flowers(360, 663, 12, 1.02) + flowers(1285, 661, 13, 1.06) + flowers(75, 704, 9, .92) + flowers(1694, 699, 9, .92) +
      '<g opacity=".82"><path d="M540 603q70-31 139 0" fill="none" stroke="#efd7ab" stroke-width="5" stroke-linecap="round"/><path d="M1230 600q74-30 142 0" fill="none" stroke="#efd7ab" stroke-width="5" stroke-linecap="round"/></g>' + texture(p), 'Pastel village entrance');
  }

  function plazaFloor(p) {
    var rows = '';
    for (var row = 0; row < 10; row++) {
      var y = 552 + row * 37;
      var offset = y - 725;
      var half = Math.max(260, Math.sqrt(Math.max(0, 1 - (offset * offset) / (211 * 211))) * 830);
      var left = 960 - half;
      var right = 960 + half;
      var curve = offset < 0 ? 10 : -10;
      rows += '<path d="M' + left.toFixed(1) + ' ' + y + 'Q960 ' + (y + curve) + ' ' + right.toFixed(1) + ' ' + y + '"/>';
      for (var seam = left + 32 + (row % 2) * 22; seam < right - 20; seam += 57) rows += '<path d="M' + seam.toFixed(1) + ' ' + (y - 14) + 'v28"/>';
    }
    return '<g><ellipse cx="960" cy="725" rx="882" ry="246" fill="#a89682" opacity=".58"/><ellipse cx="960" cy="725" rx="860" ry="230" fill="url(#' + p + '-stone)" stroke="#8d7c6d" stroke-width="7"/><ellipse cx="960" cy="725" rx="842" ry="211" fill="#decdb2" stroke="#f5e8cf" stroke-width="8"/><ellipse cx="960" cy="725" rx="842" ry="211" fill="url(#' + p + '-cobble)" opacity=".6"/><g clip-path="url(#' + p + '-plaza-clip)" fill="none" stroke="#aa9782" stroke-width="3" opacity=".72">' + rows + '</g><ellipse cx="960" cy="725" rx="860" ry="230" fill="none" stroke="#eadbc0" stroke-width="3" opacity=".8"/></g>';
  }

  function distantPlazaTrees() {
    return '<g opacity=".78"><path d="M0 537q28-72 64 0 31-100 72-8 42-86 80 8 33-62 67 0v27H0Z" fill="#638d71"/><path d="M245 538q30-72 68 0 33-93 73-5 43-74 76 5 34-51 61 0v22H245Z" fill="#7ca47b"/><path d="M465 540q25-85 62 0 29-105 70-6 40-92 76 5 31-70 66 0 34-97 75-4 38-76 72 4 34-99 76-3 40-80 73 4 32-65 65 0v18H465Z" fill="#769d78"/><path d="M506 540q23-61 53 0 27-77 62-4 34-66 65 4 27-55 59 0 31-71 65-3 33-58 62 3 29-72 66-2 31-57 59 2 27-54 57 0v15H506Z" fill="#89ab7d" opacity=".62"/><path d="M1390 540q25-75 62-2 31-98 72-6 40-82 78 6 35-62 70 0v24h-282Z" fill="#739c77"/><path d="M1650 540q27-72 63-3 34-101 77-7 39-86 81 8 28-51 49 0v25h-270Z" fill="#5f896d"/><path d="M0 527q82-47 162 1t154-4M485 530q78-40 155 2t159-3 156 2 149-5M1388 530q74-44 146 0t176-8" fill="none" stroke="#c5dca8" stroke-width="8" opacity=".5" stroke-linecap="round"/></g>';
  }

  function bulletinBoard(x, y, s, p) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><path d="M21 181V42h129v139M11 184h152" fill="none" stroke="#805846" stroke-width="12" stroke-linecap="round"/><rect x="8" y="7" width="155" height="116" rx="8" fill="#b98462" stroke="#405650" stroke-width="5"/><rect x="20" y="18" width="131" height="93" rx="4" fill="#d6b48b" stroke="#765447" stroke-width="3"/><rect x="30" y="27" width="47" height="33" rx="2" fill="#fff8e8" stroke="#a77861" stroke-width="2"/><rect x="91" y="28" width="47" height="40" rx="2" fill="#fffaf0" stroke="#a77861" stroke-width="2" transform="rotate(3 114 48)"/><rect x="45" y="72" width="70" height="27" rx="2" fill="#fff5df" stroke="#a77861" stroke-width="2" transform="rotate(-2 80 85)"/><circle cx="36" cy="31" r="4" fill="#d88772"/><circle cx="129" cy="34" r="4" fill="#7b9d85"/><circle cx="104" cy="76" r="4" fill="#e2ba68"/></g>';
  }

  function hedge(x, y, w, s, p) {
    var leaves = '';
    for (var i = 0; i <= w; i += 27) leaves += '<circle cx="' + (i + 12) + '" cy="29" r="22"/><circle cx="' + (i + 25) + '" cy="35" r="18" fill="#6e9773"/>';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')" filter="url(#' + p + '-shadow)" fill="#5f8e6d"><path d="M4 48h' + (w + 28) + 'v18H4Z" fill="#75946e" stroke="#405650" stroke-width="3"/>' + leaves + '<path d="M13 45q18-11 35 0M68 45q18-11 35 0M123 45q18-11 35 0M178 45q18-11 35 0" fill="none" stroke="#c5dca8" stroke-width="4" opacity=".7" stroke-linecap="round"/></g>';
  }

  function plaza() {
    var p = 'plaza-v2';
    return svg(defs(p) + hills(p, 392) + cloudBank() +
      '<path d="M0 627C221 572 401 628 588 581c186-47 393 23 582-28 167-45 324 13 503-28 84-19 173-20 247-35v560H0Z" fill="url(#' + p + '-grass)"/>' +
      plazaFloor(p) + distantPlazaTrees() +
      cottage(115, 387, 243, 214, '#fff4e3', '#7b9c85', p) + cottage(386, 426, 218, 190, '#f5c9b6', '#d88973', p) + cottage(1305, 402, 253, 216, '#fff1da', '#d78871', p) + cottage(1584, 448, 201, 172, '#f4c7b2', '#7f9d8d', p) +
      tree(6, 424, 1.18, p) + tree(315, 462, .77, p, '#6f9a75') + tree(1742, 426, 1.13, p) + tree(1510, 482, .74, p, '#739c78') + bulletinBoard(650, 470, .78, p) +
      lamp(210, 534, .75, p) + lamp(1660, 540, .75, p) + bench(80, 590, .8, p) + bench(1690, 590, .76, p) + planter(450, 598, .62, p) + planter(1402, 598, .62, p) +
      '<g filter="url(#' + p + '-shadow)"><ellipse cx="960" cy="756" rx="154" ry="37" fill="#9a8c7e" opacity=".27"/><path d="M848 748q9-42 36-53h152q26 11 36 53l-20 28H868Z" fill="url(#' + p + '-stone)" stroke="#405650" stroke-width="5" stroke-linejoin="round"/><path d="M881 695q13-43 79-43t79 43Z" fill="#ece4d5" stroke="#405650" stroke-width="5"/><ellipse cx="960" cy="652" rx="76" ry="17" fill="#faf5ea" stroke="#405650" stroke-width="4"/><path d="M894 731q65 17 132 0" fill="none" stroke="#a99a89" stroke-width="4" opacity=".65"/></g>' +
      '<g opacity=".93">' + hedge(12, 648, 190, .78, p) + hedge(1688, 648, 190, .78, p) + planter(250, 640, .54, p) + planter(1605, 640, .54, p) + flowers(250, 655, 15, 1) + flowers(1420, 652, 16, 1.02) + flowers(565, 715, 9, .84) + flowers(1200, 713, 9, .84) + fence(0, 697, 205, .76) + fence(1713, 698, 206, .76) + '</g>' + texture(p), 'Warm cobblestone village plaza');
  }

  function archedWindow(x, y, w, h, p) {
    return '<g filter="url(#' + p + '-shadow)"><path d="M' + x + ' ' + (y + h) + 'V' + (y + w / 2) + 'a' + (w / 2) + ' ' + (w / 2) + ' 0 0 1 ' + w + ' 0v' + (h - w / 2) + 'Z" fill="url(#' + p + '-glass)" stroke="#634a40" stroke-width="8"/><path d="M' + (x + w / 2) + ' ' + (y + 9) + 'v' + (h - 9) + 'M' + (x + 4) + ' ' + (y + w / 2 + 32) + 'h' + (w - 8) + '" stroke="#765649" stroke-width="5" opacity=".82"/><path d="M' + (x + 13) + ' ' + (y + h - 38) + 'q35-44 73-18t' + (w - 86) + ' -20v58H' + (x + 13) + 'Z" fill="#88af88" opacity=".72"/><path d="M' + (x + 19) + ' ' + (y + 52) + 'q46-41 82 7" fill="none" stroke="#fffdf5" stroke-width="8" opacity=".62" stroke-linecap="round"/></g>';
  }

  function bookshelf(x, y, w, h, p) {
    var out = '<g filter="url(#' + p + '-shadow)"><path d="M' + x + ' ' + y + 'h' + w + 'v' + h + 'H' + x + 'Z" fill="url(#' + p + '-wood)" stroke="#5c443d" stroke-width="7"/><path d="M' + (x + 14) + ' ' + (y + 61) + 'H' + (x + w - 14) + 'M' + (x + 14) + ' ' + (y + 132) + 'H' + (x + w - 14) + 'M' + (x + 14) + ' ' + (y + 203) + 'H' + (x + w - 14) + '" stroke="#5c443d" stroke-width="6"/>';
    var colors = ['#e8b081', '#94af9a', '#e1c783', '#d08a79', '#b7bed3', '#f4dfbd'];
    for (var row = 0; row < 3; row++) {
      for (var i = 0; i < 7; i++) {
        var bw = 16 + ((i * 7 + row * 3) % 12);
        var bx = x + 19 + i * (w - 42) / 7;
        var by = y + 56 + row * 71;
        var bh = 36 + ((i + row) % 3) * 7;
        out += '<rect x="' + bx + '" y="' + (by - bh) + '" width="' + bw + '" height="' + bh + '" rx="2" fill="' + colors[(i + row) % colors.length] + '" stroke="#654a40" stroke-width="1.5" transform="rotate(' + ((i % 3 - 1) * 3) + ' ' + bx + ' ' + by + ')"/>';
      }
    }
    return out + '<path d="M' + (x + w * .72) + ' ' + (y + 42) + 'c-13-31 22-45 33-18 12-26 44-7 28 15 21 9 3 33-15 19-15 16-35 0-22-16-8 5-13 2-13 0Z" fill="#6f9c75" stroke="#405650" stroke-width="3"/></g>';
  }

  function hangingLamp(x, y, s, p) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><path d="M46 0v49" stroke="#61463b" stroke-width="5"/><ellipse cx="46" cy="72" rx="56" ry="35" fill="url(#' + p + '-lamp)" opacity=".6"/><path d="M13 57q33-33 66 0l-8 31H21Z" fill="#d58667" stroke="#5f453b" stroke-width="4"/><path d="M25 84h42" stroke="#ffedab" stroke-width="8" stroke-linecap="round"/></g>';
  }

  function tea() {
    var p = 'tea-v2';
    return svg(defs(p) +
      '<rect width="1920" height="1080" fill="#e6c5a5"/><path d="M0 100H1920V477H0Z" fill="#f4d5bd"/><path d="M0 100H1920V477H0Z" fill="url(#' + p + '-wallpaper)" opacity=".72"/>' +
      '<path d="M0 101H1920M0 474H1920" stroke="#805a49" stroke-width="13"/><path d="M0 478H1920V735H0Z" fill="url(#' + p + '-wood)"/><path d="M0 478H1920V735H0Z" fill="url(#' + p + '-woodgrain)" opacity=".6"/>' +
      '<path d="M0 728C339 682 609 750 952 704c333-45 633 23 968-27v403H0Z" fill="#b57e61"/><path d="M0 728C339 682 609 750 952 704c333-45 633 23 968-27" fill="none" stroke="#6e4b3d" stroke-width="8"/><path d="M0 835q310-44 633-7t647-13q318-31 640-4M0 957q326-46 629-7t657-15q305-26 634-1" fill="none" stroke="#d9a780" stroke-width="6" opacity=".46"/>' +
      archedWindow(172, 194, 290, 347, p) +
      '<g filter="url(#' + p + '-shadow)"><path d="M507 550h390v105H507Z" fill="#9a7053" stroke="#5c443d" stroke-width="6"/><path d="M531 578h342v42H531Z" fill="#d7a879" stroke="#5c443d" stroke-width="4"/><path d="M552 581q-17-49 26-56 26-43 54 5 42-25 58 14 35-29 63 11 31-17 45 26Z" fill="#789e78" stroke="#405650" stroke-width="4"/><path d="M780 570v-62h73v62" fill="#e6b18d" stroke="#5c443d" stroke-width="5"/><ellipse cx="816" cy="507" rx="42" ry="12" fill="#f8f1e4" stroke="#5c443d" stroke-width="4"/><path d="M789 503q27-24 53 0" fill="#f1c189" stroke="#5c443d" stroke-width="3"/></g>' +
      bookshelf(1475, 202, 286, 389, p) + bookshelf(1080, 290, 202, 267, p) +
      '<g filter="url(#' + p + '-shadow)"><path d="M126 611h258l-22 95H147Z" fill="#cf8f76" stroke="#5d443a" stroke-width="5"/><path d="M151 612c-12-41 31-61 46-25 13-39 57-30 50 6 38-14 54 28 21 44 9 36-35 43-47 17-25 26-62 5-42-23-14 9-28 2-28-20Z" fill="#719b78" stroke="#405650" stroke-width="4"/><path d="M167 586q14-14 26 1M226 576q15-11 26 4" fill="none" stroke="#d4e2bd" stroke-width="4"/></g>' +
      hangingLamp(625, 111, 1, p) + hangingLamp(971, 93, 1.14, p) + hangingLamp(1330, 119, .94, p) +
      '<g opacity=".87"><path d="M664 215v77M689 223v64M714 214v78" stroke="#6d965f" stroke-width="8" stroke-linecap="round"/><path d="M664 244q-26-20-2-39M690 246q29-23 7-42M712 245q-23-18-1-40" fill="none" stroke="#86ad8d" stroke-width="8" stroke-linecap="round"/></g>' +
      planter(97, 651, .92, p) + planter(1770, 648, .88, p) + flowers(370, 667, 9, .76) + flowers(1375, 670, 9, .76) + texture(p, .34), 'Cozy warm tea room');
  }

  function wallClock(x, y, s, p) {
    var ticks = '';
    for (var i = 0; i < 12; i++) {
      var angle = i * 30;
      ticks += '<path d="M0 -58v9" transform="rotate(' + angle + ')" stroke="#765548" stroke-width="4" stroke-linecap="round"/>';
    }
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" filter="url(#' + p + '-shadow)"><circle r="81" fill="#f7edda" stroke="#695048" stroke-width="8"/><circle r="67" fill="none" stroke="#d39777" stroke-width="4"/>' + ticks + '<g class="wall-clock-hand"><path d="M0 0V-37L31-16" fill="none" stroke="#405650" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g><circle r="7" fill="#d48769"/></g>';
  }

  function balconyDoor(x, y, w, h, p) {
    var half = w / 2;
    return '<g filter="url(#' + p + '-shadow)"><path d="M' + x + ' ' + (y + h) + 'V' + (y + 45) + 'q0-45 45-45h' + (w - 90) + 'q45 0 45 45v' + (h - 45) + 'Z" fill="#f7ead9" stroke="#654a43" stroke-width="8"/><g class="balcony-door-panel-left"><path d="M' + (x + 15) + ' ' + (y + h - 13) + 'V' + (y + 53) + 'q0-24 25-24h' + (half - 40) + 'v' + (h - 29) + 'Z" fill="url(#' + p + '-glass)" stroke="#76584b" stroke-width="5"/><path d="M' + (x + 20) + ' ' + (y + 193) + 'h' + (half - 50) + 'M' + (x + half - 25) + ' ' + (y + 36) + 'v' + (h - 58) + '" stroke="#76584b" stroke-width="4" opacity=".8"/></g><g class="balcony-door-panel-right"><path d="M' + (x + half) + ' ' + (y + h - 13) + 'V' + (y + 29) + 'h' + (half - 40) + 'q25 0 25 24v' + (h - 66) + 'Z" fill="url(#' + p + '-glass)" stroke="#76584b" stroke-width="5"/><path d="M' + (x + half) + ' ' + (y + 193) + 'h' + (half - 50) + 'M' + (x + half + 25) + ' ' + (y + 36) + 'v' + (h - 58) + '" stroke="#76584b" stroke-width="4" opacity=".8"/></g><circle cx="' + (x + half - 18) + '" cy="' + (y + h * .55) + '" r="6" fill="#e6bf70"/><circle cx="' + (x + half + 18) + '" cy="' + (y + h * .55) + '" r="6" fill="#e6bf70"/><path d="M' + (x + 22) + ' ' + (y + 92) + 'q' + (w * .18) + ' -32 ' + (w * .33) + ' -4M' + (x + w * .57) + ' ' + (y + 75) + 'q' + (w * .16) + ' -28 ' + (w * .28) + ' -2" fill="none" stroke="#fffdf9" stroke-width="7" opacity=".58" stroke-linecap="round"/></g>';
  }

  function meeting() {
    var p = 'meeting-v2';
    return svg(defs(p) +
      '<rect width="1920" height="1080" fill="#deb993"/><path d="M0 100H1920V652H0Z" fill="#f2d7b5"/><path d="M0 100H1920V652H0Z" fill="url(#' + p + '-wallpaper)" opacity=".42"/><path d="M0 100H1920M0 649H1920" stroke="#765549" stroke-width="13"/>' +
      '<path d="M0 650H1920V1080H0Z" fill="#a76e52"/><path d="M0 650H1920V1080H0Z" fill="url(#' + p + '-woodgrain)" opacity=".62"/><path d="M0 702H1920M0 835H1920M0 969H1920" stroke="#d9a174" stroke-width="6" opacity=".45"/><path d="M180 650v430M470 650v430M760 650v430M1050 650v430M1340 650v430M1630 650v430" stroke="#754e40" stroke-width="5" opacity=".36"/>' +
      '<g filter="url(#' + p + '-shadow)"><rect x="650" y="165" width="620" height="230" rx="18" fill="#f9f3e8" stroke="#624942" stroke-width="10"/><rect x="672" y="188" width="576" height="184" rx="8" fill="#c5dfdd"/><path d="M692 335q99-89 188-37t165-35q95-59 184 28v61H692Z" fill="#afd09d" opacity=".54"/><path d="M692 340q100-47 193-12t165-32q95-42 179-8" fill="none" stroke="#fffdf5" stroke-width="8" opacity=".62"/><path d="M934 395h54l18 39h-90Z" fill="#745246" stroke="#543e38" stroke-width="6"/><path d="M854 436h212" stroke="#765447" stroke-width="9" stroke-linecap="round"/></g>' +
      bookshelf(82, 214, 259, 367, p) +
      '<g filter="url(#' + p + '-shadow)"><path d="M364 506h178v104H364Z" fill="#c89169" stroke="#65483e" stroke-width="6"/><path d="M383 533h140M383 565h140" stroke="#edc38f" stroke-width="5" opacity=".7"/><path d="M399 505v-86M439 505v-113M479 505v-67" stroke="#8c6250" stroke-width="8"/><rect x="385" y="392" width="28" height="26" rx="3" fill="#d7e2bc" stroke="#65483e" stroke-width="3"/><rect x="428" y="360" width="25" height="32" rx="3" fill="#e9b07e" stroke="#65483e" stroke-width="3"/></g>' +
      wallClock(270, 240, 1, p) + balconyDoor(1455, 187, 352, 450, p) +
      '<g opacity=".85"><path d="M1331 641h490" stroke="#c9936b" stroke-width="11" stroke-linecap="round"/><path d="M1360 643l-27 92M1772 643l29 92" stroke="#815646" stroke-width="10" stroke-linecap="round"/></g>' +
      '<g filter="url(#' + p + '-shadow)"><path d="M534 603h154l-16 72H550Z" fill="#d58e77" stroke="#5d443a" stroke-width="5"/><path d="M546 603c-15-42 25-60 43-27 8-35 53-28 48 5 35-14 49 24 20 39 5 31-34 37-45 15-23 18-52 1-34-22-15 8-28 4-32-10Z" fill="#719b78" stroke="#405650" stroke-width="4"/></g>' +
      hangingLamp(786, 100, .85, p) + hangingLamp(1145, 104, .85, p) + texture(p, .31), 'Warm meeting room with blank screen');
  }

  function balcony() {
    var p = 'balcony-v2';
    return svg(defs(p) + hills(p, 415) + cloudBank() +
      '<path d="M0 672C218 610 436 679 627 620c170-53 381 25 569-26 171-47 300 19 480-23 80-19 157-20 244-39v260H0Z" fill="url(#' + p + '-grass)" opacity=".9"/>' +
      '<g opacity=".9"><path d="M689 559h116v114H689Z" fill="#f5d8a8" stroke="#6e7160" stroke-width="4"/><path d="M820 520h129v153H820Z" fill="#e8b58e" stroke="#6e7160" stroke-width="4"/><path d="M965 572h108v101H965Z" fill="#c3dcae" stroke="#6e7160" stroke-width="4"/><path d="M1100 504h152v169h-152Z" fill="#f6dfba" stroke="#6e7160" stroke-width="4"/><path d="M705 547l42-40 44 40M840 508l45-42 47 42M1120 492l56-49 57 49" fill="#d9866c" stroke="#6e7160" stroke-width="4"/></g>' +
      '<g fill="#f2e8d4" stroke="#405650" stroke-width="8"><path d="M0 82H334V742H0Z"/><path d="M1586 82H1920V742H1586Z"/></g><path d="M300 82h96v660h-96ZM1524 82h96v660h-96Z" fill="#d8b69b" stroke="#6e5145" stroke-width="6"/><path d="M25 165h260M25 278h260M1635 165h260M1635 278h260" stroke="#e7c9ae" stroke-width="8" opacity=".66"/>' +
      '<path d="M374 82v665M460 82v665M1460 82v665M1546 82v665" stroke="#76574b" stroke-width="10" opacity=".9"/>' +
      '<path class="breeze" d="M480 269c112-49 166 28 275-7s153 22 273-10 175 16 314-20" fill="none" stroke="#fffdf7" stroke-width="17" stroke-linecap="round" opacity=".72"/><path class="breeze" d="M530 354c121-37 177 18 303-10 105-24 211 10 320-19s161 13 241-9" fill="none" stroke="#cae6df" stroke-width="10" stroke-linecap="round" opacity=".9"/>' +
      '<g filter="url(#' + p + '-shadow)"><path d="M314 708H1606V778H314Z" fill="#e7dbc6" stroke="#405650" stroke-width="7"/><path d="M350 749v130M485 749v130M620 749v130M755 749v130M890 749v130M1025 749v130M1160 749v130M1295 749v130M1430 749v130M1565 749v130" stroke="#405650" stroke-width="7"/><path d="M314 879H1606" stroke="#405650" stroke-width="8"/></g>' +
      '<path d="M0 881C302 836 625 900 956 862c346-40 655 8 964-29v247H0Z" fill="#d8b695"/><path d="M0 936q324-38 642-9t645-15q301-29 633-2M0 1020q311-40 635-8t657-13q302-31 628-1" fill="none" stroke="#b58469" stroke-width="7" opacity=".52"/>' +
      planter(194, 713, 1.05, p) + planter(1631, 716, 1.04, p) + tree(303, 567, .63, p, '#739e7a') + tree(1499, 574, .62, p, '#739e7a') + flowers(446, 710, 10, .82) + flowers(1320, 708, 10, .82) + texture(p), 'Open balcony overlooking a pastel town');
  }

  function mapZone(x, y, type, p) {
    var mark = '';
    if (type === 'plaza') mark = '<circle cx="0" cy="0" r="37" fill="#f5e6c9" stroke="#6c7864" stroke-width="5"/><circle cx="0" cy="0" r="15" fill="#b6d7d0" stroke="#6c7864" stroke-width="4"/><path d="M0-35v70M-35 0h70" stroke="#d5ab8d" stroke-width="4" opacity=".8"/>';
    if (type === 'tea') mark = '<path d="M-43 22V-14q0-28 25-28h36q25 0 25 28v36Z" fill="#f8edd6" stroke="#6c7864" stroke-width="5"/><path d="M-52-12 0-54 52-12" fill="#d88970" stroke="#6c7864" stroke-width="5"/><path d="M-14 7h28v20h-28Z" fill="#aad4d4" stroke="#6c7864" stroke-width="3"/>';
    if (type === 'meeting') mark = '<rect x="-44" y="-34" width="88" height="62" rx="7" fill="#eae4d5" stroke="#6c7864" stroke-width="5"/><rect x="-31" y="-23" width="62" height="33" rx="3" fill="#b5d8d3"/><path d="M-13 28h26l10 19h-46Z" fill="#96705a" stroke="#6c7864" stroke-width="4"/>';
    if (type === 'balcony') mark = '<path d="M-48-38H48V37H-48Z" fill="#c8e6e1" stroke="#6c7864" stroke-width="5"/><path d="M-30-38v75M0-38v75M30-38v75M-52 37H52" stroke="#a7775e" stroke-width="5"/><path d="M-51 6q24-17 47 0t48 0" fill="none" stroke="#fffdf5" stroke-width="6"/>';
    return '<g transform="translate(' + x + ' ' + y + ')" filter="url(#' + p + '-shadow)"><ellipse cx="0" cy="42" rx="67" ry="19" fill="#557d65" opacity=".2"/>' + mark + '</g>';
  }

  function map() {
    var p = 'map-v2';
    return svg(defs(p) +
      '<rect width="1920" height="1080" fill="#cde3dc"/><path d="M0 100H1920V1080H0Z" fill="#a9cfc4"/><path d="M0 126q182-54 353 0t359-6q183-55 367 8t361-8q199-58 380 6v954H0Z" fill="#93c3b5" opacity=".57"/>' +
      '<path d="M150 273C286 168 472 181 590 247c129 72 171 79 285 23 140-69 272-85 393-2 102 69 191 56 289-6 110-70 214-55 302 35 88 90 79 237 12 359-80 147-41 276-173 334-118 52-236-41-361-21-137 22-214 85-350 48-124-34-163-127-306-112-128 13-197-50-290-137-118-110-145-325-41-495Z" fill="#b8d998" stroke="#72986f" stroke-width="10"/>' +
      '<path d="M264 315C358 248 467 251 553 301c91 53 154 77 255 36 131-53 253-78 352-12 84 57 159 57 244 6 86-51 190-47 260 21 75 74 63 174 12 253-61 95-45 203-119 279-84 86-183 26-278 45-125 25-218 86-329 54-108-31-149-112-259-103-100 8-162-51-241-122-102-91-125-255-62-416Z" fill="#d2e8b2" opacity=".76"/>' +
      '<path d="M275 639c97-94 205-80 287-6 89 80 170 69 254-1 100-83 198-106 312-42 97 55 185 40 260-27 88-79 183-71 263 8" fill="none" stroke="#dfc187" stroke-width="37" stroke-linecap="round"/><path d="M301 629c93-83 188-70 264-2 85 76 167 65 245-1 98-83 205-101 313-39 99 57 182 39 252-24 86-78 170-71 241-4" fill="none" stroke="#f5e1ac" stroke-width="19" stroke-linecap="round"/>' +
      '<path d="M637 310c35 77 28 137-26 191M1102 303c-32 79-20 139 36 201M1464 367c-39 70-34 127 11 188" fill="none" stroke="#f3dfa9" stroke-width="17" stroke-linecap="round"/>' +
      '<path d="M637 310c35 77 28 137-26 191M1102 303c-32 79-20 139 36 201M1464 367c-39 70-34 127 11 188" fill="none" stroke="#d2b67d" stroke-width="31" stroke-linecap="round" opacity=".45"/>' +
      '<g opacity=".82"><path d="M369 445q63-90 128-32t106-14M1275 783q64-93 131-32t102-20" fill="none" stroke="#78a88a" stroke-width="44" stroke-linecap="round"/><path d="M369 445q63-90 128-32t106-14M1275 783q64-93 131-32t102-20" fill="none" stroke="#b7d793" stroke-width="28" stroke-linecap="round"/></g>' +
      mapZone(488, 446, 'plaza', p) + mapZone(796, 657, 'tea', p) + mapZone(1188, 411, 'meeting', p) + mapZone(1455, 659, 'balcony', p) +
      '<g opacity=".9">' + tree(242, 305, .58, p) + tree(174, 692, .55, p, '#6f9b75') + tree(1580, 302, .57, p) + tree(1650, 786, .55, p, '#709b78') + flowers(341, 759, 12, .75) + flowers(1514, 424, 12, .75) + flowers(922, 296, 9, .7) + '</g>' +
      '<path d="M150 273C286 168 472 181 590 247c129 72 171 79 285 23 140-69 272-85 393-2 102 69 191 56 289-6 110-70 214-55 302 35" fill="none" stroke="#eef5da" stroke-width="7" opacity=".8" stroke-dasharray="4 19" stroke-linecap="round"/>' + texture(p, .29), 'Birdseye island map with four unlabelled places');
  }

  function iconWrap(content, label) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" role="img" aria-label="' + esc(label) + '"><g fill="none" stroke="#405650" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">' + content + '</g></svg>';
  }

  function pieSlices() {
    var colors = ['#deb274', '#d7a164', '#e5bd85', '#d4a064', '#e2b77b', '#dbaa6c', '#e5bd85', '#dca96b'];
    var out = '<g class="pie-whole" transform="translate(0 30) scale(1 .8)">';
    for (var i = 0; i < 8; i++) {
      var a0 = -Math.PI / 2 + i * Math.PI / 4;
      var a1 = a0 + Math.PI / 4;
      var x0 = (150 + 108 * Math.cos(a0)).toFixed(2);
      var y0 = (150 + 108 * Math.sin(a0)).toFixed(2);
      var x1 = (150 + 108 * Math.cos(a1)).toFixed(2);
      var y1 = (150 + 108 * Math.sin(a1)).toFixed(2);
      var special = i === 1 ? ' pie-retained' : ' pie-taken';
      out += '<path class="pie-slice pie-slice-' + (i + 1) + special + '" d="M150 150 L' + x0 + ' ' + y0 + ' A108 108 0 0 1 ' + x1 + ' ' + y1 + ' Z" fill="' + colors[i] + '" stroke="#fffaf0" stroke-width="5"/>';
    }
    return out + '<circle cx="150" cy="150" r="108" fill="none" stroke="#405650" stroke-width="9"/><circle cx="150" cy="150" r="8" fill="#fffaf0" stroke="#405650" stroke-width="4"/></g>';
  }

  function prop(name, opts) {
    opts = opts || {};
    var n = String(name || '').toLowerCase();
    var draw = {
      lock: function () { return '<rect x="67" y="132" width="166" height="113" rx="25" fill="#e9a48f"/><path d="M105 132V94c0-65 90-65 90 0v38"/><circle cx="150" cy="181" r="13" fill="#fffdf7"/><path d="M150 194v21"/>'; },
      medal: function () { return '<path d="M91 39h56l4 82-56 37-28-81Z" fill="#b8d9df"/><path d="M154 39h55l-5 82-55 37-24-37Z" fill="#86ad8d"/><circle cx="150" cy="181" r="66" fill="#f1c36e"/><path d="m150 139 12 25 28 4-20 20 5 28-25-14-25 14 5-28-20-20 28-4Z" fill="#fffdf7"/>'; },
      flower: function () { return '<path d="M150 261v-80M150 211l-35-28M150 229l38-29" stroke="#5f9172"/><circle cx="150" cy="113" r="23" fill="#e3ad63"/><path d="M150 89c-58-66-99 22-46 38-72 38-2 99 27 50 19 73 99 24 53-12 76-17 25-101-18-57-1-24-8-19-16-19Z" fill="#eeb7ae"/>'; },
      pie: function () { return pieSlices(); },
      'pie8-slices': function () { return pieSlices(); },
      clock: function () { return '<circle cx="150" cy="159" r="92" fill="#fffdf7"/><path d="M115 39h70M150 67V45"/><path class="clock-hand" d="M150 112v50l37 27"/><circle cx="150" cy="159" r="8" fill="#e9a48f"/><path d="M150 77v9M197 91l-6 7M221 138h-9M103 91l6 7M79 138h9" stroke-width="7"/>'; },
      stamp: function () { return '<path d="M114 55h72v40l-14 47h-44l-14-47Z" fill="#d09b76"/><path d="M99 144h102l29 41v37H70v-37Z" fill="#bf7965"/><path d="M70 226h160v18H70Z" fill="#a96a56"/><path d="M123 69h54" stroke="#edc2a0"/>'; },
      heart: function () { return '<path d="M150 248C55 180 52 93 105 68c35-17 62 7 45 34 18-27 45-51 80-34 53 25 50 112-80 180Z" fill="#eeb2a9"/><path d="M93 104q17-24 39-10" stroke="#fffdf7" opacity=".8"/>'; },
      star: function () { return '<path d="m150 38 29 73 78 5-60 50 19 77-66-42-66 42 19-77-60-50 78-5Z" fill="#f1c36e"/><path d="m150 74 18 45" stroke="#fffdf7" opacity=".9"/>'; },
      teacup: function () { return '<path d="M70 111h126v72c0 53-126 53-126 0Z" fill="#fffdf7"/><path d="M196 129h27c38 0 38 64-4 64h-23" fill="#b9dce0"/><path d="M57 232h172"/><path d="M100 86c-15-24 17-31 3-55M142 84c-16-24 18-31 2-55M181 86c-15-24 18-31 3-55" stroke="#e9a48f"/>'; },
      graph: function () { return '<path d="M61 244h179M77 244V137h43v107M129 244V94h43v150M181 244V158h43v86" fill="#86ad8d"/><path d="M77 107l46-37 47 22 58-55" stroke="#e9a48f"/><g class="graph-error"><path d="M228 37v41M228 98v1"/><path d="M224 98h8"/></g>'; },
      anger: function () { return '<path d="M150 250c-63 0-105-48-105-108 0-70 50-112 105-112s105 42 105 112c0 60-42 108-105 108Z" fill="#eeb2a9"/><path d="m87 111 39 13M213 111l-39 13M105 184q45-28 90 0M58 55l22 25M242 55l-22 25M37 140h34M229 140h34" stroke="#e1b969"/> '; },
      sweat: function () { return '<path d="M125 247c-62 0-102-46-102-106 0-70 51-112 111-112 36 0 66 15 85 42" fill="#b9dce0"/><path d="m67 112 40 13M186 125l39-13M92 181q37 25 72 0"/><path d="M229 69c17 24 34 42 34 63 0 22-15 38-34 38s-34-16-34-38c0-21 17-39 34-63Z" fill="#86ad8d"/><path d="M96 211q36 23 70-1"/> '; },
      door: function () { return '<path d="M74 253V66q0-29 29-29h94q29 0 29 29v187Z" fill="#e9a48f"/><path d="M109 253V79h82v174" fill="#fffaf0"/><circle cx="174" cy="165" r="7" fill="#e1b969"/><path d="M54 253h192"/> '; },
      hand: function () { return '<path d="M111 260 70 180q-15-35 9-45 20-9 33 23l24 42V76q0-35 26-35t26 35v87V94q0-30 24-30t24 30v76v-44q0-27 22-27t22 27v71c0 55-43 85-91 85h-54c-30 0-49-12-62-42Z" fill="#fff9e8"/><path d="M188 163v47M236 170v34M116 216q21 10 38 0M146 116v47" fill="none" stroke="#d8c7ac" stroke-width="5" opacity=".85"/> '; },
      certificate: function () { return '<path d="M63 44h174v181H63Z" fill="#fffdf7"/><path d="M91 83h118M91 112h93M91 141h100" stroke="#b68b72" stroke-width="7"/><circle cx="185" cy="181" r="29" fill="#e1b969"/><path d="m185 160 8 16 18 3-13 13 3 18-16-9-16 9 3-18-13-13 18-3Z" fill="#fffdf7" stroke-width="4"/><path d="M166 208v45l19-14 19 14v-45" fill="#b9dce0"/> '; },
      teapot: function () { return '<path d="M87 137q0-62 63-62t63 62v51q0 50-63 50t-63-50Z" fill="#f4d6c9"/><path d="M212 135h29c48 0 48 69-2 69h-25" fill="#b9dce0"/><path d="M92 122 45 87q-25-20-35 3 31 23 76 57M117 75q-5-29 33-29t33 29" fill="#fffdf7"/><path d="M106 165q43-19 88 0" stroke="#e1b969"/> '; },
      hourglass: function () { return '<path d="M66 40h168M66 260h168M83 43c0 67 42 74 67 107 25-33 67-40 67-107M83 257c0-67 42-74 67-107 25 33 67 40 67 107"/><path class="sand-upper" d="M100 57h100c-2 37-25 55-50 76-25-21-48-39-50-76Z" fill="#e1b969" stroke="none"/><path class="sand-lower" d="M107 242h86c-3-31-22-47-43-68-21 21-40 37-43 68Z" fill="#e1b969" stroke="none"/><path class="sand-stream" d="M150 129v47" stroke="#e1b969" stroke-width="8"/> '; },
      document: function () { return '<path d="M74 38h112l43 43v181H74Z" fill="#fffdf7"/><path d="M186 38v47h43M105 123h91M105 155h91M105 187h63" stroke="#b68b72" stroke-width="9"/> '; },
      pointer: function () { return '<path d="M230 246 75 57" fill="none" stroke="#8b6047" stroke-width="18" stroke-linecap="round"/><path d="M230 246 75 57" fill="none" stroke="#c49369" stroke-width="7" stroke-linecap="round"/><path d="m75 57-17 39 39-18Z" fill="#d96f61" stroke="#405650" stroke-width="4" stroke-linejoin="round"/> '; },
      snowflake: function () { return '<path d="M150 38v224M53 94l194 112M53 206 247 94M150 38l18 24M150 38l-18 24M150 262l18-24M150 262l-18-24M53 94l31 3M53 94l14 28M247 206l-31-3M247 206l-14-28M53 206l14-28M53 206l31-3M247 94l-14 28M247 94l-31 3" stroke="#9ccbd0"/> '; },
      cloud: function () { return '<path class="cloud-drift" d="M47 215c-16-54 39-87 76-57 21-70 124-48 124 21 54-16 74 71 12 71H59c-31 0-35-26-12-35Z" fill="#fffdf7"/><path d="M84 215q38-27 76 0M166 207q31-23 58 1" stroke="#b9dce0" stroke-width="7"/> '; },
      leaf: function () { return '<path d="M69 235C61 114 135 44 244 49c6 117-72 192-175 186Z" fill="#86ad8d"/><path d="M80 222 221 72M121 178l17 28M159 137l23 19" stroke="#fff4d6" stroke-width="8"/> '; },
      check: function () { return '<circle cx="150" cy="150" r="109" fill="#b8d6bc"/><path d="m87 152 42 42 86-100" stroke="#fffdf7" stroke-width="24"/> '; },
      plates: function () { return '<ellipse cx="91" cy="196" rx="57" ry="24" fill="#fffdf7"/><ellipse cx="150" cy="143" rx="57" ry="24" fill="#f4d6c9"/><ellipse cx="208" cy="196" rx="57" ry="24" fill="#fffdf7"/><ellipse cx="150" cy="143" rx="31" ry="11" fill="none" stroke="#e1b969" stroke-width="6"/> '; },
      chair: function () { return '<path d="M71 155V70q0-27 27-27h75q27 0 27 27v85" fill="#b9dce0"/><path d="M58 157h155v43H58Z" fill="#e9a48f"/><path d="M80 200v57M193 200v57" stroke="#8d624c" stroke-width="13"/> '; },
      performance: function () { return '<path d="M56 245h188M75 245v-88h44v88M128 245V93h44v152M181 245v-125h44v125" fill="#86ad8d"/><path d="m72 115 55-42 48 18 55-50" stroke="#e9a48f" stroke-width="12"/> '; },
      price: function () { return '<path d="M49 72h117l79 79-94 94-102-102Z" fill="#f1c36e"/><circle cx="112" cy="112" r="17" fill="#fffdf7"/><path d="M151 151v56M128 174h47" stroke="#a96e55" stroke-width="10"/> '; },
      quality: function () { return '<path d="m150 41 32 20 38-2 12 36 29 24-15 35 8 37-35 15-20 32-37-10-34 17-24-28-38-5 2-38-22-31 27-27 7-37 38-7Z" fill="#b9dce0"/><path d="m150 94 16 33 37 5-27 27 7 37-33-18-33 18 7-37-27-27 37-5Z" fill="#fffdf7"/> '; },
      meetingtable: function () { return '<path d="M18 120 151 61 282 120 240 184H62Z" fill="#c38a63"/><path d="M18 120 151 61 282 120 151 171Z" fill="#e1af80"/><path d="M65 183 44 270M238 183l20 87" stroke="#805640" stroke-width="17"/><path d="M79 118 151 87l72 31" stroke="#f3c794" stroke-width="6" opacity=".7"/> '; },
      teatable: function () { return '<ellipse cx="150" cy="130" rx="126" ry="58" fill="#c58d65"/><ellipse cx="150" cy="119" rx="126" ry="58" fill="#e1af80"/><path d="M63 147 46 261M237 147l17 114" stroke="#805640" stroke-width="18"/><ellipse cx="150" cy="119" rx="93" ry="36" fill="none" stroke="#f4c996" stroke-width="5" opacity=".7"/> '; }
    };
    return iconWrap(draw[n] ? draw[n]() : '<circle cx="150" cy="150" r="80" fill="#b8d6bc"/>', n || 'village symbol');
  }

  window.WORLD = {
    background: function (place) {
      var scenes = { entrance: entrance, plaza: plaza, tea: tea, meeting: meeting, balcony: balcony, map: map };
      return (scenes[String(place || 'entrance').toLowerCase()] || entrance)();
    },
    prop: prop
  };
}());
