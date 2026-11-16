(function () {
  'use strict';
  const go = document.getElementById('go');
  const status = document.getElementById('loadStatus');
  const errorBox = document.getElementById('loadError');
  const errorText = document.getElementById('loadErrorText');
  let failed = false;
  function fail(message) {
    if (failed) return;
    failed = true;
    go.disabled = true;
    status.textContent = 'Не удалось запустить игру';
    errorText.textContent = message;
    errorBox.hidden = false;
    document.body.dataset.state = 'error';
    if (window.SnowGame) window.SnowGame.stop();
    document.querySelectorAll('.scr').forEach(screen => screen.style.display = 'none');
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('loadRetry').focus({preventScroll:true});
  }
  if(!window.isBlazorGame)document.getElementById('loadRetry').addEventListener('click',() => location.reload());
  function load(source) {
    return new Promise((resolve,reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(() => reject(new Error('Загрузка заняла слишком много времени. Распакуй архив полностью и попробуй ещё раз.')),20000);
      script.src = source;
      script.onload = () => {clearTimeout(timeout);resolve();};
      script.onerror = () => {clearTimeout(timeout);reject(new Error('Не найден файл '+source+'. Распакуй весь архив и запусти START_GAME.cmd для открытия через локальный сервер.'));};
      document.head.appendChild(script);
    });
  }
  window.addEventListener('error',event => {
    if (event.filename && /\/(game|controls|settings)\.js(?:\?|$)/.test(event.filename)) {
      fail('Игра остановлена из-за ошибки. Нажми «Повторить запуск». Если ошибка повторяется, попробуй другой браузер.');
    }
  });
  (async function () {
    try {
      status.textContent = 'Подготовка города…';
      for (const source of ['vendor/three.min.js','settings.js','controls.js','game.js']) await load(source);
      if (!window.THREE || !window.SnowGame) throw new Error('Файлы игры не загрузились. Распакуй архив полностью и запусти локальный сервер.');
      await window.SnowGame.boot();
      if (failed) return;
      status.textContent = 'Можно играть без интернета';
      window.SnowGame.ready=true;
      if(!window.isBlazorGame)go.disabled = false;
      go.focus({preventScroll:true});
    } catch (error) {
      fail(/WebGL|context/i.test(error.message)
        ? 'Браузер не смог включить 3D-графику WebGL. Включи аппаратное ускорение или открой игру в другом современном браузере.'
        : error.message);
    }
  })();
})();
