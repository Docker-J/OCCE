import{a as e}from"./rolldown-runtime-Cyuzqnbw.js";import{t}from"./reactVendor-BRmMH0Ga.js";import{O as n}from"./ckeditor-C27Jiu7M.js";import{C as r,G as i,T as a,h as o,n as s,o as c,q as l,w as u}from"./createSimplePaletteValueFilter-CmaluhCA.js";import{a as d,c as f,i as p,n as m,o as h,r as g,s as _}from"./useTimeout-Bob1KXnB.js";var v=e(n()),y=f;function b(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function x(e,t){var n=function(e){return t&&(0,v.isValidElement)(e)?t(e):e},r=Object.create(null);return e&&v.Children.map(e,function(e){return e}).forEach(function(e){r[e.key]=n(e)}),r}function S(e,t){e||={},t||={};function n(n){return n in t?t[n]:e[n]}var r=Object.create(null),i=[];for(var a in e)a in t?i.length&&(r[a]=i,i=[]):i.push(a);var o,s={};for(var c in t){if(r[c])for(o=0;o<r[c].length;o++){var l=r[c][o];s[r[c][o]]=n(l)}s[c]=n(c)}for(o=0;o<i.length;o++)s[i[o]]=n(i[o]);return s}function C(e,t,n){return n[t]==null?e.props[t]:n[t]}function w(e,t){return x(e.children,function(n){return(0,v.cloneElement)(n,{onExited:t.bind(null,n),in:!0,appear:C(n,`appear`,e),enter:C(n,`enter`,e),exit:C(n,`exit`,e)})})}function T(e,t,n){var r=x(e.children),i=S(t,r);return Object.keys(i).forEach(function(a){var o=i[a];if((0,v.isValidElement)(o)){var s=a in t,c=a in r,l=t[a],u=(0,v.isValidElement)(l)&&!l.props.in;c&&(!s||u)?i[a]=(0,v.cloneElement)(o,{onExited:n.bind(null,o),in:!0,exit:C(o,`exit`,e),enter:C(o,`enter`,e)}):!c&&s&&!u?i[a]=(0,v.cloneElement)(o,{in:!1}):c&&s&&(0,v.isValidElement)(l)&&(i[a]=(0,v.cloneElement)(o,{onExited:n.bind(null,o),in:l.props.in,exit:C(o,`exit`,e),enter:C(o,`enter`,e)}))}}),i}var E=Object.values||function(e){return Object.keys(e).map(function(t){return e[t]})},D={component:`div`,childFactory:function(e){return e}},O=function(e){d(t,e);function t(t,n){var r=e.call(this,t,n)||this;return r.state={contextValue:{isMounting:!0},handleExited:r.handleExited.bind(b(r)),firstRender:!0},r}var n=t.prototype;return n.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},n.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(e,t){var n=t.children,r=t.handleExited;return{children:t.firstRender?w(e,r):T(e,n,r),firstRender:!1}},n.handleExited=function(e,t){var n=x(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState(function(t){var n=l({},t.children);return delete n[e.key],{children:n}}))},n.render=function(){var e=this.props,t=e.component,n=e.childFactory,r=h(e,[`component`,`childFactory`]),i=this.state.contextValue,a=E(this.state.children).map(n);return delete r.appear,delete r.enter,delete r.exit,t===null?v.createElement(p.Provider,{value:i},a):v.createElement(p.Provider,{value:i},v.createElement(t,r,a))},t}(v.Component);O.propTypes={},O.defaultProps=D;function k(e){try{return e.matches(`:focus-visible`)}catch{}return!1}function A(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,s=r&&t===!1;return v.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||s)&&(e.disabled=n),e},[r,n,t,o,s,a,i])}var j={};function ee(e){let{nativeButton:t,nativeButtonProp:n,internalNativeButton:r=t,allowInferredHostMismatch:i=!1,disabled:a,type:o,hasFormAction:s=!1,tabIndex:c=0,focusableWhenDisabled:l,stopEventPropagation:u=!1,onBeforeKeyDown:d,onBeforeKeyUp:f}=e,p=v.useRef(null),m=l===!0,h=A({focusableWhenDisabled:m,disabled:a,isNativeButton:t,tabIndex:c}),g=v.useCallback(()=>{let e=p.current;return e==null?t:e.tagName===`BUTTON`?!0:!!(e.tagName===`A`&&e.href)},[t]),_=v.useMemo(()=>{let e=m?{}:{tabIndex:a?-1:c};return t?(e.type=o===void 0&&!s?`button`:o,m||(e.disabled=a)):(e.role=`button`,!m&&a&&(e[`aria-disabled`]=a)),m?{...e,...h}:e},[a,m,h,s,t,c,o]);return{getButtonProps:v.useCallback((e=j)=>{let{onClick:t,onKeyDown:n,onKeyUp:r,...i}=e,o=e=>{if(u&&e.stopPropagation(),a){e.preventDefault();return}t?.(e)},s=e=>{if(m&&h.onKeyDown(e),!a&&(d?.(e),n?.(e),!(e.target!==e.currentTarget||g()))){if(e.key===` `){e.preventDefault();return}e.key===`Enter`&&(e.preventDefault(),e.currentTarget.click())}},c=e=>{a||(f?.(e),r?.(e),e.target===e.currentTarget&&!g()&&e.key===` `&&!e.defaultPrevented&&e.currentTarget.click())};return{..._,...i,onClick:o,onKeyDown:s,onKeyUp:c}},[_,a,m,h,g,d,f,u]),rootRef:p}}var M=class e{static create(){return new e}static use(){let t=g(e.create).current,[n,r]=v.useState(!1);return t.shouldMount=n,t.setShouldMount=r,v.useEffect(t.mountEffect,[n]),t}constructor(){this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}mount(){return this.mounted||(this.mounted=N(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}};function te(){return M.use()}function N(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var P=t();function F(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:o,rippleSize:s,in:c,onExited:l,timeout:u}=e,[d,f]=v.useState(!1),p=a(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),m={width:s,height:s,top:-(s/2)+o,left:-(s/2)+i},h=a(n.child,d&&n.childLeaving,r&&n.childPulsate);return!c&&!d&&f(!0),v.useEffect(()=>{if(!c&&l!=null){let e=setTimeout(l,u);return()=>{clearTimeout(e)}}},[l,c,u]),(0,P.jsx)(`span`,{className:p,style:m,children:(0,P.jsx)(`span`,{className:h})})}var I=r(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`]),L=550,R=i`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,z=i`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,B=i`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,V=c(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),H=c(F,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${I.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${R};
    animation-duration: ${L}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  &.${I.ripplePulsate} {
    animation-duration: ${({theme:e})=>e.transitions.duration.shorter}ms;
  }

  & .${I.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${I.childLeaving} {
    opacity: 0;
    animation-name: ${z};
    animation-duration: ${L}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  & .${I.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${B};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,ne=v.forwardRef(function(e,t){let{center:n=!1,classes:r={},className:i,...o}=s({props:e,name:`MuiTouchRipple`}),[c,l]=v.useState([]),u=v.useRef(0),d=v.useRef(null);v.useEffect(()=>{d.current&&=(d.current(),null)},[c]);let f=v.useRef(!1),p=m(),h=v.useRef(null),g=v.useRef(null),_=v.useCallback(e=>{let{pulsate:t,rippleX:n,rippleY:i,rippleSize:o,cb:s}=e;l(e=>[...e,(0,P.jsx)(H,{classes:{ripple:a(r.ripple,I.ripple),rippleVisible:a(r.rippleVisible,I.rippleVisible),ripplePulsate:a(r.ripplePulsate,I.ripplePulsate),child:a(r.child,I.child),childLeaving:a(r.childLeaving,I.childLeaving),childPulsate:a(r.childPulsate,I.childPulsate)},timeout:L,pulsate:t,rippleX:n,rippleY:i,rippleSize:o},u.current)]),u.current+=1,d.current=s},[r]),y=v.useCallback((e={},t={},r=()=>{})=>{let{pulsate:i=!1,center:a=n||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&f.current){f.current=!1;return}e?.type===`touchstart`&&(f.current=!0);let s=o?null:g.current,c=s?s.getBoundingClientRect():{width:0,height:0,left:0,top:0},l,u,d;if(a||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)l=Math.round(c.width/2),u=Math.round(c.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;l=Math.round(t-c.left),u=Math.round(n-c.top)}if(a)d=Math.sqrt((2*c.width**2+c.height**2)/3),d%2==0&&(d+=1);else{let e=Math.max(Math.abs((s?s.clientWidth:0)-l),l)*2+2,t=Math.max(Math.abs((s?s.clientHeight:0)-u),u)*2+2;d=Math.sqrt(e**2+t**2)}e?.touches?h.current===null&&(h.current=()=>{_({pulsate:i,rippleX:l,rippleY:u,rippleSize:d,cb:r})},p.start(80,()=>{h.current&&=(h.current(),null)})):_({pulsate:i,rippleX:l,rippleY:u,rippleSize:d,cb:r})},[n,_,p]),b=v.useCallback(()=>{y({},{pulsate:!0})},[y]),x=v.useCallback((e,t)=>{if(p.clear(),e?.type===`touchend`&&h.current){h.current(),h.current=null,p.start(0,()=>{x(e,t)});return}h.current=null,l(e=>e.length>0?e.slice(1):e),d.current=t},[p]);return v.useImperativeHandle(t,()=>({pulsate:b,start:y,stop:x}),[b,y,x]),(0,P.jsx)(V,{className:a(I.root,r.root,i),ref:g,...o,children:(0,P.jsx)(O,{component:null,exit:!0,children:c})})});function U(e){return u(`MuiButtonBase`,e)}var W=r(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`]),re=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,suppressFocusVisible:i,classes:a}=e,s=o({root:[`root`,t&&`disabled`,n&&!i&&`focusVisible`]},U,a);return n&&!i&&r&&(s.root+=` ${r}`),s},ie=c(`button`,{name:`MuiButtonBase`,slot:`Root`})({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${W.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`}}),G=v.forwardRef(function(e,t){let n=s({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:o,className:c,component:l=`button`,disabled:u=!1,disableRipple:d=!1,disableTouchRipple:f=!1,focusRipple:p=!1,focusVisibleClassName:m,focusableWhenDisabled:h,suppressFocusVisible:g=!1,internalNativeButton:b,LinkComponent:x=`a`,nativeButton:S,onBlur:C,onClick:w,onContextMenu:T,onDragLeave:E,onFocus:D,onFocusVisible:O,onKeyDown:A,onKeyUp:j,onMouseDown:M,onMouseLeave:N,onMouseUp:F,onTouchEnd:I,onTouchMove:L,onTouchStart:R,tabIndex:z=0,TouchRippleProps:B,touchRippleRef:V,type:H,...U}=n,W=!!(U.href||U.to),G=!!U.formAction,q=l;q===`button`&&W&&(q=x);let J=typeof q==`string`?q===`button`:b??!1,ae=S??J,Y=te(),oe=_(Y.ref,V),[X,Z]=v.useState(!1);(u||g)&&X&&Z(!1);let se=y(e=>{p&&!e.repeat&&X&&e.key===` `&&Y.stop(e,()=>{Y.start(e)})}),ce=y(e=>{p&&e.key===` `&&X&&!e.defaultPrevented&&Y.stop(e,()=>{Y.pulsate(e)})}),{getButtonProps:le,rootRef:Q}=ee({nativeButton:ae,nativeButtonProp:S,internalNativeButton:J,allowInferredHostMismatch:W||typeof q==`string`,disabled:u,type:H,hasFormAction:G,tabIndex:z,onBeforeKeyDown:se,onBeforeKeyUp:ce}),{onClick:ue,onKeyDown:de,onKeyUp:fe,...pe}=le({onClick:w,onKeyDown:A,onKeyUp:j});v.useImperativeHandle(r,()=>({focusVisible:()=>{Z(!0),Q.current.focus()}}),[Q]);let me=Y.shouldMount&&!d&&!u;v.useEffect(()=>{X&&p&&!d&&Y.pulsate()},[d,p,X,Y]);let he=K(Y,`start`,M,f),ge=K(Y,`stop`,T,f),_e=K(Y,`stop`,E,f),ve=K(Y,`stop`,F,f),ye=K(Y,`stop`,e=>{X&&e.preventDefault(),N&&N(e)},f),be=K(Y,`start`,R,f),xe=K(Y,`stop`,I,f),Se=K(Y,`stop`,L,f),Ce=K(Y,`stop`,e=>{k(e.target)||Z(!1),C&&C(e)},!1),we=y(e=>{Q.current||=e.currentTarget,!g&&k(e.target)&&(Z(!0),O&&O(e)),D&&D(e)}),$={};W&&($.tabIndex=u?-1:z,u&&($[`aria-disabled`]=u),$.type=H);let Te=_(t,Q),Ee={...n,centerRipple:i,component:l,disabled:u,disableRipple:d,disableTouchRipple:f,focusRipple:p,suppressFocusVisible:g,tabIndex:z,focusVisible:X},De=re(Ee);return(0,P.jsxs)(ie,{as:q,className:a(De.root,c),ownerState:Ee,onBlur:Ce,onClick:ue,onContextMenu:ge,onFocus:we,onKeyDown:de,onKeyUp:fe,onMouseDown:he,onMouseLeave:ye,onMouseUp:ve,onDragLeave:_e,onTouchEnd:xe,onTouchMove:Se,onTouchStart:be,ref:Te,...W?$:pe,...U,children:[o,me?(0,P.jsx)(ne,{ref:oe,center:i,...B}):null]})});function K(e,t,n,r=!1){return y(i=>(n&&n(i),r||e[t](i),!0))}export{y as i,k as n,O as r,G as t};