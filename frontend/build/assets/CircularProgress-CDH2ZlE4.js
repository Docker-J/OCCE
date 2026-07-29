import{a as e,t}from"./rolldown-runtime-CNC7AqOf.js";import{t as n}from"./reactVendor-DRVin0oV.js";import{O as r}from"./ckeditor-DKI7H046.js";import{B as i,C as a,G as o,H as s,R as c,S as l,U as u,V as d,W as f,a as p,i as m,n as h,p as g,r as _,t as v,x as y,z as b}from"./createSimplePaletteValueFilter-C0gThBJK.js";import{d as x,i as S,s as C}from"./Paper-CFIV0xyD.js";import{i as w,n as T,r as E,t as ee}from"./useReducedMotion-BMSiv9BF.js";var D=t((e=>{var t=typeof Symbol==`function`&&Symbol.for,n=t?Symbol.for(`react.element`):60103,r=t?Symbol.for(`react.portal`):60106,i=t?Symbol.for(`react.fragment`):60107,a=t?Symbol.for(`react.strict_mode`):60108,o=t?Symbol.for(`react.profiler`):60114,s=t?Symbol.for(`react.provider`):60109,c=t?Symbol.for(`react.context`):60110,l=t?Symbol.for(`react.async_mode`):60111,u=t?Symbol.for(`react.concurrent_mode`):60111,d=t?Symbol.for(`react.forward_ref`):60112,f=t?Symbol.for(`react.suspense`):60113,p=t?Symbol.for(`react.suspense_list`):60120,m=t?Symbol.for(`react.memo`):60115,h=t?Symbol.for(`react.lazy`):60116,g=t?Symbol.for(`react.block`):60121,_=t?Symbol.for(`react.fundamental`):60117,v=t?Symbol.for(`react.responder`):60118,y=t?Symbol.for(`react.scope`):60119;function b(e){if(typeof e==`object`&&e){var t=e.$$typeof;switch(t){case n:switch(e=e.type,e){case l:case u:case i:case o:case a:case f:return e;default:switch(e&&=e.$$typeof,e){case c:case d:case h:case m:case s:return e;default:return t}}case r:return t}}}function x(e){return b(e)===u}e.AsyncMode=l,e.ConcurrentMode=u,e.ContextConsumer=c,e.ContextProvider=s,e.Element=n,e.ForwardRef=d,e.Fragment=i,e.Lazy=h,e.Memo=m,e.Portal=r,e.Profiler=o,e.StrictMode=a,e.Suspense=f,e.isAsyncMode=function(e){return x(e)||b(e)===l},e.isConcurrentMode=x,e.isContextConsumer=function(e){return b(e)===c},e.isContextProvider=function(e){return b(e)===s},e.isElement=function(e){return typeof e==`object`&&!!e&&e.$$typeof===n},e.isForwardRef=function(e){return b(e)===d},e.isFragment=function(e){return b(e)===i},e.isLazy=function(e){return b(e)===h},e.isMemo=function(e){return b(e)===m},e.isPortal=function(e){return b(e)===r},e.isProfiler=function(e){return b(e)===o},e.isStrictMode=function(e){return b(e)===a},e.isSuspense=function(e){return b(e)===f},e.isValidElementType=function(e){return typeof e==`string`||typeof e==`function`||e===i||e===u||e===o||e===a||e===f||e===p||typeof e==`object`&&!!e&&(e.$$typeof===h||e.$$typeof===m||e.$$typeof===s||e.$$typeof===c||e.$$typeof===d||e.$$typeof===_||e.$$typeof===v||e.$$typeof===y||e.$$typeof===g)},e.typeOf=b})),te=t(((e,t)=>{t.exports=D()})),O=t(((e,t)=>{var n=te(),r={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},i={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},o={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},s={};s[n.ForwardRef]=a,s[n.Memo]=o;function c(e){return n.isMemo(e)?o:s[e.$$typeof]||r}var l=Object.defineProperty,u=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols,f=Object.getOwnPropertyDescriptor,p=Object.getPrototypeOf,m=Object.prototype;function h(e,t,n){if(typeof t!=`string`){if(m){var r=p(t);r&&r!==m&&h(e,r,n)}var a=u(t);d&&(a=a.concat(d(t)));for(var o=c(e),s=c(t),g=0;g<a.length;++g){var _=a[g];if(!i[_]&&!(n&&n[_])&&!(s&&s[_])&&!(o&&o[_])){var v=f(t,_);try{l(e,_,v)}catch{}}}}return e}t.exports=h})),k=e(r());O();var ne=function(e,t){var n=arguments;if(t==null||!d.call(t,`css`))return k.createElement.apply(void 0,n);var r=n.length,a=Array(r);a[0]=c,a[1]=i(e,t);for(var o=2;o<r;o++)a[o]=n[o];return k.createElement.apply(null,a)};(function(e){var t;t||=e.JSX||={}})(ne||={});var re=s(function(e,t){var n=e.styles,r=f([n],void 0,k.useContext(b)),i=k.useRef();return u(function(){var e=t.key+`-global`,n=new t.sheet.constructor({key:e,nonce:t.sheet.nonce,container:t.sheet.container,speedy:t.sheet.isSpeedy}),a=!1,o=document.querySelector(`style[data-emotion="`+e+` `+r.name+`"]`);return t.sheet.tags.length&&(n.before=t.sheet.tags[0]),o!==null&&(a=!0,o.setAttribute(`data-emotion`,e),n.hydrate([o])),i.current=[n,a],function(){n.flush()}},[t]),u(function(){var e=i.current,n=e[0];if(e[1]){e[1]=!1;return}r.next!==void 0&&o(t,r.next,!0),n.tags.length&&(n.before=n.tags[n.tags.length-1].nextElementSibling,n.flush()),t.insert(``,r,n,!1)},[t,r.name]),null});function A(){return f([...arguments])}function j(){var e=A.apply(void 0,arguments),t=`animation-`+e.name;return{name:t,styles:`@keyframes `+t+`{`+e.styles+`}`,anim:1,toString:function(){return`_EMO_`+this.name+`_`+this.styles+`_EMO_`}}}var M=w;function N(e){try{return e.matches(`:focus-visible`)}catch{}return!1}function P(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,s=r&&t===!1;return k.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||s)&&(e.disabled=n),e},[r,n,t,o,s,a,i])}var ie={};function ae(e){let{nativeButton:t,nativeButtonProp:n,internalNativeButton:r=t,allowInferredHostMismatch:i=!1,disabled:a,type:o,hasFormAction:s=!1,tabIndex:c=0,focusableWhenDisabled:l,stopEventPropagation:u=!1,onBeforeKeyDown:d,onBeforeKeyUp:f}=e,p=k.useRef(null),m=l===!0,h=P({focusableWhenDisabled:m,disabled:a,isNativeButton:t,tabIndex:c}),g=k.useCallback(()=>{let e=p.current;return e==null?t:e.tagName===`BUTTON`||!!(e.tagName===`A`&&e.href)},[t]),_=k.useMemo(()=>{let e=m?{}:{tabIndex:a?-1:c};return t?(e.type=o===void 0&&!s?`button`:o,m||(e.disabled=a)):(e.role=`button`,!m&&a&&(e[`aria-disabled`]=a)),m?{...e,...h}:e},[a,m,h,s,t,c,o]);return{getButtonProps:k.useCallback((e=ie)=>{let{onClick:t,onKeyDown:n,onKeyUp:r,...i}=e,o=e=>{if(u&&e.stopPropagation(),a){e.preventDefault();return}t?.(e)},s=e=>{if(m&&h.onKeyDown(e),!a&&(d?.(e),n?.(e),!(e.target!==e.currentTarget||g()))){if(e.key===` `){e.preventDefault();return}e.key===`Enter`&&(e.preventDefault(),e.currentTarget.click())}},c=e=>{a||(f?.(e),r?.(e),e.target===e.currentTarget&&!g()&&e.key===` `&&!e.defaultPrevented&&e.currentTarget.click())};return{..._,...i,onClick:o,onKeyDown:s,onKeyUp:c}},[_,a,m,h,g,d,f,u]),rootRef:p}}var oe=class e{static create(){return new e}static use(){let t=T(e.create).current,[n,r]=k.useState(!1);return t.shouldMount=n,t.setShouldMount=r,k.useEffect(t.mountEffect,[n]),t}constructor(){this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}mount(){return this.mounted||(this.mounted=F(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}};function se(){return oe.use()}function F(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var I=[];function L(e){k.useEffect(e,I)}var R=class e{static create(){return new e}currentId=null;start(e,t){this.clear(),this.currentId=setTimeout(()=>{this.currentId=null,t()},e)}clear=()=>{this.currentId!==null&&(clearTimeout(this.currentId),this.currentId=null)};disposeEffect=()=>this.clear};function z(){let e=T(R.create).current;return L(e.disposeEffect),e}var B=n();function V(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:o,rippleSize:s,in:c,onExited:l,timeout:u}=e,[d,f]=k.useState(!1),p=z(),m=k.useRef(!1),h=k.useRef(l);h.current=l;let g=l!=null,_=a(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),v={width:s,height:s,top:-(s/2)+o,left:-(s/2)+i},y=a(n.child,d&&n.childLeaving,r&&n.childPulsate);return!c&&!d&&f(!0),k.useEffect(()=>{!c&&g?m.current||(m.current=!0,p.start(u,()=>{m.current=!1,h.current?.()})):(m.current=!1,p.clear())},[p,g,c,u]),(0,B.jsx)(`span`,{className:_,style:v,children:(0,B.jsx)(`span`,{className:y})})}var H=y(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`]),U=550,W={},G=[],K=()=>{};function q(e,t){let n=new Set(t),r=new Map,i=[];for(let t of e)n.has(t)?i.length>0&&(r.set(t,i),i=[]):i.push(t);let a=[];for(let e of t){let t=r.get(e);t&&a.push(...t),a.push(e)}return a.push(...i),a}function ce({event:e,element:t,center:n}){let r=t?t.getBoundingClientRect():{width:0,height:0,left:0,top:0},i,a;if(n||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)i=Math.round(r.width/2),a=Math.round(r.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;i=Math.round(t-r.left),a=Math.round(n-r.top)}let o;if(n)o=Math.sqrt((2*r.width**2+r.height**2)/3),o%2==0&&(o+=1);else{let e=Math.max(Math.abs((t?t.clientWidth:0)-i),i)*2+2,n=Math.max(Math.abs((t?t.clientHeight:0)-a),a)*2+2;o=Math.sqrt(e**2+n**2)}return{rippleX:i,rippleY:a,rippleSize:o}}var le=j`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,J=j`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,ue=j`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`;function de(e){if(e.motion.reducedMotion===`always`)return null;let t=A`
    &.${H.rippleVisible} {
      animation-name: ${le};
      animation-duration: ${U}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    &.${H.ripplePulsate} {
      animation-duration: ${e.transitions.duration.shorter}ms;
    }

    & .${H.childLeaving} {
      animation-name: ${J};
      animation-duration: ${U}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    & .${H.childPulsate} {
      animation-name: ${ue};
      animation-duration: 2500ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
      animation-iteration-count: infinite;
      animation-delay: 200ms;
    }
  `;return e.motion.reducedMotion===`system`?A`
      @media (prefers-reduced-motion: no-preference) {
        ${t}
      }
    `:t}var fe=p(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),pe=p(V,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${H.rippleVisible} {
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
  & .${H.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${H.childLeaving} {
    opacity: 0;
  }

  & .${H.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
  }

  ${({theme:e})=>de(e)}
`,me=k.forwardRef(function(e,t){let n=_({props:e,name:`MuiTouchRipple`}),r=ee(x().motion.reducedMotion,!1),{center:i=!1,classes:o=W,className:s,...c}=n,[l,u]=k.useState({items:G,order:G}),d=l.items,f=k.useRef(0),p=k.useRef(null),m=k.useRef(!1);L(()=>(m.current=!0,()=>{m.current=!1})),k.useEffect(()=>{p.current&&=(p.current(),null)},[d]);let h=k.useRef(!1),g=z(),v=k.useRef(null),y=k.useRef(null),b=M(e=>{m.current&&u(t=>{let n=t.items.filter(t=>t.key!==e);return{items:n,order:q(t.order.filter(t=>t!==e),n.filter(e=>!e.exiting).map(e=>e.key))}})}),S=M(e=>{let{pulsate:t,rippleX:n,rippleY:r,rippleSize:i,cb:a}=e,o=f.current;f.current+=1,u(e=>{let a=[...e.items,{key:o,pulsate:t,rippleX:n,rippleY:r,rippleSize:i,exiting:!1}];return{items:a,order:q(e.order,a.filter(e=>!e.exiting).map(e=>e.key))}}),p.current=a}),C=M((e=W,t=W,n=K)=>{let{pulsate:r=!1,center:a=i||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&h.current){h.current=!1;return}e?.type===`touchstart`&&(h.current=!0);let{rippleX:s,rippleY:c,rippleSize:l}=ce({event:e,element:o?null:y.current,center:a});e?.touches?v.current===null&&(v.current=()=>{S({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})},g.start(80,()=>{v.current&&=(v.current(),null)})):S({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})}),w=M(()=>{C(W,{pulsate:!0})}),T=M((e,t)=>{if(g.clear(),e?.type===`touchend`&&v.current){v.current(),v.current=null,g.start(0,()=>{T(e,t)});return}v.current=null,u(e=>{let t=e.items.findIndex(e=>!e.exiting);if(t===-1)return e;let n=e.items.slice();return n[t]={...n[t],exiting:!0},{items:n,order:q(e.order,n.filter(e=>!e.exiting).map(e=>e.key))}}),p.current=t});k.useImperativeHandle(t,()=>({pulsate:w,start:C,stop:T}),[w,C,T]);let E=new Map(d.map(e=>[e.key,e])),D=l.order.map(e=>E.get(e)).filter(Boolean);return(0,B.jsx)(fe,{className:a(H.root,o.root,s),ref:y,...c,children:D.map(e=>(0,B.jsx)(pe,{classes:{ripple:a(o.ripple,H.ripple),rippleVisible:a(o.rippleVisible,H.rippleVisible),ripplePulsate:a(o.ripplePulsate,H.ripplePulsate),child:a(o.child,H.child),childLeaving:a(o.childLeaving,H.childLeaving),childPulsate:a(o.childPulsate,H.childPulsate)},timeout:r.shouldReduceMotion?0:U,pulsate:e.pulsate,rippleX:e.rippleX,rippleY:e.rippleY,rippleSize:e.rippleSize,in:!e.exiting,onExited:()=>b(e.key)},e.key))})});function he(e){return l(`MuiButtonBase`,e)}var ge=y(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`]),_e=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,suppressFocusVisible:i,classes:a}=e,o=g({root:[`root`,t&&`disabled`,n&&!i&&`focusVisible`]},he,a);return n&&!i&&r&&(o.root+=` ${r}`),o},ve=p(`button`,{name:`MuiButtonBase`,slot:`Root`})({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${ge.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`}}),ye=k.forwardRef(function(e,t){let n=_({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:o,className:s,component:c=`button`,disabled:l=!1,disableRipple:u=!1,disableTouchRipple:d=!1,focusRipple:f=!1,focusVisibleClassName:p,focusableWhenDisabled:m,suppressFocusVisible:h=!1,internalNativeButton:g,LinkComponent:v=`a`,nativeButton:y,onBlur:b,onClick:x,onContextMenu:S,onDragLeave:C,onFocus:w,onFocusVisible:T,onKeyDown:ee,onKeyUp:D,onMouseDown:te,onMouseLeave:O,onMouseUp:ne,onTouchEnd:re,onTouchMove:A,onTouchStart:j,tabIndex:P=0,TouchRippleProps:ie,touchRippleRef:oe,type:F,...I}=n,L=!!(I.href||I.to),R=!!I.formAction,z=c;z===`button`&&L&&(z=v);let V=typeof z==`string`?z===`button`:g??!1,H=y??V,U=se(),W=E(U.ref,oe),[G,K]=k.useState(!1);(l||h)&&G&&K(!1);let q=M(e=>{f&&!e.repeat&&G&&e.key===` `&&U.stop(e,()=>{U.start(e)})}),ce=M(e=>{f&&e.key===` `&&G&&!e.defaultPrevented&&U.stop(e,()=>{U.pulsate(e)})}),{getButtonProps:le,rootRef:J}=ae({nativeButton:H,nativeButtonProp:y,internalNativeButton:V,allowInferredHostMismatch:L||typeof z==`string`,disabled:l,type:F,hasFormAction:R,tabIndex:P,onBeforeKeyDown:q,onBeforeKeyUp:ce}),{onClick:ue,onKeyDown:de,onKeyUp:fe,...pe}=le({onClick:x,onKeyDown:ee,onKeyUp:D});k.useImperativeHandle(r,()=>({focusVisible:()=>{K(!0),J.current.focus()}}),[J]);let he=U.shouldMount&&!u&&!l;k.useEffect(()=>{G&&f&&!u&&U.pulsate()},[u,f,G,U]);let ge=Y(U,`start`,te,d),ye=Y(U,`stop`,S,d),be=Y(U,`stop`,C,d),X=Y(U,`stop`,ne,d),Z=Y(U,`stop`,e=>{G&&e.preventDefault(),O&&O(e)},d),Q=Y(U,`start`,j,d),xe=Y(U,`stop`,re,d),Se=Y(U,`stop`,A,d),Ce=Y(U,`stop`,e=>{N(e.target)||K(!1),b&&b(e)},!1),we=M(e=>{J.current||=e.currentTarget,!h&&N(e.target)&&(K(!0),T&&T(e)),w&&w(e)}),$={};L&&($.tabIndex=l?-1:P,l&&($[`aria-disabled`]=l),$.type=F);let Te=E(t,J),Ee={...n,centerRipple:i,component:c,disabled:l,disableRipple:u,disableTouchRipple:d,focusRipple:f,suppressFocusVisible:h,tabIndex:P,focusVisible:G},De=_e(Ee);return(0,B.jsxs)(ve,{as:z,className:a(De.root,s),ownerState:Ee,onBlur:Ce,onClick:ue,onContextMenu:ye,onFocus:we,onKeyDown:de,onKeyUp:fe,onMouseDown:ge,onMouseLeave:Z,onMouseUp:X,onDragLeave:be,onTouchEnd:xe,onTouchMove:Se,onTouchStart:Q,ref:Te,...L?$:pe,...I,children:[o,he?(0,B.jsx)(me,{ref:W,center:i,...ie}):null]})});function Y(e,t,n,r=!1){return M(i=>(n&&n(i),r||e[t](i),!0))}function be(e){return l(`MuiCircularProgress`,e)}y(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDisableShrink`]);var X=44,Z=j`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,Q=j`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,xe=typeof Z==`string`?null:A`
        animation: ${Z} 1.4s linear infinite;
      `,Se=typeof Q==`string`?null:A`
        animation: ${Q} 1.4s ease-in-out infinite;
      `,Ce=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e;return g({root:[`root`,n,`color${h(r)}`],svg:[`svg`],track:[`track`],circle:[`circle`,i&&`circleDisableShrink`]},be,t)},we=p(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${h(n.color)}`]]}})(m(({theme:e})=>{let t=S(e,{animation:`none`});return{display:`inline-block`,variants:[{props:{variant:`determinate`},style:{...C(e,`transform`)}},{props:{variant:`indeterminate`},style:xe||{animation:`${Z} 1.4s linear infinite`}},...t?[{props:{variant:`indeterminate`},style:t}]:[],...Object.entries(e.palette).filter(v()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}})),$=p(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),Te=p(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,n.disableShrink&&t.circleDisableShrink]}})(m(({theme:e})=>{let t=S(e,{animation:`none`});return{stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{...C(e,`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:Se||{animation:`${Q} 1.4s ease-in-out infinite`}},...t?[{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:t}]:[]]}})),Ee=p(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(m(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),De=k.forwardRef(function(e,t){let n=_({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:o=!1,enableTrackSlot:s=!1,min:c,max:l,size:u=40,style:d,thickness:f=3.6,value:p=n.min??0,variant:m=`indeterminate`,...h}=n,g=c??0,v=l??100,y={...n,color:i,disableShrink:o,size:u,thickness:f,value:p,variant:m,enableTrackSlot:s},b=Ce(y),x={},S={},C={};if(m===`determinate`){let e=2*Math.PI*((X-f)/2),t=v-g;x.strokeDasharray=e.toFixed(3),x.strokeDashoffset=t>0?`${((v-p)/t*e).toFixed(3)}px`:`${e.toFixed(3)}px`,S.transform=`rotate(-90deg)`,C[`aria-valuenow`]=p,C[`aria-valuemin`]=g,C[`aria-valuemax`]=v}return(0,B.jsx)(we,{className:a(b.root,r),style:{width:u,height:u,...S,...d},ownerState:y,ref:t,role:`progressbar`,...C,...h,children:(0,B.jsxs)($,{className:b.svg,ownerState:y,viewBox:`${X/2} ${X/2} ${X} ${X}`,children:[s?(0,B.jsx)(Ee,{className:b.track,ownerState:y,cx:X,cy:X,r:(X-f)/2,fill:`none`,strokeWidth:f,"aria-hidden":`true`}):null,(0,B.jsx)(Te,{className:b.circle,style:x,ownerState:y,cx:X,cy:X,r:(X-f)/2,fill:`none`,strokeWidth:f})]})})});export{N as a,A as c,z as i,j as l,ye as n,M as o,R as r,re as s,De as t};