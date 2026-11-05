(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const cuts = window.CUTS, scenes = window.SCENES;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const firstIndex = scene => cuts.findIndex(c => c.scene === scene);
  const esc = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let index = 0, phase = 'ready', typing = false, typeInterval = null, jobs = [];
  let soundOn = false, audio = null, cutStarted = performance.now(), sceneStarted = performance.now();
  let currentScene = 0, pendingWrong = null, meterValue = 0, wrongShown = false;
  const totalStarted = performance.now(), sceneElapsed = scenes.map(() => 0), completed = new Set();
  const metrics = { visits: [], choices: [], whatifs: [], clicks: scenes.map(() => 0), imageErrors: [], navigation: [] };
  const current = () => cuts[index];
  const later = (fn, delay) => { const id = setTimeout(fn, delay); jobs.push(id); return id; };
  const viewContext = () => ({ later, sound, reduced });
  function clearJobs() { jobs.forEach(clearTimeout); jobs = []; clearInterval(typeInterval); typeInterval = null; typing = false; pendingWrong = null; }
  function resize() { $('stage').style.transform = `scale(${Math.min(innerWidth / 1920, innerHeight / 1080)})`; }
  function sound(kind = 'next') {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const now = audio.currentTime, oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.connect(gain); gain.connect(audio.destination);
      const frequency = { success: 660, star: 930, impact: 160, tick: 620, wind: 330, next: 470 }[kind] || 470;
      oscillator.type = kind === 'impact' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now); oscillator.frequency.exponentialRampToValueAtTime(kind === 'impact' ? 65 : frequency * 1.25, now + .16);
      gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'impact' ? .05 : .035, now + .012); gain.gain.exponentialRampToValueAtTime(.0001, now + .24);
      oscillator.start(now); oscillator.stop(now + .25);
    } catch (_) { /* Sound is optional; no device or network is required. */ }
  }
  function accumulateScene(nextScene) {
    if (currentScene === nextScene) return;
    sceneElapsed[currentScene] += performance.now() - sceneStarted;
    currentScene = nextScene; sceneStarted = performance.now();
  }
  function updateHash() {
    try { history.replaceState(null, '', '#s' + current().scene); } catch (_) { /* Local file history can be restricted. */ }
  }
  function renderRail() {
    const labels = ['광장', '찻집', '회의실', '발코니'];
    $('maprail').innerHTML = labels.map((name, i) => `<button class="station ${current().scene === i + 1 ? 'active' : ''} ${completed.has(i + 1) ? 'done' : ''}" data-scene="${i + 1}" aria-current="${current().scene === i + 1 ? 'step' : 'false'}"><span class="number">${i + 1}</span>${name}<span class="station-star" aria-label="완료">★</span></button>`).join('');
    if (current().id === '0-03') [...$('maprail').children].forEach((el, i) => later(() => { el.classList.add('lit'); sound('tick'); }, reduced ? 0 : i * 400 + 350));
    if (current().scene === 5) [...$('maprail').children].forEach((el, i) => later(() => el.classList.add('done'), reduced ? 0 : i * 500 + 200));
  }
  const ROUTE_POINTS = [[920, 585], [1240, 345], [560, 320], [385, 650]];
  const ROUTE_D = 'M920 585 C1000 480 1130 400 1240 345 C1100 250 760 230 560 320 C430 380 400 520 385 650';
  const ROUTE_LABELS = [
    ['자긍심', '상대의 역사를 인정하고 존중하기'],
    ['신뢰', '먼저 신뢰를 쌓고, 그 다음에 협상'],
    ['체면', '그 자리에서 지적하지 않고 체면 세워 주기'],
    ['인내', '감정은 발코니에서 식히고 결정은 기다리기']
  ];
  const ROUTE_CARD_POS = [[1450, 700], [1560, 440], [420, 470], [760, 745]];
  function routeSegments() {
    // cumulative share (0-100) of the whole route reached at each stop
    const ns = 'http://www.w3.org/2000/svg';
    // split(' C') yields a leading move-only chunk: drop it so index k is the end of segment k
    const parts = ROUTE_D.split(' C').slice(1).map((seg, i) => 'M' + ROUTE_POINTS[i].join(' ') + ' C' + seg);
    const lengths = parts.map(d => { const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); return p.getTotalLength(); });
    const total = lengths.reduce((a, b) => a + b, 0);
    let acc = 0;
    return [0].concat(lengths.map(l => { acc += l; return acc / total * 100; }));
  }
  let routeCtl = null;
  function renderMapLabels() {
    const box = $('mapLabels');
    box.innerHTML = '';
    routeCtl = null;
    const id = current().id;
    if (id !== '5-01' && id !== '5-02') return;
    const stops = routeSegments();
    const cards = ROUTE_LABELS.map((l, i) => `<div class="route-card" data-i="${i}" style="left:${ROUTE_CARD_POS[i][0]}px;top:${ROUTE_CARD_POS[i][1]}px"><b>★ ${i + 1} ${l[0]}</b><span>${l[1]}</span></div>`).join('');
    const pins = ROUTE_POINTS.map((p, i) => `<div class="route-pin" data-i="${i}" style="left:${p[0]}px;top:${p[1]}px">${i + 1}</div>`).join('');
    box.innerHTML = `<svg class="route-svg" viewBox="0 0 1920 1080" aria-hidden="true"><path class="route-base" d="${ROUTE_D}"/><path id="routeDraw" class="route-draw" d="${ROUTE_D}" pathLength="100"/></svg>${pins}${cards}<div id="routeWalker" class="route-walker" style="offset-path:path('${ROUTE_D}')"><img src="assets/chars/v2/w_walk_side.png" alt=""><img src="assets/chars/v2/m_wave.png" alt=""></div>`;
    const party = () => { if (!box.querySelector('.route-party')) box.insertAdjacentHTML('beforeend', '<div class="route-party"><span class="p1">🥳</span><span class="p2">🎉</span></div>'); };
    const showStop = i => { if (i === 3) party(); const pin = box.querySelector(`.route-pin[data-i="${i}"]`), card = box.querySelector(`.route-card[data-i="${i}"]`); if (pin) pin.classList.add('on'); if (card) card.classList.add('on'); sound('star'); };
    const walker = $('routeWalker'), draw = $('routeDraw');
    if (id === '5-02' || reduced) {
      draw.style.strokeDashoffset = 0; walker.style.offsetDistance = '100%'; walker.style.transform = 'scaleX(-1)'; walker.classList.add('done'); party();
      ROUTE_LABELS.forEach((_, i) => { const pin = box.querySelector(`.route-pin[data-i="${i}"]`), card = box.querySelector(`.route-card[data-i="${i}"]`); pin.classList.add('on', 'still'); card.classList.add('on', 'still'); });
      return;
    }
    // click-driven walk: one click moves the pair to the next stop
    const flip = ['scaleX(1)', 'scaleX(-1)', 'scaleX(-1)'];   // the sprite faces left: mirror it when it walks right
    walker.style.transform = flip[0]; walker.style.offsetDistance = '0%';
    draw.style.strokeDashoffset = 100;
    showStop(0);
    const ctl = { step: 0, busy: false };
    ctl.go = () => {
      if (ctl.step >= 3) return;
      const k = ++ctl.step;
      // no walking animation: one click moves the pair straight to the next number
      walker.style.offsetDistance = stops[k] + '%';
      walker.style.transform = flip[k - 1];
      draw.style.strokeDashoffset = 100 - stops[k];
      showStop(k);
    };
    routeCtl = ctl;
  }
  function setMeter(meter) {
    $('meterBox').hidden = !meter;
    if (!meter) return;
    meterValue = meter.from;
    const hearts = meter.label === '신뢰' ? '<div class="meter-heartbar" aria-hidden="true">♡ ♡ ♡ ♡</div>' : '';
    $('meterBox').innerHTML = `<div class="meter-heading"><span>${esc(meter.label)}</span><strong>${meter.from}%</strong></div>${hearts}<div class="meter-track"><i style="width:${meter.from}%"></i></div>`;
    const complete = () => {
      meterValue = meter.to;
      const fill = $('meterBox').querySelector('.meter-track i');
      if (fill) { fill.style.width = meter.to + '%'; $('meterBox').querySelector('strong').textContent = meter.to + '%'; }
      const heart = $('meterBox').querySelector('.meter-heartbar');
      if (heart) heart.textContent = [0,1,2,3].map(i => meter.to >= (i + 1) * 25 ? '♥' : '♡').join(' ');
    };
    if (reduced) complete(); else later(complete, 300);
  }
  function animateEmotion() {
    const id = current().id;
    $('emotionBox').hidden = !['4-04','4-05'].includes(id);
    if ($('emotionBox').hidden) return;
    const sequence = id === '4-04' ? [[20,'#94b67c','여유'],[58,'#dfa85c','답답함'],[92,'#c87865','감정 표출 엄금']] : [[92,'#c87865','냉각기'],[58,'#dfa85c','한숨 돌리기'],[20,'#94b67c','여유']];
    sequence.forEach((entry, i) => later(() => {
      $('emotionFill').style.height = entry[0] + '%'; $('emotionFill').style.background = entry[1]; $('emotionState').textContent = entry[2];
      if (id === '4-04' && soundOn) {
        sound('tick'); if (i > 0) later(() => sound('tick'), i === 1 ? 430 : 180);
        if (i === 2) later(() => sound('tick'), 360);
      }
    }, reduced ? 0 : i * 700));
  }
  // keep the keyword board and the choices just above the dialogue box, however tall it grows
  function fitOverlays() {
    const top = $('dialogue').offsetTop;
    const kb = $('keywordBoard'), ch = $('choices');
    if (!kb.hidden) kb.style.top = Math.round(top - kb.offsetHeight - 16) + 'px';
    if (!ch.hidden) ch.style.top = Math.round(top - ch.offsetHeight - 16) + 'px';
  }
  // [[word]] marks an emphasised keyword (rendered green)
  const rich = t => esc(t).replace(/\[\[(.+?)\]\]/g, '<b class="kw">$1</b>');
  function finishTyping() {
    clearInterval(typeInterval); typeInterval = null; typing = false;
    $('dialogueText').classList.remove('typing');
    $('dialogueText').innerHTML = '<span class="dt">' + rich(current().choice ? silentLabel(current()) : (current().text || current().keyword || silentLabel(current()))) + '</span>';
    fitOverlays();
  }
  function silentLabel(cut) {
    if (cut.id === '5-01') return '';
    if (cut.id === '5-02') return '';
    if (cut.choice) return '나의 대사';
    if (cut.id.endsWith('01')) return scenes[cut.scene].strategy;
    if (['0-04','1-10','2-08','3-08','4-09'].includes(cut.id)) return '다음 장소로 이동';
    if (cut.id === '5-01') return '';
    return '';
  }
  function typeText() {
    const text = current().text;
    if (!text || reduced) { finishTyping(); return; }
    const chars = Array.from(text); let n = 0;
    typing = true; $('dialogueText').textContent = ''; $('dialogueText').classList.add('typing');
    typeInterval = setInterval(() => { n += 2; $('dialogueText').textContent = chars.slice(0,n).join(''); fitOverlays(); if (n >= chars.length) finishTyping(); }, 30);
  }
  function updateMetadata() {
    const cut = current();
    $('chapterLabel').textContent = cut.scene === 0 ? '마을 입구' : cut.scene === 5 ? '네 가지 기억' : `전략 0${cut.scene}`;
    $('bannerTitle').textContent = scenes[cut.scene].strategy.replace(/\[\[|\]\]/g, '');
    $('notesId').textContent = `컷 ${cut.id} · 목표 ${cut.seconds}초`;
    $('notesText').textContent = cut.note;
    $('speakerTab').textContent = cut.text ? cut.speaker : cut.choice ? '나' : '기억할 한 문장';
    $('speakerTab').style.background = cut.speaker === '나' ? '#c3a273' : cut.speaker === '베트남 수석대표' ? '#92a897' : '#9cad7f';
    document.title = `${scenes[cut.scene].name} · CUT ${cut.id} · 협상이 시작되는 마을`;
    updateTimer();
  }
  function render(nextIndex = index) {
    clearJobs(); ['actors', 'effects', 'visualObjects'].forEach(k => { $(k).style.opacity = ''; $(k).style.transition = ''; }); $('whatif').hidden = true; $('travelOverlay').hidden = true; $('walker').classList.remove('walking');
    index = Math.max(0, Math.min(cuts.length - 1, nextIndex));
    const cut = current(); accumulateScene(cut.scene); cutStarted = performance.now(); phase = 'ready'; wrongShown = false;
    metrics.visits.push(cut.id);
    const classes = [];
    if (cut.id === '0-01') classes.push('opening-title');
    if (cut.id === '0-02') classes.push('no-map');
    if (cut.id === '0-03') classes.push('rail-reveal');
    if (['1-02','1-03','1-04'].includes(cut.id)) classes.push('recall');
    if (cut.id === '4-04') classes.push('tension');
    if (cut.scene === 5) classes.push('ending');
    if (cut.id === '5-05') classes.push('end-black');
    if (cut.id === '5-01' || cut.id === '5-02') classes.push('no-dialogue');
    if (['5-03','5-04'].includes(cut.id)) classes.push('finale');
    if (!cut.text) classes.push('silent');
    if (cut.keyword.length > 48) classes.push('long-keyword');
    if (cut.choice) classes.push('has-choices');
    $('stage').className = classes.join(' ');
    const departIds = ['0-04','1-10','2-08','3-08','4-09'];
    const place = departIds.includes(cut.id) && index > 0 ? cuts[index-1].place : cut.place;
    const prevImg = $('background').querySelector('img');
    $('background').innerHTML = window.WORLD.background(place);
    if (prevImg && (cut.id === '4-05' || cut.id === '4-06')) {
      // plain cross-fade between meeting room and balcony (no flash of the empty stage)
      const old = prevImg.cloneNode(); old.className = 'bg-old'; $('background').appendChild(old);
      const fo = $('furnitureOcclusion'); fo.style.opacity = '0'; later(() => { fo.style.opacity = ''; }, 650);
      later(() => old.remove(), 700);
    }
    $('titleCard').hidden = cut.id !== '0-01';
    $('blackFade').className = cut.id === '0-01' ? 'fade-in' : '';
    const displayKeyword = Boolean(cut.text && cut.keyword && !cut.choice);
    $('keywordBoard').hidden = !displayKeyword;
    $('keywordBoard').innerHTML = '<span class="dt">' + rich(cut.keyword) + '</span>';
    $('choices').hidden = !cut.choice; $('choices').classList.remove('picked');
    $('choices').innerHTML = cut.choice ? `<button data-option="bad"><span class="my-tab">나</span><span class="option-index">①</span><span>${rich(cut.choice.bad)}</span></button><button data-option="good"><span class="my-tab">나</span><span class="option-index">②</span><span class="${cut.choice.good.length > 20 ? 'long' : ''}">${rich(cut.choice.good)}</span></button>` : '';
    $('nextLabel').textContent = cut.end ? '마무리' : cut.choice ? '정답으로 진행' : '다음';
    renderRail(); renderMapLabels(); setMeter(cut.meter); animateEmotion(); updateMetadata();
    if (cut.whatIf && !cut.whatIf.embed) window.SCENE_VIEW.render(cuts[index - 1], viewContext());
    else window.SCENE_VIEW.render(cut, viewContext());
    typeText(); fitOverlays(); updateHash();
    if (departIds.includes(cut.id)) startTravel();
    else if (cut.whatIf && !cut.whatIf.embed) showWhatIf();
    else if (['1-08','2-04','3-04'].includes(cut.id)) {
      pendingWrong = () => render(index + 1);
    } else if (cut.whatIf && cut.whatIf.embed) {
      pendingWrong = showWhatIf;
    }
  }
  function startTravel() {
    const cut = current(); phase = 'travel';
    if (cut.scene > 0 && cut.scene < 5) completed.add(cut.scene);
    renderRail();
    const walker = $('walker');
    walker.style.transition = 'none'; walker.style.left = `${cut.scene === 0 ? 345 : 520 + (cut.scene - 1) * 258}px`;
    walker.classList.add('walking');
    $('travelOverlay').hidden = false; { const tw = $('travelWalker'); tw.style.animation = 'none'; void tw.offsetWidth; tw.style.animation = ''; }
    $('travelText').textContent = `${cut.scene < 4 ? scenes[cut.scene+1].name : '마을 지도'}으로 걸어가요`;
    later(() => { walker.style.transition = reduced ? 'none' : 'left 3.2s linear'; walker.style.left = `${cut.scene === 0 ? 520 : Math.min(1545,520 + cut.scene * 258)}px`; }, 35);
    later(() => render(index + 1), reduced ? 200 : 3200);
  }
  function showWhatIf() {
    pendingWrong = null; finishTyping(); phase = 'whatif'; wrongShown = true;
    const cut = current();
    metrics.whatifs.push({id:cut.id,dismissedByClick:false,heldDurationMs:null,started:performance.now()});
    $('whatif').hidden = false; $('whatif').dataset.id = cut.id;
    $('whatifVisual').innerHTML = window.SCENE_VIEW.whatIf(cut, viewContext());
    const captions = {
      '1-09':'“저희가 선진 기술을 가르쳐 드리겠습니다.”\n자긍심이 상한 파트너는 마음을 닫습니다',
      '2-04b':'가격부터 내밀면, 신뢰의 자물쇠는 열리지 않습니다',
      '3-04b':'그 자리에서 지적하면 체면이 깎이고, 분위기는 얼어붙습니다',
      '3-06':'특정인만 칭찬하면, 나머지는 마음을 닫습니다',
      '4-07':'“무슨 문제인지 지금 바로 말하세요!”\n추궁하면 신뢰를 잃습니다'
    };
    $('whatifText').textContent = captions[cut.id] || cut.whatIf.text;
    if (cut.id === '3-04b') setMeter(cut.meter);
  }
  function closeWhatIf() {
    $('whatif').hidden = true; phase = 'ready';
    if (current().id === '3-04b') setMeter({label:'수석대표 체면',from:100,to:100});
  }
  function chooseCorrect() {
    phase = 'answer';
    const good = $('choices').querySelector('[data-option="good"]'), bad = $('choices').querySelector('[data-option="bad"]');
    good.classList.add('correct'); bad.classList.add('incorrect'); $('choices').classList.add('picked');
    metrics.choices.push({id:current().id,selected:'good'}); sound('success');
    later(() => render(index + 1), reduced ? 150 : 550);
  }
  function advance() {
    metrics.clicks[current().scene]++;
    if (phase === 'travel') { render(index + 1); return; }
    if (phase === 'answer') { render(index + 1); return; }
    if (phase === 'whatif') {
      const item = metrics.whatifs[metrics.whatifs.length - 1];
      if (item) { item.dismissedByClick = true; item.heldDurationMs = performance.now() - item.started; }
      clearJobs(); closeWhatIf(); render(index + 1); return;
    }
    if (typing) { finishTyping(); return; }
    if (current().id === '5-01' && routeCtl && (routeCtl.busy || routeCtl.step < 3)) { routeCtl.go(); return; }
    if (current().choice) { chooseCorrect(); return; }
    if (pendingWrong) { pendingWrong(); return; }
    if (current().end) return;
    sound(); render(index + 1);
  }
  function previous() { if (index > 0) render(index - 1); }
  function goScene(scene) { metrics.navigation.push(scene); render(firstIndex(scene)); }
  function formatTime(ms) { const s = Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
  function updateTimer() {
    const cut = current(), elapsed = sceneElapsed[currentScene] + performance.now() - sceneStarted;
    const goal = scenes[cut.scene].duration * 1000;
    $('sceneTimer').textContent = `${scenes[cut.scene].name} ${formatTime(elapsed)} / ${formatTime(goal)}`;
    $('sceneTimerFill').style.width = `${Math.min(100,elapsed/goal*100)}%`;
    $('sceneTimerFill').style.background = elapsed > goal ? '#d5a16d' : '#91b174';
    $('cutTimer').textContent = `CUT ${cut.id} · ${formatTime(performance.now()-cutStarted)} / ${formatTime(cut.seconds*1000)}`;
    $('totalTimer').textContent = `전체 ${formatTime(performance.now()-totalStarted)} / 12:30`;
  }
  function togglePanel(panel, button) { $(panel).hidden = !$(panel).hidden; $(button).classList.toggle('active',!$(panel).hidden); }
  function toggleSound() { soundOn = !soundOn; $('soundState').textContent = soundOn ? 'ON':'OFF'; $('soundButton').classList.toggle('active',soundOn); $('soundButton').setAttribute('aria-pressed',String(soundOn));if(soundOn)sound('success'); }
  function fullscreen() { try { const result=document.fullscreenElement?document.exitFullscreen():$('viewport').requestFullscreen();if(result&&result.catch)result.catch(()=>{}); } catch (_) {} }
  $('timerButton').onclick = () => togglePanel('timerPanel','timerButton');
  $('notesButton').onclick = () => togglePanel('notesPanel','notesButton');
  $('notesClose').onclick = () => { $('notesPanel').hidden=true;$('notesButton').classList.remove('active'); };
  $('soundButton').onclick=toggleSound;$('fullButton').onclick=fullscreen;
  $('stage').addEventListener('click', event => {
    if(event.target.closest('.toolbar,#timerPanel,#notesPanel'))return;
    const station=event.target.closest('[data-scene]');
    if(station&&!current().choice) {goScene(Number(station.dataset.scene));return;}
    advance();
  });
  window.addEventListener('keydown',event=>{
    const key=event.key.toLowerCase();
    if([' ','arrowright','arrowleft','t','n','m','f'].includes(key))event.preventDefault();
    if(event.repeat)return;
    if(key===' '||key==='arrowright')advance();else if(key==='arrowleft')previous();
    else if(key==='t')togglePanel('timerPanel','timerButton');else if(key==='n')togglePanel('notesPanel','notesButton');else if(key==='m')toggleSound();else if(key==='f')fullscreen();
  });
  window.addEventListener('hashchange',()=>{const match=location.hash.match(/^#s([0-5])$/);if(match)goScene(Number(match[1]));});
  window.addEventListener('resize',resize);
  window.addEventListener('error',event=>{if(event.target&&event.target.tagName==='IMG')metrics.imageErrors.push(event.target.getAttribute('src'));},true);
  window.Presentation=Object.freeze({
    getState:()=>({index,id:current().id,scene:current().scene,type:current().type,phase,typing,choice:Boolean(current().choice),end:Boolean(current().end),pendingWrong:Boolean(pendingWrong),soundOn,reducedMotion:reduced,whatifShown:wrongShown,meterValue}),
    getMetrics:()=>JSON.parse(JSON.stringify(metrics)),
    targets:scenes.map((s,i)=>({id:s.id,seconds:s.duration,cuts:cuts.filter(c=>c.scene===i).length,clickCuts:cuts.filter(c=>c.scene===i&&c.type==='click').length})),
    cutIds:cuts.map(c=>c.id)
  });
  const navigation=performance.getEntriesByType('navigation')[0];
  const reload=navigation&&navigation.type==='reload';
  const match=!reload&&location.hash.match(/^#s([0-5])$/);
  if(match)index=firstIndex(Number(match[1]));
  const cutMatch=location.hash.match(/^#c(\d-\d\d\w?)$/);
  if(cutMatch&&window.CUT_BY_ID[cutMatch[1]])index=cuts.findIndex(c=>c.id===cutMatch[1]);
  window.addEventListener('hashchange',()=>{const m=location.hash.match(/^#c(\d-\d\d\w?)$/);if(m&&window.CUT_BY_ID[m[1]])render(cuts.findIndex(c=>c.id===m[1]));});
  currentScene=cuts[index].scene;resize();render(index);setInterval(updateTimer,400);
})();
