"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[99],{9596:(e,t,n)=>{n.d(t,{A:()=>x});var i=n(5043),s=n(2518),r=n(8390),l=n(3728),a=n(1119),o=n(9432),d=n(579);const c=e=>{const{setIsDatePickerOpen:t,id:n,disabled:i,value:r,InputProps:{ref:l}={},inputProps:{"aria-label":a}={}}=e;return(0,d.jsx)(s.A,{variant:"outlined",size:"large",id:n,disabled:i,ref:l,"aria-label":a,onClick:()=>null===t||void 0===t?void 0:t((e=>!e)),children:(0,o.GP)(r,"yyyy/MM/dd")})},x=e=>{const[t,n]=(0,i.useState)(!1),{disableDate:s,...o}=e;return(0,d.jsx)(r.$,{dateAdapter:a.h,children:(0,d.jsx)(l.l,{slots:{field:c},slotProps:{field:{setIsDatePickerOpen:n},popper:{placement:"bottom"}},...o,open:t,onClose:()=>n(!1),shouldDisableDate:e=>s&&s(e),disableHighlightToday:!0})})}},301:(e,t,n)=>{n.d(t,{A:()=>l});var i=n(9135),s=n(3216),r=n(579);const l=e=>{let{pages:t,currentPage:n}=e;const l=(0,s.Zp)();return(0,r.jsx)(i.A,{className:"pagination",count:0===t?1:t,page:Number(n),variant:"outlined",color:"primary",sx:{margin:"auto",mt:4},onChange:(e,t)=>l(`?page=${t}`)})}},16:(e,t,n)=>{n.d(t,{A:()=>p});var i=n(1637),s=n(7811),r=n(2518),l=n(2150),a=n(5043),o=n(909),d=n(8081),c=n(4889),x=n(9596),h=n(579);const p=e=>{let{isOpen:t,onClose:n,revalidator:p,id:m,origTitle:u,origBody:g}=e;const{openSnackbar:j}=(0,d.A)(),[v,y]=(0,a.useState)(!1),[A,f]=(0,a.useState)(u),[b,w]=(0,a.useState)(new Date),[k,C]=(0,a.useState)(g);(0,a.useEffect)((()=>{f(u),C(g)}),[u,g]);const D=()=>{f(u),C(g),n()};return(0,h.jsx)(c.A,{isOpen:t,onClose:D,maxWidth:"1300px",maxHeight:"90svh",children:v?(0,h.jsx)(i.A,{}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)("div",{style:{width:"100%"},children:[(0,h.jsx)(s.A,{id:"filled-basic",label:"Title",variant:"outlined",value:A,sx:{width:"85%"},onChange:e=>f(e.target.value),required:!0}),(0,h.jsx)(x.A,{sx:{width:"10%"},value:b,onChange:w})]}),(0,h.jsx)("div",{style:{height:"65svh",width:"100%",marginTop:"1em"},children:(0,h.jsx)(l.A,{body:k,getBody:C})}),(0,h.jsx)(r.A,{variant:"outlined",disabled:""===A.trim()||""===k.trim(),onClick:async()=>{y(!0);try{await(0,o.Hn)(m,A,k,b),p(),j("success","The column is successfully posted!"),D()}catch(e){console.log(e),j("error","Error Occured. Please contact to the administrator.")}finally{y(!1)}},fullWidth:!0,sx:{marginTop:"1.5em"},children:"Post"})]})})}},4652:(e,t,n)=>{n.r(t),n.d(t,{default:()=>C});var i=n(3216),s=n(5475),r=n(4496),l=n(1637),a=n(4010),o=n(141),d=n(16),c=n(2110),x=n(8911),h=n(9336),p=n(7353),m=n(9432),u=n(894),g=n(1418),j=n(579);const v=e=>{let{announcements:t}=e;function n(e){let t=(new DOMParser).parseFromString(e,"text/html");return Array.from(t.body.childNodes).filter((e=>e.nodeType===Node.TEXT_NODE||e.nodeType===Node.ELEMENT_NODE)).map((e=>e.textContent.trim())).join(" ")}return(0,j.jsx)("div",{style:{display:"flex",flexDirection:"column"},children:t.map(((e,i)=>(0,j.jsxs)("div",{children:[(0,j.jsxs)(c.A,{component:s.N_,to:e.id,color:"black",sx:{display:"flex",textDecoration:"none",px:2,py:0,my:1.8},children:[(0,j.jsxs)(x.A,{direction:"column",sx:{justifyContent:"center",width:"40px",minWidth:"40px"},children:[(0,j.jsx)(r.A,{variant:"body2",whiteSpace:"nowrap",children:(0,m.GP)(new Date(e.timestamp),"MMM dd")}),(0,j.jsx)(r.A,{variant:"body2",children:(0,m.GP)(new Date(e.timestamp),"yyyy")})]}),(0,j.jsx)(h.A,{orientation:"vertical",flexItem:!0,sx:{mx:2}}),(0,j.jsxs)(p.A,{sx:{py:1.5,flexGrow:1,overflow:"hidden"},children:[(0,j.jsx)(x.A,{direction:"row",alignItems:"center",children:(0,j.jsx)(r.A,{variant:"h6",sx:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:e.title})}),(0,j.jsxs)(x.A,{direction:"row",alignItems:"center",children:[(0,j.jsx)("p",{style:{fontSize:"0.9em",lineHeight:"1.2em",height:"2.4em",margin:0,marginTop:12,display:"-webkit-box",WebkitBoxOrient:"vertical",WebkitLineClamp:"2",width:"100%",wordBreak:"break-all",overflow:"hidden",textOverflow:"ellipsis"},children:n(e.body)}),null!==e.images?(0,j.jsx)(g.A,{}):null,e.video?(0,j.jsx)(u.A,{}):null]})]})]}),i!==t.length-1&&(0,j.jsx)(h.A,{variant:"middle"})]},e.id)))})};var y=n(301),A=(n(1843),n(6453)),f=n(9448),b=n(5043),w=n(1203);const k={backgroundImage:'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)),  url("/img/News/Columns/Columns.jpg")',backgroundPosition:"25% 65%"},C=()=>{let e=(0,i.vL)();const t=(0,i.LG)(),{state:n}=(0,i.cq)(),[c]=(0,s.ok)(),x=c.get("page"),{openModal:h}=(0,A.A)();return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)("div",{className:"title-wrapper",style:k,children:(0,j.jsx)("div",{className:"title",children:(0,j.jsx)(r.A,{variant:"h4",fontWeight:830,sx:{letterSpacing:"0.4em",pl:"0.4em",color:"white"},children:"\ubaa9\ud68c\uce7c\ub7fc"})})}),(0,j.jsx)("div",{className:"container-wrapper",children:(0,j.jsxs)("div",{className:"container",style:{maxWidth:"1200px"},children:["loading"===n&&(0,j.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:(0,j.jsx)(w.A,{})}),(0,j.jsx)(b.Suspense,{fallback:(0,j.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:(0,j.jsx)(l.A,{})}),children:(0,j.jsx)(i.jD,{resolve:t.announcementsData,errorElement:(0,j.jsx)("p",{children:"Error loading!"}),children:e=>{let{data:t}=e;return 0===t.announcements.length?(0,j.jsx)(r.A,{align:"center",children:"\uac8c\uc2dc\ubb3c\uc774 \uc874\uc7ac\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."}):(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(v,{announcements:t.announcements}),(0,j.jsx)(y.A,{pages:Math.ceil(t.count/10),currentPage:x})]})}})})]})}),(0,j.jsx)(f.A,{children:(0,j.jsx)(a.A,{style:{position:"fixed",right:"2vw",bottom:"3vh"},onClick:()=>h(d.A,{revalidator:e.revalidate,origTitle:"",origBody:""}),children:(0,j.jsx)(o.A,{})})})]})}}}]);
//# sourceMappingURL=99.5a28ea0b.chunk.js.map