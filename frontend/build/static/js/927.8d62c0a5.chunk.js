"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[927],{5927:(e,t,o)=>{o.r(t),o.d(t,{default:()=>T});var s=o(2791),i=o(5193),n=o(890),l=o(3239),a=o(2763),r=o(9877),c=o(2419),d=o(1243),h=o(7888),g=o(1087),p=o(184);const x=e=>{let{posts:t}=e;return t.map((e=>(0,p.jsx)(h.Z,{component:g.rU,to:e.ID,children:(0,p.jsx)("img",{src:"https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/".concat(e.Cover,"/thumbnail"),alt:"thumbnail",loading:"lazy"})},e.ID)))},u=(0,s.memo)(x);var m=o(8447),f=o(4554),v=o(4518),j=o(3543),b=o(9658),w=o(7831),y=o(1172),Z=o.n(y),C=o(8141),k=o(5287),S=o(6401),I=o(3400),R=o(5130),O=o(1067),D=o(8422);const E=e=>{let{id:t,image:o,index:i,movePhoto:n,removeImage:l}=e;const a=(0,s.useRef)(null),[{isDragging:r},c]=(0,O.c)({type:"previewcard",item:()=>({id:t,index:i}),collect:e=>({isDragging:e.isDragging()})}),d=r?0:1,[{handlerId:h},g]=(0,D.L)({accept:"previewcard",collect:e=>({handlerId:e.getHandlerId()}),hover(e,t){var o;if(!a.current)return;const s=e.index,l=i;if(s===l)return;const r=null===(o=a.current)||void 0===o?void 0:o.getBoundingClientRect(),c=(r.left-r.right)/2,d=t.getClientOffset().x-r.left;s<l&&d<c||s>l&&d<c||(n(s,l),e.index=l)}});return c(g(a)),(0,p.jsxs)("div",{ref:a,style:{position:"relative",display:"inline-flex",borderRadius:2,border:"1px solid #eaeaea",marginBottom:8,marginRight:8,width:"calc(90%/3)",aspectRatio:"1/1",boxSizing:"border-box",cursor:"move",opacity:d,overflow:"hidden"},children:[(0,p.jsx)("img",{src:o,alt:"preview",style:{display:"block",width:"auto",height:"100%"}}),(0,p.jsx)(I.Z,{sx:{position:"absolute",display:"block",zIndex:99,top:0,right:0,backgroundColor:"orange"},onClick:()=>l(i),children:(0,p.jsx)(R.Z,{sx:{color:"black"}})})]})},L={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"80vw",height:"80vh",maxWidth:"1300px",bgcolor:"#ffffff",boxShadow:24,borderRadius:"0.5em",p:1,py:5,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},N=e=>{let{openModal:t,setOpenModal:o}=e;const i=()=>{x(),o(!1)},[a,r]=(0,s.useState)([]),[c,h]=(0,s.useState)([]),g=e=>{URL.revokeObjectURL(c[e]),r((t=>Z()(t,{$splice:[[e,1]]}))),h((t=>Z()(t,{$splice:[[e,1]]})))},x=()=>{c.forEach((e=>URL.revokeObjectURL(e))),r([]),h([])},u=(0,s.useCallback)(((e,t)=>{r((o=>Z()(o,{$splice:[[e,1],[t,0,o[e]]]}))),h((o=>Z()(o,{$splice:[[e,1],[t,0,o[e]]]})))}),[]),{getRootProps:y,getInputProps:I}=(0,w.uI)({accept:{"image/*":[]},onDrop:e=>{var t;t=e,r((e=>[...e,...t])),t.forEach((e=>{h((t=>Z()(t,{$push:[URL.createObjectURL(e)]})))}))},noDragEventsBubbling:!0}),R=(0,s.useCallback)(((e,t)=>(0,p.jsx)(E,{index:t,image:e,movePhoto:u,removeImage:g},t)),[]),[O,D]=(0,s.useState)(!1),[N,P]=(0,s.useState)(!1),U=(e,t)=>{"clickaway"!==t&&P(!1)};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(m.Z,{open:t,onClose:i,children:(0,p.jsx)(f.Z,{sx:L,bgcolor:"white",children:O?(0,p.jsx)(l.Z,{}):(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(k.W,{backend:S.PD,children:(0,p.jsx)("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap",alignContent:"flex-start",justifyContent:"space-between",margin:"10pt",width:"95%",height:"75%",overflowX:"auto"},children:c.map(((e,t)=>R(e,t)))})}),(0,p.jsxs)("div",{style:{width:"95%",height:"20%",border:"1pt dotted #f57c00",borderRadius:"1em",overflowY:"auto"},...y(),children:[(0,p.jsx)("input",{...I()}),(0,p.jsx)(f.Z,{sx:{position:"relative",height:"100%",widht:"100%"},children:(0,p.jsxs)("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},children:[(0,p.jsx)(C.Z,{fontSize:"large",color:"primary"}),(0,p.jsx)(n.Z,{children:"Click or Drag Files to here"})]})})]}),(0,p.jsxs)("div",{style:{display:"flex",marginTop:"2em"},children:[(0,p.jsx)(v.Z,{variant:"outlined",disabled:a.length<=0,onClick:async()=>{const e=new FormData;a.forEach((t=>{e.append("images",t)}));try{D(!0);await d.Z.post("/api/meditationON/uploadImage",e,{headers:{"Content-Type":"multipart/form-data"}});P(!0),D(!1),i()}catch(t){D(!1),console.log(t)}},children:"Submit"}),(0,p.jsx)(v.Z,{variant:"outlined",onClick:x,disabled:a.length<=0,children:"Clear All"}),(0,p.jsx)(v.Z,{variant:"outlined",onClick:i,children:"Close"})]})]})})}),(0,p.jsx)(j.Z,{open:N,autoHideDuration:8e3,onClose:U,children:(0,p.jsx)(b.Z,{severity:"success",onClose:U,children:"Uploaded Succesfully!"})})]})};var P=o(4771),U=(o(6527),o(8351));const M={backgroundImage:'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/MeditationON.webp")'},T=()=>{const e=(0,i.Z)("(min-width:1200px)"),[t,o]=(0,s.useState)([]),[h,g]=(0,s.useState)(!1),[x,m]=(0,s.useState)(!0),f=async()=>{console.log("test getPosts"),console.log(t);const e=await d.Z.get("/api/MeditationON/getPosts".concat(0===t.length?"":"?lastVisible=".concat(t.at(-1).ID,"&timeStamp=").concat(t.at(-1).Timestamp)));e.data.length>0?o((t=>[...t,...e.data])):g(!0)};(0,s.useEffect)((()=>{t.length%12!==0&&g(!0)}),[t]);(0,s.useEffect)((()=>(window.onpopstate=()=>{m(!0),console.log("test restore"),o(JSON.parse(sessionStorage.getItem("posts")))},m(!1),()=>{window.onpopstate=()=>{}})),[]),(0,s.useEffect)((()=>{x||f()}),[x]),(0,s.useEffect)((()=>()=>{sessionStorage.setItem("posts",JSON.stringify(t))}));const[v,j]=(0,s.useState)(!1),b=(0,s.useRef)();return(0,s.useEffect)((()=>{b.current&&!h&&t.length>=12&&setTimeout((()=>{const e=b.current.clientHeight,t=window.innerHeight-500;console.log("test content",e),console.log("test screen",t),e>100&&e<t&&f()}),500)}),[t]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("div",{className:"title",style:M,children:(0,p.jsx)("div",{className:"titleContent",children:(0,p.jsx)(n.Z,{variant:"h4",fontWeight:830,sx:{letterSpacing:"0.4em",pl:"0.4em",color:"white"},children:"\ubb35\uc0c1 ON"})})}),(0,p.jsx)("div",{style:{position:"absolute",width:"100%",maxWidth:"1500px",left:"50%",transform:"translateX(-50%)",marginTop:"1em"},children:t.length>0?(0,p.jsx)(P.Z,{dataLength:t.length,next:f,hasMore:!h,loader:(0,p.jsx)(l.Z,{}),scrollThreshold:1,style:{overflowY:"hidden"},children:(0,p.jsx)(a.Z,{ref:b,sx:{mx:"0.5rem"},cols:e?4:3,gap:2.5,children:(0,p.jsx)(u,{posts:t})})}):(0,p.jsx)(l.Z,{})}),(0,p.jsx)(U.Z,{children:(0,p.jsx)(r.Z,{variant:"primary",style:{position:"fixed",right:"2vw",bottom:"3vh"},onClick:()=>{j(!0)},children:(0,p.jsx)(c.Z,{})})}),(0,p.jsx)(N,{openModal:v,setOpenModal:j})]})}},8351:(e,t,o)=>{o.d(t,{Z:()=>i});var s=o(9434);const i=e=>(0,s.v9)((e=>e.authToken.admin))&&e.children},6527:()=>{}}]);
//# sourceMappingURL=927.8d62c0a5.chunk.js.map