import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
const $=id=>document.getElementById(id); let activeUid=null, deferredInstall=null, locked=false, biometricAttempting=false, biometricAttemptedForLock=false, pinChecking=false;
const key=()=>`cashlog.pin.${activeUid}`, bioKey=()=>`cashlog.bio.${activeUid}`;
const enc=new TextEncoder();
async function hashPin(pin,salt){const material=await crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:180000,hash:'SHA-256'},material,256);return [...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function b64(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes)))}
function unb64(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
function showLock(){
 if(!activeUid||!localStorage.getItem(key())||locked)return;
 locked=true;biometricAttemptedForLock=false;
 document.body.classList.add('cashlog-locked');$('appLock').classList.remove('hidden');
 $('unlockPin').value='';$('lockError').textContent='';
 const hasBio=!!localStorage.getItem(bioKey());
 $('biometricUnlock').classList.toggle('hidden',!hasBio);
 requestAnimationFrame(()=>{$('unlockPin').focus();if(hasBio)setTimeout(()=>attemptBiometric(true),180)});
}
function hideLock(){locked=false;biometricAttempting=false;document.body.classList.remove('cashlog-locked');$('appLock').classList.add('hidden')}
async function attemptBiometric(automatic=false){
 if(!locked||biometricAttempting)return;
 const saved=JSON.parse(localStorage.getItem(bioKey())||'null');if(!saved)return;
 if(automatic&&biometricAttemptedForLock)return;
 biometricAttemptedForLock=true;biometricAttempting=true;
 try{
  if(!window.PublicKeyCredential||!navigator.credentials)throw new Error('Biometric unlock is not supported here. Enter your PIN instead.');
  const challenge=crypto.getRandomValues(new Uint8Array(32));
  const assertion=await navigator.credentials.get({publicKey:{challenge,allowCredentials:[{type:'public-key',id:unb64(saved.id)}],userVerification:'required',timeout:60000}});
  if(assertion&&locked)hideLock();
 }catch(err){
  if(locked){$('lockError').textContent=err.name==='NotAllowedError'?'Fingerprint was cancelled or unavailable. Enter your PIN or try fingerprint again.':(err.message||'Fingerprint verification failed. Enter your PIN.');$('unlockPin').focus();$('biometricUnlock').classList.remove('hidden')}
 }finally{biometricAttempting=false}
}
function applyTheme(mode){let chosen=mode;if(mode==='system')chosen=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.body.classList.toggle('light',chosen==='light');document.querySelector('meta[name="theme-color"]')?.setAttribute('content',chosen==='light'?'#f3f4f6':'#050505');localStorage.setItem('cashlog.theme',mode)}
applyTheme(localStorage.getItem('cashlog.theme')||'dark');
let previousScreenId='homeScreen';
// Detach Settings from the app's content flow so it is a true independent view.
const settingsPanel=$('settingsPanel');
const aboutPanel=$('aboutPanel');
if(settingsPanel){settingsPanel.classList.add('cashlog-settings-view');document.body.appendChild(settingsPanel)}
if(aboutPanel){aboutPanel.classList.add('cashlog-settings-view');document.body.appendChild(aboutPanel)}
function openSettings(){const panel=$('settingsPanel');if(!panel)return;previousScreenId=document.querySelector('.screen.active')?.id||'homeScreen';document.querySelectorAll('.screen').forEach(screen=>screen.classList.remove('active'));$('mainStatus')?.classList.add('hidden');panel.classList.remove('hidden');document.body.classList.add('cashlog-settings-open');panel.scrollTop=0;window.scrollTo(0,0);$('settingsCloseBtn')?.focus()}
function closeAbout(){aboutPanel?.classList.add('hidden');settingsPanel?.classList.remove('hidden');$('settingsCloseBtn')?.focus()}
function openAbout(){settingsPanel?.classList.add('hidden');aboutPanel?.classList.remove('hidden');aboutPanel.scrollTop=0;$('aboutCloseBtn')?.focus()}
function closeSettings(){const panel=$('settingsPanel');if(!panel)return;closeAboutIfOpen();panel.classList.add('hidden');document.body.classList.remove('cashlog-settings-open');document.getElementById(previousScreenId)?.classList.add('active');$('mainStatus')?.classList.remove('hidden');window.scrollTo(0,0);$('settingsOpenBtn')?.focus()}
function closeAboutIfOpen(){aboutPanel?.classList.add('hidden')}
$('settingsOpenBtn')?.addEventListener('click',openSettings);$('settingsCloseBtn')?.addEventListener('click',closeSettings);
$('aboutOpenBtn')?.addEventListener('click',openAbout);$('aboutCloseBtn')?.addEventListener('click',closeAbout);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&aboutPanel&&!aboutPanel.classList.contains('hidden'))closeAbout();else if(e.key==='Escape'&&!$('settingsPanel')?.classList.contains('hidden'))closeSettings()});
$('darkThemeBtn')?.addEventListener('click',()=>applyTheme('dark'));$('lightThemeBtn')?.addEventListener('click',()=>applyTheme('light'));$('systemThemeBtn')?.addEventListener('click',()=>applyTheme('system'));
$('pinSetupForm')?.addEventListener('submit',async e=>{e.preventDefault();const a=$('newPin').value,b=$('confirmPin').value;if(!/^\d{4}$/.test(a)){ $('securityStatus').textContent='PIN must contain exactly four digits.';return}if(a!==b){$('securityStatus').textContent='The PINs do not match.';return}const salt=crypto.getRandomValues(new Uint8Array(16));const digest=await hashPin(a,salt);localStorage.setItem(key(),JSON.stringify({salt:b64(salt),digest}));$('pinSetupForm').reset();$('securityStatus').textContent='App lock is enabled on this device.';});
async function verifyEnteredPin(){
 if(pinChecking||!locked)return;const input=$('unlockPin');const pin=input.value;if(pin.length!==4)return;
 pinChecking=true;input.disabled=true;
 try{const record=JSON.parse(localStorage.getItem(key())||'null');if(!record){hideLock();return}const digest=await hashPin(pin,unb64(record.salt));if(digest===record.digest){$('lockError').textContent='';hideLock()}else{$('lockError').textContent='Incorrect PIN. Try again.';input.value='';input.disabled=false;input.focus()}}
 catch(err){$('lockError').textContent='Could not verify PIN. Please try again.';input.value='';input.disabled=false;input.focus()}
 finally{pinChecking=false;if(locked)input.disabled=false}
}
$('unlockPin')?.addEventListener('input',verifyEnteredPin);
$('unlockForm')?.addEventListener('submit',e=>{e.preventDefault();verifyEnteredPin()});
$('forgotPin')?.addEventListener('click',async()=>{if(confirm('Reset this device PIN? You will be signed out and must sign in to your Cashlog account again.')){localStorage.removeItem(key());localStorage.removeItem(bioKey());await signOut(auth);hideLock()}});
$('removePinBtn')?.addEventListener('click',()=>{if(confirm('Turn off the app lock on this device?')){localStorage.removeItem(key());localStorage.removeItem(bioKey());$('securityStatus').textContent='App lock disabled.'}});
// Platform authenticator support. WebAuthn requires a secure origin (HTTPS) and a device/browser authenticator.
$('enableBiometricBtn')?.addEventListener('click',async()=>{try{if(!activeUid||!window.PublicKeyCredential||!navigator.credentials)throw new Error('Biometric unlock is not supported by this browser.');const available=await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();if(!available)throw new Error('No supported fingerprint/biometric authenticator was found.');const id=crypto.getRandomValues(new Uint8Array(16)),challenge=crypto.getRandomValues(new Uint8Array(32));const cred=await navigator.credentials.create({publicKey:{challenge,rp:{name:'Cashlog',id:location.hostname},user:{id, name:activeUid,displayName:'Cashlog user'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required'},timeout:60000,attestation:'none'}});if(!cred)throw new Error('Biometric setup was cancelled.');localStorage.setItem(bioKey(),JSON.stringify({id:b64(cred.rawId)}));$('securityStatus').textContent='Biometric unlock is enabled on this device. Cashlog will request fingerprint verification when you open the app, where supported.'; }catch(err){$('securityStatus').textContent=err.message||'Could not set up biometrics.'}});
$('biometricUnlock')?.addEventListener('click',()=>attemptBiometric(false));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('installAppBtn')?.classList.remove('hidden')});$('installAppBtn')?.addEventListener('click',async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null}else{$('securityStatus').textContent='On Android Chrome, open the browser menu and choose Install app or Add to Home screen.'}});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Offline shell registration failed',e)));
onAuthStateChanged(auth,user=>{activeUid=user?.uid||null;if(!user)hideLock();else{setTimeout(showLock,250)}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&activeUid&&localStorage.getItem(key()))showLock()});
