// تب «سوال و جواب» — چند سوال دو گزینه‌ای، افکت‌های شوخ‌طبعانه، راه ارتباطی اختیاری
const $ = (s) => document.querySelector(s), rn = (a, b) => a + Math.random() * (b - a);
const FXC = { flowers: ['🌸', '🌷', '🌹', '🌼'], hearts: ['❤️', '💖', '💕'], balloons: ['🎈', '🎈', '🎀', '🎉'], cats: ['😻', '🐱', '😸', '💘'], food: ['🍕', '🍫', '🍰', '🍩', '🍪'], stars: ['⭐', '🌟', '✨', '💫'], fire: ['🎆', '🎇', '✨', '🔥'] };
const YF = [['flowers', 'گل‌افشانی 🌸'], ['hearts', 'قلب‌ها ❤️'], ['particles', 'ذرات درخشان ✨'], ['balloons', 'بادکنک 🎈'], ['cats', 'گربه‌های عاشق 😻'], ['food', 'بارش خوراکی 🍕'], ['stars', 'ستاره‌باران 🌟'], ['fire', 'آتش‌بازی 🎆'], ['random', 'تصادفی 🎲'], ['none', 'فقط پیام']];
const NF = [['dodge', 'دکمه فرار می‌کنه 🏃'], ['swap', 'دکمه‌ها جاشون رو عوض می‌کنن 🔄'], ['shake', 'دکمه می‌لرزه 😬'], ['shrink', 'دکمه کوچیک می‌شه 🐜'], ['growyes', 'دکمه اول بزرگ‌تر می‌شه 🎈'], ['none', 'فقط پیام']];
const TEX = { weave: 'background-image:repeating-linear-gradient(45deg,#0000000a 0 2px,#0000 2px 5px)', lines: 'background-image:repeating-linear-gradient(#0000 0 27px,#0000001f 27px 28px)', dots: 'background-image:radial-gradient(#00000022 1.2px,#0000 1.6px);background-size:14px 14px', grid: 'background-image:linear-gradient(#0000000f 1px,#0000 1px),linear-gradient(90deg,#0000000f 1px,#0000 1px);background-size:20px 20px' };
const TXO = [['none', 'ساده'], ['weave', 'بافت کاغذ'], ['lines', 'خط‌دار'], ['dots', 'نقطه‌ای'], ['grid', 'شطرنجی']];
const PPO = [['fantasy', 'فانتزی'], ['cream', 'کرم کلاسیک'], ['white', 'سفید مینیمال'], ['pink', 'صورتی عاشقانه'], ['dark', 'تیره'], ['formal', 'رسمی'], ['texture', 'بافت‌دار']];
const IT = {
  fun: { q: 'قبول می‌کنی باهام بیای بیرون؟ 😄', a0: 'آره!', a1: 'نه', m0: 'ایول! 🎉', m1: 'باشه، ولی پشیمون می‌شی 😏', f0: 'flowers', f1: 'dodge', dg: 4, nx: 'end', dm: 'مطمئنی؟ 🤨\nدوباره فکر کن 😏\nدستم لغزید! 🙈\nاین دکمه خجالتیه 😳' },
  serious: { q: '', a0: 'بله', a1: 'خیر', m0: 'ممنون که پذیرفتی.', m1: 'ممنون که صادق بودی؛ احترام می‌گذارم.', f0: 'none', f1: 'none', dg: 4, nx: 'end', dm: '' }
};
const PAL = ['#E88B32', '#D89011', '#FFF4E3', '#ffd27a', '#803C42'];
const burstCss = (b) => {
  const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, ring = document.createElement('i');
  ring.style.cssText = `position:fixed;left:${x - 20}px;top:${y - 20}px;width:40px;height:40px;border:2px solid #E88B32;border-radius:50%;pointer-events:none;z-index:99`;
  document.body.append(ring); ring.animate([{ transform: 'scale(.3)', opacity: .9 }, { transform: 'scale(5)', opacity: 0 }], { duration: 700, easing: 'ease-out' }).onfinish = () => ring.remove();
  for (let i = 0; i < 46; i++) {
    const s = document.createElement('i'), c = PAL[i % PAL.length], w = rn(5, 11), t = i % 3, a = rn(0, 6.28), d = rn(70, 230), rot = rn(-540, 540);
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${t == 1 ? w * 0.5 : w}px;height:${t == 1 ? w * 1.8 : w}px;background:${c};border-radius:${t == 0 ? '50%' : '2px'};box-shadow:0 0 10px ${c};pointer-events:none;z-index:99`;
    document.body.append(s);
    s.animate([{ transform: 'translate(0,0) rotate(0) scale(.4)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 40}px) rotate(${rot / 2}deg) scale(1)`, opacity: 1, offset: .45 }, { transform: `translate(${Math.cos(a) * d * 1.15}px,${Math.sin(a) * d + 140}px) rotate(${rot}deg) scale(.5)`, opacity: 0 }], { duration: rn(1400, 2200), easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => s.remove();
  }
};
const burst = (b, ch) => {
  const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  for (let i = 0; i < 34; i++) {
    const s = document.createElement('span'); s.textContent = ch[i % ch.length];
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${rn(18, 36)}px;pointer-events:none;z-index:99`;
    document.body.append(s); const a = rn(0, 6.28), d = rn(80, 240);
    s.animate([{ transform: 'translate(0,0) scale(.3)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 60}px) rotate(${rn(0, 540)}deg) scale(1)`, opacity: 0 }], { duration: rn(1300, 2000), easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => s.remove();
  }
};

