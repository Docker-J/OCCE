import{i as R,b4 as j,a as w,g as E,b5 as P,b6 as S,s as v,d as n,m as b,H as F,r as N,u as T,j as f,c as U,b as I}from"./index-BRxhbGLV.js";var z=j();const W=R(z);function A(e){return w("MuiCircularProgress",e)}E("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const t=44,g=P`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,y=P`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`,K=typeof g!="string"?S`
        animation: ${g} 1.4s linear infinite;
      `:null,V=typeof y!="string"?S`
        animation: ${y} 1.4s ease-in-out infinite;
      `:null,q=e=>{const{classes:r,variant:s,color:a,disableShrink:c}=e,l={root:["root",s,`color${n(a)}`],svg:["svg"],circle:["circle",`circle${n(s)}`,c&&"circleDisableShrink"]};return I(l,A,r)},B=v("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:s}=e;return[r.root,r[s.variant],r[`color${n(s.color)}`]]}})(b(({theme:e})=>({display:"inline-block",variants:[{props:{variant:"determinate"},style:{transition:e.transitions.create("transform")}},{props:{variant:"indeterminate"},style:K||{animation:`${g} 1.4s linear infinite`}},...Object.entries(e.palette).filter(F()).map(([r])=>({props:{color:r},style:{color:(e.vars||e).palette[r].main}}))]}))),G=v("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,r)=>r.svg})({display:"block"}),H=v("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,r)=>{const{ownerState:s}=e;return[r.circle,r[`circle${n(s.variant)}`],s.disableShrink&&r.circleDisableShrink]}})(b(({theme:e})=>({stroke:"currentColor",variants:[{props:{variant:"determinate"},style:{transition:e.transitions.create("stroke-dashoffset")}},{props:{variant:"indeterminate"},style:{strokeDasharray:"80px, 200px",strokeDashoffset:0}},{props:({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink,style:V||{animation:`${y} 1.4s ease-in-out infinite`}}]}))),Z=N.forwardRef(function(r,s){const a=T({props:r,name:"MuiCircularProgress"}),{className:c,color:l="primary",disableShrink:$=!1,size:p=40,style:D,thickness:o=3.6,value:m=0,variant:h="indeterminate",...M}=a,i={...a,color:l,disableShrink:$,size:p,thickness:o,value:m,variant:h},u=q(i),d={},x={},k={};if(h==="determinate"){const C=2*Math.PI*((t-o)/2);d.strokeDasharray=C.toFixed(3),k["aria-valuenow"]=Math.round(m),d.strokeDashoffset=`${((100-m)/100*C).toFixed(3)}px`,x.transform="rotate(-90deg)"}return f.jsx(B,{className:U(u.root,c),style:{width:p,height:p,...x,...D},ownerState:i,ref:s,role:"progressbar",...k,...M,children:f.jsx(G,{className:u.svg,ownerState:i,viewBox:`${t/2} ${t/2} ${t} ${t}`,children:f.jsx(H,{className:u.circle,style:d,ownerState:i,cx:t,cy:t,r:(t-o)/2,fill:"none",strokeWidth:o})})})});export{Z as C,W as P};
