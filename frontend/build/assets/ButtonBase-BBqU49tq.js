import{a as e,t}from"./rolldown-runtime-CNC7AqOf.js";import{t as n}from"./reactVendor-DRVin0oV.js";import{O as r}from"./ckeditor-DKI7H046.js";import{B as i,C as a,G as o,H as s,R as c,S as l,U as u,V as d,W as f,a as p,p as m,r as h,x as g,z as _}from"./createSimplePaletteValueFilter-C0gThBJK.js";import{u as v}from"./createSvgIcon-CHCbORBp.js";import{i as y,n as b,r as x,t as S}from"./useReducedMotion-BMSiv9BF.js";var C=t((e=>{var t=typeof Symbol==`function`&&Symbol.for,n=t?Symbol.for(`react.element`):60103,r=t?Symbol.for(`react.portal`):60106,i=t?Symbol.for(`react.fragment`):60107,a=t?Symbol.for(`react.strict_mode`):60108,o=t?Symbol.for(`react.profiler`):60114,s=t?Symbol.for(`react.provider`):60109,c=t?Symbol.for(`react.context`):60110,l=t?Symbol.for(`react.async_mode`):60111,u=t?Symbol.for(`react.concurrent_mode`):60111,d=t?Symbol.for(`react.forward_ref`):60112,f=t?Symbol.for(`react.suspense`):60113,p=t?Symbol.for(`react.suspense_list`):60120,m=t?Symbol.for(`react.memo`):60115,h=t?Symbol.for(`react.lazy`):60116,g=t?Symbol.for(`react.block`):60121,_=t?Symbol.for(`react.fundamental`):60117,v=t?Symbol.for(`react.responder`):60118,y=t?Symbol.for(`react.scope`):60119;function b(e){if(typeof e==`object`&&e){var t=e.$$typeof;switch(t){case n:switch(e=e.type,e){case l:case u:case i:case o:case a:case f:return e;default:switch(e&&=e.$$typeof,e){case c:case d:case h:case m:case s:return e;default:return t}}case r:return t}}}function x(e){return b(e)===u}e.AsyncMode=l,e.ConcurrentMode=u,e.ContextConsumer=c,e.ContextProvider=s,e.Element=n,e.ForwardRef=d,e.Fragment=i,e.Lazy=h,e.Memo=m,e.Portal=r,e.Profiler=o,e.StrictMode=a,e.Suspense=f,e.isAsyncMode=function(e){return x(e)||b(e)===l},e.isConcurrentMode=x,e.isContextConsumer=function(e){return b(e)===c},e.isContextProvider=function(e){return b(e)===s},e.isElement=function(e){return typeof e==`object`&&!!e&&e.$$typeof===n},e.isForwardRef=function(e){return b(e)===d},e.isFragment=function(e){return b(e)===i},e.isLazy=function(e){return b(e)===h},e.isMemo=function(e){return b(e)===m},e.isPortal=function(e){return b(e)===r},e.isProfiler=function(e){return b(e)===o},e.isStrictMode=function(e){return b(e)===a},e.isSuspense=function(e){return b(e)===f},e.isValidElementType=function(e){return typeof e==`string`||typeof e==`function`||e===i||e===u||e===o||e===a||e===f||e===p||typeof e==`object`&&!!e&&(e.$$typeof===h||e.$$typeof===m||e.$$typeof===s||e.$$typeof===c||e.$$typeof===d||e.$$typeof===_||e.$$typeof===v||e.$$typeof===y||e.$$typeof===g)},e.typeOf=b})),w=t(((e,t)=>{t.exports=C()})),T=t(((e,t)=>{var n=w(),r={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},i={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},o={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},s={};s[n.ForwardRef]=a,s[n.Memo]=o;function c(e){return n.isMemo(e)?o:s[e.$$typeof]||r}var l=Object.defineProperty,u=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols,f=Object.getOwnPropertyDescriptor,p=Object.getPrototypeOf,m=Object.prototype;function h(e,t,n){if(typeof t!=`string`){if(m){var r=p(t);r&&r!==m&&h(e,r,n)}var a=u(t);d&&(a=a.concat(d(t)));for(var o=c(e),s=c(t),g=0;g<a.length;++g){var _=a[g];if(!i[_]&&!(n&&n[_])&&!(s&&s[_])&&!(o&&o[_])){var v=f(t,_);try{l(e,_,v)}catch{}}}}return e}t.exports=h})),E=e(r());T();var D=function(e,t){var n=arguments;if(t==null||!d.call(t,`css`))return E.createElement.apply(void 0,n);var r=n.length,a=Array(r);a[0]=c,a[1]=i(e,t);for(var o=2;o<r;o++)a[o]=n[o];return E.createElement.apply(null,a)};(function(e){var t;t||=e.JSX||={}})(D||={});var O=s(function(e,t){var n=e.styles,r=f([n],void 0,E.useContext(_)),i=E.useRef();return u(function(){var e=t.key+`-global`,n=new t.sheet.constructor({key:e,nonce:t.sheet.nonce,container:t.sheet.container,speedy:t.sheet.isSpeedy}),a=!1,o=document.querySelector(`style[data-emotion="`+e+` `+r.name+`"]`);return t.sheet.tags.length&&(n.before=t.sheet.tags[0]),o!==null&&(a=!0,o.setAttribute(`data-emotion`,e),n.hydrate([o])),i.current=[n,a],function(){n.flush()}},[t]),u(function(){var e=i.current,n=e[0];if(e[1]){e[1]=!1;return}r.next!==void 0&&o(t,r.next,!0),n.tags.length&&(n.before=n.tags[n.tags.length-1].nextElementSibling,n.flush()),t.insert(``,r,n,!1)},[t,r.name]),null});function k(){return f([...arguments])}function A(){var e=k.apply(void 0,arguments),t=`animation-`+e.name;return{name:t,styles:`@keyframes `+t+`{`+e.styles+`}`,anim:1,toString:function(){return`_EMO_`+this.name+`_`+this.styles+`_EMO_`}}}var j=y;function M(e){try{return e.matches(`:focus-visible`)}catch{}return!1}function N(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,s=r&&t===!1;return E.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||s)&&(e.disabled=n),e},[r,n,t,o,s,a,i])}var ee={};function te(e){let{nativeButton:t,nativeButtonProp:n,internalNativeButton:r=t,allowInferredHostMismatch:i=!1,disabled:a,type:o,hasFormAction:s=!1,tabIndex:c=0,focusableWhenDisabled:l,stopEventPropagation:u=!1,onBeforeKeyDown:d,onBeforeKeyUp:f}=e,p=E.useRef(null),m=l===!0,h=N({focusableWhenDisabled:m,disabled:a,isNativeButton:t,tabIndex:c}),g=E.useCallback(()=>{let e=p.current;return e==null?t:e.tagName===`BUTTON`||!!(e.tagName===`A`&&e.href)},[t]),_=E.useMemo(()=>{let e=m?{}:{tabIndex:a?-1:c};return t?(e.type=o===void 0&&!s?`button`:o,m||(e.disabled=a)):(e.role=`button`,!m&&a&&(e[`aria-disabled`]=a)),m?{...e,...h}:e},[a,m,h,s,t,c,o]);return{getButtonProps:E.useCallback((e=ee)=>{let{onClick:t,onKeyDown:n,onKeyUp:r,...i}=e,o=e=>{if(u&&e.stopPropagation(),a){e.preventDefault();return}t?.(e)},s=e=>{if(m&&h.onKeyDown(e),!a&&(d?.(e),n?.(e),!(e.target!==e.currentTarget||g()))){if(e.key===` `){e.preventDefault();return}e.key===`Enter`&&(e.preventDefault(),e.currentTarget.click())}},c=e=>{a||(f?.(e),r?.(e),e.target===e.currentTarget&&!g()&&e.key===` `&&!e.defaultPrevented&&e.currentTarget.click())};return{..._,...i,onClick:o,onKeyDown:s,onKeyUp:c}},[_,a,m,h,g,d,f,u]),rootRef:p}}var ne=class e{static create(){return new e}static use(){let t=b(e.create).current,[n,r]=E.useState(!1);return t.shouldMount=n,t.setShouldMount=r,E.useEffect(t.mountEffect,[n]),t}constructor(){this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}mount(){return this.mounted||(this.mounted=ie(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}};function re(){return ne.use()}function ie(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var P=[];function F(e){E.useEffect(e,P)}var I=class e{static create(){return new e}currentId=null;start(e,t){this.clear(),this.currentId=setTimeout(()=>{this.currentId=null,t()},e)}clear=()=>{this.currentId!==null&&(clearTimeout(this.currentId),this.currentId=null)};disposeEffect=()=>this.clear};function L(){let e=b(I.create).current;return F(e.disposeEffect),e}var R=n();function z(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:o,rippleSize:s,in:c,onExited:l,timeout:u}=e,[d,f]=E.useState(!1),p=L(),m=E.useRef(!1),h=E.useRef(l);h.current=l;let g=l!=null,_=a(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),v={width:s,height:s,top:-(s/2)+o,left:-(s/2)+i},y=a(n.child,d&&n.childLeaving,r&&n.childPulsate);return!c&&!d&&f(!0),E.useEffect(()=>{!c&&g?m.current||(m.current=!0,p.start(u,()=>{m.current=!1,h.current?.()})):(m.current=!1,p.clear())},[p,g,c,u]),(0,R.jsx)(`span`,{className:_,style:v,children:(0,R.jsx)(`span`,{className:y})})}var B=g(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`]),V=550,H={},U=[],W=()=>{};function G(e,t){let n=new Set(t),r=new Map,i=[];for(let t of e)n.has(t)?i.length>0&&(r.set(t,i),i=[]):i.push(t);let a=[];for(let e of t){let t=r.get(e);t&&a.push(...t),a.push(e)}return a.push(...i),a}function K({event:e,element:t,center:n}){let r=t?t.getBoundingClientRect():{width:0,height:0,left:0,top:0},i,a;if(n||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)i=Math.round(r.width/2),a=Math.round(r.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;i=Math.round(t-r.left),a=Math.round(n-r.top)}let o;if(n)o=Math.sqrt((2*r.width**2+r.height**2)/3),o%2==0&&(o+=1);else{let e=Math.max(Math.abs((t?t.clientWidth:0)-i),i)*2+2,n=Math.max(Math.abs((t?t.clientHeight:0)-a),a)*2+2;o=Math.sqrt(e**2+n**2)}return{rippleX:i,rippleY:a,rippleSize:o}}var q=A`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,J=A`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,Y=A`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`;function ae(e){if(e.motion.reducedMotion===`always`)return null;let t=k`
    &.${B.rippleVisible} {
      animation-name: ${q};
      animation-duration: ${V}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    &.${B.ripplePulsate} {
      animation-duration: ${e.transitions.duration.shorter}ms;
    }

    & .${B.childLeaving} {
      animation-name: ${J};
      animation-duration: ${V}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    & .${B.childPulsate} {
      animation-name: ${Y};
      animation-duration: 2500ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
      animation-iteration-count: infinite;
      animation-delay: 200ms;
    }
  `;return e.motion.reducedMotion===`system`?k`
      @media (prefers-reduced-motion: no-preference) {
        ${t}
      }
    `:t}var X=p(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),oe=p(z,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${B.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
  }

  /*
   * Order matters: 'child', 'childLeaving' and 'childPulsate' apply to the same
   * element with equal specificity, so the later rule wins. 'child' must come
   * before 'childLeaving' so the leaving 'opacity: 0' takes precedence. A focus
   * (pulsate) ripple keeps 'pulsateKeyframe' (no opacity animation) on exit, so
   * it relies on this static 'opacity: 0' to disappear on blur instead of
   * lingering until removal.
   */
  & .${B.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${B.childLeaving} {
    opacity: 0;
  }

  & .${B.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
  }

  ${({theme:e})=>ae(e)}
`,se=E.forwardRef(function(e,t){let n=h({props:e,name:`MuiTouchRipple`}),r=S(v().motion.reducedMotion,!1),{center:i=!1,classes:o=H,className:s,...c}=n,[l,u]=E.useState({items:U,order:U}),d=l.items,f=E.useRef(0),p=E.useRef(null),m=E.useRef(!1);F(()=>(m.current=!0,()=>{m.current=!1})),E.useEffect(()=>{p.current&&=(p.current(),null)},[d]);let g=E.useRef(!1),_=L(),y=E.useRef(null),b=E.useRef(null),x=j(e=>{m.current&&u(t=>{let n=t.items.filter(t=>t.key!==e);return{items:n,order:G(t.order.filter(t=>t!==e),n.filter(e=>!e.exiting).map(e=>e.key))}})}),C=j(e=>{let{pulsate:t,rippleX:n,rippleY:r,rippleSize:i,cb:a}=e,o=f.current;f.current+=1,u(e=>{let a=[...e.items,{key:o,pulsate:t,rippleX:n,rippleY:r,rippleSize:i,exiting:!1}];return{items:a,order:G(e.order,a.filter(e=>!e.exiting).map(e=>e.key))}}),p.current=a}),w=j((e=H,t=H,n=W)=>{let{pulsate:r=!1,center:a=i||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&g.current){g.current=!1;return}e?.type===`touchstart`&&(g.current=!0);let{rippleX:s,rippleY:c,rippleSize:l}=K({event:e,element:o?null:b.current,center:a});e?.touches?y.current===null&&(y.current=()=>{C({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})},_.start(80,()=>{y.current&&=(y.current(),null)})):C({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})}),T=j(()=>{w(H,{pulsate:!0})}),D=j((e,t)=>{if(_.clear(),e?.type===`touchend`&&y.current){y.current(),y.current=null,_.start(0,()=>{D(e,t)});return}y.current=null,u(e=>{let t=e.items.findIndex(e=>!e.exiting);if(t===-1)return e;let n=e.items.slice();return n[t]={...n[t],exiting:!0},{items:n,order:G(e.order,n.filter(e=>!e.exiting).map(e=>e.key))}}),p.current=t});E.useImperativeHandle(t,()=>({pulsate:T,start:w,stop:D}),[T,w,D]);let O=new Map(d.map(e=>[e.key,e])),k=l.order.map(e=>O.get(e)).filter(Boolean);return(0,R.jsx)(X,{className:a(B.root,o.root,s),ref:b,...c,children:k.map(e=>(0,R.jsx)(oe,{classes:{ripple:a(o.ripple,B.ripple),rippleVisible:a(o.rippleVisible,B.rippleVisible),ripplePulsate:a(o.ripplePulsate,B.ripplePulsate),child:a(o.child,B.child),childLeaving:a(o.childLeaving,B.childLeaving),childPulsate:a(o.childPulsate,B.childPulsate)},timeout:r.shouldReduceMotion?0:V,pulsate:e.pulsate,rippleX:e.rippleX,rippleY:e.rippleY,rippleSize:e.rippleSize,in:!e.exiting,onExited:()=>x(e.key)},e.key))})});function Z(e){return l(`MuiButtonBase`,e)}var ce=g(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`]),le=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,suppressFocusVisible:i,classes:a}=e,o=m({root:[`root`,t&&`disabled`,n&&!i&&`focusVisible`]},Z,a);return n&&!i&&r&&(o.root+=` ${r}`),o},ue=p(`button`,{name:`MuiButtonBase`,slot:`Root`})({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${ce.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`}}),de=E.forwardRef(function(e,t){let n=h({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:o,className:s,component:c=`button`,disabled:l=!1,disableRipple:u=!1,disableTouchRipple:d=!1,focusRipple:f=!1,focusVisibleClassName:p,focusableWhenDisabled:m,suppressFocusVisible:g=!1,internalNativeButton:_,LinkComponent:v=`a`,nativeButton:y,onBlur:b,onClick:S,onContextMenu:C,onDragLeave:w,onFocus:T,onFocusVisible:D,onKeyDown:O,onKeyUp:k,onMouseDown:A,onMouseLeave:N,onMouseUp:ee,onTouchEnd:ne,onTouchMove:ie,onTouchStart:P,tabIndex:F=0,TouchRippleProps:I,touchRippleRef:L,type:z,...B}=n,V=!!(B.href||B.to),H=!!B.formAction,U=c;U===`button`&&V&&(U=v);let W=typeof U==`string`?U===`button`:_??!1,G=y??W,K=re(),q=x(K.ref,L),[J,Y]=E.useState(!1);(l||g)&&J&&Y(!1);let ae=j(e=>{f&&!e.repeat&&J&&e.key===` `&&K.stop(e,()=>{K.start(e)})}),X=j(e=>{f&&e.key===` `&&J&&!e.defaultPrevented&&K.stop(e,()=>{K.pulsate(e)})}),{getButtonProps:oe,rootRef:Z}=te({nativeButton:G,nativeButtonProp:y,internalNativeButton:W,allowInferredHostMismatch:V||typeof U==`string`,disabled:l,type:z,hasFormAction:H,tabIndex:F,onBeforeKeyDown:ae,onBeforeKeyUp:X}),{onClick:ce,onKeyDown:de,onKeyUp:fe,...pe}=oe({onClick:S,onKeyDown:O,onKeyUp:k});E.useImperativeHandle(r,()=>({focusVisible:()=>{Y(!0),Z.current.focus()}}),[Z]);let me=K.shouldMount&&!u&&!l;E.useEffect(()=>{J&&f&&!u&&K.pulsate()},[u,f,J,K]);let he=Q(K,`start`,A,d),ge=Q(K,`stop`,C,d),_e=Q(K,`stop`,w,d),ve=Q(K,`stop`,ee,d),ye=Q(K,`stop`,e=>{J&&e.preventDefault(),N&&N(e)},d),be=Q(K,`start`,P,d),xe=Q(K,`stop`,ne,d),Se=Q(K,`stop`,ie,d),Ce=Q(K,`stop`,e=>{M(e.target)||Y(!1),b&&b(e)},!1),we=j(e=>{Z.current||=e.currentTarget,!g&&M(e.target)&&(Y(!0),D&&D(e)),T&&T(e)}),$={};V&&($.tabIndex=l?-1:F,l&&($[`aria-disabled`]=l),$.type=z);let Te=x(t,Z),Ee={...n,centerRipple:i,component:c,disabled:l,disableRipple:u,disableTouchRipple:d,focusRipple:f,suppressFocusVisible:g,tabIndex:F,focusVisible:J},De=le(Ee);return(0,R.jsxs)(ue,{as:U,className:a(De.root,s),ownerState:Ee,onBlur:Ce,onClick:ce,onContextMenu:ge,onFocus:we,onKeyDown:de,onKeyUp:fe,onMouseDown:he,onMouseLeave:ye,onMouseUp:ve,onDragLeave:_e,onTouchEnd:xe,onTouchMove:Se,onTouchStart:be,ref:Te,...V?$:pe,...B,children:[o,me?(0,R.jsx)(se,{ref:q,center:i,...I}):null]})});function Q(e,t,n,r=!1){return j(i=>(n&&n(i),r||e[t](i),!0))}export{j as a,A as c,M as i,I as n,O as o,L as r,k as s,de as t};