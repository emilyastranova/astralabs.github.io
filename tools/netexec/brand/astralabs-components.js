/* @ds-bundle: {"format":4,"namespace":"AstraLabs","components":[{"name":"Mark"},{"name":"Wordmark"},{"name":"Lockup"},{"name":"Button"},{"name":"Panel"},{"name":"Readout"},{"name":"StatusPill"},{"name":"Dial"},{"name":"HazardBand"},{"name":"SerialTag"},{"name":"AssetTag"},{"name":"FocusFrame"},{"name":"Terminal"}]} */
(function () {
  var React = window.React;
  var h = React.createElement, useState = React.useState, useEffect = React.useEffect;

  var MARK_O = 'M0 519.62 L300 0 L542.84 420.62 L466.63 420.62 L300 132 L76.21 519.62 Z';
  var MARK_I = 'M114.32 519.62 L300 198 L338.11 264 L228.63 453.62 L561.89 453.62 L600 519.62 Z';
  var SPIN = ['/', '—', '\\', '|'];

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function reduced() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function omit(obj, keys) {
    var out = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) out[k] = obj[k];
    return out;
  }
  // deterministic bars so a serial always renders the same barcode
  function bars(seed, n) {
    var s = 0, out = [];
    for (var c = 0; c < String(seed).length; c++) s = (s * 31 + String(seed).charCodeAt(c)) % 233280;
    for (var i = 0; i < n; i++) {
      s = (s * 9301 + 49297) % 233280;
      out.push(h('i', { key: i, style: { width: 1 + Math.floor((s / 233280) * 3), marginRight: 1 + (i % 3) } }));
    }
    return out;
  }

  /* ---------- Mark ---------- */
  function Mark(props) {
    var size = props.size || 32;
    var labelled = !!props.title;
    return h('svg', {
      className: cx('al-mark', props.trace && !reduced() && 'is-tracing', props.className),
      viewBox: '0 0 600 519.62', width: +(size * 600 / 519.62).toFixed(2), height: size,
      role: labelled ? 'img' : undefined, 'aria-label': props.title, 'aria-hidden': labelled ? undefined : true,
      style: props.style
    },
      h('g', { className: 'al-mark-outline' },
        h('path', { d: MARK_O, pathLength: 1 }), h('path', { d: MARK_I, pathLength: 1 })),
      h('g', { className: 'al-mark-fill' },
        h('path', { d: MARK_O }), h('path', { d: MARK_I })));
  }

  /* ---------- Wordmark: [ASTRA/LABS] ---------- */
  var WM = 'ASTRA/LABS';
  function Wordmark(props) {
    var size = props.size || 24;
    var boot = !!props.boot && !reduced();
    var loading = !!props.loading && !reduced();
    // boot phases: -1 hidden, 0 brackets + spinner, then a = letters of ASTRA, b = letters of LABS
    var ph = useState(boot ? -1 : 9), step = ph[0], setStep = ph[1];
    var sp = useState(0), spin = sp[0], setSpin = sp[1];
    var sn = useState(0), snap = sn[0], setSnap = sn[1];

    useEffect(function () {
      if (!boot) { setStep(9); return undefined; }
      var t, k = -1;
      setStep(-1);
      // 0: [ / ] appears spinning; 1-5: ASTRA left of the spinner; 6-9: LABS on its right
      function next() {
        k += 1; setStep(k);
        if (k < 9) t = setTimeout(next, k === 0 ? 480 : k === 5 ? 200 : 60);
        else t = setTimeout(function () { setSnap(function (x) { return x + 1; }); }, 220);
      }
      t = setTimeout(next, props.bootDelay == null ? 1650 : props.bootDelay);
      return function () { clearTimeout(t); };
    }, [boot, props.bootKey]);

    var spinning = loading || (boot && step >= 0 && step < 9);
    useEffect(function () {
      if (!spinning) return undefined;
      var t = setInterval(function () { setSpin(function (x) { return x + 1; }); }, 90);
      return function () { clearInterval(t); if (loading) setSnap(function (x) { return x + 1; }); };
    }, [spinning, loading]);

    if (step < 0) return h('span', { className: cx('al-wm', props.className), style: Object.assign({ fontSize: size, visibility: 'hidden' }, props.style), 'aria-hidden': true }, '[ASTRA/LABS]');
    var a = 'ASTRA'.slice(0, Math.max(0, Math.min(5, step))), b = 'LABS'.slice(0, Math.max(0, step - 5));
    var inner = [h('span', { key: 'a' }, a), h('span', { key: 's', className: 'al-wm-sl' }, spinning ? SPIN[spin % 4] : '/'), h('span', { key: 'b' }, b)];
    return h('span', {
      className: cx('al-wm', loading && 'is-loading', boot && 'is-booting', props.className),
      style: Object.assign({ fontSize: size }, props.style),
      role: 'img', 'aria-label': loading ? 'AstraLabs, loading' : 'AstraLabs'
    },
      h('span', { key: 'lb' + snap, className: cx('al-wm-br al-wm-lb', snap > 0 && 'is-snap'), 'aria-hidden': true }, '['),
      h('span', { className: 'al-wm-in', 'aria-hidden': true }, inner),
      h('span', { key: 'rb' + snap, className: cx('al-wm-br al-wm-rb', snap > 0 && 'is-snap'), 'aria-hidden': true }, ']'));
  }

  /* ---------- Lockup ---------- */
  function Lockup(props) {
    var size = props.size || 40;
    var stacked = props.variant === 'stacked';
    var boot = !!props.boot && !reduced();
    return h('span', {
      className: cx('al-lockup', stacked && 'is-stacked', boot && 'is-booting', props.interactive !== false && 'is-interactive', props.className),
      style: Object.assign({ gap: (stacked ? 0.35 : 0.42) * size }, props.style)
    },
      h(Mark, { key: 'm' + (props.bootKey || 0), size: stacked ? size * 1.6 : size * 1.05, trace: boot }),
      h(Wordmark, { size: size * 0.56, boot: props.boot, bootKey: props.bootKey, loading: props.loading }));
  }

  /* ---------- Button ---------- */
  function Button(props) {
    var v = props.variant || 'primary';
    var rest = omit(props, ['variant', 'className', 'children']);
    return h('button', Object.assign({ type: 'button' }, rest, { className: cx('al-btn', 'al-btn-' + v, props.className) }), props.children);
  }

  /* ---------- Panel ---------- */
  function Panel(props) {
    return h('div', { className: cx('al-panel', 'al-ticks', props.active && 'is-active', props.className), style: props.style },
      props.label ? h('span', { className: 'al-label' }, props.label) : null,
      props.value != null ? h('span', { className: 'al-panel-v' }, props.value, props.unit ? h('small', null, ' ' + props.unit) : null) : null,
      props.children);
  }

  /* ---------- Readout ---------- */
  function Readout(props) {
    return h('span', { className: cx('al-readout', props.className) },
      h('span', { className: 'al-label' }, props.label),
      h('b', null, props.value, props.unit ? h('small', null, ' ' + props.unit) : null));
  }

  /* ---------- StatusPill ---------- */
  var STATUS_WORD = { ok: 'Online', warn: 'Degraded', down: 'Offline', sync: 'Syncing' };
  function StatusPill(props) {
    var s = props.state || 'ok';
    return h('span', { className: cx('al-pill', 'is-' + s, props.className) }, props.children || STATUS_WORD[s]);
  }

  /* ---------- Dial: one ring, one arc, four markers ---------- */
  function Dial(props) {
    var v = Math.max(0, Math.min(1, props.value == null ? 0 : props.value));
    var size = props.size || 112, r = 46, C = 2 * Math.PI * r, kids = [];
    kids.push(h('circle', { key: 'trk', className: 'al-dial-trk', r: r }));
    kids.push(h('circle', { key: 'arc', className: 'al-dial-arc', r: r, transform: 'rotate(-90)', strokeDasharray: (C * v) + ' ' + C }));
    for (var i = 0; i < 4; i++) {
      var a = i * Math.PI / 2 - Math.PI / 2;
      kids.push(h('line', { key: 'm' + i, className: 'al-dial-mk', x1: Math.cos(a) * 51, y1: Math.sin(a) * 51, x2: Math.cos(a) * 56, y2: Math.sin(a) * 56 }));
    }
    kids.push(h('text', { key: 'v', className: 'al-dial-v', x: 0, y: 6, textAnchor: 'middle' }, props.label != null ? props.label : [Math.round(v * 100), h('tspan', { key: 'u', className: 'al-dial-u', dx: 2 }, '%')]));
    return h('span', { className: cx('al-dial', props.className) },
      h('svg', { viewBox: '-60 -60 120 120', width: size, height: size, role: 'img', 'aria-label': (props.sublabel ? props.sublabel + ' ' : '') + Math.round(v * 100) + ' percent' }, kids),
      props.sublabel ? h('span', { className: 'al-label' }, props.sublabel) : null);
  }

  /* ---------- HazardBand ---------- */
  function HazardBand(props) {
    return h('div', { className: cx('al-hazard', props.className), style: Object.assign({ height: props.height || 16 }, props.style), role: 'presentation' });
  }

  /* ---------- SerialTag ---------- */
  function SerialTag(props) {
    var serial = props.serial || 'AL-0451';
    return h('div', { className: cx('al-serial', props.className), style: props.style },
      h('div', { className: 'al-barcode', 'aria-hidden': true }, bars(serial, props.bars || 44)),
      h('div', { className: 'al-serial-row' }, h('span', null, serial), props.rev ? h('span', null, props.rev) : null));
  }

  /* ---------- AssetTag ---------- */
  function AssetTag(props) {
    var id = props.id || 'AL-0451';
    return h('div', { className: cx('al-tag', props.className), style: props.style },
      h('div', { className: 'al-tag-bar' }, h('span', null, props.header || 'Property of'), h('span', null, id)),
      h('div', { className: 'al-tag-body' }, h(Lockup, { size: props.size || 34, interactive: false })),
      h('div', { className: 'al-tag-foot' }, h('div', { className: 'al-hazard' }), h('div', { className: 'al-barcode', 'aria-hidden': true }, bars(id, 24))));
  }

  /* ---------- FocusFrame ---------- */
  function FocusFrame(props) {
    var active = props.active !== false;
    return h('div', { className: cx('al-focus', active && 'is-active', props.className), style: props.style },
      h('i', { className: 'al-focus-c c1' }), h('i', { className: 'al-focus-c c2' }), h('i', { className: 'al-focus-c c3' }), h('i', { className: 'al-focus-c c4' }),
      props.children);
  }

  /* ---------- Terminal ---------- */
  function Terminal(props) {
    var host = props.host || 'node-02.astralabs.dev';
    var user = props.user || 'emily';
    var short = host.split('.')[0];
    return h('div', { className: cx('al-term', props.className), style: props.style },
      props.lastLogin ? h('div', { className: 'al-term-dim' }, 'Last login: ' + props.lastLogin) : null,
      h('div', { className: 'al-term-lock' }, h(Lockup, { size: 26, interactive: false })),
      (props.lines || []).map(function (l, i) { return h('div', { key: i, className: 'al-term-line' }, l); }),
      h('div', { className: 'al-term-line' }, h('span', { className: 'al-term-k' }, user + '@' + short), h('span', { className: 'al-term-dim' }, ':~$ '), h('span', { className: 'al-term-cur' })));
  }

  window.AstraLabs = {
    Mark: Mark, Wordmark: Wordmark, Lockup: Lockup, Button: Button, Panel: Panel, Readout: Readout,
    StatusPill: StatusPill, Dial: Dial, HazardBand: HazardBand, SerialTag: SerialTag, AssetTag: AssetTag,
    FocusFrame: FocusFrame, Terminal: Terminal
  };
})();
