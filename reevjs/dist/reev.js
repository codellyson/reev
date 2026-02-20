"use strict";var Reev=(()=>{var m=(d,e,t)=>new Promise((r,i)=>{var s=o=>{try{c(t.next(o))}catch(a){i(a)}},n=o=>{try{c(t.throw(o))}catch(a){i(a)}},c=o=>o.done?r(o.value):Promise.resolve(o.value).then(s,n);c((t=t.apply(d,e)).next())});var E=`
  --uxs-bg: #161a24;
  --uxs-bg-input: #11141b;
  --uxs-border: #3a4158;
  --uxs-text: #e2e6f0;
  --uxs-text-sec: #7a829e;
  --uxs-text-muted: #4a5170;
`,S=`
  --uxs-bg: #ffffff;
  --uxs-bg-input: #f5f6f8;
  --uxs-border: #d1d5db;
  --uxs-text: #1f2937;
  --uxs-text-sec: #6b7280;
  --uxs-text-muted: #9ca3af;
`,I=`
.uxs-popover {
  --uxs-amber: #f0a830;
  --uxs-amber-dim: #c8891a;
  --uxs-red: #e84855;
  --uxs-green: #3dd68c;
  --uxs-blue: #4e9af5;
  --uxs-radius: 14px;

  position: fixed;
  z-index: 2147483647;
  width: 320px;
  background: var(--uxs-bg);
  border: 1px solid var(--uxs-border);
  border-radius: var(--uxs-radius);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  opacity: 0;
  pointer-events: none;
  transform-origin: var(--uxs-origin, center top);
  transform: scale(0.92) translateY(4px);
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: visible;
}
.uxs-popover.uxs-visible {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateY(0);
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
.uxs-stripe { height: 2px; position: relative; z-index: 2; border-radius: var(--uxs-radius) var(--uxs-radius) 0 0; opacity: 0.8; }
.uxs-stripe-red { background: var(--uxs-red); }
.uxs-stripe-amber { background: var(--uxs-amber); }
.uxs-stripe-green { background: var(--uxs-green); }
.uxs-stripe-blue { background: var(--uxs-blue); }
.uxs-close {
  position: absolute;
  top: 14px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--uxs-text-muted);
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
  line-height: 1;
  padding: 0;
}
.uxs-close:hover {
  color: var(--uxs-text);
  background: var(--uxs-bg-input);
}
.uxs-header {
  padding: 18px 20px 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.uxs-emoji { font-size: 22px; line-height: 1; flex-shrink: 0; margin-top: 1px; }
.uxs-header-text { padding-right: 24px; }
.uxs-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--uxs-text);
  letter-spacing: -0.01em;
}
.uxs-desc {
  font-size: 12.5px;
  color: var(--uxs-text-sec);
  line-height: 1.5;
  margin: 0;
}
.uxs-body { padding: 0 20px 14px; }
.uxs-textarea {
  width: 100%;
  background: var(--uxs-bg-input);
  border: 1px solid var(--uxs-border);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--uxs-text);
  font-family: inherit;
  font-size: 13px;
  resize: none;
  height: 56px;
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
  gap: 8px;
  padding: 0 20px 18px;
}
.uxs-btn {
  flex: 1;
  padding: 9px 14px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 13px;
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
  font-weight: 600;
}
.uxs-btn-send:hover {
  background: var(--uxs-amber-dim);
  border-color: var(--uxs-amber-dim);
}
.uxs-btn-dismiss {
  background: transparent;
  color: var(--uxs-text-sec);
  border: none;
}
.uxs-btn-dismiss:hover {
  color: var(--uxs-text);
  background: var(--uxs-bg-input);
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
`,L=`
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
`,T=`
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
`,A={rage_click:{emoji:"\u{1F624}",color:"amber",title:"Not working?",desc:()=>"We noticed you clicked multiple times. What were you expecting to happen?",placeholder:"e.g. The button didn\u2019t respond\u2026"},dead_link:{emoji:"\u{1F517}",color:"red",title:"Broken link",desc:d=>{var e;return`This link seems broken (${((e=d.metadata)==null?void 0:e.status)||"error"}). Where were you trying to go?`},placeholder:"e.g. I was trying to reach\u2026"},broken_image:{emoji:"\u{1F5BC}\uFE0F",color:"green",title:"Missing image",desc:()=>"An image didn\u2019t load here. Is this causing problems?",placeholder:"e.g. I can\u2019t see the product photo\u2026"},form_frustration:{emoji:"\u{1F4DD}",color:"blue",title:"Form trouble?",desc:()=>"This form seems frustrating. What\u2019s confusing?",placeholder:"e.g. The validation keeps rejecting\u2026"}},f=class{constructor(e){this.el=null;this.currentAnchor=null;this.currentIssue=null;this.triggerElement=null;this.shownCount=0;this.lastShown=0;this.stylesInjected=!1;this.reposition=()=>{var e;this.currentAnchor&&((e=this.el)!=null&&e.classList.contains("uxs-visible"))&&this.position()};this.onKeyDown=e=>{if(this.el){if(e.key==="Escape"){this.dismiss();return}if(e.key==="Tab"){let t=this.el.querySelectorAll("textarea, button");if(!t.length)return;let r=t[0],i=t[t.length-1];e.shiftKey&&document.activeElement===r?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),r.focus())}}};this.onOutsideClick=e=>{var t;this.el&&(this.el.contains(e.target)||(t=this.currentAnchor)!=null&&t.contains(e.target)||this.dismiss())};var t,r;this.config={maxPerSession:(t=e.maxPerSession)!=null?t:5,cooldown:(r=e.cooldown)!=null?r:3e4,theme:e.theme||"dark",onFeedback:e.onFeedback||null}}injectStyles(){if(this.stylesInjected)return;this.stylesInjected=!0;let e=this.config.theme==="light"?S:E,t=document.createElement("style");t.id="reev-popover-styles",t.textContent=`.uxs-popover { ${e} }
${I}`,document.head.appendChild(t)}ensureDOM(){var e,t,r;this.el||(this.injectStyles(),this.el=document.createElement("div"),this.el.className="uxs-popover",this.el.setAttribute("role","dialog"),this.el.setAttribute("aria-label","User feedback"),this.el.setAttribute("aria-modal","true"),this.el.innerHTML=T,document.body.appendChild(this.el),(e=this.el.querySelector(".uxs-close"))==null||e.addEventListener("click",()=>this.dismiss()),(t=this.el.querySelector(".uxs-btn-dismiss"))==null||t.addEventListener("click",()=>this.dismiss()),(r=this.el.querySelector(".uxs-btn-send"))==null||r.addEventListener("click",()=>this.submit()))}show(e,t=!1){var n,c;let r=Date.now();if(!t&&this.shownCount>=this.config.maxPerSession||!t&&r-this.lastShown<this.config.cooldown||!e.element||!e.element.getBoundingClientRect)return!1;this.forceClose(),this.ensureDOM();let i=A[e.type]||{emoji:"\u26A0\uFE0F",color:"amber",title:"Issue Detected",desc:()=>"Something went wrong.",placeholder:"What were you trying to do?"};if(this.el){let o=this.el.querySelector(".uxs-emoji"),a=this.el.querySelector(".uxs-title"),l=this.el.querySelector(".uxs-desc"),u=this.el.querySelector(".uxs-textarea"),h=this.el.querySelector(".uxs-stripe");o&&(o.textContent=i.emoji),a&&(a.textContent=i.title),l&&(l.textContent=i.desc(e)),u&&(u.value="",u.placeholder=i.placeholder),h&&(h.className=`uxs-stripe uxs-stripe-${i.color}`),this.el.classList.remove("uxs-visible"),this.el.offsetHeight}this.currentAnchor=e.element,this.currentIssue=e,this.triggerElement=document.activeElement,this.shownCount++,this.lastShown=r,this.currentAnchor.classList.add("uxs-highlight"),this.position(),(n=this.el)==null||n.classList.add("uxs-visible");let s=(c=this.el)==null?void 0:c.querySelector(".uxs-textarea");return s==null||s.focus(),document.addEventListener("mousedown",this.onOutsideClick),document.addEventListener("keydown",this.onKeyDown),window.addEventListener("scroll",this.reposition,!0),window.addEventListener("resize",this.reposition),!0}forceClose(){this.el&&(this.el.classList.remove("uxs-visible"),this.currentAnchor&&this.currentAnchor.classList.remove("uxs-highlight"),document.removeEventListener("mousedown",this.onOutsideClick),document.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("scroll",this.reposition,!0),window.removeEventListener("resize",this.reposition),this.currentAnchor=null,this.currentIssue=null,this.triggerElement=null)}dismiss(){!this.el||!this.el.classList.contains("uxs-visible")||(this.forceClose(),this.triggerElement&&this.triggerElement.focus&&this.triggerElement.focus())}destroy(){this.dismiss(),this.el&&(this.el.remove(),this.el=null)}submit(){var r;let e=(r=this.el)==null?void 0:r.querySelector(".uxs-textarea"),t=(e==null?void 0:e.value.trim())||"";this.config.onFeedback&&this.currentIssue&&this.config.onFeedback({issue:{type:this.currentIssue.type,severity:this.currentIssue.severity,selector:this.currentIssue.selector,url:this.currentIssue.url,metadata:this.currentIssue.metadata},message:t,timestamp:new Date().toISOString(),pageUrl:location.href}),this.dismiss()}position(){if(!this.currentAnchor||!this.el)return;let e=this.currentAnchor,t=this.el,r=t.querySelector(".uxs-arrow"),i=e.getBoundingClientRect(),s=window.innerWidth<=400?window.innerWidth-24:310,n=10,c=t.offsetHeight,a=window.innerHeight-i.bottom>c+n+20?"bottom":"top";t.classList.remove("uxs-placement-bottom","uxs-placement-top"),t.classList.add(`uxs-placement-${a}`);let l=i.left+i.width/2-s/2;l=Math.max(10,Math.min(l,window.innerWidth-s-10));let u;if(a==="bottom"?(u=i.bottom+n,t.style.setProperty("--uxs-origin","center top")):(u=i.top-n-c,u=Math.max(10,u),t.style.setProperty("--uxs-origin","center bottom")),t.style.left=`${l}px`,t.style.top=`${u}px`,r){let h=i.left+i.width/2-l-6;r.style.left=`${Math.max(18,Math.min(h,s-30))}px`}}},p=class p{constructor(e){this.events=[];this.batchInterval=null;this.maxScrollDepth=0;this.scrollTimeout=null;this.pageEnteredAt=Date.now();this.observers=[];this.popover=null;this.clickTracker=new Map;this.rageClickCooldowns=new WeakSet;this.checkedLinks=new WeakSet;this.probeResults=new Map;this.probeQueue=[];this.probeDraining=!1;this.probeDelay=300;this.reportedImages=new WeakSet;this.checkedImages=new WeakSet;this.badges=[];this.formFields=new Map;this.formFrustrationCooldowns=new WeakSet;this.formStates=new Map;this.recentErrors=[];this.breadcrumbs=[];this.pendingDomSnapshot=null;this.snapshotId=0;var t,r,i,s,n,c,o,a,l;this.projectId=e.projectId,this.apiUrl=e.apiUrl||"",this.sessionId=this.generateSessionId(),this.config={rageClick:(t=e.rageClick)!=null?t:!0,deadLink:(r=e.deadLink)!=null?r:!0,brokenImage:(i=e.brokenImage)!=null?i:!0,formFrustration:(s=e.formFrustration)!=null?s:!0,popover:(n=e.popover)!=null?n:!0,popoverTheme:(c=e.popoverTheme)!=null?c:"dark",maxPopupsPerSession:(o=e.maxPopupsPerSession)!=null?o:5,popoverCooldown:(a=e.popoverCooldown)!=null?a:3e4,debug:(l=e.debug)!=null?l:!1},this.init()}generateSessionId(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})}now(){return Date.now()}log(...e){this.config.debug&&console.log("[Reev]",...e)}push(e,t){p.SEND_TYPES.has(e)&&this.events.push({type:e,data:t,timestamp:this.now()})}init(){try{if(!document.getElementById("reev-badge-styles")){let e=document.createElement("style");e.id="reev-badge-styles",e.textContent=L,document.head.appendChild(e)}this.config.popover&&(this.popover=new f({maxPerSession:this.config.maxPopupsPerSession,cooldown:this.config.popoverCooldown,theme:this.config.popoverTheme,onFeedback:e=>this.handleFeedback(e)})),this.trackPageview(),this.trackClicks(),this.trackScroll(),this.trackForms(),this.trackErrors(),this.trackVitals(),this.trackNavigation(),this.config.deadLink&&this.trackDeadLinks(),this.config.brokenImage&&this.trackBrokenImages(),this.config.formFrustration&&this.trackFormFrustration(),this.setupBatchSending(),this.setupUnloadHandler(),this.log("Initialized",{sessionId:this.sessionId,config:this.config})}catch(e){}}handleIssue(e){this.log("Issue detected",e),this.pendingDomSnapshot=this.captureDomSnapshot(e.element),this.push("ux_issue",{issueType:e.type,severity:e.severity,selector:e.selector,url:e.url,metadata:e.metadata,pageUrl:location.href}),this.popover&&this.popover.show(e)}showPopoverForIssue(e){this.popover&&this.popover.show(e,!0)}handleFeedback(e){var t,r,i;this.log("Feedback received",e),this.push("ux_feedback",{issueType:(t=e.issue)==null?void 0:t.type,issueSeverity:(r=e.issue)==null?void 0:r.severity,issueSelector:(i=e.issue)==null?void 0:i.selector,message:e.message,pageUrl:e.pageUrl,deviceType:this.detectDevice(),browserName:this.detectBrowser(),timeOnPage:Math.round((this.now()-this.pageEnteredAt)/1e3),domSnapshot:this.pendingDomSnapshot,consoleErrors:this.recentErrors.slice(),breadcrumbs:this.breadcrumbs.slice()}),this.pendingDomSnapshot=null,this.sendBatch()}detectDevice(){let e=window.innerWidth;return e<768?"mobile":e<1024?"tablet":"desktop"}detectBrowser(){let e=navigator.userAgent;return e.includes("Firefox")?"Firefox":e.includes("Edg")?"Edge":e.includes("Chrome")?"Chrome":e.includes("Safari")?"Safari":"Other"}trackPageview(){this.pageEnteredAt=this.now(),this.maxScrollDepth=0,this.push("pageview",{url:location.href,referrer:document.referrer,title:document.title,viewport:{w:window.innerWidth,h:window.innerHeight}})}trackClicks(){let e=t=>{let r=t.target;if(!r)return;let i=this.getSelector(r),s=(r.textContent||"").trim().slice(0,100),n=this.now(),c=!1;if(this.config.rageClick){let o=this.findInteractive(r);if(o&&!this.rageClickCooldowns.has(o)){this.clickTracker.has(o)||this.clickTracker.set(o,[]);let a=this.clickTracker.get(o);a.push(n);let l=n-1500;for(;a.length&&a[0]<l;)a.shift();a.length>=3&&(c=!0,this.rageClickCooldowns.add(o),setTimeout(()=>this.rageClickCooldowns.delete(o),5e3),this.clickTracker.delete(o),this.handleIssue({type:"rage_click",severity:"medium",element:o,selector:this.getSelector(o),metadata:{clickCount:a.length,windowMs:1500,avgInterval:Math.round(1500/a.length)},timestamp:new Date().toISOString()}))}}this.addBreadcrumb("click",i,s),this.push("click",{selector:i,text:s,x:t.clientX,y:t.clientY,isRage:c,url:location.href})};document.addEventListener("click",e,!0),this.observers.push(()=>document.removeEventListener("click",e,!0))}findInteractive(e){let t=e;for(;t&&t!==document.body;){if(this.isInteractive(t))return t;t=t.parentElement}return null}trackDeadLinks(){this.scanLinks();let e=new MutationObserver(()=>{this.scanLinks()});e.observe(document.body,{childList:!0,subtree:!0}),this.observers.push(()=>e.disconnect())}scanLinks(){let e=document.querySelectorAll("a[href]");for(let t of e){if(this.checkedLinks.has(t))continue;let r=t.getAttribute("href");if(!r||r.startsWith("#")||r.startsWith("javascript:")||r.startsWith("mailto:")||r.startsWith("tel:"))continue;let i;try{let s=new URL(r,window.location.origin);if(s.origin!==window.location.origin)continue;i=s.href}catch(s){continue}this.checkedLinks.add(t),this.enqueueProbe(t,i)}}enqueueProbe(e,t){this.probeQueue.push(()=>m(this,null,function*(){yield this.probeLink(e,t)})),this.drainQueue()}drainQueue(){return m(this,null,function*(){if(!this.probeDraining){for(this.probeDraining=!0;this.probeQueue.length>0;)yield this.probeQueue.shift()(),this.probeQueue.length>0&&(yield new Promise(t=>setTimeout(t,this.probeDelay)));this.probeDraining=!1}})}probeLink(e,t){return m(this,null,function*(){let r=this.probeResults.get(t);if(r){let n=yield r;n.ok||this.reportDeadLink(e,t,n.status);return}let i=this.executeProbe(t);this.probeResults.set(t,i);let s=yield i;s.ok||(this.log("Dead link found:",t,s.status),this.reportDeadLink(e,t,s.status))})}executeProbe(e){return m(this,null,function*(){var i;let t=new AbortController,r=setTimeout(()=>t.abort(),5e3);try{let s=yield fetch(e,{method:"GET",signal:t.signal});if(clearTimeout(r),(i=s.body)==null||i.cancel(),s.status===429){let n=parseInt(s.headers.get("Retry-After")||"",10);return this.probeDelay=Math.max(this.probeDelay*2,(n||2)*1e3),{ok:!0,status:429}}return{ok:s.ok,status:s.ok?200:s.status}}catch(s){return clearTimeout(r),s.name==="AbortError"?{ok:!1,status:"TIMEOUT"}:{ok:!1,status:"NETWORK_ERROR"}}})}addIndicator(e,t,r){this.log("Adding indicator badge",t.type,t.selector);let i=e.parentElement;if(!i)return;window.getComputedStyle(i).position==="static"&&(i.style.position="relative");let n=e.getBoundingClientRect(),c=i.getBoundingClientRect(),o=n.top-c.top-4,a=n.right-c.left-16,l=document.createElement("div");l.className=`uxs-badge${r?` ${r}`:""}`,l.textContent="?",l.style.top=`${Math.max(0,o)}px`,l.style.left=`${Math.max(0,a)}px`,l.title=t.type==="dead_link"?"Broken link \u2014 click to report":"Missing image \u2014 click to report",l.addEventListener("click",u=>{u.stopPropagation(),u.preventDefault(),this.showPopoverForIssue(t)}),i.appendChild(l),this.badges.push(l)}reportDeadLink(e,t,r){let i={type:"dead_link",severity:"high",element:e,selector:this.getSelector(e),url:t,metadata:{status:r},timestamp:new Date().toISOString()};this.addIndicator(e,i,"uxs-badge-red")}trackBrokenImages(){let e=s=>{this.reportedImages.has(s)||(this.reportedImages.add(s),this.log("Broken image detected:",s.src||s.getAttribute("src")),this.reportBrokenImage(s))},t=s=>{this.reportedImages.has(s)||!s.src&&!s.getAttribute("src")||this.checkedImages.has(s)||(this.checkedImages.add(s),s.addEventListener("error",()=>e(s),{once:!0}))};document.querySelectorAll("img").forEach(t);let r=()=>{document.querySelectorAll("img").forEach(s=>{if(!this.reportedImages.has(s)&&!(s.offsetParent===null&&getComputedStyle(s).display==="none")){if(!s.src&&!s.getAttribute("src")){e(s);return}s.complete&&(s.naturalWidth>0||e(s))}})};document.readyState==="complete"?setTimeout(r,1e3):window.addEventListener("load",()=>{setTimeout(r,1e3)},{once:!0});let i=new MutationObserver(s=>{var n;for(let c of s)for(let o of c.addedNodes)o instanceof HTMLElement&&(o.tagName==="IMG"&&t(o),(n=o.querySelectorAll)==null||n.call(o,"img").forEach(t))});i.observe(document.body,{childList:!0,subtree:!0}),this.observers.push(()=>i.disconnect())}reportBrokenImage(e){let t={type:"broken_image",severity:"low",element:e,selector:this.getSelector(e),url:e.src||e.currentSrc||"",metadata:{alt:e.alt||"",naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight},timestamp:new Date().toISOString()};this.addIndicator(e,t)}trackFormFrustration(){let e=t=>{let r=t.target;if(!this.isFormField(r)||this.formFrustrationCooldowns.has(r))return;let i=(r.value||"").length;if(!this.formFields.has(r)){this.formFields.set(r,{clears:0,peakLen:i,timer:setTimeout(()=>this.formFields.delete(r),3e4)});return}let s=this.formFields.get(r);i>s.peakLen&&(s.peakLen=i),i===0&&s.peakLen>=3&&(s.clears++,s.peakLen=0,clearTimeout(s.timer),s.timer=setTimeout(()=>this.formFields.delete(r),3e4),s.clears>=2&&(this.formFrustrationCooldowns.add(r),setTimeout(()=>this.formFrustrationCooldowns.delete(r),6e4),this.formFields.delete(r),this.handleIssue({type:"form_frustration",severity:"medium",element:r,selector:this.getSelector(r),metadata:{fieldType:r.type||"text",fieldName:r.name||r.id||"",clearCount:s.clears,pattern:"repeated_clear_retype"},timestamp:new Date().toISOString()})))};document.addEventListener("input",e,!0),this.observers.push(()=>document.removeEventListener("input",e,!0))}trackScroll(){let e=()=>{let t=window.scrollY||document.documentElement.scrollTop,r=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),i=window.innerHeight,s=r-i;if(s<=0)return;let n=Math.min(100,Math.round(t/s*100));n>this.maxScrollDepth&&(this.maxScrollDepth=n),this.scrollTimeout&&clearTimeout(this.scrollTimeout),this.scrollTimeout=setTimeout(()=>{this.push("scroll",{maxDepth:this.maxScrollDepth,url:location.href})},500)};window.addEventListener("scroll",e,{passive:!0}),this.observers.push(()=>window.removeEventListener("scroll",e))}trackForms(){let e=r=>{let i=r.target;if(!this.isFormField(i))return;let s=i.form,n=s?s.id||s.getAttribute("name")||this.getSelector(s):"unknown",c=i.name||i.id||this.getSelector(i);this.formStates.has(n)||this.formStates.set(n,{fields:new Set,startedAt:this.now()}),this.formStates.get(n).fields.add(c),this.push("form",{action:"field_focus",formId:n,fieldName:c,url:location.href})},t=r=>{var n;let i=r.target,s=i.id||i.getAttribute("name")||this.getSelector(i);this.push("form",{action:"submit",formId:s,url:location.href,fieldCount:((n=this.formStates.get(s))==null?void 0:n.fields.size)||0,timeSpent:this.formStates.has(s)?this.now()-this.formStates.get(s).startedAt:0}),this.formStates.delete(s)};document.addEventListener("focusin",e,!0),document.addEventListener("submit",t,!0),this.observers.push(()=>{document.removeEventListener("focusin",e,!0),document.removeEventListener("submit",t,!0)})}trackErrors(){let e=r=>{this.captureError(r.message,r.filename,r.lineno),this.push("error",{message:r.message,source:r.filename,line:r.lineno,col:r.colno,url:location.href})},t=r=>{this.captureError(String(r.reason),"unhandled_promise_rejection"),this.push("error",{message:String(r.reason),source:"unhandled_promise_rejection",url:location.href})};window.addEventListener("error",e),window.addEventListener("unhandledrejection",t),this.observers.push(()=>{window.removeEventListener("error",e),window.removeEventListener("unhandledrejection",t)})}captureError(e,t,r){this.recentErrors.push({message:e,source:t,line:r,timestamp:this.now()}),this.recentErrors.length>p.MAX_ERRORS&&this.recentErrors.shift()}addBreadcrumb(e,t,r){let i=r?`${t} (${r.slice(0,40)})`:t;this.breadcrumbs.push({action:e,target:i,url:location.href,timestamp:this.now()}),this.breadcrumbs.length>p.MAX_BREADCRUMBS&&this.breadcrumbs.shift()}captureDomSnapshot(e){if(!e)return null;try{let t=new Set(["BODY","HTML","MAIN","SECTION","ARTICLE","NAV","HEADER","FOOTER","UL","OL"]),r=new Set(["A","IMG","BUTTON","INPUT","SPAN","LABEL","SVG"]),i=e;r.has(e.tagName)&&i.parentElement&&!t.has(i.parentElement.tagName)&&(i=i.parentElement);let s=i.cloneNode(!0),n=[];this.inlineAllStyles(i,s,n,0),s.querySelectorAll("img").forEach(a=>{a.src&&a.setAttribute("src",a.src)}),s.querySelectorAll("a").forEach(a=>{a.href&&a.setAttribute("href",a.href)}),s.querySelectorAll(".uxs-badge, .uxs-popover, .uxs-highlight").forEach(a=>a.remove());let o=`${n.length>0?`<style>${n.join("")}</style>`:""}${s.outerHTML}`;return o.length>2e4?o.slice(0,2e4):o}catch(t){return null}}inlineAllStyles(e,t,r,i){if(i>10||!(e instanceof HTMLElement)||!(t instanceof HTMLElement))return;let s=window.getComputedStyle(e),n=[];for(let l=0;l<s.length;l++){let u=s[l],h=s.getPropertyValue(u);h&&n.push(`${u}:${h}`)}t.setAttribute("style",n.join(";")),t.removeAttribute("class");for(let l of["::before","::after"]){let u=window.getComputedStyle(e,l),h=u.getPropertyValue("content");if(!h||h==="none"||h==="normal")continue;let b=`rs${this.snapshotId++}`;t.setAttribute(`data-${b}`,"");let x=[];for(let g=0;g<u.length;g++){let y=u[g],w=u.getPropertyValue(y);w&&x.push(`${y}:${w}`)}r.push(`[data-${b}]${l}{${x.join(";")}}`)}let c=e.children,o=t.children,a=Math.min(c.length,o.length,30);for(let l=0;l<a;l++)this.inlineAllStyles(c[l],o[l],r,i+1)}trackVitals(){if(typeof PerformanceObserver!="undefined"){try{let e=new PerformanceObserver(t=>{let r=t.getEntries(),i=r[r.length-1];i&&this.push("vitals",{metric:"lcp",value:Math.round(i.startTime),url:location.href})});e.observe({type:"largest-contentful-paint",buffered:!0}),this.observers.push(()=>e.disconnect())}catch(e){}try{let e=new PerformanceObserver(t=>{let r=t.getEntries()[0];r&&this.push("vitals",{metric:"fid",value:Math.round(r.processingStart-r.startTime),url:location.href})});e.observe({type:"first-input",buffered:!0}),this.observers.push(()=>e.disconnect())}catch(e){}try{let e=0,t=new PerformanceObserver(r=>{for(let i of r.getEntries())i.hadRecentInput||(e+=i.value)});t.observe({type:"layout-shift",buffered:!0}),this.observers.push(()=>{t.disconnect(),e>0&&this.push("vitals",{metric:"cls",value:Math.round(e*1e3)/1e3,url:location.href})})}catch(e){}}}trackNavigation(){let e=location.href,t=()=>{location.href!==e&&(this.maxScrollDepth>0&&this.push("scroll",{maxDepth:this.maxScrollDepth,url:e}),this.push("page_leave",{url:e,timeOnPage:this.now()-this.pageEnteredAt}),this.addBreadcrumb("navigate",location.href),e=location.href,this.maxScrollDepth=0,this.pageEnteredAt=this.now(),this.trackPageview())},r=history.pushState,i=history.replaceState;history.pushState=function(...s){r.apply(this,s),t()},history.replaceState=function(...s){i.apply(this,s),t()},window.addEventListener("popstate",t),this.observers.push(()=>{window.removeEventListener("popstate",t),history.pushState=r,history.replaceState=i})}setupBatchSending(){this.batchInterval=setInterval(()=>{this.sendBatch()},1e4)}setupUnloadHandler(){let e=()=>{this.batchInterval&&(clearInterval(this.batchInterval),this.batchInterval=null),this.maxScrollDepth>0&&this.push("scroll",{maxDepth:this.maxScrollDepth,url:location.href}),this.push("page_leave",{url:location.href,timeOnPage:this.now()-this.pageEnteredAt});for(let[t,r]of this.formStates)this.push("form",{action:"abandon",formId:t,url:location.href,fieldCount:r.fields.size,timeSpent:this.now()-r.startedAt});this.formStates.clear();for(let t of this.observers)try{t()}catch(r){}this.popover&&this.popover.destroy(),this.sendBatch(!0)};window.addEventListener("beforeunload",e),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&e()})}sendBatch(e=!1){if(this.events.length===0)return;let t=this.events.splice(0),r=`${this.apiUrl}/api/events`,i=JSON.stringify({sessionId:this.sessionId,projectId:this.projectId,events:t});if(e&&typeof navigator.sendBeacon=="function"){navigator.sendBeacon(r,i);return}fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:i,keepalive:e}).catch(()=>{e||this.events.unshift(...t)})}getSelector(e){let t=[],r=e;for(;r&&r!==document.body&&r!==document.documentElement;){if(r.id){t.unshift(`#${r.id}`);break}let i=r.tagName.toLowerCase(),s=r.parentElement,n="";if(s){let c=r.tagName,a=Array.from(s.children).filter(l=>l.tagName===c);a.length>1&&(n=`:nth-of-type(${a.indexOf(r)+1})`)}t.unshift(`${i}${n}`),r=s}return t.join(" > ")}isInteractive(e){let t=e.tagName;if(t==="BUTTON"||t==="A"||t==="SELECT")return!0;if(t==="INPUT"){let i=(e.type||"").toLowerCase();return["button","submit","reset","checkbox","radio"].includes(i)}return e.getAttribute("role")==="button"||e.getAttribute("tabindex")!=null||e.onclick!=null?!0:window.getComputedStyle(e).cursor==="pointer"?(e.parentElement?window.getComputedStyle(e.parentElement).cursor:"auto")!=="pointer":!1}isFormField(e){let t=e.tagName.toLowerCase();if(t==="textarea")return!0;if(t==="input"){let r=(e.type||"").toLowerCase();return["text","email","password","search","tel","url","number"].includes(r)}return e.getAttribute("contenteditable")==="true"}stop(){this.batchInterval&&(clearInterval(this.batchInterval),this.batchInterval=null);for(let e of this.observers)try{e()}catch(t){}this.observers=[],this.popover&&(this.popover.destroy(),this.popover=null);for(let e of this.badges)e.remove();this.badges=[]}};p.MAX_ERRORS=5,p.MAX_BREADCRUMBS=10,p.SEND_TYPES=new Set(["ux_feedback"]);var v=p;function k(){let d=document.currentScript;if(!d){let i=document.querySelectorAll("script[data-project-id]");i.length>0&&(d=i[i.length-1])}if(!d)return;let e=d.getAttribute("data-project-id");if(!e)return;let t=d.getAttribute("data-api-url")||"",r={projectId:e,apiUrl:t,rageClick:d.getAttribute("data-rage-click")!=="false",deadLink:d.getAttribute("data-dead-link")!=="false",brokenImage:d.getAttribute("data-broken-image")!=="false",formFrustration:d.getAttribute("data-form-frustration")!=="false",popover:d.getAttribute("data-popover")!=="false",popoverTheme:d.getAttribute("data-popover-theme")||"dark",maxPopupsPerSession:parseInt(d.getAttribute("data-max-popups")||"5",10),popoverCooldown:parseInt(d.getAttribute("data-popover-cooldown")||"30000",10),debug:d.getAttribute("data-debug")==="true"};new v(r)}typeof window!="undefined"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",k):k());})();
