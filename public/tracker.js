"use strict";var Reev=(()=>{var p=(l,e,r)=>new Promise((t,s)=>{var i=a=>{try{o(r.next(a))}catch(u){s(u)}},n=a=>{try{o(r.throw(a))}catch(u){s(u)}},o=a=>a.done?t(a.value):Promise.resolve(a.value).then(i,n);o((r=r.apply(l,e)).next())});var x=`
  --uxs-bg: #161a24;
  --uxs-bg-input: #11141b;
  --uxs-border: #3a4158;
  --uxs-text: #e2e6f0;
  --uxs-text-sec: #7a829e;
  --uxs-text-muted: #4a5170;
`,b=`
  --uxs-bg: #ffffff;
  --uxs-bg-input: #f5f6f8;
  --uxs-border: #d1d5db;
  --uxs-text: #1f2937;
  --uxs-text-sec: #6b7280;
  --uxs-text-muted: #9ca3af;
`,w=`
.uxs-popover {
  --uxs-amber: #f0a830;
  --uxs-amber-dim: #c8891a;
  --uxs-red: #e84855;
  --uxs-green: #3dd68c;
  --uxs-blue: #4e9af5;
  --uxs-radius: 10px;

  position: fixed;
  z-index: 2147483647;
  width: 310px;
  background: var(--uxs-bg);
  border: 1px solid var(--uxs-border);
  border-radius: var(--uxs-radius);
  box-shadow: 0 12px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  opacity: 0;
  pointer-events: none;
  transform-origin: var(--uxs-origin, center top);
  transform: scale(0.9);
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: visible;
}
.uxs-popover.uxs-visible {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}
.uxs-arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--uxs-bg);
  border: 1px solid var(--uxs-border);
  transform: rotate(45deg);
  z-index: 1;
}
.uxs-placement-bottom .uxs-arrow {
  top: -7px;
  border-right: none;
  border-bottom: none;
}
.uxs-placement-top .uxs-arrow {
  bottom: -7px;
  border-left: none;
  border-top: none;
}
.uxs-stripe { height: 3px; position: relative; z-index: 2; border-radius: var(--uxs-radius) var(--uxs-radius) 0 0; }
.uxs-stripe-red { background: var(--uxs-red); }
.uxs-stripe-amber { background: var(--uxs-amber); }
.uxs-stripe-green { background: var(--uxs-green); }
.uxs-stripe-blue { background: var(--uxs-blue); }
.uxs-close {
  position: absolute;
  top: 12px;
  right: 10px;
  width: 22px;
  height: 22px;
  background: transparent;
  border: 1px solid var(--uxs-border);
  border-radius: 4px;
  color: var(--uxs-text-muted);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  line-height: 1;
  padding: 0;
}
.uxs-close:hover {
  color: var(--uxs-text);
  border-color: var(--uxs-text-sec);
}
.uxs-header {
  padding: 14px 16px 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.uxs-emoji { font-size: 20px; line-height: 1; flex-shrink: 0; }
.uxs-header-text { padding-right: 22px; }
.uxs-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 3px;
  color: var(--uxs-text);
}
.uxs-desc {
  font-size: 12px;
  color: var(--uxs-text-sec);
  line-height: 1.45;
  margin: 0;
}
.uxs-body { padding: 0 16px 10px; }
.uxs-textarea {
  width: 100%;
  background: var(--uxs-bg-input);
  border: 1px solid var(--uxs-border);
  border-radius: 6px;
  padding: 8px 10px;
  color: var(--uxs-text);
  font-family: inherit;
  font-size: 12px;
  resize: none;
  height: 48px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.uxs-textarea:focus {
  border-color: var(--uxs-amber);
}
.uxs-textarea::placeholder {
  color: var(--uxs-text-muted);
}
.uxs-actions {
  display: flex;
  gap: 6px;
  padding: 0 16px 14px;
}
.uxs-btn {
  flex: 1;
  padding: 7px 12px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.uxs-btn-send {
  background: var(--uxs-amber);
  color: #0a0c10;
  border-color: var(--uxs-amber);
}
.uxs-btn-send:hover {
  background: var(--uxs-amber-dim);
  border-color: var(--uxs-amber-dim);
}
.uxs-btn-dismiss {
  background: transparent;
  color: var(--uxs-text-sec);
  border-color: var(--uxs-border);
}
.uxs-btn-dismiss:hover {
  color: var(--uxs-text);
  border-color: var(--uxs-text-sec);
}
.uxs-highlight {
  outline: 2px solid var(--uxs-amber, #f0a830) !important;
  outline-offset: 3px;
  border-radius: 4px;
  animation: uxs-ring-pulse 1.5s ease-in-out infinite;
}
@keyframes uxs-ring-pulse {
  0%, 100% { outline-color: #f0a830; }
  50% { outline-color: rgba(240,168,48,0.3); }
}
@media (max-width: 400px) {
  .uxs-popover {
    width: calc(100vw - 24px) !important;
    left: 12px !important;
    right: 12px !important;
  }
}
`,y=`
.uxs-badge {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #f0a830;
  color: #0a0c10;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2147483646;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1;
  border: 2px solid #fff;
  transition: transform 0.15s ease;
  animation: uxs-badge-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
}
.uxs-badge:hover {
  transform: scale(1.15);
}
.uxs-badge-red { background: #e84855; color: #fff; }
@keyframes uxs-badge-pop {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
`,k=`
<div class="uxs-arrow"></div>
<div class="uxs-stripe"></div>
<button class="uxs-close" aria-label="Dismiss">&times;</button>
<div class="uxs-header">
  <span class="uxs-emoji"></span>
  <div class="uxs-header-text">
    <h4 class="uxs-title"></h4>
    <p class="uxs-desc"></p>
  </div>
</div>
<div class="uxs-body">
  <textarea class="uxs-textarea" placeholder="What were you trying to do?" rows="2"></textarea>
</div>
<div class="uxs-actions">
  <button class="uxs-btn uxs-btn-dismiss">Dismiss</button>
  <button class="uxs-btn uxs-btn-send">Send</button>
</div>
`,E={rage_click:{emoji:"\u{1F624}",color:"amber",title:"Not working?",desc:()=>"We noticed you clicked multiple times. What were you expecting to happen?",placeholder:"e.g. The button didn\u2019t respond\u2026"},dead_link:{emoji:"\u{1F517}",color:"red",title:"Broken link",desc:l=>{var e;return`This link seems broken (${((e=l.metadata)==null?void 0:e.status)||"error"}). Where were you trying to go?`},placeholder:"e.g. I was trying to reach\u2026"},broken_image:{emoji:"\u{1F5BC}\uFE0F",color:"green",title:"Missing image",desc:()=>"An image didn\u2019t load here. Is this causing problems?",placeholder:"e.g. I can\u2019t see the product photo\u2026"},form_frustration:{emoji:"\u{1F4DD}",color:"blue",title:"Form trouble?",desc:()=>"This form seems frustrating. What\u2019s confusing?",placeholder:"e.g. The validation keeps rejecting\u2026"}},m=class{constructor(e){this.el=null;this.currentAnchor=null;this.currentIssue=null;this.triggerElement=null;this.shownCount=0;this.lastShown=0;this.stylesInjected=!1;this.reposition=()=>{var e;this.currentAnchor&&((e=this.el)!=null&&e.classList.contains("uxs-visible"))&&this.position()};this.onKeyDown=e=>{if(this.el){if(e.key==="Escape"){this.dismiss();return}if(e.key==="Tab"){let r=this.el.querySelectorAll("textarea, button");if(!r.length)return;let t=r[0],s=r[r.length-1];e.shiftKey&&document.activeElement===t?(e.preventDefault(),s.focus()):!e.shiftKey&&document.activeElement===s&&(e.preventDefault(),t.focus())}}};this.onOutsideClick=e=>{var r;this.el&&(this.el.contains(e.target)||(r=this.currentAnchor)!=null&&r.contains(e.target)||this.dismiss())};var r,t;this.config={maxPerSession:(r=e.maxPerSession)!=null?r:5,cooldown:(t=e.cooldown)!=null?t:3e4,theme:e.theme||"dark",onFeedback:e.onFeedback||null}}injectStyles(){if(this.stylesInjected)return;this.stylesInjected=!0;let e=this.config.theme==="light"?b:x,r=document.createElement("style");r.id="reev-popover-styles",r.textContent=`.uxs-popover { ${e} }
${w}`,document.head.appendChild(r)}ensureDOM(){var e,r,t;this.el||(this.injectStyles(),this.el=document.createElement("div"),this.el.className="uxs-popover",this.el.setAttribute("role","dialog"),this.el.setAttribute("aria-label","User feedback"),this.el.setAttribute("aria-modal","true"),this.el.innerHTML=k,document.body.appendChild(this.el),(e=this.el.querySelector(".uxs-close"))==null||e.addEventListener("click",()=>this.dismiss()),(r=this.el.querySelector(".uxs-btn-dismiss"))==null||r.addEventListener("click",()=>this.dismiss()),(t=this.el.querySelector(".uxs-btn-send"))==null||t.addEventListener("click",()=>this.submit()))}show(e){let r=Date.now();if(this.shownCount>=this.config.maxPerSession||r-this.lastShown<this.config.cooldown||!e.element||!e.element.getBoundingClientRect)return!1;this.dismiss(),this.ensureDOM();let t=E[e.type]||{emoji:"\u26A0\uFE0F",color:"amber",title:"Issue Detected",desc:()=>"Something went wrong.",placeholder:"What were you trying to do?"};if(this.el){let s=this.el.querySelector(".uxs-emoji"),i=this.el.querySelector(".uxs-title"),n=this.el.querySelector(".uxs-desc"),o=this.el.querySelector(".uxs-textarea"),a=this.el.querySelector(".uxs-stripe");s&&(s.textContent=t.emoji),i&&(i.textContent=t.title),n&&(n.textContent=t.desc(e)),o&&(o.value="",o.placeholder=t.placeholder),a&&(a.className=`uxs-stripe uxs-stripe-${t.color}`)}return this.currentAnchor=e.element,this.currentIssue=e,this.triggerElement=document.activeElement,this.shownCount++,this.lastShown=r,this.currentAnchor.classList.add("uxs-highlight"),this.position(),requestAnimationFrame(()=>{var i,n;(i=this.el)==null||i.classList.add("uxs-visible");let s=(n=this.el)==null?void 0:n.querySelector(".uxs-textarea");s==null||s.focus()}),document.addEventListener("mousedown",this.onOutsideClick),document.addEventListener("keydown",this.onKeyDown),window.addEventListener("scroll",this.reposition,!0),window.addEventListener("resize",this.reposition),!0}dismiss(){!this.el||!this.el.classList.contains("uxs-visible")||(this.el.classList.remove("uxs-visible"),this.currentAnchor&&this.currentAnchor.classList.remove("uxs-highlight"),document.removeEventListener("mousedown",this.onOutsideClick),document.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("scroll",this.reposition,!0),window.removeEventListener("resize",this.reposition),this.triggerElement&&this.triggerElement.focus&&this.triggerElement.focus(),this.currentAnchor=null,this.currentIssue=null,this.triggerElement=null)}destroy(){this.dismiss(),this.el&&(this.el.remove(),this.el=null)}submit(){var t;let e=(t=this.el)==null?void 0:t.querySelector(".uxs-textarea"),r=(e==null?void 0:e.value.trim())||"";this.config.onFeedback&&this.currentIssue&&this.config.onFeedback({issue:{type:this.currentIssue.type,severity:this.currentIssue.severity,selector:this.currentIssue.selector,url:this.currentIssue.url,metadata:this.currentIssue.metadata},message:r,timestamp:new Date().toISOString(),pageUrl:location.href}),this.dismiss()}position(){if(!this.currentAnchor||!this.el)return;let e=this.currentAnchor,r=this.el,t=r.querySelector(".uxs-arrow"),s=e.getBoundingClientRect(),i=window.innerWidth<=400?window.innerWidth-24:310,n=10;r.style.visibility="hidden",r.style.left="-9999px",r.classList.add("uxs-visible");let o=r.offsetHeight;r.classList.remove("uxs-visible"),r.style.visibility="";let u=window.innerHeight-s.bottom>o+n+20?"bottom":"top";r.classList.remove("uxs-placement-bottom","uxs-placement-top"),r.classList.add(`uxs-placement-${u}`);let c=s.left+s.width/2-i/2;c=Math.max(10,Math.min(c,window.innerWidth-i-10));let d;if(u==="bottom"?(d=s.bottom+n,r.style.setProperty("--uxs-origin","center top")):(d=s.top-n-o,d=Math.max(10,d),r.style.setProperty("--uxs-origin","center bottom")),r.style.left=`${c}px`,r.style.top=`${d}px`,t){let v=s.left+s.width/2-c-6;t.style.left=`${Math.max(18,Math.min(v,i-30))}px`}}},h=class h{constructor(e){this.events=[];this.batchInterval=null;this.maxScrollDepth=0;this.scrollTimeout=null;this.pageEnteredAt=Date.now();this.observers=[];this.popover=null;this.clickTracker=new Map;this.rageClickCooldowns=new WeakSet;this.checkedLinks=new WeakSet;this.reportedImages=new WeakSet;this.badges=[];this.formFields=new Map;this.formFrustrationCooldowns=new WeakSet;this.formStates=new Map;this.recentErrors=[];this.breadcrumbs=[];this.pendingScreenshot=null;var r,t,s,i,n,o,a,u,c;this.projectId=e.projectId,this.apiUrl=e.apiUrl||"",this.sessionId=this.generateSessionId(),this.config={rageClick:(r=e.rageClick)!=null?r:!0,deadLink:(t=e.deadLink)!=null?t:!0,brokenImage:(s=e.brokenImage)!=null?s:!0,formFrustration:(i=e.formFrustration)!=null?i:!0,popover:(n=e.popover)!=null?n:!0,popoverTheme:(o=e.popoverTheme)!=null?o:"dark",maxPopupsPerSession:(a=e.maxPopupsPerSession)!=null?a:5,popoverCooldown:(u=e.popoverCooldown)!=null?u:3e4,debug:(c=e.debug)!=null?c:!1},this.init()}generateSessionId(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{let r=Math.random()*16|0;return(e==="x"?r:r&3|8).toString(16)})}now(){return Date.now()}log(...e){this.config.debug&&console.log("[Reev]",...e)}push(e,r){h.SEND_TYPES.has(e)&&this.events.push({type:e,data:r,timestamp:this.now()})}init(){try{if(!document.getElementById("reev-badge-styles")){let e=document.createElement("style");e.id="reev-badge-styles",e.textContent=y,document.head.appendChild(e)}this.config.popover&&(this.popover=new m({maxPerSession:this.config.maxPopupsPerSession,cooldown:this.config.popoverCooldown,theme:this.config.popoverTheme,onFeedback:e=>this.handleFeedback(e)})),this.trackPageview(),this.trackClicks(),this.trackScroll(),this.trackForms(),this.trackErrors(),this.trackVitals(),this.trackNavigation(),this.config.deadLink&&this.trackDeadLinks(),this.config.brokenImage&&this.trackBrokenImages(),this.config.formFrustration&&this.trackFormFrustration(),this.setupBatchSending(),this.setupUnloadHandler(),this.log("Initialized",{sessionId:this.sessionId,config:this.config})}catch(e){}}handleIssue(e){this.log("Issue detected",e),this.pendingScreenshot=null,this.captureScreenshot(e.element).then(r=>{this.pendingScreenshot=r}),this.push("ux_issue",{issueType:e.type,severity:e.severity,selector:e.selector,url:e.url,metadata:e.metadata,pageUrl:location.href}),this.popover&&this.popover.show(e)}handleFeedback(e){var t,s,i,n;this.log("Feedback received",e);let r=(t=e.issue)!=null&&t.selector?document.querySelector(e.issue.selector):null;this.push("ux_feedback",{issueType:(s=e.issue)==null?void 0:s.type,issueSeverity:(i=e.issue)==null?void 0:i.severity,issueSelector:(n=e.issue)==null?void 0:n.selector,message:e.message,pageUrl:e.pageUrl,deviceType:this.detectDevice(),browserName:this.detectBrowser(),timeOnPage:Math.round((this.now()-this.pageEnteredAt)/1e3),screenshot:this.pendingScreenshot,domSnapshot:this.captureDomSnapshot(r),consoleErrors:this.recentErrors.slice(),breadcrumbs:this.breadcrumbs.slice()}),this.pendingScreenshot=null,this.sendBatch()}detectDevice(){let e=window.innerWidth;return e<768?"mobile":e<1024?"tablet":"desktop"}detectBrowser(){let e=navigator.userAgent;return e.includes("Firefox")?"Firefox":e.includes("Edg")?"Edge":e.includes("Chrome")?"Chrome":e.includes("Safari")?"Safari":"Other"}trackPageview(){this.pageEnteredAt=this.now(),this.maxScrollDepth=0,this.push("pageview",{url:location.href,referrer:document.referrer,title:document.title,viewport:{w:window.innerWidth,h:window.innerHeight}})}trackClicks(){let e=r=>{let t=r.target;if(!t)return;let s=this.getSelector(t),i=(t.textContent||"").trim().slice(0,100),n=this.now(),o=!1;if(this.config.rageClick&&this.isInteractive(t)&&!this.rageClickCooldowns.has(t)){this.clickTracker.has(t)||this.clickTracker.set(t,[]);let a=this.clickTracker.get(t);a.push(n);let u=n-1500;for(;a.length&&a[0]<u;)a.shift();a.length>=3&&(o=!0,this.rageClickCooldowns.add(t),setTimeout(()=>this.rageClickCooldowns.delete(t),5e3),this.clickTracker.delete(t),this.handleIssue({type:"rage_click",severity:"medium",element:t,selector:s,metadata:{clickCount:a.length,windowMs:1500,avgInterval:Math.round(1500/a.length)},timestamp:new Date().toISOString()}))}this.addBreadcrumb("click",s,i),this.push("click",{selector:s,text:i,x:r.clientX,y:r.clientY,isRage:o,url:location.href})};document.addEventListener("click",e,!0),this.observers.push(()=>document.removeEventListener("click",e,!0))}trackDeadLinks(){this.scanLinks();let e=new MutationObserver(()=>{this.scanLinks()});e.observe(document.body,{childList:!0,subtree:!0}),this.observers.push(()=>e.disconnect())}scanLinks(){let e=document.querySelectorAll("a[href]");for(let r of e){if(this.checkedLinks.has(r))continue;let t=r.getAttribute("href");if(!(!t||t.startsWith("#")||t.startsWith("javascript:")||t.startsWith("mailto:")||t.startsWith("tel:"))){try{if(new URL(t,window.location.origin).origin!==window.location.origin)continue}catch(s){continue}this.checkedLinks.add(r),this.probeLink(r,t)}}}probeLink(e,r){return p(this,null,function*(){try{let t=new URL(r,window.location.origin),s=new AbortController,i=setTimeout(()=>s.abort(),5e3),n=yield fetch(t.href,{method:"HEAD",mode:"same-origin",signal:s.signal});clearTimeout(i),n.ok||(this.log("Dead link found:",r,n.status),this.reportDeadLink(e,r,n.status))}catch(t){let s=t.name==="AbortError"?"TIMEOUT":"NETWORK_ERROR";this.log("Dead link found:",r,s),this.reportDeadLink(e,r,s)}})}addIndicator(e,r,t){this.log("Adding indicator badge",r.type,r.selector);let s=e.parentElement;if(!s)return;window.getComputedStyle(s).position==="static"&&(s.style.position="relative");let n=e.getBoundingClientRect(),o=s.getBoundingClientRect(),a=n.top-o.top-4,u=n.right-o.left-16,c=document.createElement("div");c.className=`uxs-badge${t?` ${t}`:""}`,c.textContent="?",c.style.top=`${Math.max(0,a)}px`,c.style.left=`${Math.max(0,u)}px`,c.title=r.type==="dead_link"?"Broken link \u2014 click to report":"Missing image \u2014 click to report",c.addEventListener("click",d=>{d.stopPropagation(),d.preventDefault(),c.remove(),this.handleIssue(r)}),s.appendChild(c),this.badges.push(c)}reportDeadLink(e,r,t){let s={type:"dead_link",severity:"high",element:e,selector:this.getSelector(e),url:r,metadata:{status:t},timestamp:new Date().toISOString()};this.addIndicator(e,s,"uxs-badge-red")}trackBrokenImages(){let e=t=>{this.reportedImages.has(t)||!t.src&&!t.getAttribute("src")||(t.complete?t.naturalWidth===0&&(this.reportedImages.add(t),this.log("Broken image detected:",t.src||t.getAttribute("src")),this.reportBrokenImage(t)):t.addEventListener("error",()=>{this.reportedImages.has(t)||(this.reportedImages.add(t),this.log("Broken image detected (onerror):",t.src),this.reportBrokenImage(t))},{once:!0}))};document.querySelectorAll("img").forEach(e),document.readyState!=="complete"&&window.addEventListener("load",()=>{document.querySelectorAll("img").forEach(e)},{once:!0});let r=new MutationObserver(t=>{var s;for(let i of t)for(let n of i.addedNodes)n instanceof HTMLElement&&(n.tagName==="IMG"&&e(n),(s=n.querySelectorAll)==null||s.call(n,"img").forEach(e))});r.observe(document.body,{childList:!0,subtree:!0}),this.observers.push(()=>r.disconnect())}reportBrokenImage(e){let r={type:"broken_image",severity:"low",element:e,selector:this.getSelector(e),url:e.src||e.currentSrc||"",metadata:{alt:e.alt||"",naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight},timestamp:new Date().toISOString()};this.addIndicator(e,r)}trackFormFrustration(){let e=r=>{let t=r.target;if(!this.isFormField(t)||this.formFrustrationCooldowns.has(t))return;let s=(t.value||"").length;if(!this.formFields.has(t)){this.formFields.set(t,{clears:0,peakLen:s,timer:setTimeout(()=>this.formFields.delete(t),3e4)});return}let i=this.formFields.get(t);s>i.peakLen&&(i.peakLen=s),s===0&&i.peakLen>=3&&(i.clears++,i.peakLen=0,clearTimeout(i.timer),i.timer=setTimeout(()=>this.formFields.delete(t),3e4),i.clears>=2&&(this.formFrustrationCooldowns.add(t),setTimeout(()=>this.formFrustrationCooldowns.delete(t),6e4),this.formFields.delete(t),this.handleIssue({type:"form_frustration",severity:"medium",element:t,selector:this.getSelector(t),metadata:{fieldType:t.type||"text",fieldName:t.name||t.id||"",clearCount:i.clears,pattern:"repeated_clear_retype"},timestamp:new Date().toISOString()})))};document.addEventListener("input",e,!0),this.observers.push(()=>document.removeEventListener("input",e,!0))}trackScroll(){let e=()=>{let r=window.scrollY||document.documentElement.scrollTop,t=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),s=window.innerHeight,i=t-s;if(i<=0)return;let n=Math.min(100,Math.round(r/i*100));n>this.maxScrollDepth&&(this.maxScrollDepth=n),this.scrollTimeout&&clearTimeout(this.scrollTimeout),this.scrollTimeout=setTimeout(()=>{this.push("scroll",{maxDepth:this.maxScrollDepth,url:location.href})},500)};window.addEventListener("scroll",e,{passive:!0}),this.observers.push(()=>window.removeEventListener("scroll",e))}trackForms(){let e=t=>{let s=t.target;if(!this.isFormField(s))return;let i=s.form,n=i?i.id||i.getAttribute("name")||this.getSelector(i):"unknown",o=s.name||s.id||this.getSelector(s);this.formStates.has(n)||this.formStates.set(n,{fields:new Set,startedAt:this.now()}),this.formStates.get(n).fields.add(o),this.push("form",{action:"field_focus",formId:n,fieldName:o,url:location.href})},r=t=>{var n;let s=t.target,i=s.id||s.getAttribute("name")||this.getSelector(s);this.push("form",{action:"submit",formId:i,url:location.href,fieldCount:((n=this.formStates.get(i))==null?void 0:n.fields.size)||0,timeSpent:this.formStates.has(i)?this.now()-this.formStates.get(i).startedAt:0}),this.formStates.delete(i)};document.addEventListener("focusin",e,!0),document.addEventListener("submit",r,!0),this.observers.push(()=>{document.removeEventListener("focusin",e,!0),document.removeEventListener("submit",r,!0)})}trackErrors(){let e=t=>{this.captureError(t.message,t.filename,t.lineno),this.push("error",{message:t.message,source:t.filename,line:t.lineno,col:t.colno,url:location.href})},r=t=>{this.captureError(String(t.reason),"unhandled_promise_rejection"),this.push("error",{message:String(t.reason),source:"unhandled_promise_rejection",url:location.href})};window.addEventListener("error",e),window.addEventListener("unhandledrejection",r),this.observers.push(()=>{window.removeEventListener("error",e),window.removeEventListener("unhandledrejection",r)})}captureError(e,r,t){this.recentErrors.push({message:e,source:r,line:t,timestamp:this.now()}),this.recentErrors.length>h.MAX_ERRORS&&this.recentErrors.shift()}addBreadcrumb(e,r,t){let s=t?`${r} (${t.slice(0,40)})`:r;this.breadcrumbs.push({action:e,target:s,url:location.href,timestamp:this.now()}),this.breadcrumbs.length>h.MAX_BREADCRUMBS&&this.breadcrumbs.shift()}captureDomSnapshot(e){if(!e)return null;try{let r=new Set(["BODY","HTML","MAIN","SECTION","ARTICLE"]),t=e;t.parentElement&&!r.has(t.parentElement.tagName)&&(t=t.parentElement);let s=t.outerHTML;return s.length>1e3?s.slice(0,1e3)+"...":s}catch(r){return null}}loadScript(e,r){return p(this,null,function*(){return new Promise(t=>{let s=document.createElement("script"),i=setTimeout(()=>{s.remove(),t(!1)},r);s.src=e,s.onload=()=>{clearTimeout(i),t(!0)},s.onerror=()=>{clearTimeout(i),s.remove(),t(!1)},document.head.appendChild(s)})})}captureScreenshot(e){return p(this,null,function*(){try{if(typeof window.html2canvas=="undefined"){let n=["https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js","https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"],o=!1;for(let a of n)if(o=yield this.loadScript(a,3e3),o)break;if(!o)return null}let r=window.html2canvas;if(!r)return null;let t=new Set(["BODY","HTML"]),s=e;return s.parentElement&&!t.has(s.parentElement.tagName)&&(s=s.parentElement),(yield r(s,{scale:.5,logging:!1,useCORS:!0})).toDataURL("image/jpeg",.6)}catch(r){return null}})}trackVitals(){if(typeof PerformanceObserver!="undefined"){try{let e=new PerformanceObserver(r=>{let t=r.getEntries(),s=t[t.length-1];s&&this.push("vitals",{metric:"lcp",value:Math.round(s.startTime),url:location.href})});e.observe({type:"largest-contentful-paint",buffered:!0}),this.observers.push(()=>e.disconnect())}catch(e){}try{let e=new PerformanceObserver(r=>{let t=r.getEntries()[0];t&&this.push("vitals",{metric:"fid",value:Math.round(t.processingStart-t.startTime),url:location.href})});e.observe({type:"first-input",buffered:!0}),this.observers.push(()=>e.disconnect())}catch(e){}try{let e=0,r=new PerformanceObserver(t=>{for(let s of t.getEntries())s.hadRecentInput||(e+=s.value)});r.observe({type:"layout-shift",buffered:!0}),this.observers.push(()=>{r.disconnect(),e>0&&this.push("vitals",{metric:"cls",value:Math.round(e*1e3)/1e3,url:location.href})})}catch(e){}}}trackNavigation(){let e=location.href,r=()=>{location.href!==e&&(this.maxScrollDepth>0&&this.push("scroll",{maxDepth:this.maxScrollDepth,url:e}),this.push("page_leave",{url:e,timeOnPage:this.now()-this.pageEnteredAt}),this.addBreadcrumb("navigate",location.href),e=location.href,this.maxScrollDepth=0,this.pageEnteredAt=this.now(),this.trackPageview())},t=history.pushState,s=history.replaceState;history.pushState=function(...i){t.apply(this,i),r()},history.replaceState=function(...i){s.apply(this,i),r()},window.addEventListener("popstate",r),this.observers.push(()=>{window.removeEventListener("popstate",r),history.pushState=t,history.replaceState=s})}setupBatchSending(){this.batchInterval=setInterval(()=>{this.sendBatch()},1e4)}setupUnloadHandler(){let e=()=>{this.batchInterval&&(clearInterval(this.batchInterval),this.batchInterval=null),this.maxScrollDepth>0&&this.push("scroll",{maxDepth:this.maxScrollDepth,url:location.href}),this.push("page_leave",{url:location.href,timeOnPage:this.now()-this.pageEnteredAt});for(let[r,t]of this.formStates)this.push("form",{action:"abandon",formId:r,url:location.href,fieldCount:t.fields.size,timeSpent:this.now()-t.startedAt});this.formStates.clear();for(let r of this.observers)try{r()}catch(t){}this.popover&&this.popover.destroy(),this.sendBatch(!0)};window.addEventListener("beforeunload",e),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&e()})}sendBatch(e=!1){if(this.events.length===0)return;let r=this.events.splice(0),t=`${this.apiUrl}/api/events`,s=JSON.stringify({sessionId:this.sessionId,projectId:this.projectId,events:r});if(e&&typeof navigator.sendBeacon=="function"){navigator.sendBeacon(t,s);return}fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:s,keepalive:e}).catch(()=>{e||this.events.unshift(...r)})}getSelector(e){if(e.id)return`#${e.id}`;let r=e.tagName.toLowerCase(),t=Array.from(e.classList).filter(n=>!n.startsWith("rr-")&&!n.startsWith("uxs-")).slice(0,2).join("."),s=e.parentElement,i="";return s&&Array.from(s.children).filter(o=>o.tagName===e.tagName).length>1&&(i=`:nth-child(${Array.from(s.children).indexOf(e)+1})`),`${r}${t?"."+t:""}${i}`}isInteractive(e){let r=e.tagName;if(r==="BUTTON"||r==="A"||r==="SELECT")return!0;if(r==="INPUT"){let s=(e.type||"").toLowerCase();return["button","submit","reset","checkbox","radio"].includes(s)}return e.getAttribute("role")==="button"||e.getAttribute("tabindex")!=null||e.onclick!=null?!0:window.getComputedStyle(e).cursor==="pointer"}isFormField(e){let r=e.tagName.toLowerCase();if(r==="textarea")return!0;if(r==="input"){let t=(e.type||"").toLowerCase();return["text","email","password","search","tel","url","number"].includes(t)}return e.getAttribute("contenteditable")==="true"}stop(){this.batchInterval&&(clearInterval(this.batchInterval),this.batchInterval=null);for(let e of this.observers)try{e()}catch(r){}this.observers=[],this.popover&&(this.popover.destroy(),this.popover=null);for(let e of this.badges)e.remove();this.badges=[]}};h.MAX_ERRORS=5,h.MAX_BREADCRUMBS=10,h.SEND_TYPES=new Set(["ux_feedback"]);var g=h;function f(){let l=document.currentScript;if(!l){let s=document.querySelectorAll("script[data-project-id]");s.length>0&&(l=s[s.length-1])}if(!l)return;let e=l.getAttribute("data-project-id");if(!e)return;let r=l.getAttribute("data-api-url")||"",t={projectId:e,apiUrl:r,rageClick:l.getAttribute("data-rage-click")!=="false",deadLink:l.getAttribute("data-dead-link")!=="false",brokenImage:l.getAttribute("data-broken-image")!=="false",formFrustration:l.getAttribute("data-form-frustration")!=="false",popover:l.getAttribute("data-popover")!=="false",popoverTheme:l.getAttribute("data-popover-theme")||"dark",maxPopupsPerSession:parseInt(l.getAttribute("data-max-popups")||"5",10),popoverCooldown:parseInt(l.getAttribute("data-popover-cooldown")||"30000",10),debug:l.getAttribute("data-debug")==="true"};new g(t)}typeof window!="undefined"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f());})();
