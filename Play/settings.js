/* Local preferences are optional: private browsing must still be playable. */
(function (root) {
  'use strict';
  const defaults = {quality:'auto',volume:60,sensitivity:100,controlsMode:'auto',effects:true};
  const key = 'snow-and-lead.settings.v1';
  const clamp = (value,min,max,fallback) => Number.isFinite(Number(value)) ? Math.max(min,Math.min(max,Number(value))) : fallback;
  function validate(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
      quality:['auto','low','medium','high'].includes(source.quality)?source.quality:defaults.quality,
      volume:clamp(source.volume,0,100,defaults.volume),
      sensitivity:clamp(source.sensitivity,50,200,defaults.sensitivity),
      controlsMode:['auto','touch','keyboard'].includes(source.controlsMode)?source.controlsMode:defaults.controlsMode,
      effects:typeof source.effects === 'boolean'?source.effects:defaults.effects
    };
  }
  let current = {...defaults};
  try {current = validate(JSON.parse(root.localStorage.getItem(key)));} catch (_) { /* Storage may be unavailable. */ }
  root.GameSettings = {
    get:() => ({...current}),
    set:patch => {
      current = validate({...current,...patch});
      try {root.localStorage.setItem(key,JSON.stringify(current));} catch (_) { /* Session settings still work. */ }
      return {...current};
    }
  };
})(window);
