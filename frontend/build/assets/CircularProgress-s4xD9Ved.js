import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{t}from"./reactVendor-By8zZfk0.js";import{O as n}from"./ckeditor-DKI7H046.js";import{C as r,S as i,a,i as o,n as s,p as c,r as l,t as u,x as d}from"./createSimplePaletteValueFilter-JVTA6G-l.js";import{c as f,s as p}from"./ButtonBase-ikHaXqWz.js";import{i as m,s as h}from"./Paper-CwmgGJR9.js";var g=e(n(),1);function _(e){return i(`MuiCircularProgress`,e)}d(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDisableShrink`]);var v=t(),y=44,b=f`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,x=f`
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
`,S=typeof b==`string`?null:p`
        animation: ${b} 1.4s linear infinite;
      `,C=typeof x==`string`?null:p`
        animation: ${x} 1.4s ease-in-out infinite;
      `,w=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e;return c({root:[`root`,n,`color${s(r)}`],svg:[`svg`],track:[`track`],circle:[`circle`,i&&`circleDisableShrink`]},_,t)},T=a(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${s(n.color)}`]]}})(o(({theme:e})=>{let t=m(e,{animation:`none`});return{display:`inline-block`,variants:[{props:{variant:`determinate`},style:{...h(e,`transform`)}},{props:{variant:`indeterminate`},style:S||{animation:`${b} 1.4s linear infinite`}},...t?[{props:{variant:`indeterminate`},style:t}]:[],...Object.entries(e.palette).filter(u()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}})),E=a(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),D=a(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,n.disableShrink&&t.circleDisableShrink]}})(o(({theme:e})=>{let t=m(e,{animation:`none`});return{stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{...h(e,`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:C||{animation:`${x} 1.4s ease-in-out infinite`}},...t?[{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:t}]:[]]}})),O=a(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(o(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),k=g.forwardRef(function(e,t){let n=l({props:e,name:`MuiCircularProgress`}),{className:i,color:a=`primary`,disableShrink:o=!1,enableTrackSlot:s=!1,min:c,max:u,size:d=40,style:f,thickness:p=3.6,value:m=n.min??0,variant:h=`indeterminate`,...g}=n,_=c??0,b=u??100,x={...n,color:a,disableShrink:o,size:d,thickness:p,value:m,variant:h,enableTrackSlot:s},S=w(x),C={},k={},A={};if(h===`determinate`){let e=2*Math.PI*((y-p)/2),t=b-_;C.strokeDasharray=e.toFixed(3),C.strokeDashoffset=t>0?`${((b-m)/t*e).toFixed(3)}px`:`${e.toFixed(3)}px`,k.transform=`rotate(-90deg)`,A[`aria-valuenow`]=m,A[`aria-valuemin`]=_,A[`aria-valuemax`]=b}return(0,v.jsx)(T,{className:r(S.root,i),style:{width:d,height:d,...k,...f},ownerState:x,ref:t,role:`progressbar`,...A,...g,children:(0,v.jsxs)(E,{className:S.svg,ownerState:x,viewBox:`${y/2} ${y/2} ${y} ${y}`,children:[s?(0,v.jsx)(O,{className:S.track,ownerState:x,cx:y,cy:y,r:(y-p)/2,fill:`none`,strokeWidth:p,"aria-hidden":`true`}):null,(0,v.jsx)(D,{className:S.circle,style:C,ownerState:x,cx:y,cy:y,r:(y-p)/2,fill:`none`,strokeWidth:p})]})})});export{k as t};