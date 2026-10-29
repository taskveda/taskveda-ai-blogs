/* TaskVeda spin-to-win wheel — self-contained widget.
   Adds a floating "Spin & win" ad. The wheel opens only when the visitor clicks it.
   Outcomes are weighted to the bootcamp prizes by config. */
(function () {
  'use strict';

  var ICONS = {
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 15 2 2 4-4"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    perfume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v3h-4z"/><path d="M9 5h6a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M7 12h10"/><path d="M12 16h.01"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M12 8S9.5 3 7 4.5 8 8 12 8zM12 8s2.5-5 5-3.5S16 8 12 8z"/></svg>'
  };

  var CONFIG = {
    prizes: [
      { id: 'bootcamp-21', label: 'Free 21-Day Zero to Confidence Bootcamp', lines: ['FREE 21-DAY', 'ZERO TO CONFIDENCE'], bg: '#FF6B2C', fg: '#FFFFFF', icon: ICONS.rocket },
      { id: 'recharge',    label: '1-Month Recharge',     lines: ['1-MONTH', 'RECHARGE'],       bg: '#161616', fg: '#FFFFFF', icon: ICONS.bolt },
      { id: 'bootcamp-11', label: '11-Day Free AI Bootcamp', lines: ['11-DAY FREE', 'AI BOOTCAMP'], bg: '#FF8A54', fg: '#FFFFFF', icon: ICONS.calendar },
      { id: 'perfumes',    label: 'Any 3 Perfumes Free',  lines: ['ANY 3 PERFUMES', 'FREE'],    bg: '#FFF1E8', fg: '#2A1A12', icon: ICONS.perfume, light: true },
      { id: 'mystery',     label: 'Amazing Mystery Box',  lines: ['AMAZING', 'MYSTERY BOX'],     bg: '#2B2B2B', fg: '#FFFFFF', icon: ICONS.gift }
    ],
    guaranteed: ['bootcamp-21', 'bootcamp-11'],
    spinMs: 5200,
    teaseMs: 2800,
    phone: '919966367583'
  };

  var TAU = Math.PI * 2;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rotation = -Math.PI / 5;
  var spinning = false;
  var hasWon = false;
  var lastWinner = null;
  var overlay, card, canvas, ctx, hub, spinBtn, resultBox, prizeEl, claimEl, teaser, wheelWrap, slotsLayer;
  var slots = [];
  var size = 0, dpr = 1;
  var bookingHandled = false;
  var teaseTimer = null;

  function rand() {
    if (window.crypto && window.crypto.getRandomValues) {
      var a = new Uint32Array(1);
      window.crypto.getRandomValues(a);
      return a[0] / 4294967296;
    }
    return Math.random();
  }

  function norm(a) {
    return ((a % TAU) + TAU) % TAU;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  var CSS = [
    '.tvsw-teaser{position:fixed;left:20px;bottom:20px;z-index:9998;width:min(344px,calc(100vw - 24px));background:linear-gradient(135deg,#FF7A3D 0%,#F04E0C 100%);color:#fff;border-radius:20px;box-shadow:0 20px 50px rgba(224,74,10,.35),0 4px 14px rgba(0,0,0,.12);opacity:0;transform:translateY(18px) scale(.98);transition:opacity .32s ease,transform .32s cubic-bezier(.2,.8,.2,1);font-family:"Inter",system-ui,sans-serif;overflow:hidden;}',
    '.tvsw-teaser.show{opacity:1;transform:none;}',
    '.tvsw-teaser::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 15%,rgba(255,255,255,.22),transparent 46%),radial-gradient(circle at 95% 100%,rgba(255,255,255,.12),transparent 40%);pointer-events:none;}',
    '.tvsw-teaser-pulse{animation:tvsw-teaser-pulse 1.2s ease-in-out 3;}',
    '@keyframes tvsw-teaser-pulse{0%,100%{box-shadow:0 20px 50px rgba(224,74,10,.35),0 4px 14px rgba(0,0,0,.12);}50%{box-shadow:0 0 0 8px rgba(255,107,44,.22),0 20px 50px rgba(224,74,10,.42);}}',
    '.tvsw-teaser-main{position:relative;z-index:1;display:flex;align-items:center;gap:13px;width:100%;padding:14px 36px 14px 14px;background:transparent;border:0;color:#fff;text-align:left;cursor:pointer;font-family:inherit;border-radius:20px;}',
    '.tvsw-teaser-art{position:relative;flex:0 0 56px;width:56px;height:56px;}',
    '.tvsw-teaser-wheel{position:absolute;inset:0;border-radius:50%;border:3px solid #fff;background:conic-gradient(#111 0 20%,#FF6B2C 20% 40%,#FFF1E8 40% 60%,#FF8A54 60% 80%,#FFD3BF 80% 100%);box-shadow:0 4px 10px rgba(90,20,0,.28);animation:tvsw-idle 18s linear infinite;}',
    '.tvsw-teaser-wheel::after{content:"";position:absolute;top:50%;left:50%;width:38%;height:38%;border-radius:50%;background:#111;border:2px solid #fff;transform:translate(-50%,-50%);}',
    '.tvsw-teaser-art::after{content:"";position:absolute;top:-5px;left:50%;transform:translateX(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid #fff;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}',
    '@keyframes tvsw-idle{to{transform:rotate(360deg);}}',
    '.tvsw-teaser-copy{display:flex;flex-direction:column;align-items:flex-start;min-width:0;}',
    '.tvsw-teaser-kicker{display:inline-flex;align-items:center;font-family:"DM Mono",monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.30);border-radius:100px;padding:3px 7px;margin-bottom:5px;}',
    '.tvsw-teaser b{display:block;font-family:"Plus Jakarta Sans",sans-serif;font-size:14.5px;font-weight:800;line-height:1.24;letter-spacing:-.01em;color:#fff;}',
    '.tvsw-teaser-sub{display:block;margin-top:3px;font-size:10.5px;line-height:1.4;color:rgba(255,255,255,.88);}',
    '.tvsw-teaser-fomo{display:inline-flex;align-items:center;gap:5px;margin-top:4px;font-family:"DM Mono",monospace;font-size:9px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#FFFFFF;opacity:.92;}',
    '.tvsw-teaser-fomo::before{content:"";width:5px;height:5px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.16);animation:tvsw-fomo-dot 1.6s ease-in-out infinite;}',
    '@keyframes tvsw-fomo-dot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.75);}}',
    '.tvsw-teaser-cta{display:inline-flex;align-items:center;gap:5px;margin-top:8px;background:#fff;color:#D9430A;border-radius:100px;padding:5px 11px;font-family:"Plus Jakarta Sans",sans-serif;font-size:10.5px;font-weight:800;letter-spacing:.01em;box-shadow:0 3px 8px rgba(90,20,0,.16);}',
    '.tvsw-teaser-cta svg{width:11px;height:11px;}',
    '.tvsw-teaser:hover .tvsw-teaser-cta{background:#FFF1E8;}',
    '.tvsw-teaser-x{position:absolute;top:7px;right:7px;z-index:4;width:24px;height:24px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:rgba(255,255,255,.85);font-size:13px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
    '.tvsw-teaser-x:hover{background:rgba(255,255,255,.26);color:#fff;}',
    '.tvsw-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(8,8,9,.66);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .25s ease;overflow:auto;font-family:"Inter",system-ui,sans-serif;}',
    '.tvsw-overlay.show{opacity:1;}',
    '.tvsw-overlay[hidden]{display:none;}',
    '.tvsw-card{position:relative;width:min(920px,100%);max-height:93vh;overflow:auto;background:#fff;border:1px solid #F0EDE9;border-radius:26px;padding:30px;display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center;box-shadow:0 40px 90px rgba(0,0,0,.30);transform:translateY(18px) scale(.97);transition:transform .32s cubic-bezier(.2,.8,.2,1);}',
    '.tvsw-overlay.show .tvsw-card{transform:none;}',
    '.tvsw-x{position:absolute;top:14px;right:14px;z-index:6;width:34px;height:34px;border:0;border-radius:50%;background:#FFF4EC;color:#C94A14;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
    '.tvsw-x:hover{background:#FFE6D8;}',
    '.tvsw-wheel-col{position:relative;display:flex;align-items:center;justify-content:center;}',
    '.tvsw-wheel-wrap{position:relative;width:100%;max-width:400px;aspect-ratio:1;margin:0 auto;}',
    '.tvsw-wheel-wrap canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}',
    '.tvsw-pointer{position:absolute;top:-7px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-top:28px solid #111;filter:drop-shadow(0 4px 5px rgba(0,0,0,.25));z-index:5;pointer-events:none;}',
    '.tvsw-hub{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:23%;aspect-ratio:1;border-radius:50%;border:5px solid #fff;background:#111;color:#fff;font-family:"Plus Jakarta Sans",sans-serif;font-weight:800;font-size:clamp(11px,1.5vw,14px);letter-spacing:.06em;cursor:pointer;z-index:4;box-shadow:0 0 0 5px rgba(255,107,44,.16),0 8px 22px rgba(0,0,0,.28);transition:background .18s ease,transform .12s ease;}',
    '.tvsw-hub:hover{background:#FF6B2C;}',
    '.tvsw-slots{position:absolute;inset:0;z-index:2;pointer-events:none;}',
    '.tvsw-slot{position:absolute;left:50%;top:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:var(--tvsw-slot-w,120px);text-align:center;will-change:transform;}',
    '.tvsw-slot-icon{display:flex;align-items:center;justify-content:center;width:var(--tvsw-icon,26px);height:var(--tvsw-icon,26px);border-radius:50%;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.24);box-shadow:0 1px 2px rgba(0,0,0,.10);}',
    '.tvsw-slot-icon svg{width:60%;height:60%;}',
    '.tvsw-slot.light .tvsw-slot-icon{background:rgba(0,0,0,.05);border-color:rgba(0,0,0,.10);}',
    '.tvsw-slot-text{font-family:"Plus Jakarta Sans",sans-serif;font-weight:800;font-size:var(--tvsw-slot-font,11px);line-height:1.18;letter-spacing:.01em;text-transform:uppercase;}',
    '.tvsw-slot:not(.light) .tvsw-slot-text{text-shadow:0 1px 2px rgba(0,0,0,.18);}',
    '.tvsw-hub:active{transform:translate(-50%,-50%) scale(.96);}',
    '.tvsw-hub:disabled{cursor:default;background:#111;opacity:.9;}',
    '.tvsw-copy{position:relative;z-index:2;}',
    '.tvsw-eyebrow{display:inline-flex;align-items:center;gap:7px;font-family:"DM Mono",monospace;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#E5581D;background:#FFF1E8;border-radius:100px;padding:6px 12px 6px 7px;margin-bottom:14px;}',
    '.tvsw-eyebrow-logo{width:18px;height:18px;object-fit:contain;border-radius:50%;background:#fff;padding:1px;}',
    '.tvsw-copy h2{font-family:"Plus Jakarta Sans",sans-serif;font-weight:800;font-size:clamp(25px,3.2vw,38px);line-height:1.1;letter-spacing:-.02em;color:#0A0A0A;}',
    '.tvsw-copy h2 span{color:#FF6B2C;}',
    '.tvsw-sub{margin-top:12px;font-size:14px;line-height:1.65;color:#8A8A93;max-width:340px;}',
    '.tvsw-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;max-width:340px;margin-top:20px;padding:14px 18px;border:0;border-radius:11px;background:#FF6B2C;color:#fff;font-family:"Plus Jakarta Sans",sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:background .18s ease,transform .12s ease;}',
    '.tvsw-btn:hover{background:#E5581D;}',
    '.tvsw-btn:active{transform:scale(.99);}',
    '.tvsw-btn:disabled{opacity:.55;cursor:default;}',
    '.tvsw-fine{margin-top:12px;font-size:11.5px;line-height:1.55;color:#A8A29B;max-width:330px;}',
    '.tvsw-fine b{color:#6B6B6B;font-weight:600;}',
    '.tvsw-result{margin-top:20px;padding:5px 0 0;}',
    '.tvsw-result[hidden]{display:none;}',
    '.tvsw-ok{width:44px;height:44px;border-radius:50%;background:#E6F7EC;color:#1B9A4B;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;margin-bottom:10px;}',
    '.tvsw-win-label{font-family:"DM Mono",monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#1B9A4B;}',
    '.tvsw-win-prize{font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(19px,2.4vw,24px);font-weight:800;line-height:1.25;color:#0A0A0A;margin-top:4px;}',
    '.tvsw-claim{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;max-width:340px;margin-top:16px;padding:13px 16px;border-radius:11px;background:#25D366;color:#fff;font-family:"Plus Jakarta Sans",sans-serif;font-size:14px;font-weight:700;text-decoration:none;transition:background .18s ease;}',
    '.tvsw-claim:hover{background:#1EBE5A;}',
    '.tvsw-claim svg{flex:0 0 auto;}',
    '.tvsw-claim-note{margin-top:9px;font-size:11.5px;color:#A8A29B;line-height:1.5;max-width:330px;}',
    '.tvsw-card.is-won .tvsw-intro,.tvsw-card.is-won #tvswSpinBtn{display:none;}',
    '.tvsw-confetti{position:absolute;top:-12px;width:7px;height:11px;border-radius:2px;z-index:8;pointer-events:none;animation:tvsw-fall 2.4s ease-in forwards;}',
    '@keyframes tvsw-fall{0%{opacity:0;transform:translate3d(0,-20px,0) rotate(0);}10%{opacity:1;}100%{opacity:0;transform:translate3d(var(--dx,0),72vh,0) rotate(var(--rot,360deg));}}',
    '@media (max-width:820px){.tvsw-card{grid-template-columns:1fr;gap:22px;padding:22px 18px 24px;}.tvsw-wheel-wrap{max-width:330px;}.tvsw-copy{text-align:center;}.tvsw-copy h2 span{display:inline;}.tvsw-sub,.tvsw-fine{margin-left:auto;margin-right:auto;}.tvsw-btn,.tvsw-claim,.tvsw-claim-note{margin-left:auto;margin-right:auto;}.tvsw-ok{margin-left:auto;margin-right:auto;}.tvsw-win-label{text-align:center;}.tvsw-win-prize{text-align:center;}.tvsw-x{top:10px;right:10px;}.tvsw-overlay{padding:10px;}}',
    '@media (max-width:480px){.tvsw-teaser{left:12px;right:12px;bottom:12px;width:auto;}.tvsw-card{max-height:95vh;border-radius:20px;padding:20px 14px 22px;}.tvsw-wheel-wrap{max-width:290px;}}',
    '@media (prefers-reduced-motion:reduce){.tvsw-teaser,.tvsw-overlay,.tvsw-card{transition:none;}.tvsw-confetti{display:none;}}'
  ].join('\n');

  function injectCSS() {
    var style = document.createElement('style');
    style.id = 'tvsw-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function build() {
    teaser = document.createElement('div');
    teaser.className = 'tvsw-teaser';
    teaser.innerHTML =
      '<button type="button" class="tvsw-teaser-main" aria-label="Open spin and win wheel">' +
        '<span class="tvsw-teaser-art"><span class="tvsw-teaser-wheel"></span></span>' +
        '<span class="tvsw-teaser-copy">' +
          '<span class="tvsw-teaser-kicker">Free seat</span>' +
          '<b>Spin &amp; win a free bootcamp seat</b>' +
          '<span class="tvsw-teaser-sub">Win amazing mystery boxes</span>' +
          '<span class="tvsw-teaser-fomo">Limited free seats &middot; Today only</span>' +
          '<span class="tvsw-teaser-cta">Tap to spin <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '</span>' +
      '</button>' +
      '<button type="button" class="tvsw-teaser-x" aria-label="Dismiss">&#10005;</button>';
    document.body.appendChild(teaser);

    overlay = document.createElement('div');
    overlay.className = 'tvsw-overlay';
    overlay.id = 'tvswOverlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'tvswTitle');
    overlay.innerHTML =
      '<div class="tvsw-card" id="tvswCard">' +
        '<button type="button" class="tvsw-x" aria-label="Close">&#10005;</button>' +
        '<div class="tvsw-wheel-col">' +
          '<div class="tvsw-wheel-wrap" id="tvswWheelWrap">' +
            '<canvas id="tvswCanvas" role="img" aria-label="Prize wheel: Free 21-Day Zero to Confidence Bootcamp, 1-Month Recharge, 11-Day Free AI Bootcamp, Any 3 Perfumes Free, Mystery Gift"></canvas>' +
            '<div class="tvsw-pointer" aria-hidden="true"></div>' +
            '<button type="button" class="tvsw-hub" id="tvswHub" aria-label="Spin the wheel">SPIN</button>' +
          '</div>' +
        '</div>' +
        '<div class="tvsw-copy">' +
          '<span class="tvsw-eyebrow"><img class="tvsw-eyebrow-logo" src="/images/logo.webp" alt=""> TaskVeda rewards</span>' +
          '<div class="tvsw-intro">' +
            '<h2 id="tvswTitle">Spin the wheel.<br><span>Win a free bootcamp.</span></h2>' +
            '<p class="tvsw-sub">Five prizes. One spin. Land on a free TaskVeda bootcamp seat and start building with AI.</p>' +
          '</div>' +
          '<div class="tvsw-result" id="tvswResult" aria-live="polite" hidden>' +
            '<div class="tvsw-ok">&#10003;</div>' +
            '<div class="tvsw-win-label">You won</div>' +
            '<div class="tvsw-win-prize" id="tvswPrize">Free 21-Day Bootcamp</div>' +
            '<a class="tvsw-claim" id="tvswClaim" href="#" target="_blank" rel="noopener">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24s8.24 3.7 8.24 8.24-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>' +
              'Claim on WhatsApp' +
            '</a>' +
            '<p class="tvsw-claim-note">Send us the prize name and your reference ID. Our team will activate your free seat.</p>' +
          '</div>' +
          '<button type="button" class="tvsw-btn" id="tvswSpinBtn">Spin now</button>' +
          '<p class="tvsw-fine"><b>Every spin wins</b> a free TaskVeda bootcamp seat. One claim per student.</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    card = document.getElementById('tvswCard');
    canvas = document.getElementById('tvswCanvas');
    ctx = canvas.getContext('2d');
    hub = document.getElementById('tvswHub');
    spinBtn = document.getElementById('tvswSpinBtn');
    resultBox = document.getElementById('tvswResult');
    prizeEl = document.getElementById('tvswPrize');
    claimEl = document.getElementById('tvswClaim');
    wheelWrap = document.getElementById('tvswWheelWrap');

    slotsLayer = document.createElement('div');
    slotsLayer.className = 'tvsw-slots';
    wheelWrap.insertBefore(slotsLayer, hub);
    CONFIG.prizes.forEach(function (p) {
      var slot = document.createElement('div');
      slot.className = 'tvsw-slot' + (p.light ? ' light' : '');
      slot.style.color = p.fg;
      slot.innerHTML = '<span class="tvsw-slot-icon">' + p.icon + '</span>' +
        '<span class="tvsw-slot-text">' + p.lines.join('<br>') + '</span>';
      slotsLayer.appendChild(slot);
      slots.push(slot);
    });

    teaser.querySelector('.tvsw-teaser-main').addEventListener('click', function () { open('teaser'); });
    teaser.querySelector('.tvsw-teaser-x').addEventListener('click', function () {
      hideTeaser();
      try { sessionStorage.setItem('tvswDismissed', '1'); } catch (err) {}
    });

    overlay.querySelector('.tvsw-x').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });

    hub.addEventListener('click', spin);
    spinBtn.addEventListener('click', spin);

    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(wheelWrap);
    } else {
      window.addEventListener('resize', resize);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(); });
  }

  function resize() {
    if (!canvas || !wheelWrap) return;
    var rect = wheelWrap.getBoundingClientRect();
    var px = Math.max(160, Math.min(rect.width, rect.height || rect.width));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(px * dpr);
    canvas.height = Math.round(px * dpr);
    size = px;
    wheelWrap.style.setProperty('--tvsw-slot-font', Math.max(9, px * 0.029).toFixed(1) + 'px');
    wheelWrap.style.setProperty('--tvsw-icon', Math.max(17, px * 0.062).toFixed(1) + 'px');
    wheelWrap.style.setProperty('--tvsw-slot-w', Math.max(84, px * 0.305).toFixed(1) + 'px');
    draw();
  }

  function draw() {
    if (!ctx || !size) return;
    var c = size / 2;
    var R = c - 14;
    var n = CONFIG.prizes.length;
    var seg = TAU / n;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(c, c, c - 2, 0, TAU);
    ctx.fillStyle = '#111111';
    ctx.fill();

    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(rotation);
    for (var i = 0; i < n; i++) {
      var p = CONFIG.prizes[i];
      var a0 = -Math.PI / 2 + i * seg;
      var a1 = a0 + seg;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, a0, a1);
      ctx.closePath();
      ctx.fillStyle = p.bg;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.12)';
      ctx.lineWidth = 2;
      ctx.stroke();

    }
    ctx.restore();

    var gloss = ctx.createRadialGradient(c * 0.66, c * 0.28, size * 0.02, c, c, R);
    gloss.addColorStop(0, 'rgba(255,255,255,.20)');
    gloss.addColorStop(0.45, 'rgba(255,255,255,.04)');
    gloss.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(c, c, R, 0, TAU);
    ctx.fillStyle = gloss;
    ctx.fill();

    var bulbs = 24;
    for (var b = 0; b < bulbs; b++) {
      var ang = (b / bulbs) * TAU;
      var bx = c + Math.cos(ang) * (R + 6);
      var by = c + Math.sin(ang) * (R + 6);
      ctx.beginPath();
      ctx.arc(bx, by, Math.max(2, size * 0.006), 0, TAU);
      ctx.fillStyle = b % 2 ? '#FFD3BF' : '#FF6B2C';
      ctx.fill();
    }

    layoutSlots();
  }

  function layoutSlots() {
    if (!slots.length || !size) return;
    var R = (size / 2 - 14) * 0.60;
    var n = CONFIG.prizes.length;
    var seg = TAU / n;
    for (var i = 0; i < slots.length; i++) {
      var mid = -Math.PI / 2 + (i + 0.5) * seg + rotation;
      var x = Math.cos(mid) * R;
      var y = Math.sin(mid) * R;
      slots[i].style.transform = 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    }
  }

  function pickWinnerIndex() {
    var ids = CONFIG.guaranteed;
    var id = ids[Math.floor(rand() * ids.length)];
    for (var i = 0; i < CONFIG.prizes.length; i++) {
      if (CONFIG.prizes[i].id === id) return i;
    }
    return 0;
  }

  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function spin() {
    if (spinning) return;
    if (hasWon) resetUI();
    spinning = true;
    hub.disabled = true;
    spinBtn.disabled = true;
    hub.textContent = '...';
    resultBox.hidden = true;
    card.classList.remove('is-won');

    var idx = pickWinnerIndex();
    var n = CONFIG.prizes.length;
    var seg = TAU / n;
    var jitter = (rand() - 0.5) * seg * 0.35;
    var target = -(idx + 0.5) * seg + jitter;
    var turns = 5 + Math.floor(rand() * 3);
    var start = rotation;
    var delta = norm(target) - norm(start);
    if (delta < 0) delta += TAU;
    var total = turns * TAU + delta;
    var duration = reduceMotion ? 900 : CONFIG.spinMs;
    var started = performance.now();

    function frame(now) {
      var t = Math.min((now - started) / duration, 1);
      rotation = start + total * easeOutQuint(t);
      draw();
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        finish(idx);
      }
    }
    requestAnimationFrame(frame);
  }

  function finish(idx) {
    spinning = false;
    hasWon = true;
    lastWinner = CONFIG.prizes[idx];
    hub.disabled = false;
    hub.textContent = 'WIN';
    spinBtn.disabled = false;
    prizeEl.textContent = lastWinner.label;
    var ref = 'TV-SPIN-' + String(Math.floor(100000 + rand() * 900000));
    var msg = 'Hi TaskVeda! I won "' + lastWinner.label + '" on the spin wheel. My reference: ' + ref;
    claimEl.href = 'https://wa.me/' + CONFIG.phone + '?text=' + encodeURIComponent(msg);
    resultBox.hidden = false;
    card.classList.add('is-won');
    burstConfetti();
  }

  function resetUI() {
    hasWon = false;
    lastWinner = null;
    resultBox.hidden = true;
    card.classList.remove('is-won');
    hub.textContent = 'SPIN';
    hub.disabled = false;
    spinBtn.disabled = false;
  }

  function burstConfetti() {
    if (reduceMotion) return;
    var colors = ['#FF6B2C', '#FFB48F', '#1B9A4B', '#111111', '#FFD3BF'];
    for (var i = 0; i < 44; i++) {
      var s = document.createElement('span');
      s.className = 'tvsw-confetti';
      s.style.left = (8 + rand() * 84) + '%';
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = (rand() * 0.4) + 's';
      s.style.setProperty('--dx', ((rand() * 2 - 1) * 140) + 'px');
      s.style.setProperty('--rot', ((rand() * 720 - 360)) + 'deg');
      card.appendChild(s);
      (function (el) {
        setTimeout(function () { el.remove(); }, 3200);
      })(s);
    }
  }

  function modalStillOpen() {
    return !!document.querySelector('.wm-overlay.open, .success-overlay.show');
  }

  function anotherModalOpen() {
    return modalStillOpen() || document.body.style.overflow === 'hidden';
  }

  function open(source) {
    if (!overlay || !overlay.hidden) return;
    clearTimeout(teaseTimer);
    hideTeaser();
    resetUI();
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add('show');
      resize();
      draw();
    });
    document.body.style.overflow = 'hidden';
    card.dataset.source = source || 'manual';
    setTimeout(function () {
      var x = overlay.querySelector('.tvsw-x');
      if (x) x.focus({ preventScroll: true });
    }, 120);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(function () {
      overlay.hidden = true;
      document.body.style.overflow = modalStillOpen() ? 'hidden' : '';
      showTeaser();
    }, reduceMotion ? 0 : 220);
  }

  function showTeaser() {
    if (!teaser || !overlay.hidden) return;
    if (anotherModalOpen()) { teaseTimer = setTimeout(showTeaser, 4000); return; }
    try { if (sessionStorage.getItem('tvswDismissed') === '1') return; } catch (err) {}
    teaser.classList.add('show');
  }

  function hideTeaser() {
    if (teaser) teaser.classList.remove('show');
  }

  function nudgeTeaser() {
    if (!teaser || !overlay.hidden) return;
    try { if (sessionStorage.getItem('tvswDismissed') === '1') return; } catch (err) {}
    showTeaser();
    teaser.classList.remove('tvsw-teaser-pulse');
    void teaser.offsetWidth;
    teaser.classList.add('tvsw-teaser-pulse');
    setTimeout(function () { teaser.classList.remove('tvsw-teaser-pulse'); }, 4500);
  }

  function watchBookings() {
    var selectors = ['.success-overlay.show', '.guidance-success.show', '.wm-success:not([hidden])', '.success.show'];
    function visible(el) {
      if (!el) return false;
      var cs = window.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
      var r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }
    function scan() {
      if (bookingHandled) return;
      for (var i = 0; i < selectors.length; i++) {
        var els = document.querySelectorAll(selectors[i]);
        for (var j = 0; j < els.length; j++) {
          if (visible(els[j])) {
            bookingHandled = true;
            setTimeout(nudgeTeaser, 900);
            return;
          }
        }
      }
    }
    var obs = new MutationObserver(scan);
    obs.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['class', 'hidden'], childList: true });
    setTimeout(scan, 1500);
    document.addEventListener('taskveda:booking-success', function () {
      if (bookingHandled) return;
      bookingHandled = true;
      setTimeout(nudgeTeaser, 500);
    });
  }

  function boot() {
    injectCSS();
    build();
    watchBookings();
    var params = new URLSearchParams(window.location.search);
    if (params.get('fast') === '1') CONFIG.spinMs = 600;
    if (params.get('nospin') === '1') return;
    teaseTimer = setTimeout(showTeaser, CONFIG.teaseMs);
    if (params.get('spin') === '1') {
      setTimeout(function () {
        open('url');
        if (params.get('autospin') === '1') setTimeout(spin, 400);
      }, 250);
    }
  }

  window.TaskVedaSpin = {
    open: open,
    close: close,
    spin: spin,
    reset: resetUI,
    config: CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
