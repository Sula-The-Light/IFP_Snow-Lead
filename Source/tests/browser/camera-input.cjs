const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(process.env.CAMERA_WEBROOT||path.join(__dirname,'../../../Play')),report={checks:[],errors:[]};
function pass(name,evidence){report.checks.push({name,status:'PASS',evidence});console.log('PASS '+name)}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 report.browser=browser.version();
 try{
  const context=await browser.newContext({viewport:{width:1280,height:720}});
  await context.route('**/*',route=>{
   const url=new URL(route.request().url());if(url.origin!=='http://snow.test')return route.abort();
   if(url.pathname==='/favicon.ico')return route.fulfill({status:204,body:''});
   const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'missing'});
   return route.fulfill({path:file,contentType:file.endsWith('.wasm')?'application/wasm':file.endsWith('.json')?'application/json':file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8'});
  });
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://snow.test/');await page.waitForFunction(()=>window.SnowGame&&!document.querySelector('#go').disabled);
  await page.evaluate(()=>{window.lockCalls=[];window.originalLock=document.body.requestPointerLock.bind(document.body);document.body.requestPointerLock=options=>{window.lockCalls.push(options||null);return window.originalLock(options)};config.volume=0});
  await page.locator('#go').click();await page.locator('#nx').click();await page.waitForFunction(()=>document.pointerLockElement===document.body);
  assert.equal(await page.evaluate(()=>window.lockCalls[0].unadjustedMovement),true);pass('Real mouse capture requests raw input');
  let angles=await page.evaluate(()=>[P.yaw,P.pitch]);const start=await page.evaluate(()=>({x:P.x,z:P.z}));await page.keyboard.down('KeyW');
  try{await page.waitForFunction(p=>Math.hypot(P.x-p.x,P.z-p.z)>.01,start,{timeout:10000})}finally{await page.keyboard.up('KeyW')}
  assert.deepEqual(await page.evaluate(()=>[P.yaw,P.pitch]),angles);pass('Movement with stationary mouse does not turn camera');
  await page.mouse.click(640,360);angles=await page.evaluate(()=>[P.yaw,P.pitch]);await page.waitForTimeout(200);assert.deepEqual(await page.evaluate(()=>[P.yaw,P.pitch]),angles);pass('Shooting without moving does not drift camera');
  const fast=await page.evaluate(()=>{const yaw=P.yaw;document.body.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,movementX:500,movementY:0}));return {delta:P.yaw-yaw,expected:-500*.0022*config.sensitivity/100}});
  assert(Math.abs(fast.delta-fast.expected)<1e-9);pass('Intentional fast-turn deltas are preserved (synthetic packet)',fast);
  angles=await page.evaluate(()=>[P.yaw,P.pitch]);
  await page.evaluate(()=>{const event=new MouseEvent('mousemove',{bubbles:true,movementX:400,movementY:100});Object.defineProperty(event,'sourceCapabilities',{value:{firesTouchEvents:true}});document.body.dispatchEvent(event)});
  assert.deepEqual(await page.evaluate(()=>[P.yaw,P.pitch]),angles);pass('Touch compatibility mouse events are ignored');
  await page.evaluate(()=>{const event=new MouseEvent('mousemove',{bubbles:true});Object.defineProperty(event,'movementX',{value:NaN});document.body.dispatchEvent(event)});
  assert.deepEqual(await page.evaluate(()=>[P.yaw,P.pitch]),angles);pass('Invalid movement cannot corrupt camera angles');
  const corner=await page.evaluate(()=>{
   const saved={boxes:W.boxes,x:P.x,z:P.z,yaw:P.yaw,pitch:P.pitch,reach:cameraReach};
   W.boxes=[{x0:0,x1:7,z0:0,z1:7,h:12}];P.x=-.76;P.z=6.99;P.yaw=P.pitch=0;cameraReach=null;heroCam();const a=cam.position.clone();P.x+=.02;heroCam();const distance=a.distanceTo(cam.position);
   W.boxes=saved.boxes;P.x=saved.x;P.z=saved.z;P.yaw=saved.yaw;P.pitch=saved.pitch;cameraReach=saved.reach;heroCam();return distance;
  });assert(corner<.1);pass('Shoulder crossing a wall corner does not snap camera metres',corner);
  await page.evaluate(()=>pauseGame());await page.waitForFunction(()=>!document.pointerLockElement);
  await page.evaluate(()=>{window.lockCalls=[];rawMouseSupported=true;document.body.requestPointerLock=options=>{window.lockCalls.push(options||null);return options&&options.unadjustedMovement?Promise.reject(new DOMException('unsupported','NotSupportedError')):window.originalLock()}});
  await page.locator('#resume').click();await page.waitForFunction(()=>document.pointerLockElement===document.body);
  assert.deepEqual(await page.evaluate(()=>window.lockCalls),[{unadjustedMovement:true},null]);pass('Unsupported raw input falls back to ordinary real capture');
  await page.evaluate(()=>pauseGame());await page.waitForFunction(()=>!document.pointerLockElement);
  await page.evaluate(()=>{document.body.requestPointerLock=()=>Promise.reject(new DOMException('denied','NotAllowedError'))});
  await page.locator('#resume').click();await page.waitForFunction(()=>state==='play'&&!lockPending);
  await page.mouse.move(600,400);await page.mouse.down();const before=await page.evaluate(()=>P.yaw);await page.mouse.move(620,400);
  assert.notEqual(await page.evaluate(()=>P.yaw),before);pass('Denied capture still permits intentional drag look');
  await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerType:'mouse',pointerId:mouseDragPoint.id,buttons:0,clientX:900,clientY:600})));
  angles=await page.evaluate(()=>[P.yaw,P.pitch]);assert.equal(await page.evaluate(()=>!!keys.mouse),false);await page.mouse.up();await page.mouse.move(700,450);assert.deepEqual(await page.evaluate(()=>[P.yaw,P.pitch]),angles);pass('Missing mouse release cannot leave drag look or fire latched');
  await page.evaluate(()=>pauseGame());angles=await page.evaluate(()=>[P.yaw,P.pitch]);await page.mouse.move(500,200);assert.deepEqual(await page.evaluate(()=>[P.yaw,P.pitch]),angles);pass('Pause blocks camera input');
  assert.deepEqual(report.errors,[]);report.result='PASS';
 }catch(error){report.result='FAIL';report.failure=error.message;console.error(error);process.exitCode=1}
 finally{const output=process.env.CAMERA_REPORT||path.join(root,'test-results/report-camera.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
