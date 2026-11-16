/* Touch input is separate from game state and desktop input. */
(function () {
  'use strict';

  window.createGameControls = function (options) {
    options = options || {};
    var overlay = document.getElementById('touch');
    var canvas = document.getElementById('c');
    var joystick = document.getElementById('joystick');
    var stick = document.getElementById('stick');
    var lookZone = document.getElementById('lookZone');
    var fireButton = document.getElementById('tf');
    var slowButton = document.getElementById('tb');
    var reloadButton = document.getElementById('tr');
    var sprintButton = document.getElementById('ts');
    var coarse = window.matchMedia('(any-pointer:coarse)');
    var listeners = [];
    var captures = new Map();
    var presses = new Map();
    var movePointer = null;
    var actionPointer = null;
    var sprintActive = false;
    var slowActive = slowButton && slowButton.getAttribute('aria-pressed') === 'true';
    var destroyed = false;
    var selectedMode = normalizeMode(options.mode);
    var touchAvailable = detectTouch();
    var effectiveMode = selectedMode === 'auto' ? (touchAvailable ? 'touch' : 'keyboard') : selectedMode;

    function call(name) {
      if (typeof options[name] === 'function') {
        return options[name].apply(null, Array.prototype.slice.call(arguments, 1));
      }
    }

    function playing() {
      return !destroyed && typeof options.isPlaying === 'function' && options.isPlaying();
    }

    function normalizeMode(mode) {
      return mode === 'touch' || mode === 'keyboard' ? mode : 'auto';
    }

    function detectTouch() {
      return coarse.matches || navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    }

    function listen(target, type, handler, config) {
      if (!target) return;
      target.addEventListener(type, handler, config);
      listeners.push(function () { target.removeEventListener(type, handler, config); });
    }

    function visual(element, active, toggle) {
      if (!element) return;
      element.classList.toggle('active', !!active);
      element.dataset.active = String(!!active);
      if (toggle || element === fireButton) element.setAttribute('aria-pressed', String(!!active));
    }

    function paintStick(x, y) {
      if (stick) stick.style.transform = 'translate(-50%, -50%) translate(' + x + 'px, ' + y + 'px)';
    }

    function prevent(event) {
      if (event.cancelable) event.preventDefault();
    }

    function capture(element, pointerId) {
      try {
        element.setPointerCapture(pointerId);
        captures.set(pointerId, element);
      } catch (_) { /* Synthetic and already-ended pointers cannot be captured. */ }
    }

    function release(pointerId) {
      var element = captures.get(pointerId);
      captures.delete(pointerId);
      if (!element) return;
      try {
        if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
      } catch (_) { /* A browser cancellation may have released it already. */ }
    }

    function setSprint(active) {
      sprintActive = !!active;
      visual(sprintButton, sprintActive, true);
      call('onSprint', sprintActive);
    }

    function reset() {
      movePointer = null;
      actionPointer = null;
      presses.clear();
      // Clear ownership before releasePointerCapture can dispatch lostpointercapture.
      Array.from(captures.keys()).forEach(release);
      paintStick(0, 0);
      visual(joystick, false);
      visual(lookZone, false);
      visual(fireButton, false);
      visual(reloadButton, false);
      visual(slowButton, slowActive, true);
      sprintActive = false;
      visual(sprintButton, false, true);
      call('onMove', 0, 0);
      call('onFire', false);
      call('onSprint', false);
    }

    function changeEffective(mode) {
      if (effectiveMode === mode) return;
      reset();
      effectiveMode = mode;
      call('onMode', mode);
    }

    function setMode(mode) {
      selectedMode = normalizeMode(mode);
      touchAvailable = detectTouch();
      var next = selectedMode === 'auto' ? (touchAvailable ? 'touch' : 'keyboard') : selectedMode;
      if (next === effectiveMode) reset();
      else changeEffective(next);
      return selectedMode;
    }

    function refresh() {
      if (destroyed) return;
      var available = detectTouch();
      if (selectedMode === 'auto' && available !== touchAvailable) {
        changeEffective(available ? 'touch' : 'keyboard');
      }
      touchAvailable = available;
      if (!playing() && (movePointer || actionPointer || presses.size || sprintActive)) reset();
      // The game can synchronize this attribute after a keyboard slow-time action.
      if (slowButton) slowActive = slowButton.getAttribute('aria-pressed') === 'true';
      visual(slowButton, slowActive, true);
    }

    function gameSurface(target) {
      return target === canvas || (overlay && target instanceof Node && overlay.contains(target));
    }

    function compatibilityMouse(event) {
      return event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents;
    }

    function detectPointerMode(event) {
      if (selectedMode !== 'auto' || !playing() || !gameSurface(event.target)) return;
      if (event.pointerType === 'touch' || event.pointerType === 'pen') changeEffective('touch');
      // Pointer Events avoid touch-generated mouse compatibility events altogether.
      else if (event.pointerType === 'mouse' && !compatibilityMouse(event) && !movePointer && !actionPointer && !presses.size) {
        changeEffective('keyboard');
      }
    }

    function startMove(event) {
      if (!playing() || effectiveMode !== 'touch' || movePointer || event.button > 0) return;
      prevent(event);
      var rect = joystick.getBoundingClientRect();
      var knob = stick ? stick.getBoundingClientRect() : { width: 0, height: 0 };
      movePointer = {
        id: event.pointerId,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        radius: Math.max(1, (Math.min(rect.width, rect.height) - Math.max(knob.width, knob.height)) / 2)
      };
      capture(joystick, event.pointerId);
      visual(joystick, true);
      updateMove(event);
    }

    function updateMove(event) {
      var dx = event.clientX - movePointer.x;
      var dy = event.clientY - movePointer.y;
      var distance = Math.hypot(dx, dy);
      var normalized = Math.min(1, distance / movePointer.radius);
      var strength = normalized <= 0.12 ? 0 : (normalized - 0.12) / 0.88;
      var nx = distance ? dx / distance : 0;
      var ny = distance ? dy / distance : 0;
      paintStick(nx * normalized * movePointer.radius, ny * normalized * movePointer.radius);
      call('onMove', nx * strength, ny * strength);
    }

    function startAction(kind, element, event) {
      if (!playing() || effectiveMode !== 'touch' || actionPointer || event.button > 0) return;
      prevent(event);
      actionPointer = { id: event.pointerId, kind: kind, x: event.clientX, y: event.clientY };
      capture(element, event.pointerId);
      visual(element, true);
      // FIRE owns the same aiming channel as the look zone, so one thumb can do both.
      if (kind === 'fire') call('onFire', true);
    }

    function activate(kind) {
      if (kind === 'reload') call('onReload');
      else if (kind === 'slow') {
        slowActive = !(slowButton && slowButton.getAttribute('aria-pressed') === 'true');
        var result = call('onSlow');
        if (typeof result === 'boolean') slowActive = result;
        visual(slowButton, slowActive, true);
      } else if (kind === 'sprint') setSprint(!sprintActive);
    }

    function bindTap(element, kind) {
      if (!element) return;
      listen(element, 'pointerdown', function (event) {
        if (!playing() || effectiveMode !== 'touch' || event.button > 0) return;
        // Each tap button accepts one contact; unrelated thumbs retain their channels.
        if (Array.from(presses.values()).some(function (press) { return press.element === element; })) return;
        prevent(event);
        presses.set(event.pointerId, { element: element, kind: kind });
        capture(element, event.pointerId);
        // Press feedback must not change a toggle's committed aria-pressed value.
        visual(element, true, false);
      }, { passive: false });
      listen(element, 'click', function (event) {
        if (!playing() || effectiveMode !== 'touch') return;
        prevent(event);
        // Native keyboard / assistive clicks have no pointer and detail zero.
        // Pointer taps are committed on pointerup, so their subsequent click is ignored.
        if (event.detail === 0 && !event.pointerType) activate(kind);
      });
    }

    function releaseChannel(pointerId, commit, event) {
      var affected = false;
      if (movePointer && movePointer.id === pointerId) {
        movePointer = null;
        paintStick(0, 0);
        visual(joystick, false);
        call('onMove', 0, 0);
        affected = true;
      }
      if (actionPointer && actionPointer.id === pointerId) {
        var kind = actionPointer.kind;
        actionPointer = null;
        visual(kind === 'fire' ? fireButton : lookZone, false);
        if (kind === 'fire') call('onFire', false);
        affected = true;
      }
      var press = presses.get(pointerId);
      if (press) {
        presses.delete(pointerId);
        var rect = press.element.getBoundingClientRect();
        var inside = event && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (commit && inside && playing() && effectiveMode === 'touch') activate(press.kind);
        visual(press.element, press.kind === 'slow' ? slowActive : press.kind === 'sprint' ? sprintActive : false, press.kind !== 'reload');
        affected = true;
      }
      release(pointerId);
      return affected;
    }

    listen(document, 'pointerdown', detectPointerMode, true);
    listen(joystick, 'pointerdown', startMove, { passive: false });
    listen(lookZone, 'pointerdown', function (event) { startAction('look', lookZone, event); }, { passive: false });
    listen(fireButton, 'pointerdown', function (event) { startAction('fire', fireButton, event); }, { passive: false });
    listen(fireButton, 'click', function (event) {
      if (playing() && effectiveMode === 'touch' && event.detail === 0 && !event.pointerType) {
        call('onFire', true);
        requestAnimationFrame(function () { call('onFire', false); });
      }
    });
    bindTap(slowButton, 'slow');
    bindTap(reloadButton, 'reload');
    bindTap(sprintButton, 'sprint');

    listen(document, 'pointermove', function (event) {
      var activeMove = movePointer && movePointer.id === event.pointerId;
      var activeAction = actionPointer && actionPointer.id === event.pointerId;
      if (!activeMove && !activeAction && !presses.has(event.pointerId)) {
        if (event.target === canvas && (event.movementX || event.movementY)) detectPointerMode(event);
        return;
      }
      if (!playing() || effectiveMode !== 'touch') { reset(); return; }
      prevent(event);
      if (activeMove) updateMove(event);
      else if (activeAction) {
        var dx = event.clientX - actionPointer.x;
        var dy = event.clientY - actionPointer.y;
        actionPointer.x = event.clientX;
        actionPointer.y = event.clientY;
        if (dx || dy) call('onLook', dx, dy);
      }
    }, { passive: false });

    listen(document, 'pointerup', function (event) { releaseChannel(event.pointerId, true, event); });
    function cancel(event) {
      // Cancellation releases only this thumb, plus latched sprint to prevent a stuck run.
      if (releaseChannel(event.pointerId, false, event) && sprintActive) setSprint(false);
    }
    listen(document, 'pointercancel', cancel);
    listen(document, 'lostpointercapture', cancel);
    listen(document, 'keydown', function (event) {
      if (selectedMode !== 'auto' || !playing() || event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest('input, select, textarea, [contenteditable="true"]')) return;
      if (event.target instanceof Element && event.target.closest('#touch button') && (event.code === 'Space' || event.code === 'Enter')) return;
      if (/^(Key[WASDQR]|Arrow(Up|Down|Left|Right)|Space|ShiftLeft|ShiftRight|Escape)$/.test(event.code)) changeEffective('keyboard');
    }, true);
    listen(window, 'blur', reset);
    listen(document, 'visibilitychange', function () { if (document.hidden) reset(); });
    listen(window, 'resize', function () {
      if (movePointer || actionPointer || presses.size) reset();
      refresh();
    });
    if (coarse.addEventListener) listen(coarse, 'change', refresh);
    else if (coarse.addListener) {
      coarse.addListener(refresh);
      listeners.push(function () { coarse.removeListener(refresh); });
    }

    paintStick(0, 0);
    visual(joystick, false);
    visual(lookZone, false);
    visual(fireButton, false);
    visual(reloadButton, false);
    visual(slowButton, slowActive, true);
    visual(sprintButton, false, true);
    call('onMode', effectiveMode);

    return {
      reset: reset,
      setMode: setMode,
      getMode: function () { return selectedMode; },
      refresh: refresh,
      destroy: function () {
        if (destroyed) return;
        reset();
        destroyed = true;
        listeners.splice(0).forEach(function (remove) { remove(); });
      }
    };
  };
}());
