"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[474],{4474:function(n,t,e){e.r(t),e.d(t,{default:function(){return I}});var i=e(4165),r=e(5861),o=e(9439),s=e(2791),a=e(1087),c=e(9281),u=e(5527),d=e(9836),l=e(6890),h=e(5855),f=e(3994),x=e(3382),p=e(3239),Z=e(7246),j=e(9877),m=e(3590),v=e(4554),b=e(2419),g=e(6321),y=e(7451),w=e(8641),C=e(4518),S=e(8923),k=e.n(S),E=e(7551),B=e(184),D=function(n){var t=n.getBody;return(0,B.jsx)("div",{style:{maxWidth:"1500px",alignItems:"center"},children:(0,B.jsx)(E.CKEditor,{editor:k(),data:"<p>Hello from CKEditor 5!</p>",onReady:function(n){console.log("Editor is ready to use!",n)},onChange:function(n,e){var i=e.getData();t(i)}})})},A=function(n){var t=(0,s.useState)(""),e=(0,o.Z)(t,2),a=e[0],c=e[1],u=(0,s.useState)(""),d=(0,o.Z)(u,2),l=d[0],h=d[1],f=(0,s.useState)(!1),x=(0,o.Z)(f,2),p=x[0],Z=x[1];function j(){return(j=(0,r.Z)((0,i.Z)().mark((function n(){return(0,i.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,(0,g.ET)((0,g.hJ)(y.db,"Announcement"),{title:a,body:l,date:(0,g.Bt)()});case 2:case"end":return n.stop()}}),n)})))).apply(this,arguments)}return(0,s.useEffect)((function(){Z(""===a.trim()||""===l.trim())}),[{title:a,body:l}]),(0,B.jsxs)("div",{children:[(0,B.jsx)(w.Z,{id:"filled-basic",label:"Title",variant:"outlined",onChange:function(n){return c(n.target.value)}}),(0,B.jsx)(D,{body:l,getBody:function(n){h(n)}}),(0,B.jsx)(C.Z,{variant:"outlined",disabled:p,onClick:function(){return j.apply(this,arguments)},children:"Post"}),(0,B.jsx)(C.Z,{variant:"outlined",onClick:n.handleClose,children:"Cancel"})]})},I=function(){var n=(0,s.useState)(""),t=(0,o.Z)(n,2),e=(t[0],t[1],(0,s.useState)(1)),w=(0,o.Z)(e,2),C=w[0],S=w[1],k=(0,s.useState)(null),E=(0,o.Z)(k,2),D=E[0],I=E[1],J=(0,s.useState)(0),N=(0,o.Z)(J,2),P=N[0],T=N[1],L=(0,s.useState)(0),M=(0,o.Z)(L,2),U=(M[0],M[1],(0,s.useState)(0)),W=(0,o.Z)(U,2),K=W[0],O=W[1],Q=(0,s.useState)(!1),X=(0,o.Z)(Q,2),F=X[0],H=X[1],R=D&&D.docs[D.docs.length-1],q=function(){H(!1)};function z(){return z=(0,r.Z)((0,i.Z)().mark((function n(){var t,e;return(0,i.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,(0,g.QT)((0,g.JU)(y.db,"Misc","Announcements"));case 2:return t=n.sent,S(t.data().posts),n.next=6,(0,g.PL)((0,g.IO)((0,g.hJ)(y.db,"Announcement"),(0,g.Xo)("date","desc"),(0,g.b9)(10)));case 6:e=n.sent,I(e);case 8:case"end":return n.stop()}}),n)}))),z.apply(this,arguments)}function G(){return(G=(0,r.Z)((0,i.Z)().mark((function n(){var t;return(0,i.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,(0,g.PL)((0,g.IO)((0,g.hJ)(y.db,"Announcement"),(0,g.Xo)("date","desc"),(0,g.TQ)(R),(0,g.b9)(10)));case 2:t=n.sent,I(t);case 4:case"end":return n.stop()}}),n)})))).apply(this,arguments)}(0,s.useEffect)((function(){!function(){z.apply(this,arguments)}()}),[]),(0,s.useEffect)((function(){!function(){G.apply(this,arguments)}()}),[K]),(0,s.useEffect)((function(){null!==D&&T(C%10!==0?Math.floor(C/10+1):Math.floor(C/10))}),[D]);return(0,B.jsxs)(B.Fragment,{children:[(0,B.jsxs)("div",{className:"board",style:{width:"100%",maxWidth:"1500px"},children:[(0,B.jsx)("h1",{children:"\uacf5\uc9c0\uc0ac\ud56d"}),(0,B.jsxs)("div",{children:[(0,B.jsx)(c.Z,{className:"table",component:u.Z,sx:{width:"85%"},children:(0,B.jsxs)(d.Z,{children:[(0,B.jsx)(l.Z,{children:(0,B.jsxs)(h.Z,{children:[(0,B.jsx)(f.Z,{align:"center",width:"80%",children:"\uc81c\ubaa9"}),(0,B.jsx)(f.Z,{align:"center",children:" \uc791\uc131\uc77c "})]})}),(0,B.jsx)(x.Z,{children:D?D.docs.map((function(n){return(0,B.jsxs)(h.Z,{component:a.rU,to:"/announcements/announcement?docID="+n.id,sx:{textDecoration:"none"},children:[(0,B.jsx)(f.Z,{children:n.data().title}),(0,B.jsx)(f.Z,{align:"right",children:n.data().date.toDate().toLocaleDateString("en-US")})]},n.id)})):(0,B.jsx)(h.Z,{children:(0,B.jsx)(p.Z,{})})})]})}),(0,B.jsx)(Z.Z,{className:"pagination",count:P,variant:"outlined",color:"primary",hideNextButton:1===P,hidePrevButton:P===C,onChange:function(n,t){return function(n,t){O(t)}(0,t)}})]})]}),(0,B.jsx)(j.Z,{variant:"primary",style:{position:"fixed",right:"2vw",bottom:"3vh"},onClick:function(){H(!0)},children:(0,B.jsx)(b.Z,{})}),(0,B.jsx)(m.Z,{open:F,onClose:q,children:(0,B.jsx)(v.Z,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"80vw",maxWidth:"1500px",height:"80vh",bgcolor:"#ffffff",border:"0.1px solid #f57c00",boxShadow:24,p:2},bgcolor:"white",children:(0,B.jsx)(A,{handleClose:q})})})]})}}}]);
//# sourceMappingURL=474.f37556e7.chunk.js.map