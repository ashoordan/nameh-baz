import { CONFIG as C } from './config.js';
import { qaCreate, showQA } from './qa.js?v=8';
const $ = (s) => document.querySelector(s), enc = new TextEncoder(), dec = new TextDecoder();
const b64 = (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const ub64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const rnd = (n) => crypto.getRandomValues(new Uint8Array(n));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const view = (h) => { $('#app').innerHTML = h; scrollTo(0, 0); };
const toast = (m) => { const d = document.createElement('div'); d.className = 't'; d.textContent = m; $('#ts').append(d); setTimeout(() => d.remove(), 3200); };
const fmt = (d) => new Date(d).toLocaleDateString('fa-IR');

// ---------- Crypto (Web Crypto: PBKDF2 -> AES-256-GCM) ----------
const imp = (raw) => crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
const kdf = async (pw, salt) => crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: C.PBKDF2_ITER, hash: 'SHA-256' }, await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey']), { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
const seal = async (k, o) => { const iv = rnd(12); return { iv: b64(iv), ct: b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, enc.encode(JSON.stringify(o)))) }; };
const open = async (k, iv, ct) => JSON.parse(dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ub64(iv) }, k, ub64(ct))));
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)))].map((x) => x.toString(16).padStart(2, '0')).join('');
const rkb = async (s) => new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode('key' + s)));

