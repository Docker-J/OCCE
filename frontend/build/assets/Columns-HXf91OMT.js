import{q as c,t as m,v as d,w as p,x,j as e,T as s,r as u,A as g}from"./index-D0ffJibv.js";import{A as h}from"./Add-DaKmQVaf.js";import{C as j}from"./ColumnPostModal-DbhiYz_b.js";import{F as v,B as f}from"./ForumPostBoard-CaCcE0XZ.js";import{A as y,F as C}from"./AdminComponent-BY4SfafQ.js";import{F as w}from"./FullScreenLoading-gAJ1qPJs.js";import{C as F}from"./CircularProgress-C-x0Pocr.js";import"./ButtonDatePicker-DjBWPzF7.js";import"./useThemeProps-CxeQR4Qm.js";import"./getDate-CGzhIz2n.js";import"./index-DuWtxBdy.js";import"./index-CjQvKCDE.js";import"./Popper-kJfmeLJg.js";import"./ListItem-1Go5e1Bu.js";import"./PushPin-8T02UHiJ.js";import"./Card-0XlkzvdH.js";import"./Stack-KtSrEba7.js";const P={backgroundImage:'url("/img/News/Columns/Columns.webp")',backgroundPosition:"25% 65%"},H=()=>{let t=c();const a=m(),{state:o}=d(),[n]=p(),i=n.get("page"),{openModal:l}=x();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"title-wrapper",style:P,children:e.jsx("div",{className:"title",children:e.jsx(s,{variant:"h4",fontWeight:830,sx:{letterSpacing:"0.4em",pl:"0.4em",color:"white"},children:"목회칼럼"})})}),e.jsx("div",{className:"container-wrapper",children:e.jsxs("div",{className:"container",style:{maxWidth:"1200px"},children:[o==="loading"&&e.jsx("div",{style:{display:"flex",justifyContent:"center"},children:e.jsx(w,{})}),e.jsx(u.Suspense,{fallback:e.jsx("div",{style:{display:"flex",justifyContent:"center"},children:e.jsx(F,{})}),children:e.jsx(g,{resolve:a.announcementsData,errorElement:e.jsx("p",{children:"Error loading!"}),children:({data:r})=>r.announcements.length===0?e.jsx(s,{align:"center",children:"게시물이 존재하지 않습니다."}):e.jsxs(e.Fragment,{children:[e.jsx(v,{announcements:r.announcements}),e.jsx(f,{pages:Math.ceil(r.count/10),currentPage:i})]})})})]})}),e.jsx(y,{children:e.jsx(C,{style:{position:"fixed",right:"2vw",bottom:"3vh"},onClick:()=>l(j,{revalidator:t.revalidate,origTitle:"",origBody:""}),children:e.jsx(h,{})})})]})};export{H as default};