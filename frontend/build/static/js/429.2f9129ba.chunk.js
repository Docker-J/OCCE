(self.webpackChunkblog=self.webpackChunkblog||[]).push([[429],{1522:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>W});var l=n(2791),i=n(1243),a=n(3400),s=n(3239),o=n(9877),d=n(3543),r=n(9658),c=n(2017),u=n(3385),h=n(9013),p=n(4518),x=n(1652),f=n(9555),g=n(2170),j=n(6386),m=n(184);function w(e){const{setIsDatePickerOpen:t,id:n,disabled:l,value:i,InputProps:{ref:a}={},inputProps:{"aria-label":s}={}}=e;return(0,m.jsx)(p.Z,{variant:"outlined",size:"large",id:n,disabled:l,ref:a,"aria-label":s,onClick:()=>null===t||void 0===t?void 0:t((e=>!e)),children:(0,j.Z)(i,"MM/dd/yyyy")})}const v=function(e){const[t,n]=(0,l.useState)(!1);return(0,m.jsx)(x._,{dateAdapter:g.H,children:(0,m.jsx)(f.M,{slots:{field:w,...e.slots},slotProps:{field:{setIsDatePickerOpen:n},popper:{placement:"bottom"}},...e,open:t,onClose:()=>n(!1),shouldDisableDate:e=>0!==e.getDay(),disableHighlightToday:!0})})};var b=n(7928),D=n(173),Z=n(1789),k=n(9898),C=n(6695);n(7549);Z.default.GlobalWorkerOptions.workerSrc="//cdnjs.cloudflare.com/ajax/libs/pdf.js/".concat(Z.default.version,"/pdf.worker.min.js");const y=function(e){const[t,n]=(0,l.useState)(null),[i,a]=(0,l.useState)(1),[o,d]=(0,l.useState)(1);function r(e){a((t=>t+e))}(0,l.useEffect)((()=>{a(1)}),[e.file]);const c=D.tq?document.documentElement.clientWidth:window.innerWidth,u=D.tq?document.documentElement.clientHeight:window.innerHeight,[h,x]=(0,l.useState)({width:u/c>=1.6?c-30:null,height:u/c<1.6?u:null}),f=()=>{const e=D.tq?document.documentElement.clientWidth:window.innerWidth,t=D.tq?document.documentElement.clientHeight:window.innerHeight;x({width:t/e>=1.6?e-30:null,height:t/e<1.6?t:null})};return(0,l.useEffect)((()=>(window.addEventListener("resize",f),()=>{window.removeEventListener("resize",f)})),[h]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{style:{marginTop:"1em",marginBottom:"1em"},children:(0,m.jsxs)(b.Z,{id:"scaleButton",children:[(0,m.jsx)(p.Z,{onClick:()=>{d((e=>e+.2))},variant:"outlined",children:"+"}),(0,m.jsx)(p.Z,{onClick:()=>{1!==o&&d((e=>e-.2))},variant:"outlined",disabled:o<=1,children:"-"})]})}),(0,m.jsx)(k.Z,{file:e.file,onLoadSuccess:function(e){let{numPages:t}=e;n(t)},loading:(0,m.jsx)(s.Z,{}),children:(0,m.jsx)(C.Z,{renderTextLayer:!1,className:"page",scale:o,height:h.height,width:h.width,pageNumber:i})}),(0,m.jsxs)("p",{style:{color:"black"},children:["Page ",i||(t?1:"--")," of ",t||"--"]}),(0,m.jsxs)(b.Z,{id:"pageButton",children:[(0,m.jsx)(p.Z,{type:"button",variant:"outlined",disabled:i<=1,onClick:function(){r(-1)},children:"Previous"}),(0,m.jsx)(p.Z,{type:"button",variant:"outlined",disabled:i>=t,onClick:function(){r(1)},children:"Next"})]})]})};var S=n(8447),E=n(4554);const F={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"50vw",maxWidth:"1500px",height:"50vh",bgcolor:"#ffffff",border:"0.1px solid #f57c00",boxShadow:24,p:2},B=e=>{const[t,n]=(0,l.useState)(),[i,a]=(0,l.useState)(null),s=(0,l.useRef)(null);return(0,l.useEffect)((()=>{(()=>{const e=new Date;e.setDate(e.getDate()+(-1-e.getDay()+7)%7+1),n(e)})()}),[]),(0,m.jsx)(S.Z,{open:e.open,onClose:e.onClose,children:(0,m.jsxs)(E.Z,{sx:F,bgcolor:"white",children:[(0,m.jsx)("h2",{children:"Choose Date"}),(0,m.jsx)(v,{value:t,minDate:new Date("2022/04/03"),onChange:n}),(0,m.jsx)("h2",{children:"Choose File"}),(0,m.jsx)("input",{type:"file",ref:s,id:"bulletin",name:"theFile",onChange:e=>{let{target:t}=e;a(t.files[0])},accept:"application/pdf"}),(0,m.jsxs)("p",{children:[(0,m.jsx)(p.Z,{onClick:()=>e.onModalUpload(i,t),children:"Upload"}),(0,m.jsx)(p.Z,{onClick:e.onClose,children:"Close"})]})]})})};var M=n(7689),P=n(8351);const W=()=>{const e=(0,M.s0)();let t=(0,M.xW)();const{maxDate:n,queryDate:p}=(0,M.f_)(),x=new Date("2022/04/03"),[f,g]=(0,l.useState)(null),[j,w]=(0,l.useState)(p),[b,D]=(0,l.useState)(!1),[Z,k]=(0,l.useState)(!1),C=(e,t)=>{"clickaway"!==t&&k(!1)},S=(0,l.useCallback)((async()=>{try{const e=await i.Z.get("/api/WeeklyUpdate/GetBulletin",{params:{date:j.toLocaleDateString("sv")}});g(e.data)}catch(e){}}),[j]),E=()=>{D(!1)},F=(e,t)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=function(){t(null,n.result)},n.onerror=function(e){t(e,null)}};function W(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}return(0,l.useEffect)((()=>{null!=j&&(S(),e("/weeklyupdate/"+j.toLocaleDateString("sv").replace(/-/g,"")))}),[j,S,e]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("h1",{children:"\uc8fc\ubcf4"}),f?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a.Z,{id:"previousBulletin",onClick:()=>{w(new Date(j.getFullYear(),j.getMonth(),j.getDate()-7))},disabled:W(j,x),children:(0,m.jsx)(c.Z,{})}),(0,m.jsx)(v,{value:j,minDate:x,maxDate:n,onChange:w}),(0,m.jsx)(a.Z,{id:"nextBulletin",onClick:()=>{w(new Date(j.getFullYear(),j.getMonth(),j.getDate()+7))},disabled:W(j,n),children:(0,m.jsx)(u.Z,{})}),(0,m.jsx)(y,{file:f})]}):(0,m.jsx)(s.Z,{}),(0,m.jsxs)(P.Z,{children:[(0,m.jsxs)(o.Z,{id:"uploadBulletinButton",variant:"extended",onClick:()=>D(!0),children:[(0,m.jsx)(h.Z,{sx:{mr:1}}),"Upload"]}),(0,m.jsx)(B,{open:b,onModalUpload:async(e,n)=>{F(e,((e,l)=>{i.Z.put("/api/WeeklyUpdate/PostBulletin/",{file:l,date:n.toLocaleDateString("sv")}).then((e=>{console.log(e.data),w(n),t.revalidate(),E(),k(!0)}))}))},onClose:E}),(0,m.jsx)(d.Z,{open:Z,autoHideDuration:8e3,onClose:C,children:(0,m.jsx)(r.Z,{severity:"success",onClose:C,children:"Uploaded Succesfully!"})})]})]})}},8351:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});var l=n(9434);const i=e=>(0,l.v9)((e=>e.authToken.admin))&&e.children},3414:()=>{},172:()=>{},2001:()=>{},3779:()=>{},6558:()=>{},2258:()=>{}}]);
//# sourceMappingURL=429.2f9129ba.chunk.js.map