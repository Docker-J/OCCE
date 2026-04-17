import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{C as t,D as n,j as r}from"./reactVendor-B1CKzCld.js";import{O as i}from"./ckeditor-BjoMAk85.js";import{C as a,F as o,K as s,o as c,r as l,w as u}from"./createSimplePaletteValueFilter-BLWNyjUn.js";import{a as d,i as f,n as p,r as m}from"./useTimeout-CvUrZCgx.js";var h=e(i(),1),g=d;function _(e){try{return e.matches(`:focus-visible`)}catch{}return!1}function v(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,s=r&&t===!1;return h.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||s)&&(e.disabled=n),e},[r,n,t,o,s,a,i])}var y={};function b(e){let{nativeButton:t,nativeButtonProp:n,internalNativeButton:r=t,allowInferredHostMismatch:i=!1,disabled:a,type:o,hasFormAction:s=!1,tabIndex:c=0,focusableWhenDisabled:l,stopEventPropagation:u=!1,onBeforeKeyDown:d,onBeforeKeyUp:f}=e,p=h.useRef(null),m=l===!0,g=v({focusableWhenDisabled:m,disabled:a,isNativeButton:t,tabIndex:c}),_=h.useCallback(()=>{let e=p.current;return e==null?t:e.tagName===`BUTTON`?!0:!!(e.tagName===`A`&&e.href)},[t]),b=h.useMemo(()=>{let e=m?{}:{tabIndex:a?-1:c};return t?(e.type=o===void 0&&!s?`button`:o,m||(e.disabled=a)):(e.role=`button`,!m&&a&&(e[`aria-disabled`]=a)),m?{...e,...g}:e},[a,m,g,s,t,c,o]);return{getButtonProps:h.useCallback((e=y)=>{let{onClick:t,onKeyDown:n,onKeyUp:r,...i}=e,o=e=>{if(u&&e.stopPropagation(),a){e.preventDefault();return}t?.(e)},s=e=>{if(m&&g.onKeyDown(e),!a&&(d?.(e),n?.(e),!(e.target!==e.currentTarget||_()))){if(e.key===` `){e.preventDefault();return}e.key===`Enter`&&(e.preventDefault(),e.currentTarget.click())}},c=e=>{a||(f?.(e),r?.(e),e.target===e.currentTarget&&!_()&&e.key===` `&&!e.defaultPrevented&&e.currentTarget.click())};return{...b,...i,onClick:o,onKeyDown:s,onKeyUp:c}},[b,a,m,g,_,d,f,u]),rootRef:p}}var x=class e{static create(){return new e}static use(){let t=m(e.create).current,[n,r]=h.useState(!1);return t.shouldMount=n,t.setShouldMount=r,h.useEffect(t.mountEffect,[n]),t}constructor(){this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}mount(){return this.mounted||(this.mounted=C(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}};function S(){return x.use()}function C(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var w=n();function T(e){let{className:t,classes:n,pulsate:i=!1,rippleX:a,rippleY:o,rippleSize:s,in:c,onExited:l,timeout:u}=e,[d,f]=h.useState(!1),p=r(t,n.ripple,n.rippleVisible,i&&n.ripplePulsate),m={width:s,height:s,top:-(s/2)+o,left:-(s/2)+a},g=r(n.child,d&&n.childLeaving,i&&n.childPulsate);return!c&&!d&&f(!0),h.useEffect(()=>{if(!c&&l!=null){let e=setTimeout(l,u);return()=>{clearTimeout(e)}}},[l,c,u]),(0,w.jsx)(`span`,{className:p,style:m,children:(0,w.jsx)(`span`,{className:g})})}var E=a(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`]),D=550,O=o`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,k=o`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,A=o`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,j=c(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),M=c(T,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${E.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${O};
    animation-duration: ${D}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  &.${E.ripplePulsate} {
    animation-duration: ${({theme:e})=>e.transitions.duration.shorter}ms;
  }

  & .${E.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${E.childLeaving} {
    opacity: 0;
    animation-name: ${k};
    animation-duration: ${D}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  & .${E.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${A};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,ee=h.forwardRef(function(e,n){let{center:i=!1,classes:a={},className:o,...s}=l({props:e,name:`MuiTouchRipple`}),[c,u]=h.useState([]),d=h.useRef(0),f=h.useRef(null);h.useEffect(()=>{f.current&&=(f.current(),null)},[c]);let m=h.useRef(!1),g=p(),_=h.useRef(null),v=h.useRef(null),y=h.useCallback(e=>{let{pulsate:t,rippleX:n,rippleY:i,rippleSize:o,cb:s}=e;u(e=>[...e,(0,w.jsx)(M,{classes:{ripple:r(a.ripple,E.ripple),rippleVisible:r(a.rippleVisible,E.rippleVisible),ripplePulsate:r(a.ripplePulsate,E.ripplePulsate),child:r(a.child,E.child),childLeaving:r(a.childLeaving,E.childLeaving),childPulsate:r(a.childPulsate,E.childPulsate)},timeout:D,pulsate:t,rippleX:n,rippleY:i,rippleSize:o},d.current)]),d.current+=1,f.current=s},[a]),b=h.useCallback((e={},t={},n=()=>{})=>{let{pulsate:r=!1,center:a=i||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&m.current){m.current=!1;return}e?.type===`touchstart`&&(m.current=!0);let s=o?null:v.current,c=s?s.getBoundingClientRect():{width:0,height:0,left:0,top:0},l,u,d;if(a||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)l=Math.round(c.width/2),u=Math.round(c.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;l=Math.round(t-c.left),u=Math.round(n-c.top)}if(a)d=Math.sqrt((2*c.width**2+c.height**2)/3),d%2==0&&(d+=1);else{let e=Math.max(Math.abs((s?s.clientWidth:0)-l),l)*2+2,t=Math.max(Math.abs((s?s.clientHeight:0)-u),u)*2+2;d=Math.sqrt(e**2+t**2)}e?.touches?_.current===null&&(_.current=()=>{y({pulsate:r,rippleX:l,rippleY:u,rippleSize:d,cb:n})},g.start(80,()=>{_.current&&=(_.current(),null)})):y({pulsate:r,rippleX:l,rippleY:u,rippleSize:d,cb:n})},[i,y,g]),x=h.useCallback(()=>{b({},{pulsate:!0})},[b]),S=h.useCallback((e,t)=>{if(g.clear(),e?.type===`touchend`&&_.current){_.current(),_.current=null,g.start(0,()=>{S(e,t)});return}_.current=null,u(e=>e.length>0?e.slice(1):e),f.current=t},[g]);return h.useImperativeHandle(n,()=>({pulsate:x,start:b,stop:S}),[x,b,S]),(0,w.jsx)(j,{className:r(E.root,a.root,o),ref:v,...s,children:(0,w.jsx)(t,{component:null,exit:!0,children:c})})});function N(e){return u(`MuiButtonBase`,e)}var P=a(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`]),te=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,suppressFocusVisible:i,classes:a}=e,o=s({root:[`root`,t&&`disabled`,n&&!i&&`focusVisible`]},N,a);return n&&!i&&r&&(o.root+=` ${r}`),o},ne=c(`button`,{name:`MuiButtonBase`,slot:`Root`})({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${P.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`}}),F=h.forwardRef(function(e,t){let n=l({props:e,name:`MuiButtonBase`}),{action:i,centerRipple:a=!1,children:o,className:s,component:c=`button`,disabled:u=!1,disableRipple:d=!1,disableTouchRipple:p=!1,focusRipple:m=!1,focusVisibleClassName:v,focusableWhenDisabled:y,suppressFocusVisible:x=!1,internalNativeButton:C,LinkComponent:T=`a`,nativeButton:E,onBlur:D,onClick:O,onContextMenu:k,onDragLeave:A,onFocus:j,onFocusVisible:M,onKeyDown:N,onKeyUp:P,onMouseDown:F,onMouseLeave:L,onMouseUp:re,onTouchEnd:R,onTouchMove:z,onTouchStart:ie,tabIndex:B=0,TouchRippleProps:ae,touchRippleRef:oe,type:V,...H}=n,U=!!(H.href||H.to),W=!!H.formAction,G=c;G===`button`&&U&&(G=T);let K=typeof G==`string`?G===`button`:C??!1,se=E??K,q=S(),ce=f(q.ref,oe),[J,Y]=h.useState(!1);(u||x)&&J&&Y(!1);let le=g(e=>{m&&!e.repeat&&J&&e.key===` `&&q.stop(e,()=>{q.start(e)})}),ue=g(e=>{m&&e.key===` `&&J&&!e.defaultPrevented&&q.stop(e,()=>{q.pulsate(e)})}),{getButtonProps:de,rootRef:X}=b({nativeButton:se,nativeButtonProp:E,internalNativeButton:K,allowInferredHostMismatch:U||typeof G==`string`,disabled:u,type:V,hasFormAction:W,tabIndex:B,onBeforeKeyDown:le,onBeforeKeyUp:ue}),{onClick:fe,onKeyDown:pe,onKeyUp:me,...he}=de({onClick:O,onKeyDown:N,onKeyUp:P});h.useImperativeHandle(i,()=>({focusVisible:()=>{Y(!0),X.current.focus()}}),[X]);let ge=q.shouldMount&&!d&&!u;h.useEffect(()=>{J&&m&&!d&&q.pulsate()},[d,m,J,q]);let _e=I(q,`start`,F,p),ve=I(q,`stop`,k,p),ye=I(q,`stop`,A,p),be=I(q,`stop`,re,p),xe=I(q,`stop`,e=>{J&&e.preventDefault(),L&&L(e)},p),Se=I(q,`start`,ie,p),Z=I(q,`stop`,R,p),Ce=I(q,`stop`,z,p),we=I(q,`stop`,e=>{_(e.target)||Y(!1),D&&D(e)},!1),Te=g(e=>{X.current||=e.currentTarget,!x&&_(e.target)&&(Y(!0),M&&M(e)),j&&j(e)}),Q={};U&&(Q.tabIndex=u?-1:B,u&&(Q[`aria-disabled`]=u),Q.type=V);let Ee=f(t,X),$={...n,centerRipple:a,component:c,disabled:u,disableRipple:d,disableTouchRipple:p,focusRipple:m,suppressFocusVisible:x,tabIndex:B,focusVisible:J},De=te($);return(0,w.jsxs)(ne,{as:G,className:r(De.root,s),ownerState:$,onBlur:we,onClick:fe,onContextMenu:ve,onFocus:Te,onKeyDown:pe,onKeyUp:me,onMouseDown:_e,onMouseLeave:xe,onMouseUp:be,onDragLeave:ye,onTouchEnd:Z,onTouchMove:Ce,onTouchStart:Se,ref:Ee,...U?Q:he,...H,children:[o,ge?(0,w.jsx)(ee,{ref:ce,center:a,...ae}):null]})});function I(e,t,n,r=!1){return g(i=>(n&&n(i),r||e[t](i),!0))}export{_ as n,g as r,F as t};