import{a as e}from"./chunk-BEqpzyXh.js";import{t}from"./react-CFRkDy7n.js";import{I as n,L as r,N as i,T as a,X as o,Z as s,i as c,n as l,r as u,s as d,t as f,w as p}from"./createSimplePaletteValueFilter-xRUpZy8D.js";function m(e){return a(`MuiCircularProgress`,e)}p(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDeterminate`,`circleIndeterminate`,`circleDisableShrink`]);var h=e(t()),g=i(),_=44,v=r`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,y=r`
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
`,b=typeof v==`string`?null:n`
        animation: ${v} 1.4s linear infinite;
      `,x=typeof y==`string`?null:n`
        animation: ${y} 1.4s ease-in-out infinite;
      `,S=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e;return o({root:[`root`,n,`color${l(r)}`],svg:[`svg`],track:[`track`],circle:[`circle`,`circle${l(n)}`,i&&`circleDisableShrink`]},m,t)},C=d(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${l(n.color)}`]]}})(c(({theme:e})=>({display:`inline-block`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`transform`)}},{props:{variant:`indeterminate`},style:b||{animation:`${v} 1.4s linear infinite`}},...Object.entries(e.palette).filter(f()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}))),w=d(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),T=d(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,t[`circle${l(n.variant)}`],n.disableShrink&&t.circleDisableShrink]}})(c(({theme:e})=>({stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:x||{animation:`${y} 1.4s ease-in-out infinite`}}]}))),E=d(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(c(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),D=h.forwardRef(function(e,t){let n=u({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:a=!1,enableTrackSlot:o=!1,size:c=40,style:l,thickness:d=3.6,value:f=0,variant:p=`indeterminate`,...m}=n,h={...n,color:i,disableShrink:a,size:c,thickness:d,value:f,variant:p,enableTrackSlot:o},v=S(h),y={},b={},x={};if(p===`determinate`){let e=2*Math.PI*((_-d)/2);y.strokeDasharray=e.toFixed(3),x[`aria-valuenow`]=Math.round(f),y.strokeDashoffset=`${((100-f)/100*e).toFixed(3)}px`,b.transform=`rotate(-90deg)`}return(0,g.jsx)(C,{className:s(v.root,r),style:{width:c,height:c,...b,...l},ownerState:h,ref:t,role:`progressbar`,...x,...m,children:(0,g.jsxs)(w,{className:v.svg,ownerState:h,viewBox:`${_/2} ${_/2} ${_} ${_}`,children:[o?(0,g.jsx)(E,{className:v.track,ownerState:h,cx:_,cy:_,r:(_-d)/2,fill:`none`,strokeWidth:d,"aria-hidden":`true`}):null,(0,g.jsx)(T,{className:v.circle,style:y,ownerState:h,cx:_,cy:_,r:(_-d)/2,fill:`none`,strokeWidth:d})]})})});export{D as t};