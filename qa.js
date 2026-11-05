// تب «سوال و جواب» — سوال دو گزینه‌ای با افکت‌های قابل تنظیم توسط طراح
const $ = (s) => document.querySelector(s), rn = (a, b) => a + Math.random() * (b - a);
const FXC = { flowers: ['🌸', '🌷', '🌹', '🌼'], hearts: ['❤️', '💖', '💕'], confetti: ['🎉', '✨', '🎊', '⭐'] };
const YF = [['flowers', 'گل‌افشانی 🌸'], ['hearts', 'قلب‌ها ❤️'], ['confetti', 'کنفتی 🎉'], ['none', 'فقط پیام']];
const NF = [['dodge', 'دکمه فرار می‌کنه 🏃'], ['shrink', 'دکمه کوچیک می‌شه 🐜'], ['none', 'فقط پیام']];
const DEF = {
  fun: { q: 'قبول می‌کنی باهام بیای بیرون؟ 😄', a0: 'آره!', a1: 'نه', m0: 'ایول! 🎉', m1: 'باشه، ولی پشیمون می‌شی 😏', f0: 'flowers', f1: 'dodge', dg: 4 },
  serious: { q: '', a0: 'بله', a1: 'خیر', m0: 'ممنون که پذیرفتی.', m1: 'ممنون که صادق بودی؛ احترام می‌گذارم.', f0: 'none', f1: 'none', dg: 4 }
};
const burst = (b, ch) => {
  const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  for (let i = 0; i < 32; i++) {
    const s = document.createElement('span'); s.textContent = ch[i % ch.length];
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${rn(18, 36)}px;pointer-events:none;z-index:99`;
    document.body.append(s); const a = rn(0, 6.28), d = rn(80, 240);
    s.animate([{ transform: 'translate(0,0) scale(.3)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 60}px) rotate(${rn(0, 540)}deg) scale(1)`, opacity: 0 }], { duration: rn(1300, 2000), easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => s.remove();
  }
};

export function showQA(el, p, o, H) {
  const { esc } = H, [ya, na] = p.a || ['', ''], [ym, nm] = p.m || ['', ''], fx = p.fx || [], rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const max = Math.min(8, Math.max(1, +p.dg || 4)); let n = 0, done = 0;
  el.innerHTML = `<div class="paper qa" style="${H.pst({ paper: p.paper, size: 20, align: 'center' })}"><h2>${esc(p.q)}</h2><div class="qb"><button class="btn" id="qy">${esc(ya)}</button><button class="btn ghost" id="qn">${esc(na)}</button></div><p class="rx"></p><small>${p.name ? 'از طرف ' + esc(p.name) : 'فرستنده ناشناس'}</small></div>`;
  const yb = $('#qy'), nb = $('#qn');
  const ans = async (i, b) => {
    if (done) return; done = 1; el.querySelectorAll('.qb .btn').forEach((x) => x.disabled = true);
    el.querySelector('.rx').textContent = [ym, nm][i] || '';
    if (i == 0 && FXC[fx[0]] && !rm) { b.classList.add('pop'); burst(b, FXC[fx[0]]); }
    if (o.preview) { el.querySelector('.rx').insertAdjacentHTML('afterend', '<button class="btn ghost" id="qrt">تست دوباره</button>'); $('#qrt').onclick = () => showQA(el, p, o, H); return; }
    try { const s = await H.seal(await H.imp(H.ub64(p.rk)), { t: [ya, na][i], at: Date.now() }); await H.rpc('submit_response', { p_id: o.id, p_iv: s.iv, p_ct: s.ct }); } catch { H.toast('ثبت پاسخ ناموفق بود'); }
  };
  const dodge = () => {
    if (rm || n >= max || (fx[1] != 'dodge' && fx[1] != 'shrink')) return false; n++;
    nb.style.transform = fx[1] == 'dodge' ? `translate(${rn(-90, 90)}px,${rn(-50, 50)}px)` : `scale(${1 - n * 0.1})`;
    return fx[1] == 'dodge';
  };
  yb.onclick = () => ans(0, yb);
  nb.addEventListener('pointerenter', dodge);
  nb.onclick = () => { if (!dodge()) ans(1, nb); };
}