// ---------- Storage (Supabase RPC) ----------
const rpc = async (fn, args) => {
  let r;
  try { r = await fetch(`${C.SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: C.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + C.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) }); } catch { throw Error('net'); }
  if (!r.ok) throw Error('srv');
  const t = await r.text(); return t ? JSON.parse(t) : null;
};

// ---------- Data ----------
const YN = 'قبول می‌کنم|خیلی خوشحالم کردی! 🎉\nنه، ممنون|مشکلی نیست، ممنون که صادق بودی 🤍', CH = 'گزینه اول|\nگزینه دوم|';
const T = [['نامه معمولی', '✉️', 'cream', '', '🕊️'], ['نامه شوخ‌طبعانه', '😄', 'fantasy', '', '🎈'], ['نامه عاشقانه', '💌', 'pink', '', '❤️'], ['دعوت‌نامه', '🎉', 'formal', YN, '🎈'], ['نامه رسمی و جدی', '📜', 'formal', '', '⚜️'], ['نامه معمایی', '🧩', 'dark', CH, '🔑'], ['نامه زمان‌دار', '⏳', 'texture', '', '⏳'], ['اعتراف و سؤال', '💭', 'white', YN, '💬']];
const TONES = [['شوخ و شیطنت‌آمیز', 'امروز چه شیطنتی در کاره؟ 😄'], ['جدی و احساسی', 'آنچه در دل داری را بنویس…'], ['معمولی و دوستانه', 'سلام! چی می‌خوای بنویسی؟']];
const THX = ['ثبت شد! فرستنده‌ات هیجان‌زده می‌شه 😉', 'پاسخ تو برای فرستنده ثبت شد.', 'پاسخت ثبت شد، ممنون!'];
const P = { cream: ['کرم کلاسیک', '#FFF4E3', '#38271F'], white: ['سفید مینیمال', '#FFFFFF', '#222222'], pink: ['صورتی عاشقانه', '#FFE4EA', '#5a2336'], dark: ['تیره', '#2b1d18', '#f3e3c8'], fantasy: ['فانتزی', '#EADFFF', '#3b2a5c'], formal: ['رسمی', '#F4F1EA', '#1d2330'], texture: ['بافت‌دار', '#EAD9B8', '#3a2a1a'] };
const ENV = ['#E88B32', '#803C42', '#D89011', '#35170F', '#5b7a5a'], FONTS = ['Vazirmatn', 'Tahoma', 'serif', 'cursive'], ALIGN = ['right', 'center', 'justify'];
const ec = (c) => (/^#[0-9a-f]{6}$/i.test(c) ? c : ENV[0]);

// ---------- Letter rendering ----------
const envH = (c, s) => `<div class="env" style="--ec:${ec(c)}"><div class="pp"></div><div class="fl"></div><div class="fr"></div><div class="sl">${esc(s || '✉️')}</div></div>`;
const links = (c) => {
  c = c || {}; const o = [], h = (u, t) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`, u = (s) => String(s || '').replace(/[^\w.]/g, ''), d = (s) => String(s || '').replace(/\D/g, '');
  if (u(c.ig)) o.push(h('https://instagram.com/' + u(c.ig), 'اینستاگرام'));
  if (u(c.tg)) o.push(h('https://t.me/' + u(c.tg), 'تلگرام'));
  if (d(c.wa)) o.push(h('https://wa.me/' + d(c.wa), 'واتساپ'));
  if (d(c.ph)) o.push(h('tel:' + d(c.ph), 'تماس'));
  try { const x = new URL(c.web); if (/^https?:$/.test(x.protocol)) o.push(h(esc(x.href), 'وب‌سایت')); } catch {}
  return o.length ? `<div class="ct">${o.join(' · ')}</div>` : '';
};
const TEX = { weave: 'background-image:repeating-linear-gradient(45deg,#0000000a 0 2px,#0000 2px 5px)', lines: 'background-image:repeating-linear-gradient(#0000 0 27px,#0000001f 27px 28px)', dots: 'background-image:radial-gradient(#00000022 1.2px,#0000 1.6px);background-size:14px 14px', grid: 'background-image:linear-gradient(#0000000f 1px,#0000 1px),linear-gradient(90deg,#0000000f 1px,#0000 1px);background-size:20px 20px' };
const TXO = [['none', 'ساده'], ['weave', 'بافت کاغذ'], ['lines', 'خط‌دار'], ['dots', 'نقطه‌ای'], ['grid', 'شطرنجی']];
const pst = (p) => {
  const pp = P[p.paper] || P.cream, hx = /^#[0-9a-f]{6}$/i, bg = hx.test(p.bg) ? p.bg : pp[1];
  const l = (parseInt(bg.slice(1, 3), 16) * 299 + parseInt(bg.slice(3, 5), 16) * 587 + parseInt(bg.slice(5, 7), 16) * 114) / 1000;
  const col = hx.test(p.color) ? p.color : hx.test(p.bg) ? (l > 140 ? '#2a1c14' : '#fff4e3') : pp[2], sz = Math.min(40, Math.max(12, +p.size || 18));
  return `background:${bg};color:${col};font-family:${FONTS.includes(p.font) ? p.font : 'Vazirmatn'},Vazirmatn,sans-serif;font-size:${sz}px;text-align:${ALIGN.includes(p.align) ? p.align : 'right'}${TEX[p.tex] ? ';' + TEX[p.tex] : ''}`;
};
const showLetter = (el, p, o) => {
  if (p.kind === 'qa') return showQA(el, p, o, H);
  const opts = Array.isArray(p.opts) ? p.opts : [];
  el.innerHTML = `<div class="paper ${p.paper === 'texture' ? 'tx' : ''}" style="${pst(p)}"><h2>${esc(p.title)}</h2><div class="bd2">${esc(p.body)}</div><p>${esc(p.sig)}</p><small>${p.name ? 'از طرف ' + esc(p.name) : 'فرستنده ناشناس'}</small>${opts.length ? `<div class="ops">${p.q ? `<p><b>${esc(p.q)}</b></p>` : ''}${opts.map((x, i) => `<button class="btn ghost" data-o="${i}">${esc(x[0])}</button>`).join('')}<p class="rx"></p></div>` : ''}${links(p.ct)}</div>`;
  el.querySelectorAll('[data-o]').forEach((b) => b.onclick = async () => {
    const i = +b.dataset.o; el.querySelectorAll('[data-o]').forEach((x) => x.disabled = true);
    el.querySelector('.rx').textContent = opts[i][1] || THX[p.tone ?? 2];
    if (o.preview) return;
    try { const s = await seal(await imp(ub64(p.rk)), { t: opts[i][0], at: Date.now() }); await rpc('submit_response', { p_id: o.id, p_iv: s.iv, p_ct: s.ct }); } catch { toast('ثبت پاسخ ناموفق بود'); }
  });
};
const stageH = () => `<div>${envH()}<div id="lt"></div></div>`;
const reveal = (p, o) => {
  const e = $('.env'); e.style.setProperty('--ec', ec(p.env)); $('.sl').textContent = p.seal || '✉️'; e.classList.add('open');
  setTimeout(() => showLetter($('#lt'), p, o), 1400);
};

// ---------- Create wizard ----------
let S;
const init = () => S = { step: 0, type: 0, tone: 2, title: '', body: '', sig: '', font: 'Vazirmatn', size: 18, color: '', align: 'right', paper: 'cream', tex: 'none', bg: '', env: ENV[0], seal: '🕊️', inter: 'none', q: '', opts: '', unlock: '', anon: false, name: '', ig: '', tg: '', wa: '', ph: '', web: '', show: true, pw: '', pw2: '' };
const f = (k, l, t = 'text') => `<label>${l}<input data-k="${k}" type="${t}" value="${esc(S[k])}"></label>`;
const ta = (k, l, ph = '') => `<label>${l}<textarea data-k="${k}" placeholder="${esc(ph)}">${esc(S[k])}</textarea></label>`;
const sel = (k, l, o) => `<label>${l}<select data-k="${k}">${o.map((x) => `<option value="${esc(x[0])}" ${S[k] == x[0] ? 'selected' : ''}>${esc(x[1])}</option>`).join('')}</select></label>`;
const ck = (k, l) => `<label class="ck"><input type="checkbox" data-k="${k}" ${S[k] ? 'checked' : ''}> ${l}</label>`;
const STEPS = ['نوع و لحن', 'نوشتن', 'تنظیمات', 'رمز و ساخت'];
const pay = () => ({ title: S.title.trim(), body: S.body, sig: S.sig, font: S.font, size: +S.size, color: S.color, align: S.align, paper: S.paper, tex: S.tex, bg: S.bg, env: S.env, seal: S.seal, tone: S.tone, q: S.q, unlock: S.unlock, name: S.anon ? '' : S.name.trim(), ct: S.show ? { ig: S.ig, tg: S.tg, wa: S.wa, ph: S.ph, web: S.web } : {}, opts: S.inter === 'ch' ? S.opts.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const [a, ...b] = l.split('|'); return [a.trim(), b.join('|').trim()]; }) : [] });
const steps = () => [
  `<h3>نوع نامه</h3><div class="grid">${T.map((t, i) => `<button class="card ${S.type == i ? 'on' : ''}" data-t="${i}"><i>${t[1]}</i>${t[0]}</button>`).join('')}</div><h3>لحن نامه</h3><div class="grid">${TONES.map((t, i) => `<button class="card ${S.tone == i ? 'on' : ''}" data-n="${i}">${t[0]}</button>`).join('')}</div><small>لحن فقط روی متن‌های راهنما و پیام‌های سیستمی اثر می‌گذاره؛ متن تو دست‌نخورده می‌مونه.</small>`,
  `${f('title', 'عنوان')}${ta('body', 'متن نامه', TONES[S.tone][1])}${f('sig', 'امضای پایانی')}<div class="row">${sel('font', 'فونت', [['Vazirmatn', 'وزیر'], ['Tahoma', 'تاهوما'], ['serif', 'سریف'], ['cursive', 'دست‌نویس']])}${f('size', 'اندازه', 'number')}<label>رنگ متن<input type="color" data-k="color" value="${S.color || '#38271F'}"></label>${sel('align', 'تراز', [['right', 'راست'], ['center', 'وسط'], ['justify', 'دوطرفه']])}</div><div class="row">${sel('paper', 'کاغذ', Object.entries(P).map(([k, v]) => [k, v[0]]))}${sel('tex', 'بافت کاغذ', TXO)}<label>رنگ پس‌زمینه دلخواه<input type="color" data-k="bg" value="${S.bg || '#FFF4E3'}"></label></div><button class="btn ghost" data-rbg="1">رنگ پیش‌فرض کاغذ</button><div id="lv"></div>`,
  `<h3>پاکت و تعامل</h3><div class="sw">${ENV.map((c) => `<button class="sw1 ${S.env == c ? 'on' : ''}" data-e="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div><div class="row">${sel('seal', 'مهر', ['🕊️', '❤️', '⚜️', '🔑', '🎈', '⏳', '💬', '🌙'].map((x) => [x, x]))}${sel('inter', 'تعامل با گیرنده', [['none', 'بدون تعامل'], ['ch', 'دکمه‌ها / گزینه‌ها']])}</div>${S.inter == 'ch' ? `${f('q', 'سؤال')}${ta('opts', 'هر خط یک گزینه: متن گزینه|پیام بعد از انتخاب (همیشه یک گزینه «رد» بذار)')}` : ''}<label>باز شدن نامه از تاریخ (اختیاری)<input type="datetime-local" data-k="unlock" value="${esc(S.unlock)}"></label><h3>فرستنده (اختیاری)</h3>${ck('anon', 'ارسال ناشناس (نام و اطلاعات تماس پیش‌فرض مخفی)')}<div class="row">${f('name', 'نام یا نام مستعار')}</div>${ck('show', 'نمایش اطلاعات تماس زیر نامه')}<div class="row">${f('ig', 'اینستاگرام')}${f('tg', 'تلگرام')}${f('wa', 'واتساپ')}${f('ph', 'شماره تماس')}${f('web', 'وب‌سایت')}</div>`,
  `<h3>رمز نامه</h3><div class="row"><label>رمز<input data-k="pw" type="password" autocomplete="new-password" value="${esc(S.pw)}"></label><label>تکرار رمز<input data-k="pw2" type="password" value="${esc(S.pw2)}"></label></div><div class="sm"><i id="sm"></i></div>${ck('sp', 'نمایش رمز').replace('data-k="sp"', 'id="sp"')}<small>حداقل ۸ نویسه، ترکیب حروف، عدد و علامت. رمز را جدا از لینک به مخاطبت بگو. اگه رمز گم بشه، نامه قابل بازیابی نیست.</small><h3>پیش‌نمایش</h3><div class="mid">${stageH()}<button class="btn ghost" id="pv">باز کردن</button></div><button class="btn" id="mk">ساخت نامه و دریافت لینک</button>`
];
function draw() {
  view(`<div class="panel"><div class="pb">${STEPS.map((s, i) => `<span class="${i < S.step ? 'dn' : ''} ${i == S.step ? 'on' : ''}"><b>${i + 1}</b>${s}</span>`).join('')}</div>${steps()[S.step]}<div class="nav">${S.step ? '<button class="btn ghost" id="bk">قبلی</button>' : '<span></span>'}${S.step < 3 ? '<button class="btn" id="nx">بعدی</button>' : ''}</div></div>`);
  upd(); strength();
}
const upd = () => { const e = $('#lv'); if (e) { const p = pay(); e.innerHTML = `<div class="paper ${p.paper === 'texture' ? 'tx' : ''}" style="${pst(p)}"><h2>${esc(p.title) || 'عنوان'}</h2><div class="bd2">${esc(p.body)}</div><p>${esc(p.sig)}</p></div>`; } };
const strength = () => { const e = $('#sm'); if (!e) return; const w = S.pw, s = (w.length >= 8) + (w.length >= 12) + /[A-Za-z]/.test(w) + /\d/.test(w) + /[^\w\s]/.test(w); e.style.width = s * 20 + '%'; e.style.background = s < 3 ? '#c0392b' : s < 5 ? '#E88B32' : '#4a9a4a'; };
const chk = () => {
  if (S.step == 1 && (!S.title.trim() || !S.body.trim())) return 'عنوان و متن نامه را بنویس';
  if (S.step == 2 && S.inter == 'ch' && pay().opts.length < 2) return 'حداقل دو گزینه لازمه';
  if (S.step == 3) { if (S.pw.length < 8) return 'رمز باید حداقل ۸ نویسه باشه'; if (S.pw !== S.pw2) return 'تکرار رمز مطابقت نداره'; }
};
async function make(btn) {
  btn.disabled = true; btn.textContent = 'در حال ساخت…';
  try {
    const id = b64(rnd(12)), A = b64(rnd(24)), salt = rnd(16), rb = await rkb(A), p = { ...pay(), rk: b64(rb) };
    const c = await seal(await kdf(S.pw, salt), p), m = await seal(await imp(rb), { title: p.title });
    await rpc('create_letter', { p_id: id, p_salt: b64(salt), p_iv: c.iv, p_ct: c.ct, p_auth: await sha('auth' + A), p_meta: m });
    const base = location.origin + location.pathname, l1 = `${base}#/l/${id}`, l2 = `${base}#/m/${id}.${A}`; init();
    view(`<div class="panel"><h2>نامه‌ات آماده‌ست 🎉</h2><p>لینک نامه (رمز رو جدا بفرست):</p><div class="lk">${l1}</div><p><button class="btn" data-cp="${l1}">کپی لینک</button> <button class="btn ghost" data-sh="${l1}">اشتراک‌گذاری</button></p><hr><p><b>لینک مدیریت (محرمانه):</b> برای دیدن بازدیدها و پاسخ‌ها و حذف نامه. اگه گم بشه، دسترسی به پاسخ‌ها رو از دست می‌دی و قابل بازیابی نیست.</p><div class="lk">${l2}</div><p><button class="btn ghost" data-cp="${l2}">کپی لینک مدیریت</button></p></div>`);
  } catch (e) { toast(e.message === 'net' ? 'اینترنت ضعیفه؛ دوباره تلاش کن' : 'ساخت نامه ناموفق بود؛ تنظیمات Supabase رو بررسی کن'); btn.disabled = false; btn.textContent = 'ساخت نامه و دریافت لینک'; }
}

