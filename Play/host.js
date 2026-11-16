(function () {
  'use strict';
  const progressKey='snow-and-lead.csharp-progress.v1';
  let started=false;
  window.SnowHost={
    initialize:async function (reference) {
      if(started)return !!(window.SnowGame&&window.SnowGame.ready);
      started=true;window.isBlazorGame=true;window.SnowCoreRef=reference;
      document.getElementById('loadRetry').addEventListener('click',()=>location.reload());
      try{
      try{const saved=localStorage.getItem(progressKey);if(saved)reference.invokeMethod('ImportProgress',saved)}catch(_){/* Private storage is optional. */}
      await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='boot.js';script.onload=resolve;script.onerror=()=>reject(new Error('Не найден boot.js'));document.head.appendChild(script)});
      const deadline=performance.now()+30000;
      while(!window.SnowGame||!window.SnowGame.ready){
        if(document.getElementById('loadError')&&!document.getElementById('loadError').hidden)throw new Error(document.getElementById('loadErrorText').textContent);
        if(performance.now()>deadline)throw new Error('Не удалось подготовить игровой мир.');
        await new Promise(resolve=>setTimeout(resolve,50));
      }
      window.SnowHost.saveProgress();
      return true;
      }catch(error){
        if(window.SnowGame)try{window.SnowGame.stop()}catch(_){}
        document.querySelectorAll('.scr').forEach(screen=>screen.style.display='none');
        document.getElementById('menu').style.display='flex';
        document.getElementById('loadStatus').textContent='Не удалось запустить игру';
        document.getElementById('loadErrorText').textContent=error.message;
        document.getElementById('loadError').hidden=false;
        return false;
      }
    },
    saveProgress:function () {
      if(!window.SnowCoreRef)return;
      try{localStorage.setItem(progressKey,window.SnowCoreRef.invokeMethod('ExportProgress'))}catch(_){/* Session gameplay continues without persistent storage. */}
    },
    getSettings:function () {return window.GameSettings?window.GameSettings.get():{quality:'auto',volume:60,sensitivity:100,controlsMode:'auto',effects:true}}
  };
})();
