/* MARK 전주 특별공연 사전예매 — 신청은 구글 시트(Apps Script)로 저장 */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbwQbCfibWjqFoQ_BCyBEYfy-r7zgRoV4vfqkuoYvd2iehD0MZUJNsPqEkq8bm_3wd1n/exec';
  var PRICE = 20000;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var won = function (n) { return n.toLocaleString('ko-KR') + '원'; };
  var tt;
  function toast(m) { var t = $('#mkToast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2200); }
  function copy(text, msg) {
    var done = function () { toast(msg); };
    var fb = function () { var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { alert(text); } document.body.removeChild(ta); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fb); else fb();
  }
  $$('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { copy(b.getAttribute('data-copy'), b.getAttribute('data-msg') || '복사되었습니다.'); }); });

  var form = $('#mkForm'); if (!form) return;
  var type = '개인';
  var qty = $('#mkQty');
  function q() { return Math.max(1, Math.min(500, parseInt(qty.value, 10) || 1)); }
  function unit() { return q() >= 10 ? PRICE * 0.9 : PRICE; }
  function calc() { var n = q(); $('#mkUnit').textContent = won(unit()); $('#mkTotal').textContent = won(unit() * n); $('#mkDisc').hidden = n < 10; }
  $$('.mk-qty button').forEach(function (b) { b.addEventListener('click', function () { qty.value = Math.max(1, Math.min(500, q() + (+b.getAttribute('data-q')))); calc(); }); });
  qty.addEventListener('input', function () { qty.value = qty.value.replace(/\D/g, ''); calc(); });
  qty.addEventListener('blur', function () { qty.value = q(); calc(); });
  $$('.mk-seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      type = b.getAttribute('data-type');
      $$('.mk-seg button').forEach(function (x) { x.classList.toggle('on', x === b); });
      var g = type === '교회·단체';
      $('.mk-church').hidden = !g;
      $('#mkNameLabel').textContent = g ? '담당자 이름' : '이름';
      var pick = document.querySelector('input[name=pickup][value="' + (g ? '교회·단체 일괄수령' : '공연 당일 개인수령') + '"]');
      if (pick) pick.checked = true;
    });
  });
  var ph = $('#mkPhone');
  ph.addEventListener('input', function () { var v = ph.value.replace(/\D/g, '').slice(0, 11); ph.value = v.length < 4 ? v : v.length < 8 ? v.slice(0, 3) + '-' + v.slice(3) : v.slice(0, 3) + '-' + v.slice(3, v.length - 4) + '-' + v.slice(-4); });
  $$('#mkForm input').forEach(function (i) { i.addEventListener('input', function () { i.classList.remove('mk-err'); }); });
  function fail(el, m) { el.classList.add('mk-err'); el.focus(); toast(m); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var sub = $('#mkSubmit'); if (sub.disabled) return;
    var g = type === '교회·단체', name = $('#mkName'), church = $('#mkChurch');
    if (g && !church.value.trim()) return fail(church, '교회명을 입력해 주세요');
    if (!name.value.trim()) return fail(name, g ? '담당자 이름을 입력해 주세요' : '이름을 입력해 주세요');
    if (ph.value.replace(/\D/g, '').length < 10) return fail(ph, '휴대전화 번호를 확인해 주세요');
    if (!$('#mkAgree').checked) { toast('개인정보 수집·이용에 동의해 주세요'); return; }
    var pick = document.querySelector('input[name=pickup]:checked');
    var data = { type: type, name: name.value.trim(), church: g ? church.value.trim() : '', phone: ph.value.trim(), qty: q(), pickup: pick ? pick.value : '', note: $('#mkNote').value.trim() };
    sub.disabled = true; sub.textContent = '신청 중…';
    fetch(API, { method: 'POST', body: JSON.stringify({ site: 'mark', data: data }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error();
        $('#mkDoneWho').innerHTML = (g ? esc(data.church) + ' ' : '') + esc(data.name) + ' 님 <b>' + j.qty + '매</b> 신청';
        $('#mkDoneNo').textContent = j.no;
        $('#mkDoneAmt').textContent = won(j.total);
        form.hidden = true; $('#mkDone').hidden = false;
        $('#mkFormWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast('예매 신청이 완료되었습니다');
      })
      .catch(function () { toast('신청 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요'); })
      .finally(function () { sub.disabled = false; sub.textContent = '사전예매 신청하기'; });
  });
  $('#mkAgain').addEventListener('click', function () { form.reset(); qty.value = 1; calc(); $('.mk-seg button').click(); form.hidden = false; $('#mkDone').hidden = true; });
  calc();

  /* 모바일 하단 예매 바: 히어로 지나면 보이고, 예매 영역에선 숨김 */
  var bar = $('#mkBar'), hero = $('#hero'), rsv = $('#reserve');
  function onScroll() {
    if (!bar || !hero) return;
    var past = window.scrollY > hero.offsetHeight * 0.7;
    var r = rsv ? rsv.getBoundingClientRect() : null;
    var inRsv = r && r.top < window.innerHeight && r.bottom > 0;
    bar.classList.toggle('show', past && !inRsv);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* 아이폰 자동재생 보조 */
  var hv = document.querySelector('.mk-hero-video');
  if (hv) { hv.muted = true; hv.setAttribute('muted', ''); var p = hv.play(); if (p && p.catch) p.catch(function () {}); }
})();
