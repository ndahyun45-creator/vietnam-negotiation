/* Original AI-rendered environments, used as pre-rendered 3D backdrops. */
(function () {
  'use strict';
  var images = {
    entrance: {file:'assets/backgrounds/entrance-pastel.jpg', managed:'/manus-storage/async-images/BPCZOVMkUeYDlm8D57e2hZ/image-1.webp', alt:'햇살과 나무·꽃이 있는 3D 마을 입구'},
    plaza: {file:'assets/backgrounds/plaza-pastel.jpg', managed:'/manus-storage/async-images/BPCZOVMkUeYDlm8D57e2hZ/image-2.webp', alt:'돌광장과 집·가로등·벤치의 3D 마을 광장'},
    tea: {file:'assets/backgrounds/tea-pastel.jpg', managed:'/manus-storage/async-images/BPCZOVMkUeYDlm8D57e2hZ/image-3.webp', alt:'원목 테이블과 창·조명·선반이 있는 3D 찻집'},
    meeting: {file:'assets/backgrounds/meeting-pastel.jpg', managed:'/manus-storage/async-images/BPCZOVMkUeYDlm8D57e2hZ/image-4.webp', alt:'회의 테이블과 스크린·책장·발코니 문이 있는 3D 회의실'},
    balcony: {file:'assets/backgrounds/balcony-pastel.jpg', managed:'/manus-storage/async-images/BPCZOVMkUeYDlm8D57e2hZ/image-5.webp', alt:'마을 풍경과 난간·화분의 3D 발코니'},
    map: {file:'assets/backgrounds/map-pastel.jpg', managed:'/manus-storage/async-images/eRhYhQqZ0Fth0DPQEyDnF3/image-1.webp', alt:'네 장소를 내려다보는 3D 마을 조감도'}
  };
  // Ship the inspected pixels with the requested offline artifact and web build.
  // The exact managed addresses above are retained as source provenance.
  var local = true;
  var original = window.WORLD;
  function background(place) {
    var name = String(place || 'entrance').toLowerCase();
    var image = images[name] || images.entrance;
    var source = local ? image.file : image.managed;
    var stage = document.getElementById('stage');
    if (stage) stage.dataset.place = name;
    var front = document.getElementById('furnitureOcclusion');
    if (front) {
      front.className = name;
      front.innerHTML = (name === 'tea' || name === 'meeting') ? '<img class="furniture-front" draggable="false" src="' + source + '" alt="">' : '';
    }
    return '<img class="environment-3d" draggable="false" data-place="' + name + '" src="' + source + '" alt="' + image.alt + '">';
  }
  window.BACKGROUNDS = Object.freeze(images);
  window.WORLD = Object.assign({}, original, {background:background, rendered3D:true});
  Object.keys(images).forEach(function (name) {
    var image = new Image(); image.src = local ? images[name].file : images[name].managed;
  });
}());