// ---------- Receive / Manage ----------
const lk = (id) => { try { return JSON.parse(localStorage.getItem('lk' + id)) || { n: 0, u: 0 }; } catch { return { n: 0, u: 0 }; } };
const gone = () => view(`<div class="mid"><h2>این نامه منقضی شده یا وجود نداره</h2><p>نامه‌ها ۳۰ روز بعد از ساخت حذف می‌شن.</p><a class="btn" href="#/create">نوشتن نامه جدید</a></div>`);
async function recv(id) {
  view('<p class="mid">در حال بارگذاری…</p>'); let L;
  try { L = await rpc('get_letter', { p_id: id }); } catch (e) { return view(`<p class="mid">${e.message == 'net' ? 'اتصال اینترنت ضعیفه. دوباره تلاش کن.' : 'خطا در دریافت نامه.'}</p>`); }
  if (!L) return gone();
  view(`<div class="mid"><h2>یک نامه برای تو رسیده...</h2>${stageH()}<div id="pwb"><button class="btn" id="go">باز کردن نامه</button></div></div>`);
  $('#go').onclick = () => {
    $('#pwb').innerHTML = '<input id="rp" type="password" placeholder="رمز نامه" autocomplete="off"><button class="btn" id="ok">ورود</button><p class="er" id="er"></p>'; $('#rp').focus();
    const go = async () => {
      const q = lk(id); if (q.u > Date.now()) return $('#er').textContent = 'تلاش‌های زیاد؛ چند دقیقه بعد دوباره امتحان کن.';
      $('#ok').disabled = true; let p;
      try { p = await open(await kdf($('#rp').value, ub64(L.salt)), L.iv, L.ct); } catch {
        q.n++; if (q.n >= 5) { q.u = Date.now() + 3e5; q.n = 0; } try { localStorage.setItem('lk' + id, JSON.stringify(q)); } catch {}
        $('#er').textContent = 'رمز درست نیست. دوباره امتحان کن 🤍'; $('#ok').disabled = false; return;
      }
      try { localStorage.removeItem('lk' + id); } catch {}
      if (p.unlock && new Date(p.unlock) > new Date()) return $('#pwb').innerHTML = `<p>این نامه از ${new Date(p.unlock).toLocaleString('fa-IR')} قابل خوندنه ⏳</p>`;
      $('#pwb').remove(); reveal(p, { id });
    };
    $('#ok').onclick = go; $('#rp').onkeydown = (e) => e.key == 'Enter' && go();
  };
}
async function manage(x) {
  const [id, A] = (x || '').split('.'); let d;
  try { d = await rpc('get_manage', { p_id: id, p_auth: await sha('auth' + A) }); } catch { return view('<p class="mid">خطا در اتصال. دوباره تلاش کن.</p>'); }
  if (!d) return gone();
  const k = await imp(await rkb(A)); let title = '—', rs = [];
  try { title = (await open(k, d.meta.iv, d.meta.ct)).title; } catch {}
  for (const r of d.responses) { try { rs.push({ ...(await open(k, r.iv, r.ct)), at: r.at }); } catch {} }
  const cnt = {}; rs.forEach((r) => cnt[r.t] = (cnt[r.t] || 0) + 1);
  view(`<div class="panel"><h2>${esc(title)}</h2><p>ساخت: ${fmt(d.created)} · انقضا: ${fmt(d.expires)} · وضعیت: فعال<br>بازدید: ${d.views} · پاسخ: ${rs.length}</p>${Object.entries(cnt).map(([t, n]) => `<p>${esc(t)}: <b>${n}</b></p>`).join('')}<ul>${rs.map((r) => `<li>${esc(r.t)} — ${new Date(r.at).toLocaleString('fa-IR')}</li>`).join('')}</ul><button class="btn ghost" id="dl">حذف نامه</button></div>`);
  $('#dl').onclick = async () => { if (!confirm('نامه و همه پاسخ‌ها برای همیشه حذف می‌شن. مطمئنی؟')) return; try { await rpc('delete_letter', { p_id: id, p_auth: await sha('auth' + A) }); toast('نامه حذف شد'); location.hash = '#/'; } catch { toast('حذف ناموفق بود'); } };
}

