import{g as R,a as j,s as c,b9 as v,r as M,u as N,T as i,j as r,c as T,b as $}from"./index-D0ffJibv.js";function P(a){return j("MuiCardHeader",a)}const d=R("MuiCardHeader",["root","avatar","action","content","title","subheader"]),w=a=>{const{classes:e}=a;return $({root:["root"],avatar:["avatar"],action:["action"],content:["content"],title:["title"],subheader:["subheader"]},P,e)},A=c("div",{name:"MuiCardHeader",slot:"Root",overridesResolver:(a,e)=>[{[`& .${d.title}`]:e.title},{[`& .${d.subheader}`]:e.subheader},e.root]})({display:"flex",alignItems:"center",padding:16}),U=c("div",{name:"MuiCardHeader",slot:"Avatar",overridesResolver:(a,e)=>e.avatar})({display:"flex",flex:"0 0 auto",marginRight:16}),S=c("div",{name:"MuiCardHeader",slot:"Action",overridesResolver:(a,e)=>e.action})({flex:"0 0 auto",alignSelf:"flex-start",marginTop:-4,marginRight:-8,marginBottom:-4}),k=c("div",{name:"MuiCardHeader",slot:"Content",overridesResolver:(a,e)=>e.content})({flex:"1 1 auto",[`.${v.root}:where(& .${d.title})`]:{display:"block"},[`.${v.root}:where(& .${d.subheader})`]:{display:"block"}}),B=M.forwardRef(function(e,u){const h=N({props:e,name:"MuiCardHeader"}),{action:m,avatar:l,className:y,component:C="div",disableTypography:p=!1,subheader:b,subheaderTypographyProps:g,title:x,titleTypographyProps:f,...H}=h,s={...h,component:C,disableTypography:p},t=w(s);let o=x;o!=null&&o.type!==i&&!p&&(o=r.jsx(i,{variant:l?"body2":"h5",className:t.title,component:"span",...f,children:o}));let n=b;return n!=null&&n.type!==i&&!p&&(n=r.jsx(i,{variant:l?"body2":"body1",className:t.subheader,color:"textSecondary",component:"span",...g,children:n})),r.jsxs(A,{className:T(t.root,y),as:C,ref:u,ownerState:s,...H,children:[l&&r.jsx(U,{className:t.avatar,ownerState:s,children:l}),r.jsxs(k,{className:t.content,ownerState:s,children:[o,n]}),m&&r.jsx(S,{className:t.action,ownerState:s,children:m})]})});export{B as C};