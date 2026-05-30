/**
 * ============================================================
 * SOVEREIGN PLUGIN — Client Logic
 * Property of Albert Lane | No Kents Allowed
 * License: Custom — See LICENSE.md
 * Exhaustive UI Design: Albert & 1 Unknown Employee, Anthropic
 * Maths: Albert, Anthropic, Claude, Gemini
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── REFS ────────────────────────────────────────────────────
  const b1Button  = document.getElementById('b1-btn');
  const s1Window  = document.getElementById('s1');
  const s1Header  = document.getElementById('s1-header');
  const c1Column  = document.getElementById('c1');
  const r1        = document.getElementById('r1');
  const lCol      = document.getElementById('l-col');
  const pBlog     = document.getElementById('p-blog');

  // ── P BLOG VIEWPORT ─────────────────────────────────────────
  // Loads blog.albertlane.net inside P panel.
  // User only ever sees albertlane.net in the browser bar.
  const blogFrame     = document.createElement('iframe');
  blogFrame.src       = 'https://blog.albertlane.net';
  blogFrame.loading   = 'lazy';
  blogFrame.title     = 'Albert Lane — Forensic Audit Series';
  pBlog.appendChild(blogFrame);

  // ── B1: S1 → S2 EXPANSION ───────────────────────────────────
  // Toggles expanded class on S1.
  // R1 snaps to base of S2 via s2-mode class.
  // (original listener — preserved exactly)
  let s1Expanded = false;
  b1Button.addEventListener('click', () => {
    s1Expanded = !s1Expanded;
    s1Window.classList.toggle('expanded', s1Expanded);
    r1.classList.toggle('s2-mode', s1Expanded);
    b1Button.innerHTML = s1Expanded ? '&#9664;' : '&#9654;';
  });

  // S1 header tap — recalls scroll to top of R1
  s1Header.addEventListener('click', () => {
    r1.scrollTop = 0;
  });

  // ── C1: CLICK TO EXPAND INWARD ──────────────────────────────
  // (original listener — preserved exactly, guard added)
  c1Column.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT'  ||
        e.target.tagName === 'SELECT' ||
        e.target.tagName === 'BUTTON') return;
    c1Column.classList.toggle('expanded');
  });

  // ── LINK REVEAL LOGIC ────────────────────────────────────────
  // Single click: reveal travel path (color)
  // Double click: navigate
  // (original dblclick logic preserved, extended to single+double)
  function bindLinks(nodeList) {
    nodeList.forEach(el => {
      let clickTimer = null;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (clickTimer) {
          // Second click — navigate
          clearTimeout(clickTimer);
          clickTimer = null;
          el.classList.remove('path-revealed');
          const uri = el.dataset.uri;
          if (uri && uri !== '#') window.open(uri, '_blank', 'noopener,noreferrer');
        } else {
          // First click — reveal path
          el.classList.add('path-revealed');
          el.setAttribute('title', el.dataset.uri || '');
          clickTimer = setTimeout(() => {
            el.classList.remove('path-revealed');
            clickTimer = null;
          }, 2500);
        }
      });

      // Original dblclick preserved for touch devices
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const element = e.target;
        if (!element.classList.contains('path-revealed')) {
          element.classList.add('path-revealed');
          element.textContent = element.getAttribute('data-uri');
        } else {
          element.classList.remove('path-revealed');
          element.textContent = 'Link_Hidden';
        }
      });
    });
  }

  // ── S1 CHAT UI ───────────────────────────────────────────────

  const s1Log = document.createElement('div');
  s1Log.style.cssText =
    'flex:1;overflow-y:auto;font-size:0.78rem;' +
    'padding:0.4rem 0;min-height:0;';

  const s1Row = document.createElement('div');
  s1Row.style.cssText = 'display:flex;gap:0.3rem;flex-shrink:0;padding-top:0.4rem;';

  const s1Input = document.createElement('input');
  s1Input.type        = 'text';
  s1Input.placeholder = 'Query the Sovereign\u2026';
  s1Input.style.cssText =
    'flex:1;background:rgba(255,255,255,0.08);' +
    'border:1px solid rgba(255,255,255,0.18);color:#fff;' +
    'padding:0.4rem 0.5rem;font-family:monospace;font-size:0.76rem;outline:none;';

  const s1Btn = document.createElement('button');
  s1Btn.innerHTML     = '&#9654;';
  s1Btn.style.cssText =
    'background:rgba(150,130,200,0.35);color:#fff;' +
    'border:1px solid rgba(255,255,255,0.2);' +
    'padding:0.4rem 0.7rem;cursor:pointer;font-family:monospace;';

  s1Row.appendChild(s1Input);
  s1Row.appendChild(s1Btn);
  s1Window.appendChild(s1Log);
  s1Window.appendChild(s1Row);

  function s1Log_append(who, text, color) {
    const line = document.createElement('div');
    line.style.cssText =
      'padding:0.25rem 0;' +
      'border-bottom:1px solid rgba(255,255,255,0.05);' +
      'word-break:break-word;font-size:0.76rem;';
    const lbl = document.createElement('strong');
    lbl.style.color   = color || 'rgba(150,130,200,0.9)';
    lbl.textContent   = who + ': ';
    line.appendChild(lbl);
    line.appendChild(document.createTextNode(text));
    s1Log.appendChild(line);
    s1Log.scrollTop = s1Log.scrollHeight;
  }

  async function s1Submit() {
    const val = s1Input.value.trim();
    if (!val) return;
    s1Input.value = '';
    s1Log_append('You', val, '#8bbfe8');

    try {
      const res  = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: val })
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.results)) {
        renderR1(data.results, val);
        s1Log_append(
          'Sovereign',
          data.results.length + ' result' +
          (data.results.length !== 1 ? 's' : '') + ' in R1.',
          'rgba(150,130,200,0.9)'
        );
      } else {
        s1Log_append('Error', data.error || 'No results', '#ff6666');
      }
    } catch (err) {
      s1Log_append('Error', err.message, '#ff6666');
    }
  }

  s1Btn.addEventListener('click', s1Submit);
  s1Input.addEventListener('keydown', e => { if (e.key === 'Enter') s1Submit(); });

  // ── R1 RENDERER ──────────────────────────────────────────────

  r1.innerHTML =
    '<div style="padding:0.8rem;font-size:0.74rem;opacity:0.3;">' +
    'Awaiting query\u2026</div>';

  function renderR1(results, query) {
    r1.innerHTML = '';

    // Sticky header — tap to recall position:top
    const hdr = document.createElement('div');
    hdr.style.cssText =
      'padding:0.45rem 0.6rem;font-size:0.68rem;opacity:0.5;' +
      'border-bottom:1px solid rgba(255,255,255,0.07);' +
      'position:sticky;top:0;background:rgba(20,15,30,0.93);' +
      'cursor:pointer;';
    hdr.textContent = '\u201C' + query + '\u201D \u2014 ' + results.length + ' results';
    hdr.addEventListener('click', () => { r1.scrollTop = 0; });
    r1.appendChild(hdr);

    results.forEach((item, i) => {
      const entry = document.createElement('div');
      entry.style.cssText =
        'padding:0.6rem 0.6rem;' +
        'border-bottom:1px solid rgba(255,255,255,0.04);';

      // URI — grayscale by schema type (a11y)
      const uriEl = document.createElement('div');
      uriEl.className     = 'secured-link';
      uriEl.dataset.uri   = item.url || '#';
      uriEl.textContent   = item.url || 'unknown';
      uriEl.style.color   = schemaColor(item.schema || item.url || '');
      uriEl.style.marginBottom = '0.15rem';

      // Title
      const titleEl = document.createElement('div');
      titleEl.style.cssText =
        'color:#c8b8e8;font-size:0.85rem;font-weight:600;' +
        'line-height:1.3;margin-bottom:0.15rem;';
      titleEl.textContent = item.title || ('Result ' + (i + 1));

      // Description
      const descEl = document.createElement('div');
      descEl.style.cssText = 'font-size:0.74rem;opacity:0.65;line-height:1.5;';
      descEl.textContent   = item.description || '';

      entry.appendChild(uriEl);
      entry.appendChild(titleEl);
      entry.appendChild(descEl);

      // Metadata — red, per spec (fish can see it too)
      if (item.metadata) {
        const meta = document.createElement('div');
        meta.style.cssText  = 'color:#ff4444;font-size:0.66rem;margin-top:0.15rem;';
        meta.textContent    = '[META: ' + item.metadata + ']';
        entry.appendChild(meta);
      }

      r1.appendChild(entry);
    });

    syncL(results);
    bindLinks(r1.querySelectorAll('.secured-link'));
  }

  // ── L COLUMN — fixed vertical link positions ─────────────────

  function syncL(results) {
    lCol.innerHTML = '';
    results.slice(0, 11).forEach((item, i) => {
      const link = document.createElement('div');
      link.className     = 'secured-link';
      link.dataset.uri   = item.url || '#';
      link.textContent   = 'L' + String(i + 1).padStart(2, '0');
      link.style.cssText =
        'width:100%;text-align:center;padding:0.3rem 0;' +
        'border-bottom:1px solid rgba(255,255,255,0.04);' +
        'flex-shrink:0;color:' + schemaColor(item.schema || item.url || '') + ';';
      lCol.appendChild(link);
    });
    bindLinks(lCol.querySelectorAll('.secured-link'));
  }

  // URI schema → grayscale color (a11y per spec)
  function schemaColor(val) {
    if (/^https/i.test(val))  return '#cccccc';
    if (/^http/i.test(val))   return '#999999';
    if (/^ftp/i.test(val))    return '#777777';
    if (/^schema/i.test(val)) return '#555555';
    return '#444444';
  }

  // ── C1: SOVEREIGN AUDITOR ────────────────────────────────────

  const c1Label = document.createElement('div');
  c1Label.style.cssText =
    'font-size:0.62rem;opacity:0.4;letter-spacing:0.1em;' +
    'flex-shrink:0;padding-bottom:0.3rem;';
  c1Label.textContent = 'C1 \u2014 SOVEREIGN AUDITOR';

  // Model selector — switch models as if it's an API
  const modelSel = document.createElement('select');
  modelSel.style.cssText =
    'width:100%;background:rgba(100,80,120,0.55);color:#fff;' +
    'border:1px solid rgba(255,255,255,0.13);' +
    'padding:0.25rem 0.35rem;font-family:monospace;' +
    'font-size:0.65rem;margin-bottom:0.3rem;outline:none;cursor:pointer;flex-shrink:0;';

  [
    ['Llama 3 8B',    '@cf/meta/llama-3-8b-instruct'],
    ['Llama 3.1 8B',  '@cf/meta/llama-3.1-8b-instruct'],
    ['Llama 3.1 70B', '@cf/meta/llama-3.1-70b-instruct'],
    ['Mistral 7B',    '@cf/mistral/mistral-7b-instruct-v0.1'],
    ['Gemma 7B',      '@cf/google/gemma-7b-it']
  ].forEach(([label, val]) => {
    const o = document.createElement('option');
    o.value = val; o.textContent = label;
    modelSel.appendChild(o);
  });

  const c1Log = document.createElement('div');
  c1Log.style.cssText =
    'flex:1;overflow-y:auto;font-size:0.68rem;padding:0.2rem 0;min-height:0;';

  const c1Input = document.createElement('input');
  c1Input.type        = 'text';
  c1Input.placeholder = 'Auditor query\u2026';
  c1Input.style.cssText =
    'width:100%;background:rgba(255,255,255,0.06);' +
    'border:1px solid rgba(255,255,255,0.13);color:#fff;' +
    'padding:0.35rem 0.45rem;font-family:monospace;' +
    'font-size:0.68rem;outline:none;flex-shrink:0;';

  const c1Btn = document.createElement('button');
  c1Btn.innerHTML     = '&#9654;';
  c1Btn.style.cssText =
    'width:100%;margin-top:0.25rem;background:rgba(100,80,120,0.45);color:#fff;' +
    'border:1px solid rgba(255,255,255,0.13);padding:0.28rem;' +
    'cursor:pointer;font-family:monospace;font-size:0.68rem;flex-shrink:0;';

  c1Column.appendChild(c1Label);
  c1Column.appendChild(modelSel);
  c1Column.appendChild(c1Log);
  c1Column.appendChild(c1Input);
  c1Column.appendChild(c1Btn);

  function c1Log_append(who, text, color) {
    const line = document.createElement('div');
    line.style.cssText =
      'padding:0.2rem 0;border-bottom:1px solid rgba(255,255,255,0.04);' +
      'word-break:break-word;font-size:0.68rem;';
    const lbl = document.createElement('strong');
    lbl.style.color = color || 'rgba(130,100,180,0.9)';
    lbl.textContent = who + ': ';
    line.appendChild(lbl);
    line.appendChild(document.createTextNode(text));
    c1Log.appendChild(line);
    c1Log.scrollTop = c1Log.scrollHeight;
  }

  async function c1Submit() {
    const val = c1Input.value.trim();
    if (!val) return;
    c1Input.value = '';
    c1Log_append('\u25B6', val, '#8bbfe8');
    try {
      const res  = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: val, model: modelSel.value })
      });
      const data  = await res.json();
      const reply = (data && data.response)
        ? data.response
        : (data.error || JSON.stringify(data));
      c1Log_append('C1', typeof reply === 'string' ? reply : JSON.stringify(reply),
        'rgba(130,100,180,0.9)');
    } catch (err) {
      c1Log_append('ERR', err.message, '#ff6666');
    }
  }

  c1Btn.addEventListener('click', c1Submit);
  c1Input.addEventListener('keydown', e => { if (e.key === 'Enter') c1Submit(); });

});
          