// ---------- Static pages ----------
const home = () => view(`<section class="hero"><div><h1>بعضی حرف‌ها، لایق یک نامه‌اند.</h1><p>نامه‌ای بساز، رمز اختصاصی براش انتخاب کن و با یک لینک، به دست کسی برسون که باید بخوندش.</p><a class="btn" href="#/create">نوشتن یک نامه جدید</a> <a class="btn ghost" href="#/qa">سوال و جواب</a> <button class="btn ghost" data-sc>نامه چطور کار می‌کنه؟</button></div>${envH()}</section><div class="grid">${[['بدون ثبت‌نام', 'حساب نمی‌خوای، فقط بنویس.'], ['نامه‌های رمزدار', 'فقط با رمز اختصاصی باز می‌شه.'], ['طراحی و شخصی‌سازی', 'کاغذ، پاکت، مهر و لحن با خودته.'], ['حفظ حریم خصوصی', 'رمزگذاری توی مرورگر خودت انجام می‌شه.']].map((x) => `<div class="fx"><b>${x[0]}</b><br>${x[1]}</div>`).join('')}</div><h2 id="how">نامه چطور کار می‌کنه؟</h2><div class="grid">${['نامه‌ات را طراحی کن.', 'رمز و لینک اختصاصی بساز.', 'لینک را برای مخاطبت بفرست.'].map((x, i) => `<div class="fx"><b>${i + 1}</b> ${x}</div>`).join('')}</div><div class="mid"><h2>اولین نامه‌ات رو بنویس</h2><a class="btn" href="#/create">شروع کن</a></div>`);
const about = () => { const c = C.creator; view(`<div class="panel"><h2>نامه‌باز چیست؟</h2><p>نامه‌باز جاییه برای نوشتن و فرستادن نامه‌های دیجیتال، بدون ثبت‌نام. نامه‌ات رو طراحی می‌کنی، رمز اختصاصی براش می‌ذاری و با یک لینک به دست مخاطبت می‌رسونی. نامه‌ها توی مرورگر رمزگذاری می‌شن و ۳۰ روز بعد خودکار حذف می‌شن.</p><p>رمزگذاری واقعی و سمت مرورگره، اما هیچ سیستمی امنیت مطلق نداره. نسخه ${esc(C.app.version)}</p><h2>سازنده</h2><h3>${esc(c.name)}</h3><p>${esc(c.title)}</p><p>${esc(c.bio)}</p>${links(footLinks())}</div>`); };
const privacy = () => view(`<div class="panel"><h2>حریم خصوصی</h2><p>نامه‌های شما در مرورگر خودتان رمزگذاری می‌شوند. محتوای خوانای نامه‌ها در سرور ذخیره نمی‌شود و بدون رمز اختصاصی و کلید معتبر امکان خواندن آن‌ها وجود ندارد.</p><h3>محدودیت‌ها</h3><ul><li>رمز ضعیف قابل حدس‌زدنه؛ رمز قوی انتخاب کن.</li><li>هر کس لینک و رمز رو داشته باشه می‌تونه نامه رو بخونه.</li><li>تعداد بازدید، تاریخ ساخت و حجم داده برای سرور قابل مشاهده‌ست.</li><li>محدودیت تلاش ناموفق سمت مرورگره و جلوی مهاجم حرفه‌ای رو نمی‌گیره.</li><li>گیرنده بعد از ورود رمز می‌تونه پاسخ‌ها رو رمز کنه؛ فقط فرستنده با لینک مدیریت می‌خونه‌شون.</li></ul></div>`);
const footLinks = () => { const l = C.creator.links; return { ig: l.instagram.split('/').pop(), tg: l.telegram, wa: l.whatsapp, web: l.website }; };