export function showQA(el, p, o, H) {
  const { esc } = H, rm = matchMedia('(prefers-reduced-motion:reduce)').matches, ct = H.links(p.ct);
  const items = p.items || [{ q: p.q, a: p.a, m: p.m, fx: p.fx, dg: p.dg, dm: [] }]; let idx = 0;
  let sty = H.pst({ paper: p.paper, size: 20, align: 'center' });
  if (/^#[0-9a-f]{6}$/i.test(p.bg)) { const h = p.bg, l = (parseInt(h.slice(1, 3), 16) * 299 + parseInt(h.slice(3, 5), 16) * 587 + parseInt(h.slice(5, 7), 16) * 114) / 1000; sty += `;background:${h};color:${l > 140 ? '#2a1c14' : '#fff4e3'}`; }
  if (TEX[p.tex]) sty += ';' + TEX[p.tex];
  const step = () => {
    const it = items[idx] || {}, [ya, na] = it.a || ['', ''], [ym, nm] = it.m || ['', ''], fx = it.fx || [], dm = Array.isArray(it.dm) ? it.dm : [];
    const max = Math.min(8, Math.max(1, +it.dg || 4)), last = idx >= items.length - 1; let n = 0, done = 0;
    el.innerHTML = `<div class="paper qa" style="${sty}">${items.length > 1 ? `<small>سوال ${idx + 1} از ${items.length}</small>` : ''}<h2>${esc(it.q)}</h2><div class="qb"><button class="btn" id="qy">${esc(ya)}</button><button class="btn ghost" id="qn">${esc(na)}</button></div><p class="dm"></p><p class="rx"></p><div class="nx"></div><small>${p.name ? 'از طرف ' + esc(p.name) : 'فرستنده ناشناس'}</small>${ct}</div>`;
    const yb = $('#qy'), nb = $('#qn'), qb = el.querySelector('.qb'), nx = el.querySelector('.nx');
    const ans = async (i, b) => {
      if (done) return; done = 1; el.querySelectorAll('.qb .btn').forEach((x) => x.disabled = true);
      el.querySelector('.rx').textContent = [ym, nm][i] || '';
      let k = fx[0]; if (k == 'random') { const ks = [...Object.keys(FXC), 'particles']; k = ks[Math.floor(Math.random() * ks.length)]; }
      if (k == 'confetti') k = 'particles';
      if (i == 0 && !rm && (k == 'particles' || FXC[k])) { b.classList.add('pop'); k == 'particles' ? burstCss(b) : burst(b, FXC[k]); }
      const early = i == 1 && it.nx == 'end', DF = 'ممنون که جواب دادی 🤍';
      if (!last && !early) nx.innerHTML = '<button class="btn" id="qx">سوال بعدی</button>';
      else nx.innerHTML = `<p><b>${esc((early ? p.endNo || p.end : p.end) || DF)}</b></p>${o.preview ? '<button class="btn ghost" id="qrt">تست دوباره</button>' : ''}`;
      if ($('#qx')) $('#qx').onclick = () => { idx++; step(); };
      if ($('#qrt')) $('#qrt').onclick = () => { idx = 0; step(); };
      if (o.preview) return;
      try { const s = await H.seal(await H.imp(H.ub64(p.rk)), { t: `${items.length > 1 ? idx + 1 + '. ' : ''}${it.q}: ${[ya, na][i]}`.slice(0, 220), at: Date.now() }); await H.rpc('submit_response', { p_id: o.id, p_iv: s.iv, p_ct: s.ct }); } catch { H.toast('ثبت پاسخ ناموفق بود'); }
    };
    const kind = fx[1], mv = ['dodge', 'swap', 'shake', 'shrink', 'growyes'].includes(kind), block = true, limit = mv ? max : Math.min(max, dm.length);
    const att = () => {
      if (n >= limit) return false; n++;
      if (!rm) {
        if (kind == 'dodge') nb.style.transform = `translate(${rn(-90, 90)}px,${rn(-50, 50)}px)`;
        else if (kind == 'shrink') nb.style.transform = `scale(${1 - 0.7 * n / max})`;
        else if (kind == 'growyes') yb.style.transform = `scale(${1 + 1.1 * n / max})`;
        else if (kind == 'swap') { qb.style.flexDirection = qb.style.flexDirection == 'row-reverse' ? 'row' : 'row-reverse'; [yb, nb].forEach((x) => x.animate([{ opacity: .2 }, { opacity: 1 }], { duration: 350 })); }
        else if (kind == 'shake') nb.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-12px)' }, { transform: 'translateX(12px)' }, { transform: 'translateX(0)' }], { duration: 350 });
      }
      if (dm.length) { const d = el.querySelector('.dm'); d.textContent = dm[Math.min(n - 1, dm.length - 1)]; d.style.cssText = 'color:#c0392b;font-weight:700;min-height:1.8em'; d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop'); }
      return block;
    };
    yb.onclick = () => ans(0, yb);
    nb.addEventListener('pointerenter', (e) => { if (e.pointerType == 'mouse' && kind == 'dodge') att(); });
    nb.onclick = () => { if (!att()) ans(1, nb); };
  };
  step();
}

export function qaCreate(H) {
  const { esc, view, toast } = H;
  let Q = { mode: 'fun', paper: 'fantasy', bg: '', tex: 'none', name: '', end: 'ممنون که جواب دادی 🤍', endNo: 'ممنون که جواب دادی 🤍', ig: '', tg: '', wa: '', ph: '', web: '', pw: '', pw2: '', items: [{ ...IT.fun }] };
  const tin = (i, k, l, t) => `<label>${l}<input data-i="${i}" data-q="${k}" type="${t || 'text'}" value="${esc(Q.items[i][k])}"></label>`;
  const tsel = (i, k, l, o) => `<label>${l}<select data-i="${i}" data-q="${k}">${o.map((x) => `<option value="${x[0]}" ${Q.items[i][k] == x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select></label>`;
  const gin = (k, l, t) => `<label>${l}<input data-q="${k}" type="${t || 'text'}" value="${esc(Q[k])}"></label>`;
  const itemH = (it, i) => `<div class="fx" style="border:1px solid #38271f33;margin:12px 0"><b>سوال ${i + 1}</b> ${Q.items.length > 1 ? `<button class="btn ghost" data-del="${i}">حذف</button>` : ''}
<label>سوال<textarea data-i="${i}" data-q="q" style="min-height:60px">${esc(it.q)}</textarea></label>${Q.items.length > 1 ? tsel(i, 'nx', 'اگه گزینه دوم رو زد', [['end', 'سوال‌ها تموم بشه'], ['cont', 'بره سوال بعدی']]) + '<small>اگه گزینه اول رو بزنه همیشه سوال بعدی ساخته می‌شه.</small>' : ''}
<div class="row">${tin(i, 'a0', 'گزینه اول')}${tin(i, 'a1', 'گزینه دوم')}</div><div class="row">${tin(i, 'm0', 'پیام بعد از گزینه اول')}${tin(i, 'm1', 'پیام بعد از گزینه دوم')}</div>
${Q.mode == 'fun' ? `<div class="row">${tsel(i, 'f0', 'افکت گزینه اول', YF)}${tsel(i, 'f1', 'افکت گزینه دوم', NF)}${tin(i, 'dg', 'حداکثر دفعات فرار (۱ تا ۸)', 'number')}</div>` : ''}<label>پیام برای هر بار کلیک روی گزینه دوم (هر خط یک بار؛ خالی = همون بار اول جواب ثبت بشه)<textarea data-i="${i}" data-q="dm" style="min-height:80px">${esc(it.dm)}</textarea></label><small>گیرنده بعد از این تعداد تلاش، همیشه می‌تونه گزینه دوم رو بزنه.</small></div>`;
  const pay = () => ({ kind: 'qa', mode: Q.mode, title: (Q.items[0].q || '').trim().slice(0, 40), paper: Q.paper, bg: Q.bg, tex: Q.tex, name: Q.name.trim(), tone: Q.mode == 'fun' ? 0 : 1, end: Q.end.trim(), endNo: Q.endNo.trim(), ct: { ig: Q.ig, tg: Q.tg, wa: Q.wa, ph: Q.ph, web: Q.web }, items: Q.items.map((it) => ({ q: it.q.trim(), a: [it.a0, it.a1], m: [it.m0, it.m1], fx: [it.f0, it.f1], dg: +it.dg, nx: it.nx, dm: (it.dm || '').split('\n').map((s) => s.trim()).filter(Boolean) })) });
  const pv = () => showQA($('#qpv'), pay(), { preview: true }, H);
  const rd = () => {
    const y = scrollY;
    view(`<div class="panel"><h2>سوال و جواب دو گزینه‌ای</h2><div class="grid"><button class="card ${Q.mode == 'fun' ? 'on' : ''}" data-md="fun"><i>😄</i>شوخ‌طبعانه</button><button class="card ${Q.mode == 'serious' ? 'on' : ''}" data-md="serious"><i>📜</i>جدی</button></div>
${Q.items.map(itemH).join('')}${Q.items.length < 10 ? '<button class="btn ghost" data-add="1">+ سوال جدید</button>' : ''}
${gin('end', 'پیام پایان وقتی همه سوال‌ها تموم شد')}${Q.items.length > 1 ? gin('endNo', 'پیام پایان وقتی با گزینه دوم تموم شد') : ''}${gin('name', 'نام یا نام مستعار (اختیاری)')}
<h3>ظاهر کاغذ</h3><div class="row"><label>کاغذ<select data-q="paper">${PPO.map((x) => `<option value="${x[0]}" ${Q.paper == x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select></label><label>بافت<select data-q="tex">${TXO.map((x) => `<option value="${x[0]}" ${Q.tex == x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select></label><label>رنگ پس‌زمینه دلخواه<input type="color" data-q="bg" value="${Q.bg || '#FFF4E3'}"></label></div><button class="btn ghost" data-rbg="1">برگردوندن رنگ پیش‌فرض کاغذ</button> <small>رنگ دلخواه جای رنگ کاغذ رو می‌گیره.</small>
<h3>راه ارتباطی (اختیاری، زیر سوال‌ها نشون داده می‌شه)</h3><div class="row">${gin('ig', 'اینستاگرام')}${gin('tg', 'تلگرام')}${gin('wa', 'واتساپ')}${gin('ph', 'شماره تماس')}${gin('web', 'وب‌سایت (https://...)')}</div>
<div class="row">${gin('pw', 'رمز (حداقل ۸ نویسه)', 'password')}${gin('pw2', 'تکرار رمز', 'password')}</div>
<h3>پیش‌نمایش (تستش کن)</h3><div id="qpv"></div><button class="btn" id="qmk">ساخت و دریافت لینک</button></div>`);
    scrollTo(0, y);
    $('#app').oninput = (e) => { const k = e.target.dataset.q; if (!k) return; const i = e.target.dataset.i; (i === undefined ? Q : Q.items[i])[k] = e.target.value; if (k != 'pw' && k != 'pw2') pv(); };
    document.querySelectorAll('[data-md]').forEach((b) => b.onclick = () => { const m = b.dataset.md; Q.mode = m; if (Q.paper == (m == 'fun' ? 'formal' : 'fantasy')) Q.paper = m == 'fun' ? 'fantasy' : 'formal'; Q.items = Q.items.map((it) => ({ ...it, f0: IT[m].f0, f1: IT[m].f1, dm: m == 'fun' ? (it.dm || IT.fun.dm) : (it.dm == IT.fun.dm ? '' : it.dm) })); rd(); });
    document.querySelectorAll('[data-add]').forEach((b) => b.onclick = () => { Q.items.push({ ...IT[Q.mode], q: '' }); rd(); });
    document.querySelectorAll('[data-rbg]').forEach((b) => b.onclick = () => { Q.bg = ''; rd(); });
    document.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => { Q.items.splice(+b.dataset.del, 1); rd(); });
    $('#qmk').onclick = (e) => mk(e.target); pv();
  };
  async function mk(btn) {
    const p = pay();
    if (p.items.some((it) => !it.q || !it.a[0].trim() || !it.a[1].trim())) return toast('سوال و متن هر دو گزینه برای همه سوال‌ها لازمه');
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