export function qaCreate(H) {
  const { esc, view, toast } = H; let Q = { mode: 'fun', ...DEF.fun, name: '', pw: '', pw2: '' };
  const inp = (k, l, t = 'text') => `<label>${l}<input data-q="${k}" type="${t}" value="${esc(Q[k])}"></label>`;
  const sel = (k, l, o) => `<label>${l}<select data-q="${k}">${o.map((x) => `<option value="${x[0]}" ${Q[k] == x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select></label>`;
  const pay = () => ({ kind: 'qa', mode: Q.mode, q: Q.q.trim(), title: Q.q.trim().slice(0, 40), a: [Q.a0, Q.a1], m: [Q.m0, Q.m1], fx: [Q.f0, Q.f1], dg: +Q.dg, paper: Q.mode == 'fun' ? 'fantasy' : 'formal', name: Q.name.trim(), tone: Q.mode == 'fun' ? 0 : 1 });
  const pv = () => showQA($('#qpv'), pay(), { preview: true }, H);
  const rd = () => {
    view(`<div class="panel"><h2>سوال و جواب دو گزینه‌ای</h2><div class="grid"><button class="card ${Q.mode == 'fun' ? 'on' : ''}" data-md="fun"><i>😄</i>شوخ‌طبعانه</button><button class="card ${Q.mode == 'serious' ? 'on' : ''}" data-md="serious"><i>📜</i>جدی</button></div>
<label>سوال<textarea data-q="q" style="min-height:70px">${esc(Q.q)}</textarea></label>
<div class="row">${inp('a0', 'متن گزینه اول (موافق)')}${inp('a1', 'متن گزینه دوم (مخالف)')}</div>
<div class="row">${inp('m0', 'پیام بعد از گزینه اول')}${inp('m1', 'پیام بعد از گزینه دوم')}</div>
${Q.mode == 'fun' ? `<div class="row">${sel('f0', 'افکت گزینه اول', YF)}${sel('f1', 'افکت گزینه دوم', NF)}${inp('dg', 'تعداد دفعات فرار (۱ تا ۸)', 'number')}</div><small>گیرنده بعد از همین تعداد تلاش، همیشه می‌تونه گزینه دوم رو بزنه.</small>` : ''}
${inp('name', 'نام یا نام مستعار (اختیاری)')}<div class="row">${inp('pw', 'رمز (حداقل ۸ نویسه)', 'password')}${inp('pw2', 'تکرار رمز', 'password')}</div>
<h3>پیش‌نمایش (تستش کن)</h3><div id="qpv"></div><button class="btn" id="qmk">ساخت و دریافت لینک</button></div>`);
    $('#app').oninput = (e) => { const k = e.target.dataset.q; if (!k) return; Q[k] = e.target.value; if (k != 'pw' && k != 'pw2') pv(); };
    document.querySelectorAll('[data-md]').forEach((b) => b.onclick = () => { Q = { mode: b.dataset.md, ...DEF[b.dataset.md], name: Q.name, pw: Q.pw, pw2: Q.pw2 }; rd(); });
    $('#qmk').onclick = (e) => mk(e.target); pv();
  };
  async function mk(btn) {
    const p = pay();
    if (!p.q) return toast('سوال را بنویس'); if (!Q.a0.trim() || !Q.a1.trim()) return toast('متن هر دو گزینه لازمه');
    if (Q.pw.length < 8) return toast('رمز باید حداقل ۸ نویسه باشه'); if (Q.pw !== Q.pw2) return toast('تکرار رمز مطابقت نداره');
    btn.disabled = true; btn.textContent = 'در حال ساخت…';
    try {
      const id = H.b64(H.rnd(12)), A = H.b64(H.rnd(24)), salt = H.rnd(16), rb = await H.rkb(A); p.rk = H.b64(rb);
      const c = await H.seal(await H.kdf(Q.pw, salt), p), m = await H.seal(await H.imp(rb), { title: p.title });
      await H.rpc('create_letter', { p_id: id, p_salt: H.b64(salt), p_iv: c.iv, p_ct: c.ct, p_auth: await H.sha('auth' + A), p_meta: m });
      const base = location.origin + location.pathname, l1 = `${base}#/l/${id}`, l2 = `${base}#/m/${id}.${A}`;
      view(`<div class="panel"><h2>آماده‌ست 🎉</h2><p>لینک (رمز رو جدا بفرست):</p><div class="lk">${l1}</div><p><button class="btn" data-cp="${l1}">کپی لینک</button> <button class="btn ghost" data-sh="${l1}">اشتراک‌گذاری</button></p><hr><p><b>لینک مدیریت (محرمانه):</b> برای دیدن پاسخ‌ها و آمار. اگه گم بشه قابل بازیابی نیست.</p><div class="lk">${l2}</div><p><button class="btn ghost" data-cp="${l2}">کپی لینک مدیریت</button></p></div>`);
    } catch (e) { toast(e.message == 'net' ? 'اینترنت ضعیفه؛ دوباره تلاش کن' : 'ساخت ناموفق بود'); btn.disabled = false; btn.textContent = 'ساخت و دریافت لینک'; }
  }
  rd();
}