// ---------- Router & events ----------
function route() {
  const [, a, b] = (location.hash.slice(1) || '/').split('/');
  document.querySelectorAll('nav a').forEach((x) => x.classList.toggle('on', x.dataset.nv == a));
  if (a == 'create') { if (!S) init(); draw(); } else if (a == 'about') about(); else if (a == 'privacy') privacy(); else if (a == 'qa') qaCreate(H); else if (a == 'l') recv(b); else if (a == 'm') manage(b); else home();
}
addEventListener('hashchange', route);
const nm = { instagram: 'اینستاگرام', telegram: 'تلگرام', whatsapp: 'واتساپ', email: 'ایمیل', website: 'وب‌سایت' };
const NAV = [['create', 'ساخت نامه', '<path d="M3 6h18v12H3z"/><path d="M3 7l9 7 9-7"/>'], ['qa', 'سوال و جواب', '<path d="M4 5h16v11H9l-5 4z"/>'], ['about', 'درباره', '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'], ['privacy', 'حریم خصوصی', '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>']];
const NH = NAV.map(([k, t, d]) => `<a href="#/${k}" data-nv="${k}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg><span>${t}</span></a>`).join('');
$('nav').innerHTML = NH; const nb = document.createElement('nav'); nb.id = 'nb'; nb.innerHTML = NH; document.body.append(nb);
$('#ft').innerHTML = `نامه‌باز · ${esc(C.creator.name)} ` + Object.entries(C.creator.links).filter(([, v]) => v).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener noreferrer">${nm[k]}</a>`).join(' · ');
document.addEventListener('input', (e) => {
  const k = e.target.dataset.k; if (!k) return;
  S[k] = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
  if (k == 'anon') { S.show = !S.anon; draw(); } else if (k == 'inter') draw(); else { upd(); strength(); }
});
document.addEventListener('click', async (e) => {
  const t = e.target.closest('button'); if (!t) return;
  const D = t.dataset;
  if (D.t) { const y = T[D.t]; S.type = +D.t; S.paper = y[2]; S.seal = y[4]; S.inter = y[3] ? 'ch' : 'none'; S.opts = y[3]; draw(); }
  else if (D.n) { S.tone = +D.n; draw(); }
  else if (D.e) { S.env = D.e; draw(); }
  else if (D.rbg) { S.bg = ''; draw(); }
  else if (D.sc !== undefined) $('#how').scrollIntoView({ behavior: 'smooth' });
  else if (D.cp) { try { await navigator.clipboard.writeText(D.cp); toast('کپی شد ✓'); } catch { toast('کپی نشد؛ دستی انتخاب کن'); } }
  else if (D.sh) { navigator.share ? navigator.share({ title: 'نامه‌باز', url: D.sh }).catch(() => {}) : toast('مرورگر از اشتراک‌گذاری پشتیبانی نمی‌کنه؛ لینک رو کپی کن'); }
  else if (t.id == 'nx') { const m = chk(); m ? toast(m) : (S.step++, draw()); }
  else if (t.id == 'bk') { S.step--; draw(); }
  else if (t.id == 'pv') { t.remove(); reveal(pay(), { preview: true }); }
  else if (t.id == 'mk') { const m = chk(); m ? toast(m) : make(t); }
});
document.addEventListener('change', (e) => { if (e.target.id == 'sp') document.querySelectorAll('[data-k=pw],[data-k=pw2]').forEach((i) => i.type = e.target.checked ? 'text' : 'password'); });
const H = { rpc, kdf, seal, imp, sha, rkb, b64, ub64, rnd, esc, view, toast, pst, links };
route();
