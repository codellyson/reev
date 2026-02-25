"use strict";var Reev=(()=>{var U=Object.defineProperty;var D=Object.getOwnPropertySymbols;var _=Object.prototype.hasOwnProperty,W=Object.prototype.propertyIsEnumerable;var H=(d,e,t)=>e in d?U(d,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[e]=t,N=(d,e)=>{for(var t in e||(e={}))_.call(e,t)&&H(d,t,e[t]);if(D)for(var t of D(e))W.call(e,t)&&H(d,t,e[t]);return d};var y=(d,e,t)=>new Promise((s,r)=>{var i=o=>{try{a(t.next(o))}catch(l){r(l)}},n=o=>{try{a(t.throw(o))}catch(l){r(l)}},a=o=>o.done?s(o.value):Promise.resolve(o.value).then(i,n);a((t=t.apply(d,e)).next())});var P=`
  --uxs-bg: #161a24;
  --uxs-bg-input: #11141b;
  --uxs-border: #3a4158;
  --uxs-text: #e2e6f0;
  --uxs-text-sec: #7a829e;
  --uxs-text-muted: #4a5170;
`,F=`
  --uxs-bg: #ffffff;
  --uxs-bg-input: #f5f6f8;
  --uxs-border: #d1d5db;
  --uxs-text: #1f2937;
  --uxs-text-sec: #6b7280;
  --uxs-text-muted: #9ca3af;
`,z=`
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
`,$=`
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
`,q=`
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
`,X={rage_click:{emoji:"\u{1F624}",color:"amber",title:"Not working?",desc:()=>"We noticed you clicked multiple times. What were you expecting to happen?",placeholder:"e.g. The button didn\u2019t respond\u2026"},dead_link:{emoji:"\u{1F517}",color:"red",title:"Broken link",desc:d=>{var e;return`This link seems broken (${((e=d.metadata)==null?void 0:e.status)||"error"}). Where were you trying to go?`},placeholder:"e.g. I was trying to reach\u2026"},broken_image:{emoji:"\u{1F5BC}\uFE0F",color:"green",title:"Missing image",desc:()=>"An image didn\u2019t load here. Is this causing problems?",placeholder:"e.g. I can\u2019t see the product photo\u2026"},form_frustration:{emoji:"\u{1F4DD}",color:"blue",title:"Form trouble?",desc:()=>"This form seems frustrating. What\u2019s confusing?",placeholder:"e.g. The validation keeps rejecting\u2026"}},C=class{constructor(e){this.el=null;this.currentAnchor=null;this.currentIssue=null;this.triggerElement=null;this.shownCount=0;this.lastShown=0;this.stylesInjected=!1;this.reposition=()=>{var e;this.currentAnchor&&((e=this.el)!=null&&e.classList.contains("uxs-visible"))&&this.position()};this.onKeyDown=e=>{if(this.el){if(e.key==="Escape"){this.dismiss();return}if(e.key==="Tab"){let t=this.el.querySelectorAll("textarea, button");if(!t.length)return;let s=t[0],r=t[t.length-1];e.shiftKey&&document.activeElement===s?(e.preventDefault(),r.focus()):!e.shiftKey&&document.activeElement===r&&(e.preventDefault(),s.focus())}}};this.onOutsideClick=e=>{var t;this.el&&(this.el.contains(e.target)||(t=this.currentAnchor)!=null&&t.contains(e.target)||this.dismiss())};var t,s;this.config={maxPerSession:(t=e.maxPerSession)!=null?t:5,cooldown:(s=e.cooldown)!=null?s:3e4,theme:e.theme||"dark",onFeedback:e.onFeedback||null}}injectStyles(){if(this.stylesInjected)return;this.stylesInjected=!0;let e=this.config.theme==="light"?F:P,t=document.createElement("style");t.id="reev-popover-styles",t.textContent=`.uxs-popover { ${e} }
${z}`,document.head.appendChild(t)}ensureDOM(){var e,t,s;this.el||(this.injectStyles(),this.el=document.createElement("div"),this.el.className="uxs-popover",this.el.setAttribute("role","dialog"),this.el.setAttribute("aria-label","User feedback"),this.el.setAttribute("aria-modal","true"),this.el.innerHTML=q,document.body.appendChild(this.el),(e=this.el.querySelector(".uxs-close"))==null||e.addEventListener("click",()=>this.dismiss()),(t=this.el.querySelector(".uxs-btn-dismiss"))==null||t.addEventListener("click",()=>this.dismiss()),(s=this.el.querySelector(".uxs-btn-send"))==null||s.addEventListener("click",()=>this.submit()))}show(e,t=!1){var n,a;let s=Date.now();if(!t&&this.shownCount>=this.config.maxPerSession||!t&&s-this.lastShown<this.config.cooldown||!e.element||!e.element.getBoundingClientRect)return!1;this.forceClose(),this.ensureDOM();let r=X[e.type]||{emoji:"\u26A0\uFE0F",color:"amber",title:"Issue Detected",desc:()=>"Something went wrong.",placeholder:"What were you trying to do?"};if(this.el){let o=this.el.querySelector(".uxs-emoji"),l=this.el.querySelector(".uxs-title"),u=this.el.querySelector(".uxs-desc"),c=this.el.querySelector(".uxs-textarea"),p=this.el.querySelector(".uxs-stripe");o&&(o.textContent=r.emoji),l&&(l.textContent=r.title),u&&(u.textContent=r.desc(e)),c&&(c.value="",c.placeholder=r.placeholder),p&&(p.className=`uxs-stripe uxs-stripe-${r.color}`),this.el.classList.remove("uxs-visible"),this.el.offsetHeight}this.currentAnchor=e.element,this.currentIssue=e,this.triggerElement=document.activeElement,this.shownCount++,this.lastShown=s,this.currentAnchor.classList.add("uxs-highlight"),this.position(),(n=this.el)==null||n.classList.add("uxs-visible");let i=(a=this.el)==null?void 0:a.querySelector(".uxs-textarea");return i==null||i.focus(),document.addEventListener("mousedown",this.onOutsideClick),document.addEventListener("keydown",this.onKeyDown),window.addEventListener("scroll",this.reposition,!0),window.addEventListener("resize",this.reposition),!0}forceClose(){this.el&&(this.el.classList.remove("uxs-visible"),this.currentAnchor&&this.currentAnchor.classList.remove("uxs-highlight"),document.removeEventListener("mousedown",this.onOutsideClick),document.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("scroll",this.reposition,!0),window.removeEventListener("resize",this.reposition),this.currentAnchor=null,this.currentIssue=null,this.triggerElement=null)}dismiss(){!this.el||!this.el.classList.contains("uxs-visible")||(this.forceClose(),this.triggerElement&&this.triggerElement.focus&&this.triggerElement.focus())}destroy(){this.dismiss(),this.el&&(this.el.remove(),this.el=null)}submit(){var s;let e=(s=this.el)==null?void 0:s.querySelector(".uxs-textarea"),t=(e==null?void 0:e.value.trim())||"";this.config.onFeedback&&this.currentIssue&&this.config.onFeedback({issue:{type:this.currentIssue.type,severity:this.currentIssue.severity,selector:this.currentIssue.selector,url:this.currentIssue.url,metadata:this.currentIssue.metadata},message:t,timestamp:new Date().toISOString(),pageUrl:location.href}),this.dismiss()}position(){if(!this.currentAnchor||!this.el)return;let e=this.currentAnchor,t=this.el,s=t.querySelector(".uxs-arrow"),r=e.getBoundingClientRect(),i=window.innerWidth<=400?window.innerWidth-24:310,n=10,a=t.offsetHeight,l=window.innerHeight-r.bottom>a+n+20?"bottom":"top";t.classList.remove("uxs-placement-bottom","uxs-placement-top"),t.classList.add(`uxs-placement-${l}`);let u=r.left+r.width/2-i/2;u=Math.max(10,Math.min(u,window.innerWidth-i-10));let c;if(l==="bottom"?(c=r.bottom+n,t.style.setProperty("--uxs-origin","center top")):(c=r.top-n-a,c=Math.max(10,c),t.style.setProperty("--uxs-origin","center bottom")),t.style.left=`${u}px`,t.style.top=`${c}px`,s){let p=r.left+r.width/2-u-6;s.style.left=`${Math.max(18,Math.min(p,i-30))}px`}}},V=`
/* \u2500\u2500 Root \u2014 fixed to side wall, vertically centered \u2500\u2500 */
.uxs-suggest {
  position: fixed;
  z-index: 2147483646;
  top: 50%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  pointer-events: none;
}
.uxs-suggest.uxs-visible {
  opacity: 1;
  pointer-events: auto;
}

/* \u2500\u2500 Right wall \u2500\u2500 */
.uxs-suggest-right {
  right: 0;
  transform: translateY(-50%) translateX(100%);
}
.uxs-suggest-right.uxs-visible {
  transform: translateY(-50%) translateX(0);
}

/* \u2500\u2500 Left wall \u2500\u2500 */
.uxs-suggest-left {
  left: 0;
  transform: translateY(-50%) translateX(-100%);
}
.uxs-suggest-left.uxs-visible {
  transform: translateY(-50%) translateX(0);
}

/* \u2500\u2500 Collapsed tab \u2014 vertical strip stuck to wall \u2500\u2500 */
.uxs-suggest-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 6px;
  background: var(--uxs-bg);
  border: 1px solid var(--uxs-border);
  cursor: pointer;
  user-select: none;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.uxs-suggest-right .uxs-suggest-tab {
  border-right: none;
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 0 16px rgba(0,0,0,0.12);
}
.uxs-suggest-left .uxs-suggest-tab {
  border-left: none;
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 0 16px rgba(0,0,0,0.12);
}
.uxs-suggest-tab:hover {
  border-color: var(--uxs-text-muted);
}
.uxs-suggest-tab-icon {
  display: flex;
  align-items: center;
  color: var(--uxs-text-muted);
}
.uxs-suggest-tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #3dd68c;
  flex-shrink: 0;
}
.uxs-suggest-tab-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--uxs-text-muted);
  line-height: 1;
}
.uxs-suggest-tab-label {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  font-size: 11px;
  font-weight: 500;
  color: var(--uxs-text-sec);
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.uxs-suggest-right .uxs-suggest-tab-label {
  transform: rotate(180deg);
}

/* \u2500\u2500 Expanded panel \u2014 slides from side wall \u2500\u2500 */
.uxs-suggest-panel {
  width: 300px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  background: var(--uxs-bg);
  border: 1px solid var(--uxs-border);
  overflow: hidden;
}
.uxs-suggest-right .uxs-suggest-panel {
  border-right: none;
  border-radius: 10px 0 0 10px;
  box-shadow: -4px 0 32px rgba(0,0,0,0.18), -1px 0 6px rgba(0,0,0,0.06);
}
.uxs-suggest-left .uxs-suggest-panel {
  border-left: none;
  border-radius: 0 10px 10px 0;
  box-shadow: 4px 0 32px rgba(0,0,0,0.18), 1px 0 6px rgba(0,0,0,0.06);
}

.uxs-suggest-header {
  padding: 12px 12px 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--uxs-border);
  flex-shrink: 0;
}
.uxs-suggest-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.uxs-suggest-header-icon {
  color: var(--uxs-text-muted);
  display: flex;
  align-items: center;
}
.uxs-suggest-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--uxs-text);
  margin: 0;
  letter-spacing: -0.01em;
}
.uxs-suggest-close {
  width: 26px;
  height: 26px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--uxs-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  transition: color 0.15s, background 0.15s;
}
.uxs-suggest-close:hover {
  color: var(--uxs-text);
  background: var(--uxs-bg-input);
}

/* \u2500\u2500 Suggestion list \u2500\u2500 */
.uxs-suggest-list {
  list-style: none;
  margin: 0;
  padding: 4px 6px 6px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* \u2500\u2500 Tree group \u2500\u2500 */
.uxs-suggest-group {
  margin-bottom: 2px;
}
.uxs-suggest-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px 4px;
  color: var(--uxs-text-muted);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.uxs-suggest-group-header svg {
  flex-shrink: 0;
  opacity: 0.6;
}
.uxs-suggest-group-children {
  list-style: none;
  margin: 0;
  padding: 0 0 0 10px;
}

/* \u2500\u2500 Suggestion item \u2500\u2500 */
.uxs-suggest-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--uxs-text-sec);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
  line-height: 1.3;
}
.uxs-suggest-item:hover {
  background: var(--uxs-bg-input);
  color: var(--uxs-text);
}
.uxs-suggest-item-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: var(--uxs-bg-input);
  border: 1px solid var(--uxs-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--uxs-text-muted);
  transition: color 0.15s, border-color 0.15s;
}
.uxs-suggest-item:hover .uxs-suggest-item-icon {
  color: var(--uxs-text-sec);
  border-color: var(--uxs-text-muted);
}
.uxs-suggest-item-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.uxs-suggest-item-arrow {
  color: var(--uxs-text-muted);
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.15s, transform 0.15s;
}
.uxs-suggest-item:hover .uxs-suggest-item-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Child items */
.uxs-suggest-group-children .uxs-suggest-item {
  padding: 6px 10px;
}
.uxs-suggest-group-children .uxs-suggest-item-icon {
  width: 22px;
  height: 22px;
  border-radius: 5px;
}
.uxs-suggest-group-children .uxs-suggest-item-icon svg {
  width: 11px;
  height: 11px;
}

/* \u2500\u2500 Footer \u2500\u2500 */
.uxs-suggest-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  border-top: 1px solid var(--uxs-border);
  flex-shrink: 0;
}
.uxs-suggest-footer-label {
  font-size: 11px;
  color: var(--uxs-text-muted);
  font-weight: 400;
}

/* \u2500\u2500 Mobile \u2014 compact side tab, hide vertical label \u2500\u2500 */
@media (max-width: 768px) {
  /* Smaller tab: just icon + dot + count, no text */
  .uxs-suggest-tab {
    padding: 10px 5px;
    gap: 6px;
  }
  .uxs-suggest-tab-label {
    display: none;
  }
  /* Panel stays on the same wall side but takes more width */
  .uxs-suggest-panel {
    width: calc(100vw - 48px);
    max-height: 60vh;
  }
}
`,L=class{constructor(e){this.el=null;this.expanded=!1;this.config=null;this.stylesInjected=!1;this.dismissed=!1;this.onInteraction=null;this.onInteraction=e.onInteraction||null}injectStyles(e){if(this.stylesInjected)return;this.stylesInjected=!0;let t=e==="light"?F:P,s=document.getElementById("reev-suggest-styles");s&&s.remove();let r=document.createElement("style");r.id="reev-suggest-styles",r.textContent=`.uxs-suggest { ${t} }
${V}`,document.head.appendChild(r)}configure(e){if(this.config=e,!e.enabled||e.suggestions.length===0){this.hide();return}this.injectStyles(e.theme),e.displayMode==="always"&&this.showCollapsed()}getDisplayMode(){var e,t;return(t=(e=this.config)==null?void 0:e.displayMode)!=null?t:null}buildDOM(){var s;let e=document.createElement("div"),t=((s=this.config)==null?void 0:s.position)==="bottom-left"?"uxs-suggest-left":"uxs-suggest-right";return e.className=`uxs-suggest ${t}`,e.setAttribute("role","complementary"),e.setAttribute("aria-label","Navigation suggestions"),e}showCollapsed(){if(this.dismissed||!this.config)return;this.cleanup(),this.el=this.buildDOM();let e=document.createElement("div");e.className="uxs-suggest-tab",e.title="Navigation suggestions";let t=document.createElement("span");t.className="uxs-suggest-tab-icon",t.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>';let s=document.createElement("span");s.className="uxs-suggest-tab-dot";let r=document.createElement("span");r.className="uxs-suggest-tab-count",r.textContent=String(this.config.suggestions.length);let i=document.createElement("span");i.className="uxs-suggest-tab-label",i.textContent="Navigate",e.appendChild(t),e.appendChild(s),e.appendChild(r),e.appendChild(i),e.addEventListener("click",()=>this.showExpanded()),this.el.appendChild(e),document.body.appendChild(this.el),requestAnimationFrame(()=>{var n;(n=this.el)==null||n.classList.add("uxs-visible")}),this.expanded=!1}showExpanded(){if(this.dismissed||!this.config||this.config.suggestions.length===0)return;this.cleanup(),this.el=this.buildDOM();let e=document.createElement("div");e.className="uxs-suggest-panel";let t=document.createElement("div");t.className="uxs-suggest-header";let s=document.createElement("div");s.className="uxs-suggest-header-left";let r=document.createElement("span");r.className="uxs-suggest-header-icon",r.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>';let i=document.createElement("h4");i.className="uxs-suggest-title",i.textContent="Suggested pages",s.appendChild(r),s.appendChild(i);let n=document.createElement("button");n.className="uxs-suggest-close";let a=this.config.position!=="bottom-left";n.innerHTML=a?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',n.title="Collapse",n.addEventListener("click",()=>this.showCollapsed()),t.appendChild(s),t.appendChild(n),e.appendChild(t);let o='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',l='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',u='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',c=document.createElement("ul");c.className="uxs-suggest-list";let p=new Map,k=[];for(let h of this.config.suggestions){let x=h.url.replace(/^\//,"").split("/").filter(Boolean);if(x.length>1){let g=x[0];p.has(g)||p.set(g,[]),p.get(g).push(h)}else k.push(h)}for(let[h,x]of p)x.length===1&&(k.push(x[0]),p.delete(h));let M=(h,x)=>{let g=document.createElement("li"),m=document.createElement("button");m.className="uxs-suggest-item";let w=document.createElement("span");w.className="uxs-suggest-item-icon",w.innerHTML=l;let f=document.createElement("span");if(f.className="uxs-suggest-item-label",x){let B=h.url.replace(/^\//,"").split("/").filter(Boolean).slice(1);f.textContent=B.map(R=>R.replace(/[-_]/g," ").replace(/\b\w/g,O=>O.toUpperCase())).join(" > ")}else f.textContent=h.label;let b=document.createElement("span");return b.className="uxs-suggest-item-arrow",b.innerHTML=o,m.appendChild(w),m.appendChild(f),m.appendChild(b),m.addEventListener("click",()=>{var I;(I=this.onInteraction)==null||I.call(this,"suggestion_clicked",h),window.location.href=h.url}),g.appendChild(m),g};for(let[h,x]of p){let g=document.createElement("li");g.className="uxs-suggest-group";let m=document.createElement("div");m.className="uxs-suggest-group-header",m.innerHTML=u;let w=document.createElement("span");w.textContent=h.replace(/[-_]/g," ").replace(/\b\w/g,b=>b.toUpperCase()),m.appendChild(w),g.appendChild(m);let f=document.createElement("ul");f.className="uxs-suggest-group-children";for(let b of x)f.appendChild(M(b,!0));g.appendChild(f),c.appendChild(g)}for(let h of k)c.appendChild(M(h,!1));e.appendChild(c);let E=document.createElement("div");E.className="uxs-suggest-footer";let S=document.createElement("span");S.className="uxs-suggest-footer-label";let A=this.config.suggestions.length;S.textContent=`${A} suggestion${A!==1?"s":""}`,E.appendChild(S),e.appendChild(E),this.el.appendChild(e),document.body.appendChild(this.el),requestAnimationFrame(()=>{var h;(h=this.el)==null||h.classList.add("uxs-visible")}),this.expanded=!0}dismiss(){var e;if(this.config)for(let t of this.config.suggestions)(e=this.onInteraction)==null||e.call(this,"suggestion_dismissed",t);this.dismissed=!0,this.hide()}hide(){this.el&&(this.el.classList.remove("uxs-visible"),setTimeout(()=>{var e;(e=this.el)==null||e.remove(),this.el=null},300))}cleanup(){this.el&&(this.el.remove(),this.el=null)}onNavigate(){this.dismissed=!1,this.hide()}destroy(){this.cleanup(),this.config=null}},v=class v{constructor(e){this.events=[];this.batchInterval=null;this.maxScrollDepth=0;this.scrollTimeout=null;this.pageEnteredAt=Date.now();this.observers=[];this.popover=null;this.suggestionWidget=null;this.currentSuggestionsUrl="";this.demoSuggestions=null;this.clickTracker=new Map;this.rageClickCooldowns=new WeakSet;this.checkedLinks=new WeakSet;this.probeResults=new Map;this.probeQueue=[];this.probeDraining=!1;this.probeDelay=300;this.reportedImages=new WeakSet;this.checkedImages=new WeakSet;this.badges=[];this.formFields=new Map;this.formFrustrationCooldowns=new WeakSet;this.formStates=new Map;this.recentErrors=[];this.breadcrumbs=[];this.pendingDomSnapshot=null;var t,s,r,i,n,a,o,l,u,c;this.projectId=e.projectId,this.apiUrl=e.apiUrl||"",this.sessionId=this.generateSessionId(),this.config={rageClick:(t=e.rageClick)!=null?t:!0,deadLink:(s=e.deadLink)!=null?s:!0,brokenImage:(r=e.brokenImage)!=null?r:!0,formFrustration:(i=e.formFrustration)!=null?i:!0,popover:(n=e.popover)!=null?n:!0,popoverTheme:(a=e.popoverTheme)!=null?a:"dark",maxPopupsPerSession:(o=e.maxPopupsPerSession)!=null?o:5,popoverCooldown:(l=e.popoverCooldown)!=null?l:3e4,debug:(u=e.debug)!=null?u:!1,suggestions:(c=e.suggestions)!=null?c:!1},this.demoSuggestions=e.demoSuggestions||null,this.init()}generateSessionId(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})}now(){return Date.now()}log(...e){this.config.debug&&console.log("[Reev]",...e)}push(e,t){v.SEND_TYPES.has(e)&&this.events.push({type:e,data:t,timestamp:this.now()})}init(){try{if(!document.getElementById("reev-badge-styles")){let e=document.createElement("style");e.id="reev-badge-styles",e.textContent=$,document.head.appendChild(e)}this.config.popover&&(this.popover=new C({maxPerSession:this.config.maxPopupsPerSession,cooldown:this.config.popoverCooldown,theme:this.config.popoverTheme,onFeedback:e=>this.handleFeedback(e)})),this.trackPageview(),this.trackClicks(),this.trackScroll(),this.trackForms(),this.trackErrors(),this.trackVitals(),this.trackNavigation(),this.config.deadLink&&this.trackDeadLinks(),this.config.brokenImage&&this.trackBrokenImages(),this.config.formFrustration&&this.trackFormFrustration(),this.config.suggestions&&(this.suggestionWidget=new L({onInteraction:(e,t)=>{this.push(e,{suggestionId:t.id,targetUrl:t.url,targetLabel:t.label,pageUrl:location.href}),this.sendBatch()}}),this.fetchSuggestions()),this.setupBatchSending(),this.setupUnloadHandler(),this.log("Initialized",{sessionId:this.sessionId,config:this.config})}catch(e){}}handleIssue(e){this.log("Issue detected",e),this.pendingDomSnapshot=this.captureDomSnapshot(e.element),this.push("ux_issue",{issueType:e.type,severity:e.severity,selector:e.selector,url:e.url,metadata:e.metadata,pageUrl:location.href}),this.popover&&this.popover.show(e),this.suggestionWidget&&this.suggestionWidget.getDisplayMode()==="frustration"&&setTimeout(()=>{var t;(t=this.suggestionWidget)==null||t.showExpanded()},500)}showPopoverForIssue(e){this.popover&&this.popover.show(e,!0)}handleFeedback(e){var t,s,r;this.log("Feedback received",e),this.push("ux_feedback",{issueType:(t=e.issue)==null?void 0:t.type,issueSeverity:(s=e.issue)==null?void 0:s.severity,issueSelector:(r=e.issue)==null?void 0:r.selector,message:e.message,pageUrl:e.pageUrl,deviceType:this.detectDevice(),browserName:this.detectBrowser(),timeOnPage:Math.round((this.now()-this.pageEnteredAt)/1e3),domSnapshot:this.pendingDomSnapshot,consoleErrors:this.recentErrors.slice(),breadcrumbs:this.breadcrumbs.slice()}),this.pendingDomSnapshot=null,this.sendBatch()}fetchSuggestions(){let e=location.href;if(e===this.currentSuggestionsUrl)return;this.currentSuggestionsUrl=e;let t=()=>{this.demoSuggestions&&this.demoSuggestions.length>0&&this.suggestionWidget&&this.suggestionWidget.configure({enabled:!0,displayMode:"always",position:"bottom-right",theme:this.config.popoverTheme||"dark",suggestions:this.demoSuggestions.map((r,i)=>N({id:-(i+1)},r))})},s=()=>{let r=`${this.apiUrl}/api/flows/suggest?projectId=${encodeURIComponent(this.projectId)}&url=${encodeURIComponent(e)}`;fetch(r).then(i=>i.json()).then(i=>{this.suggestionWidget&&(i.enabled&&i.suggestions.length>0?this.suggestionWidget.configure(i):t())}).catch(()=>{this.log("Failed to fetch suggestions, using fallback"),t()})};typeof window.requestIdleCallback!="undefined"?window.requestIdleCallback(s,{timeout:3e3}):setTimeout(s,100)}detectDevice(){let e=window.innerWidth;return e<768?"mobile":e<1024?"tablet":"desktop"}detectBrowser(){let e=navigator.userAgent;return e.includes("Firefox")?"Firefox":e.includes("Edg")?"Edge":e.includes("Chrome")?"Chrome":e.includes("Safari")?"Safari":"Other"}trackPageview(){this.pageEnteredAt=this.now(),this.maxScrollDepth=0,this.push("pageview",{url:location.href,referrer:document.referrer,title:document.title,viewport:{w:window.innerWidth,h:window.innerHeight}})}trackClicks(){let e=t=>{let s=t.target;if(!s)return;let r=this.getSelector(s),i=(s.textContent||"").trim().slice(0,100),n=this.now(),a=!1;if(this.config.rageClick){let o=this.findInteractive(s);if(o&&!this.rageClickCooldowns.has(o)){this.clickTracker.has(o)||this.clickTracker.set(o,[]);let l=this.clickTracker.get(o);l.push(n);let u=n-1500;for(;l.length&&l[0]<u;)l.shift();l.length>=3&&(a=!0,this.rageClickCooldowns.add(o),setTimeout(()=>this.rageClickCooldowns.delete(o),5e3),this.clickTracker.delete(o),this.handleIssue({type:"rage_click",severity:"medium",element:o,selector:this.getSelector(o),metadata:{clickCount:l.length,windowMs:1500,avgInterval:Math.round(1500/l.length)},timestamp:new Date().toISOString()}))}}this.addBreadcrumb("click",r,i),this.push("click",{selector:r,text:i,x:t.clientX,y:t.clientY,isRage:a,url:location.href})};document.addEventListener("click",e,!0),this.observers.push(()=>document.removeEventListener("click",e,!0))}findInteractive(e){let t=e;for(;t&&t!==document.body;){if(this.isInteractive(t))return t;t=t.parentElement}return null}trackDeadLinks(){this.scanLinks();let e=new MutationObserver(()=>{this.scanLinks()});e.observe(document.body,{childList:!0,subtree:!0}),this.observers.push(()=>e.disconnect())}scanLinks(){let e=document.querySelectorAll("a[href]");for(let t of e){if(this.checkedLinks.has(t))continue;let s=t.getAttribute("href");if(!s||s.startsWith("#")||s.startsWith("javascript:")||s.startsWith("mailto:")||s.startsWith("tel:"))continue;let r;try{let i=new URL(s,window.location.origin);if(i.origin!==window.location.origin)continue;r=i.href}catch(i){continue}this.checkedLinks.add(t),this.enqueueProbe(t,r)}}enqueueProbe(e,t){this.probeQueue.push(()=>y(this,null,function*(){yield this.probeLink(e,t)})),this.drainQueue()}drainQueue(){return y(this,null,function*(){if(!this.probeDraining){for(this.probeDraining=!0;this.probeQueue.length>0;)yield this.probeQueue.shift()(),this.probeQueue.length>0&&(yield new Promise(t=>setTimeout(t,this.probeDelay)));this.probeDraining=!1}})}probeLink(e,t){return y(this,null,function*(){let s=this.probeResults.get(t);if(s){let n=yield s;n.ok||this.reportDeadLink(e,t,n.status);return}let r=this.executeProbe(t);this.probeResults.set(t,r);let i=yield r;i.ok||(this.log("Dead link found:",t,i.status),this.reportDeadLink(e,t,i.status))})}executeProbe(e){return y(this,null,function*(){var r;let t=new AbortController,s=setTimeout(()=>t.abort(),5e3);try{let i=yield fetch(e,{method:"GET",signal:t.signal});if(clearTimeout(s),(r=i.body)==null||r.cancel(),i.status===429){let n=parseInt(i.headers.get("Retry-After")||"",10);return this.probeDelay=Math.max(this.probeDelay*2,(n||2)*1e3),{ok:!0,status:429}}return{ok:i.ok,status:i.ok?200:i.status}}catch(i){return clearTimeout(s),i.name==="AbortError"?{ok:!1,status:"TIMEOUT"}:{ok:!1,status:"NETWORK_ERROR"}}})}addIndicator(e,t,s){this.log("Adding indicator badge",t.type,t.selector);let r=e.parentElement;if(!r)return;window.getComputedStyle(r).position==="static"&&(r.style.position="relative");let n=e.getBoundingClientRect(),a=r.getBoundingClientRect(),o=n.top-a.top-4,l=n.right-a.left-16,u=document.createElement("div");u.className=`uxs-badge${s?` ${s}`:""}`,u.textContent="?",u.style.top=`${Math.max(0,o)}px`,u.style.left=`${Math.max(0,l)}px`,u.title=t.type==="dead_link"?"Broken link \u2014 click to report":"Missing image \u2014 click to report",u.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),this.showPopoverForIssue(t)}),r.appendChild(u),this.badges.push(u)}reportDeadLink(e,t,s){let r={type:"dead_link",severity:"high",element:e,selector:this.getSelector(e),url:t,metadata:{status:s},timestamp:new Date().toISOString()};this.addIndicator(e,r,"uxs-badge-red")}trackBrokenImages(){let e=i=>{this.reportedImages.has(i)||(this.reportedImages.add(i),this.log("Broken image detected:",i.src||i.getAttribute("src")),this.reportBrokenImage(i))},t=i=>{this.reportedImages.has(i)||!i.src&&!i.getAttribute("src")||this.checkedImages.has(i)||(this.checkedImages.add(i),i.addEventListener("error",()=>e(i),{once:!0}))};document.querySelectorAll("img").forEach(t);let s=()=>{document.querySelectorAll("img").forEach(i=>{if(!this.reportedImages.has(i)&&!(i.offsetParent===null&&getComputedStyle(i).display==="none")){if(!i.src&&!i.getAttribute("src")){e(i);return}i.complete&&(i.naturalWidth>0||e(i))}})};document.readyState==="complete"?setTimeout(s,1e3):window.addEventListener("load",()=>{setTimeout(s,1e3)},{once:!0});let r=new MutationObserver(i=>{var n;for(let a of i)for(let o of a.addedNodes)o instanceof HTMLElement&&(o.tagName==="IMG"&&t(o),(n=o.querySelectorAll)==null||n.call(o,"img").forEach(t))});r.observe(document.body,{childList:!0,subtree:!0}),this.observers.push(()=>r.disconnect())}reportBrokenImage(e){let t={type:"broken_image",severity:"low",element:e,selector:this.getSelector(e),url:e.src||e.currentSrc||"",metadata:{alt:e.alt||"",naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight},timestamp:new Date().toISOString()};this.addIndicator(e,t)}trackFormFrustration(){let e=t=>{let s=t.target;if(!this.isFormField(s)||this.formFrustrationCooldowns.has(s))return;let r=(s.value||"").length;if(!this.formFields.has(s)){this.formFields.set(s,{clears:0,peakLen:r,timer:setTimeout(()=>this.formFields.delete(s),3e4)});return}let i=this.formFields.get(s);r>i.peakLen&&(i.peakLen=r),r===0&&i.peakLen>=3&&(i.clears++,i.peakLen=0,clearTimeout(i.timer),i.timer=setTimeout(()=>this.formFields.delete(s),3e4),i.clears>=2&&(this.formFrustrationCooldowns.add(s),setTimeout(()=>this.formFrustrationCooldowns.delete(s),6e4),this.formFields.delete(s),this.handleIssue({type:"form_frustration",severity:"medium",element:s,selector:this.getSelector(s),metadata:{fieldType:s.type||"text",fieldName:s.name||s.id||"",clearCount:i.clears,pattern:"repeated_clear_retype"},timestamp:new Date().toISOString()})))};document.addEventListener("input",e,!0),this.observers.push(()=>document.removeEventListener("input",e,!0))}trackScroll(){let e=()=>{let t=window.scrollY||document.documentElement.scrollTop,s=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),r=window.innerHeight,i=s-r;if(i<=0)return;let n=Math.min(100,Math.round(t/i*100));n>this.maxScrollDepth&&(this.maxScrollDepth=n),this.scrollTimeout&&clearTimeout(this.scrollTimeout),this.scrollTimeout=setTimeout(()=>{this.push("scroll",{maxDepth:this.maxScrollDepth,url:location.href})},500)};window.addEventListener("scroll",e,{passive:!0}),this.observers.push(()=>window.removeEventListener("scroll",e))}trackForms(){let e=s=>{let r=s.target;if(!this.isFormField(r))return;let i=r.form,n=i?i.id||i.getAttribute("name")||this.getSelector(i):"unknown",a=r.name||r.id||this.getSelector(r);this.formStates.has(n)||this.formStates.set(n,{fields:new Set,startedAt:this.now()}),this.formStates.get(n).fields.add(a),this.push("form",{action:"field_focus",formId:n,fieldName:a,url:location.href})},t=s=>{var n;let r=s.target,i=r.id||r.getAttribute("name")||this.getSelector(r);this.push("form",{action:"submit",formId:i,url:location.href,fieldCount:((n=this.formStates.get(i))==null?void 0:n.fields.size)||0,timeSpent:this.formStates.has(i)?this.now()-this.formStates.get(i).startedAt:0}),this.formStates.delete(i)};document.addEventListener("focusin",e,!0),document.addEventListener("submit",t,!0),this.observers.push(()=>{document.removeEventListener("focusin",e,!0),document.removeEventListener("submit",t,!0)})}trackErrors(){let e=s=>{this.captureError(s.message,s.filename,s.lineno),this.push("error",{message:s.message,source:s.filename,line:s.lineno,col:s.colno,url:location.href})},t=s=>{this.captureError(String(s.reason),"unhandled_promise_rejection"),this.push("error",{message:String(s.reason),source:"unhandled_promise_rejection",url:location.href})};window.addEventListener("error",e),window.addEventListener("unhandledrejection",t),this.observers.push(()=>{window.removeEventListener("error",e),window.removeEventListener("unhandledrejection",t)})}captureError(e,t,s){this.recentErrors.push({message:e,source:t,line:s,timestamp:this.now()}),this.recentErrors.length>v.MAX_ERRORS&&this.recentErrors.shift()}addBreadcrumb(e,t,s){let r=s?`${t} (${s.slice(0,40)})`:t;this.breadcrumbs.push({action:e,target:r,url:location.href,timestamp:this.now()}),this.breadcrumbs.length>v.MAX_BREADCRUMBS&&this.breadcrumbs.shift()}captureDomSnapshot(e){if(!e)return null;try{let t=new Set(["BODY","HTML","MAIN","SECTION","ARTICLE","NAV","HEADER","FOOTER","UL","OL"]),s=new Set(["A","IMG","BUTTON","INPUT","SPAN","LABEL","SVG"]),r=e;s.has(e.tagName)&&r.parentElement&&!t.has(r.parentElement.tagName)&&(r=r.parentElement);let i=r.outerHTML;return i.length>2e3?i.slice(0,2e3)+"...":i}catch(t){return null}}trackVitals(){if(typeof PerformanceObserver!="undefined"){try{let e=new PerformanceObserver(t=>{let s=t.getEntries(),r=s[s.length-1];r&&this.push("vitals",{metric:"lcp",value:Math.round(r.startTime),url:location.href})});e.observe({type:"largest-contentful-paint",buffered:!0}),this.observers.push(()=>e.disconnect())}catch(e){}try{let e=new PerformanceObserver(t=>{let s=t.getEntries()[0];s&&this.push("vitals",{metric:"fid",value:Math.round(s.processingStart-s.startTime),url:location.href})});e.observe({type:"first-input",buffered:!0}),this.observers.push(()=>e.disconnect())}catch(e){}try{let e=0,t=new PerformanceObserver(s=>{for(let r of s.getEntries())r.hadRecentInput||(e+=r.value)});t.observe({type:"layout-shift",buffered:!0}),this.observers.push(()=>{t.disconnect(),e>0&&this.push("vitals",{metric:"cls",value:Math.round(e*1e3)/1e3,url:location.href})})}catch(e){}}}trackNavigation(){let e=location.href,t=()=>{location.href!==e&&(this.maxScrollDepth>0&&this.push("scroll",{maxDepth:this.maxScrollDepth,url:e}),this.push("page_leave",{url:e,timeOnPage:this.now()-this.pageEnteredAt}),this.addBreadcrumb("navigate",location.href),e=location.href,this.maxScrollDepth=0,this.pageEnteredAt=this.now(),this.trackPageview(),this.suggestionWidget&&(this.suggestionWidget.onNavigate(),this.fetchSuggestions()))},s=history.pushState,r=history.replaceState;history.pushState=function(...i){s.apply(this,i),t()},history.replaceState=function(...i){r.apply(this,i),t()},window.addEventListener("popstate",t),this.observers.push(()=>{window.removeEventListener("popstate",t),history.pushState=s,history.replaceState=r})}setupBatchSending(){this.batchInterval=setInterval(()=>{this.sendBatch()},1e4)}setupUnloadHandler(){let e=()=>{this.batchInterval&&(clearInterval(this.batchInterval),this.batchInterval=null),this.maxScrollDepth>0&&this.push("scroll",{maxDepth:this.maxScrollDepth,url:location.href}),this.push("page_leave",{url:location.href,timeOnPage:this.now()-this.pageEnteredAt});for(let[t,s]of this.formStates)this.push("form",{action:"abandon",formId:t,url:location.href,fieldCount:s.fields.size,timeSpent:this.now()-s.startedAt});this.formStates.clear();for(let t of this.observers)try{t()}catch(s){}this.popover&&this.popover.destroy(),this.suggestionWidget&&this.suggestionWidget.destroy(),this.sendBatch(!0)};window.addEventListener("beforeunload",e),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&e()})}sendBatch(e=!1){if(this.events.length===0)return;let t=this.events.splice(0),s=`${this.apiUrl}/api/events`,r=JSON.stringify({sessionId:this.sessionId,projectId:this.projectId,events:t});if(e&&typeof navigator.sendBeacon=="function"){navigator.sendBeacon(s,r);return}fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:r,keepalive:e}).catch(()=>{e||this.events.unshift(...t)})}getSelector(e){let t=[],s=e;for(;s&&s!==document.body&&s!==document.documentElement;){if(s.id){t.unshift(`#${s.id}`);break}let r=s.tagName.toLowerCase(),i=s.parentElement,n="";if(i){let a=s.tagName,l=Array.from(i.children).filter(u=>u.tagName===a);l.length>1&&(n=`:nth-of-type(${l.indexOf(s)+1})`)}t.unshift(`${r}${n}`),s=i}return t.join(" > ")}isInteractive(e){let t=e.tagName;if(t==="BUTTON"||t==="A"||t==="SELECT")return!0;if(t==="INPUT"){let r=(e.type||"").toLowerCase();return["button","submit","reset","checkbox","radio"].includes(r)}return e.getAttribute("role")==="button"||e.getAttribute("tabindex")!=null||e.onclick!=null?!0:window.getComputedStyle(e).cursor==="pointer"?(e.parentElement?window.getComputedStyle(e.parentElement).cursor:"auto")!=="pointer":!1}isFormField(e){let t=e.tagName.toLowerCase();if(t==="textarea")return!0;if(t==="input"){let s=(e.type||"").toLowerCase();return["text","email","password","search","tel","url","number"].includes(s)}return e.getAttribute("contenteditable")==="true"}stop(){this.batchInterval&&(clearInterval(this.batchInterval),this.batchInterval=null);for(let e of this.observers)try{e()}catch(t){}this.observers=[],this.popover&&(this.popover.destroy(),this.popover=null);for(let e of this.badges)e.remove();this.badges=[]}};v.MAX_ERRORS=5,v.MAX_BREADCRUMBS=10,v.SEND_TYPES=new Set(["ux_feedback","pageview","suggestion_clicked","suggestion_dismissed"]);var T=v;function j(){let d=window.ReevConfig;!d||!d.projectId||new T(d)}typeof window!="undefined"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",j):j());})();
