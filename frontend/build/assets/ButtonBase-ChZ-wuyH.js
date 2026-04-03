import{a as e}from"./chunk-BEqpzyXh.js";import{t}from"./react-CFRkDy7n.js";import{L as n,N as r,T as i,X as a,Z as o,r as s,s as c,w as l,z as u}from"./createSimplePaletteValueFilter-xRUpZy8D.js";import{a as d,c as f,i as p,n as m,o as h,r as g,s as _}from"./useTimeout-DHGaMEev.js";var v=f;function y(e){try{return e.matches(`:focus-visible`)}catch{}return!1}var b=e(t()),x=class e{static create(){return new e}static use(){let t=h(e.create).current,[n,r]=b.useState(!1);return t.shouldMount=n,t.setShouldMount=r,b.useEffect(t.mountEffect,[n]),t}constructor(){this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}mount(){return this.mounted||(this.mounted=C(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}};function S(){return x.use()}function C(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}function w(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function T(e,t){var n=function(e){return t&&(0,b.isValidElement)(e)?t(e):e},r=Object.create(null);return e&&b.Children.map(e,function(e){return e}).forEach(function(e){r[e.key]=n(e)}),r}function E(e,t){e||={},t||={};function n(n){return n in t?t[n]:e[n]}var r=Object.create(null),i=[];for(var a in e)a in t?i.length&&(r[a]=i,i=[]):i.push(a);var o,s={};for(var c in t){if(r[c])for(o=0;o<r[c].length;o++){var l=r[c][o];s[r[c][o]]=n(l)}s[c]=n(c)}for(o=0;o<i.length;o++)s[i[o]]=n(i[o]);return s}function D(e,t,n){return n[t]==null?e.props[t]:n[t]}function O(e,t){return T(e.children,function(n){return(0,b.cloneElement)(n,{onExited:t.bind(null,n),in:!0,appear:D(n,`appear`,e),enter:D(n,`enter`,e),exit:D(n,`exit`,e)})})}function k(e,t,n){var r=T(e.children),i=E(t,r);return Object.keys(i).forEach(function(a){var o=i[a];if((0,b.isValidElement)(o)){var s=a in t,c=a in r,l=t[a],u=(0,b.isValidElement)(l)&&!l.props.in;c&&(!s||u)?i[a]=(0,b.cloneElement)(o,{onExited:n.bind(null,o),in:!0,exit:D(o,`exit`,e),enter:D(o,`enter`,e)}):!c&&s&&!u?i[a]=(0,b.cloneElement)(o,{in:!1}):c&&s&&(0,b.isValidElement)(l)&&(i[a]=(0,b.cloneElement)(o,{onExited:n.bind(null,o),in:l.props.in,exit:D(o,`exit`,e),enter:D(o,`enter`,e)}))}}),i}var A=Object.values||function(e){return Object.keys(e).map(function(t){return e[t]})},j={component:`div`,childFactory:function(e){return e}},M=function(e){p(t,e);function t(t,n){var r=e.call(this,t,n)||this;return r.state={contextValue:{isMounting:!0},handleExited:r.handleExited.bind(w(r)),firstRender:!0},r}var n=t.prototype;return n.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},n.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(e,t){var n=t.children,r=t.handleExited;return{children:t.firstRender?O(e,r):k(e,n,r),firstRender:!1}},n.handleExited=function(e,t){var n=T(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState(function(t){var n=u({},t.children);return delete n[e.key],{children:n}}))},n.render=function(){var e=this.props,t=e.component,n=e.childFactory,r=d(e,[`component`,`childFactory`]),i=this.state.contextValue,a=A(this.state.children).map(n);return delete r.appear,delete r.enter,delete r.exit,t===null?b.createElement(g.Provider,{value:i},a):b.createElement(g.Provider,{value:i},b.createElement(t,r,a))},t}(b.Component);M.propTypes={},M.defaultProps=j;var N=r();function P(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:a,rippleSize:s,in:c,onExited:l,timeout:u}=e,[d,f]=b.useState(!1),p=o(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),m={width:s,height:s,top:-(s/2)+a,left:-(s/2)+i},h=o(n.child,d&&n.childLeaving,r&&n.childPulsate);return!c&&!d&&f(!0),b.useEffect(()=>{if(!c&&l!=null){let e=setTimeout(l,u);return()=>{clearTimeout(e)}}},[l,c,u]),(0,N.jsx)(`span`,{className:p,style:m,children:(0,N.jsx)(`span`,{className:h})})}var F=l(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`]),I=550,L=n`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,R=n`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,z=n`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,B=c(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),V=c(P,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${F.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${L};
    animation-duration: ${I}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  &.${F.ripplePulsate} {
    animation-duration: ${({theme:e})=>e.transitions.duration.shorter}ms;
  }

  & .${F.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${F.childLeaving} {
    opacity: 0;
    animation-name: ${R};
    animation-duration: ${I}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  & .${F.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${z};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,H=b.forwardRef(function(e,t){let{center:n=!1,classes:r={},className:i,...a}=s({props:e,name:`MuiTouchRipple`}),[c,l]=b.useState([]),u=b.useRef(0),d=b.useRef(null);b.useEffect(()=>{d.current&&=(d.current(),null)},[c]);let f=b.useRef(!1),p=m(),h=b.useRef(null),g=b.useRef(null),_=b.useCallback(e=>{let{pulsate:t,rippleX:n,rippleY:i,rippleSize:a,cb:s}=e;l(e=>[...e,(0,N.jsx)(V,{classes:{ripple:o(r.ripple,F.ripple),rippleVisible:o(r.rippleVisible,F.rippleVisible),ripplePulsate:o(r.ripplePulsate,F.ripplePulsate),child:o(r.child,F.child),childLeaving:o(r.childLeaving,F.childLeaving),childPulsate:o(r.childPulsate,F.childPulsate)},timeout:I,pulsate:t,rippleX:n,rippleY:i,rippleSize:a},u.current)]),u.current+=1,d.current=s},[r]),v=b.useCallback((e={},t={},r=()=>{})=>{let{pulsate:i=!1,center:a=n||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&f.current){f.current=!1;return}e?.type===`touchstart`&&(f.current=!0);let s=o?null:g.current,c=s?s.getBoundingClientRect():{width:0,height:0,left:0,top:0},l,u,d;if(a||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)l=Math.round(c.width/2),u=Math.round(c.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;l=Math.round(t-c.left),u=Math.round(n-c.top)}if(a)d=Math.sqrt((2*c.width**2+c.height**2)/3),d%2==0&&(d+=1);else{let e=Math.max(Math.abs((s?s.clientWidth:0)-l),l)*2+2,t=Math.max(Math.abs((s?s.clientHeight:0)-u),u)*2+2;d=Math.sqrt(e**2+t**2)}e?.touches?h.current===null&&(h.current=()=>{_({pulsate:i,rippleX:l,rippleY:u,rippleSize:d,cb:r})},p.start(80,()=>{h.current&&=(h.current(),null)})):_({pulsate:i,rippleX:l,rippleY:u,rippleSize:d,cb:r})},[n,_,p]),y=b.useCallback(()=>{v({},{pulsate:!0})},[v]),x=b.useCallback((e,t)=>{if(p.clear(),e?.type===`touchend`&&h.current){h.current(),h.current=null,p.start(0,()=>{x(e,t)});return}h.current=null,l(e=>e.length>0?e.slice(1):e),d.current=t},[p]);return b.useImperativeHandle(t,()=>({pulsate:y,start:v,stop:x}),[y,v,x]),(0,N.jsx)(B,{className:o(F.root,r.root,i),ref:g,...a,children:(0,N.jsx)(M,{component:null,exit:!0,children:c})})});function U(e){return i(`MuiButtonBase`,e)}var W=l(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`]),G=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,classes:i}=e,o=a({root:[`root`,t&&`disabled`,n&&`focusVisible`]},U,i);return n&&r&&(o.root+=` ${r}`),o},K=c(`button`,{name:`MuiButtonBase`,slot:`Root`})({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${W.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`}}),q=b.forwardRef(function(e,t){let n=s({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:a,className:c,component:l=`button`,disabled:u=!1,disableRipple:d=!1,disableTouchRipple:f=!1,focusRipple:p=!1,focusVisibleClassName:m,LinkComponent:h=`a`,onBlur:g,onClick:x,onContextMenu:C,onDragLeave:w,onFocus:T,onFocusVisible:E,onKeyDown:D,onKeyUp:O,onMouseDown:k,onMouseLeave:A,onMouseUp:j,onTouchEnd:M,onTouchMove:P,onTouchStart:F,tabIndex:I=0,TouchRippleProps:L,touchRippleRef:R,type:z,...B}=n,V=b.useRef(null),U=S(),W=_(U.ref,R),[q,Y]=b.useState(!1);u&&q&&Y(!1),b.useImperativeHandle(r,()=>({focusVisible:()=>{Y(!0),V.current.focus()}}),[]);let ee=U.shouldMount&&!d&&!u;b.useEffect(()=>{q&&p&&!d&&U.pulsate()},[d,p,q,U]);let te=J(U,`start`,k,f),ne=J(U,`stop`,C,f),re=J(U,`stop`,w,f),ie=J(U,`stop`,j,f),ae=J(U,`stop`,e=>{q&&e.preventDefault(),A&&A(e)},f),oe=J(U,`start`,F,f),se=J(U,`stop`,M,f),ce=J(U,`stop`,P,f),le=J(U,`stop`,e=>{y(e.target)||Y(!1),g&&g(e)},!1),ue=v(e=>{V.current||=e.currentTarget,y(e.target)&&(Y(!0),E&&E(e)),T&&T(e)}),X=()=>{let e=V.current;return l&&l!==`button`&&!(e.tagName===`A`&&e.href)},de=v(e=>{p&&!e.repeat&&q&&e.key===` `&&U.stop(e,()=>{U.start(e)}),e.target===e.currentTarget&&X()&&e.key===` `&&e.preventDefault(),D&&D(e),e.target===e.currentTarget&&X()&&e.key===`Enter`&&!u&&(e.preventDefault(),x&&x(e))}),fe=v(e=>{p&&e.key===` `&&q&&!e.defaultPrevented&&U.stop(e,()=>{U.pulsate(e)}),O&&O(e),x&&e.target===e.currentTarget&&X()&&e.key===` `&&!e.defaultPrevented&&x(e)}),Z=l;Z===`button`&&(B.href||B.to)&&(Z=h);let Q={};if(Z===`button`){let e=!!B.formAction;Q.type=z===void 0&&!e?`button`:z,Q.disabled=u}else !B.href&&!B.to&&(Q.role=`button`),u&&(Q[`aria-disabled`]=u);let pe=_(t,V),$={...n,centerRipple:i,component:l,disabled:u,disableRipple:d,disableTouchRipple:f,focusRipple:p,tabIndex:I,focusVisible:q},me=G($);return(0,N.jsxs)(K,{as:Z,className:o(me.root,c),ownerState:$,onBlur:le,onClick:x,onContextMenu:ne,onFocus:ue,onKeyDown:de,onKeyUp:fe,onMouseDown:te,onMouseLeave:ae,onMouseUp:ie,onDragLeave:re,onTouchEnd:se,onTouchMove:ce,onTouchStart:oe,ref:pe,tabIndex:u?-1:I,type:z,...Q,...B,children:[a,ee?(0,N.jsx)(H,{ref:W,center:i,...L}):null]})});function J(e,t,n,r=!1){return v(i=>(n&&n(i),r||e[t](i),!0))}export{v as i,M as n,y as r,q as t};