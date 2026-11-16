const {chromium,webkit}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const webroot=path.resolve(process.env.BLAZOR_WEBROOT||path.join(__dirname,'../../../Play'));
const output=path.resolve(process.env.BLAZOR_TEST_OUTPUT||path.join(__dirname,'../../../verification'));
fs.mkdirSync(output,{recursive:true});
const report={engine:process.env.TEST_ENGINE||'chromium',checks:[],errors:[],consoleErrors:[],missing:[]};
function pass(name,evidence){report.checks.push({name,status:'PASS',evidence});console.log('PASS '+name)}
async function fixture(context,options={}){
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());if(url.origin!=='http://snow-blazor.test')return route.abort();
  let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/index.html';
  if(pathname==='/favicon.ico')return route.fulfill({status:204,body:''});
  if(options.delayGame&&pathname==='/game.js')await new Promise(r=>setTimeout(r,800));
  const file=path.resolve(webroot,'.'+pathname);
  if(!file.startsWith(webroot+path.sep)||!fs.existsSync(file)){if(!pathname.endsWith('.map'))report.missing.push(pathname);return route.fulfill({status:404,body:'missing'})}
  const type=file.endsWith('.wasm')?'application/wasm':file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream';
  return route.fulfill({path:file,contentType:type});
 });
}
async function ready(page){await page.goto('http://snow-blazor.test/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.SnowGame&&window.SnowGame.ready&&!document.querySelector('#go').disabled,{},{timeout:90000})}
async function playing(page){await page.waitForFunction(()=>state==='play'&&!lockPending);}
async function resizePlaying(page,w,h){const previous=page.viewportSize(),rotated=(previous.width>previous.height)!==(w>h);await page.setViewportSize({width:w,height:h});await page.waitForFunction(([x,y])=>innerWidth===x&&innerHeight===y,[w,h]);if(rotated&&await page.evaluate(()=>!!screen.orientation))await page.waitForFunction(()=>state==='paused');if(await page.evaluate(()=>state==='paused'))await page.locator('#resume').tap();await playing(page)}
(async()=>{
 const engine=report.engine==='webkit'?webkit:chromium,options={headless:true};
 if(engine===chromium){options.executablePath=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';options.args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']}
 const browser=await engine.launch(options);report.browser=browser.version();let diagnosticPage;
 try{
  const desktop=await browser.newContext({viewport:{width:1280,height:720}});await fixture(desktop,{delayGame:true});const page=await desktop.newPage();diagnosticPage=page;
  page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())});
  await page.goto('http://snow-blazor.test/',{waitUntil:'domcontentloaded'});await page.locator('#settingsButton').waitFor({state:'visible',timeout:90000});
  if(!await page.evaluate(()=>!!(window.SnowGame&&window.SnowGame.ready)))assert(await page.locator('#settingsButton').isDisabled());pass('Razor menu is disabled during engine initialization');
  await page.waitForFunction(()=>window.SnowGame&&window.SnowGame.ready&&!document.querySelector('#go').disabled,{},{timeout:90000});
  assert.equal(await page.locator('iframe').count(),0);const initial=await page.evaluate(()=>coreCall('SetPhase','menu'));assert.equal(initial.ammo,12);assert.equal(initial.health,100);pass('Published Blazor WASM initializes real C# session without iframe',initial);
  await page.screenshot({path:path.join(output,'desktop-menu.png')});
  await page.locator('#difficulty').selectOption('hard');await page.locator('#go').click();await page.waitForFunction(()=>state==='comic');await page.locator('#nx').click();await playing(page);
  assert.equal(await page.evaluate(()=>lastCoreSnapshot.difficulty),'hard');pass('Razor difficulty starts the C# hard run');
  let ammo=await page.evaluate(()=>P.ammo);await page.mouse.click(640,360);await page.waitForFunction(a=>P.ammo===a-1,ammo);await page.waitForFunction(()=>document.querySelector('#am').textContent.includes('11'));
  assert.equal(await page.evaluate(()=>lastCoreSnapshot.ammo),11);pass('Mouse1 updates C# ammunition and Razor HUD');
  ammo=await page.evaluate(()=>P.ammo);await page.mouse.down();try{await page.waitForFunction(a=>P.ammo<=a-2,ammo,{timeout:15000})}finally{await page.mouse.up()}
  assert.equal(await page.evaluate(()=>!!keys.mouse),false);pass('Held Mouse1 repeats; release clears fire');
  await page.keyboard.press('KeyR');await page.waitForFunction(()=>lastCoreSnapshot.reloadRemaining>0);await page.waitForFunction(()=>lastCoreSnapshot.reloadRemaining===0&&lastCoreSnapshot.ammo===12,{},{timeout:15000});pass('C# reload transfers reserve into magazine');
  await page.evaluate(()=>hurt(10));assert.equal(await page.evaluate(()=>P.hp),87);await page.waitForFunction(()=>document.querySelector('#hp').getAttribute('aria-valuenow')==='87');pass('C# difficulty applies damage and Razor renders health');
  await page.keyboard.press('KeyQ');await page.waitForFunction(()=>lastCoreSnapshot.slowActive&&lastCoreSnapshot.slowEnergy<100);pass('C# slow-time energy drives the world');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>state==='paused'&&frameHandle===0);const frozen=await page.evaluate(()=>JSON.stringify(lastCoreSnapshot));await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>JSON.stringify(lastCoreSnapshot)),frozen);pass('Pause freezes C# resources and the game loop');
  await page.locator('#pauseSettingsButton').click();await page.locator('#quality').selectOption('low');await page.locator('#sensitivity').fill('150');await page.locator('#volume').fill('0');
  await page.waitForFunction(()=>config.quality==='low'&&config.sensitivity===150&&config.volume===0);assert((await page.locator('#sensitivityValue').textContent()).includes('150%'));pass('Razor settings validate and update native game without DOM conflict');
  await page.locator('#settingsBack').click();await page.locator('#resume').click();await playing(page);
  const score=await page.evaluate(()=>{const enemy=W.en.find(e=>e.type!=='boss'&&!e.dead);const expected=(enemy.type==='robber'?100:150)+50;kill(enemy,true);return{expected,score:lastCoreSnapshot.score,kills:lastCoreSnapshot.kills}});assert.equal(score.score,score.expected);assert.equal(score.kills,1);pass('C# records enemy/headshot score and kill count',score);
  await page.waitForFunction(()=>document.querySelector('#missionReadout').textContent.includes(String(lastCoreSnapshot.score)));
  await page.screenshot({path:path.join(output,'desktop-game.png')});
  await page.reload();await page.waitForFunction(()=>window.SnowGame&&window.SnowGame.ready&&!document.querySelector('#go').disabled,{},{timeout:90000});assert.equal(await page.evaluate(()=>lastCoreSnapshot.bestScore),score.score);pass('C# versioned best-score progress survives reload');
  await page.locator('#go').click();await page.locator('#nx').click();await playing(page);await page.evaluate(()=>hurt(10000));await page.locator('#retry').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>lastCoreSnapshot.phase),'dead');await page.locator('#retry').click();await playing(page);assert.equal(await page.evaluate(()=>P.hp),100);assert.equal(await page.evaluate(()=>lastCoreSnapshot.ammo),12);pass('Death and Razor retry reset the C# session');
  await page.evaluate(()=>{kill(boss,true);ending=7.1});await page.waitForFunction(()=>state==='comic');await page.locator('#nx').click();await page.waitForFunction(()=>state==='fin');assert.equal(await page.evaluate(()=>lastCoreSnapshot.missionComplete),true);assert.equal(await page.evaluate(()=>lastCoreSnapshot.victories),1);pass('Scripted boss victory reaches end comic and C# finished state');
  await desktop.close();
  const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await fixture(mobile);const mp=await mobile.newPage();diagnosticPage=mp;mp.on('pageerror',e=>report.errors.push(e.message));mp.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())});await ready(mp);await mp.screenshot({path:path.join(output,'phone-menu.png')});await mp.locator('#go').tap();await mp.locator('#nx').tap();await playing(mp);
  for(const [w,h] of [[390,844],[844,390],[320,568],[667,375],[768,1024]]){
   await resizePlaying(mp,w,h);
   const layout=await mp.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,items:[...document.querySelectorAll('#touch button,#pauseButton')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return{id:e.id,x:r.x,y:r.y,w:r.width,h:r.height}})}));assert.equal(layout.overflow,false);assert.equal(layout.items.length,5);for(const i of layout.items){assert(i.w>=44&&i.h>=44);assert(i.x>=0&&i.y>=0&&i.x+i.w<=w+1&&i.y+i.h<=h+1)}
   if(w===390||w===844)await mp.screenshot({path:path.join(output,w===390?'phone-portrait.png':'phone-landscape.png')});
  }pass('Blazor phone/tablet UI fits five portrait and landscape viewports');
  await resizePlaying(mp,844,390);
  if(engine===chromium){
   const cdp=await mobile.newCDPSession(mp);const points=await mp.evaluate(()=>['joystick','tf'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}}));
   const start=await mp.evaluate(()=>({x:P.x,z:P.z,ammo:P.ammo,yaw:P.yaw}));let touches=[{id:1,...points[0]}];await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touches});touches=[{id:1,x:points[0].x,y:points[0].y-25},{id:2,...points[1]}];await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touches});touches[1].x-=24;await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:touches});
   await mp.waitForFunction(p=>Math.hypot(P.x-p.x,P.z-p.z)>.01&&P.ammo<p.ammo&&P.yaw!==p.yaw,start,{timeout:15000});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.deepEqual(await mp.evaluate(()=>[T.mx,T.my,T.fire]),[0,0,0]);pass('Two synthesized contacts move/aim/fire through C#; cancel clears input');
  }
  await mobile.close();
  const noGL=await browser.newContext();await fixture(noGL);await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args)}});const ep=await noGL.newPage();await ep.goto('http://snow-blazor.test/',{waitUntil:'domcontentloaded'});await ep.locator('#loadError').waitFor({state:'visible',timeout:90000});assert(await ep.locator('#go').isDisabled());assert.equal(await ep.locator('#blazor-error-ui').isVisible(),false);pass('WebGL failure shows retry without an unhandled Blazor startup error');await noGL.close();
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.missing,[]);pass('No unhandled game/Blazor errors or missing required assets');report.result='PASS';
 }catch(error){report.result='FAIL';report.failure=error.stack;console.error(error);if(diagnosticPage){try{report.diagnostic=await diagnosticPage.evaluate(()=>({title:document.title,body:document.body.innerText.slice(0,2000),state:typeof state==='undefined'?null:state,core:typeof lastCoreSnapshot==='undefined'?null:lastCoreSnapshot}));await diagnosticPage.screenshot({path:path.join(output,'failure.png')});console.error(JSON.stringify(report.diagnostic))}catch(_){}}process.exitCode=1}
 finally{fs.writeFileSync(path.join(output,'report-blazor-'+report.engine+'.json'),JSON.stringify(report,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
