"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[841],{1784:(e,t,o)=>{var n=o(2411);t.c=void 0;var r=n(o(864)),i=o(2496);t.c=(0,r.default)((0,i.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"}),"Delete")},5676:(e,t,o)=>{var n=o(2411);t.c=void 0;var r=n(o(864)),i=o(2496);t.c=(0,r.default)((0,i.jsx)("path",{d:"M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z"}),"EditNote")},1828:(e,t,o)=>{var n=o(2411);t.c=void 0;var r=n(o(864)),i=o(2496);t.c=(0,r.default)((0,i.jsx)("path",{fillRule:"evenodd",d:"M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3"}),"PushPin")},1120:(e,t,o)=>{var n=o(2411);t.c=void 0;var r=n(o(864)),i=o(2496);t.c=(0,r.default)((0,i.jsx)("path",{d:"M14 4v5c0 1.12.37 2.16 1 3H9c.65-.86 1-1.9 1-3V4zm3-2H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3V4h1c.55 0 1-.45 1-1s-.45-1-1-1"}),"PushPinOutlined")},1088:(e,t,o)=>{o.d(t,{c:()=>T});var n=o(4312),r=o(5656),i=o(5072),a=o(9060),c=o(9736),s=o(1412),l=o(220),d=o(5832),p=o(3456),u=o(2556),h=o(99),m=o(3448);function v(e){return(0,m.cp)("MuiCircularProgress",e)}(0,h.c)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);var f,g,b,x,w=o(2496);const S=["className","color","disableShrink","size","style","thickness","value","variant"];let y,k,C,D;const R=44,I=(0,l.xZ)(y||(y=f||(f=(0,n.c)(["\n  0% {\n    transform: rotate(0deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n"])))),M=(0,l.xZ)(k||(k=g||(g=(0,n.c)(["\n  0% {\n    stroke-dasharray: 1px, 200px;\n    stroke-dashoffset: 0;\n  }\n\n  50% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -15px;\n  }\n\n  100% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -125px;\n  }\n"])))),E=(0,u.cp)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,t[o.variant],t["color".concat((0,d.c)(o.color))]]}})((e=>{let{ownerState:t,theme:o}=e;return(0,i.c)({display:"inline-block"},"determinate"===t.variant&&{transition:o.transitions.create("transform")},"inherit"!==t.color&&{color:(o.vars||o).palette[t.color].main})}),(e=>{let{ownerState:t}=e;return"indeterminate"===t.variant&&(0,l.gV)(C||(C=b||(b=(0,n.c)(["\n      animation: "," 1.4s linear infinite;\n    "]))),I)})),z=(0,u.cp)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,t)=>t.svg})({display:"block"}),P=(0,u.cp)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.circle,t["circle".concat((0,d.c)(o.variant))],o.disableShrink&&t.circleDisableShrink]}})((e=>{let{ownerState:t,theme:o}=e;return(0,i.c)({stroke:"currentColor"},"determinate"===t.variant&&{transition:o.transitions.create("stroke-dashoffset")},"indeterminate"===t.variant&&{strokeDasharray:"80px, 200px",strokeDashoffset:0})}),(e=>{let{ownerState:t}=e;return"indeterminate"===t.variant&&!t.disableShrink&&(0,l.gV)(D||(D=x||(x=(0,n.c)(["\n      animation: "," 1.4s ease-in-out infinite;\n    "]))),M)})),T=a.forwardRef((function(e,t){const o=(0,p.c)({props:e,name:"MuiCircularProgress"}),{className:n,color:a="primary",disableShrink:l=!1,size:u=40,style:h,thickness:m=3.6,value:f=0,variant:g="indeterminate"}=o,b=(0,r.c)(o,S),x=(0,i.c)({},o,{color:a,disableShrink:l,size:u,thickness:m,value:f,variant:g}),y=(e=>{const{classes:t,variant:o,color:n,disableShrink:r}=e,i={root:["root",o,"color".concat((0,d.c)(n))],svg:["svg"],circle:["circle","circle".concat((0,d.c)(o)),r&&"circleDisableShrink"]};return(0,s.c)(i,v,t)})(x),k={},C={},D={};if("determinate"===g){const e=2*Math.PI*((R-m)/2);k.strokeDasharray=e.toFixed(3),D["aria-valuenow"]=Math.round(f),k.strokeDashoffset="".concat(((100-f)/100*e).toFixed(3),"px"),C.transform="rotate(-90deg)"}return(0,w.jsx)(E,(0,i.c)({className:(0,c.c)(y.root,n),style:(0,i.c)({width:u,height:u},C,h),ownerState:x,ref:t,role:"progressbar"},D,b,{children:(0,w.jsx)(z,{className:y.svg,ownerState:x,viewBox:"".concat(22," ").concat(22," ").concat(R," ").concat(R),children:(0,w.jsx)(P,{className:y.circle,style:k,ownerState:x,cx:R,cy:R,r:(R-m)/2,fill:"none",strokeWidth:m})})}))}))},2112:(e,t,o)=>{o.d(t,{c:()=>g});var n=o(5656),r=o(5072),i=o(9060),a=o(9736),c=o(1412),s=o(6944),l=o(2556),d=o(3456),p=o(9456),u=o(2496);const h=["absolute","children","className","component","flexItem","light","orientation","role","textAlign","variant"],m=(0,l.cp)("div",{name:"MuiDivider",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,o.absolute&&t.absolute,t[o.variant],o.light&&t.light,"vertical"===o.orientation&&t.vertical,o.flexItem&&t.flexItem,o.children&&t.withChildren,o.children&&"vertical"===o.orientation&&t.withChildrenVertical,"right"===o.textAlign&&"vertical"!==o.orientation&&t.textAlignRight,"left"===o.textAlign&&"vertical"!==o.orientation&&t.textAlignLeft]}})((e=>{let{theme:t,ownerState:o}=e;return(0,r.c)({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:(t.vars||t).palette.divider,borderBottomWidth:"thin"},o.absolute&&{position:"absolute",bottom:0,left:0,width:"100%"},o.light&&{borderColor:t.vars?"rgba(".concat(t.vars.palette.dividerChannel," / 0.08)"):(0,s.W4)(t.palette.divider,.08)},"inset"===o.variant&&{marginLeft:72},"middle"===o.variant&&"horizontal"===o.orientation&&{marginLeft:t.spacing(2),marginRight:t.spacing(2)},"middle"===o.variant&&"vertical"===o.orientation&&{marginTop:t.spacing(1),marginBottom:t.spacing(1)},"vertical"===o.orientation&&{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"},o.flexItem&&{alignSelf:"stretch",height:"auto"})}),(e=>{let{ownerState:t}=e;return(0,r.c)({},t.children&&{display:"flex",whiteSpace:"nowrap",textAlign:"center",border:0,"&::before, &::after":{content:'""',alignSelf:"center"}})}),(e=>{let{theme:t,ownerState:o}=e;return(0,r.c)({},o.children&&"vertical"!==o.orientation&&{"&::before, &::after":{width:"100%",borderTop:"thin solid ".concat((t.vars||t).palette.divider)}})}),(e=>{let{theme:t,ownerState:o}=e;return(0,r.c)({},o.children&&"vertical"===o.orientation&&{flexDirection:"column","&::before, &::after":{height:"100%",borderLeft:"thin solid ".concat((t.vars||t).palette.divider)}})}),(e=>{let{ownerState:t}=e;return(0,r.c)({},"right"===t.textAlign&&"vertical"!==t.orientation&&{"&::before":{width:"90%"},"&::after":{width:"10%"}},"left"===t.textAlign&&"vertical"!==t.orientation&&{"&::before":{width:"10%"},"&::after":{width:"90%"}})})),v=(0,l.cp)("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.wrapper,"vertical"===o.orientation&&t.wrapperVertical]}})((e=>{let{theme:t,ownerState:o}=e;return(0,r.c)({display:"inline-block",paddingLeft:"calc(".concat(t.spacing(1)," * 1.2)"),paddingRight:"calc(".concat(t.spacing(1)," * 1.2)")},"vertical"===o.orientation&&{paddingTop:"calc(".concat(t.spacing(1)," * 1.2)"),paddingBottom:"calc(".concat(t.spacing(1)," * 1.2)")})})),f=i.forwardRef((function(e,t){const o=(0,d.c)({props:e,name:"MuiDivider"}),{absolute:i=!1,children:s,className:l,component:f=(s?"div":"hr"),flexItem:g=!1,light:b=!1,orientation:x="horizontal",role:w=("hr"!==f?"separator":void 0),textAlign:S="center",variant:y="fullWidth"}=o,k=(0,n.c)(o,h),C=(0,r.c)({},o,{absolute:i,component:f,flexItem:g,light:b,orientation:x,role:w,textAlign:S,variant:y}),D=(e=>{const{absolute:t,children:o,classes:n,flexItem:r,light:i,orientation:a,textAlign:s,variant:l}=e,d={root:["root",t&&"absolute",l,i&&"light","vertical"===a&&"vertical",r&&"flexItem",o&&"withChildren",o&&"vertical"===a&&"withChildrenVertical","right"===s&&"vertical"!==a&&"textAlignRight","left"===s&&"vertical"!==a&&"textAlignLeft"],wrapper:["wrapper","vertical"===a&&"wrapperVertical"]};return(0,c.c)(d,p.L,n)})(C);return(0,u.jsx)(m,(0,r.c)({as:f,className:(0,a.c)(D.root,l),role:w,ref:t,ownerState:C},k,{children:s?(0,u.jsx)(v,{className:D.wrapper,ownerState:C,children:s}):null}))}));f.muiSkipListHighlight=!0;const g=f},2904:(e,t,o)=>{o.d(t,{c:()=>x});var n=o(5656),r=o(5072),i=o(9060),a=o(9736),c=o(1412),s=o(3440),l=o(5832),d=o(3456),p=o(99),u=o(3448);function h(e){return(0,u.cp)("MuiFab",e)}const m=(0,p.c)("MuiFab",["root","primary","secondary","extended","circular","focusVisible","disabled","colorInherit","sizeSmall","sizeMedium","sizeLarge","info","error","warning","success"]);var v=o(2556),f=o(2496);const g=["children","className","color","component","disabled","disableFocusRipple","focusVisibleClassName","size","variant"],b=(0,v.cp)(s.c,{name:"MuiFab",slot:"Root",shouldForwardProp:e=>(0,v.CU)(e)||"classes"===e,overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,t[o.variant],t["size".concat((0,l.c)(o.size))],"inherit"===o.color&&t.colorInherit,t[(0,l.c)(o.size)],t[o.color]]}})((e=>{let{theme:t,ownerState:o}=e;var n,i;return(0,r.c)({},t.typography.button,{minHeight:36,transition:t.transitions.create(["background-color","box-shadow","border-color"],{duration:t.transitions.duration.short}),borderRadius:"50%",padding:0,minWidth:0,width:56,height:56,zIndex:(t.vars||t).zIndex.fab,boxShadow:(t.vars||t).shadows[6],"&:active":{boxShadow:(t.vars||t).shadows[12]},color:t.vars?t.vars.palette.text.primary:null==(n=(i=t.palette).getContrastText)?void 0:n.call(i,t.palette.grey[300]),backgroundColor:(t.vars||t).palette.grey[300],"&:hover":{backgroundColor:(t.vars||t).palette.grey.A100,"@media (hover: none)":{backgroundColor:(t.vars||t).palette.grey[300]},textDecoration:"none"},["&.".concat(m.focusVisible)]:{boxShadow:(t.vars||t).shadows[6]}},"small"===o.size&&{width:40,height:40},"medium"===o.size&&{width:48,height:48},"extended"===o.variant&&{borderRadius:24,padding:"0 16px",width:"auto",minHeight:"auto",minWidth:48,height:48},"extended"===o.variant&&"small"===o.size&&{width:"auto",padding:"0 8px",borderRadius:17,minWidth:34,height:34},"extended"===o.variant&&"medium"===o.size&&{width:"auto",padding:"0 16px",borderRadius:20,minWidth:40,height:40},"inherit"===o.color&&{color:"inherit"})}),(e=>{let{theme:t,ownerState:o}=e;return(0,r.c)({},"inherit"!==o.color&&"default"!==o.color&&null!=(t.vars||t).palette[o.color]&&{color:(t.vars||t).palette[o.color].contrastText,backgroundColor:(t.vars||t).palette[o.color].main,"&:hover":{backgroundColor:(t.vars||t).palette[o.color].dark,"@media (hover: none)":{backgroundColor:(t.vars||t).palette[o.color].main}}})}),(e=>{let{theme:t}=e;return{["&.".concat(m.disabled)]:{color:(t.vars||t).palette.action.disabled,boxShadow:(t.vars||t).shadows[0],backgroundColor:(t.vars||t).palette.action.disabledBackground}}})),x=i.forwardRef((function(e,t){const o=(0,d.c)({props:e,name:"MuiFab"}),{children:i,className:s,color:p="default",component:u="button",disabled:m=!1,disableFocusRipple:v=!1,focusVisibleClassName:x,size:w="large",variant:S="circular"}=o,y=(0,n.c)(o,g),k=(0,r.c)({},o,{color:p,component:u,disabled:m,disableFocusRipple:v,size:w,variant:S}),C=(e=>{const{color:t,variant:o,classes:n,size:i}=e,a={root:["root",o,"size".concat((0,l.c)(i)),"inherit"===t?"colorInherit":t]},s=(0,c.c)(a,h,n);return(0,r.c)({},n,s)})(k);return(0,f.jsx)(b,(0,r.c)({className:(0,a.c)(C.root,s),component:u,disabled:m,focusRipple:!v,focusVisibleClassName:(0,a.c)(C.focusVisible,x),ownerState:k,ref:t},y,{classes:C,children:i}))}))},8716:(e,t,o)=>{o.d(t,{c:()=>k});var n=o(5656),r=o(5072),i=o(9060),a=o(9736),c=o(1412),s=o(6944),l=o(2556),d=o(3456),p=o(2904),u=o(3358),h=o(5832),m=o(99),v=o(3448);function f(e){return(0,v.cp)("MuiSpeedDialAction",e)}const g=(0,m.c)("MuiSpeedDialAction",["fab","fabClosed","staticTooltip","staticTooltipClosed","staticTooltipLabel","tooltipPlacementLeft","tooltipPlacementRight"]);var b=o(2496);const x=["className","delay","FabProps","icon","id","open","TooltipClasses","tooltipOpen","tooltipPlacement","tooltipTitle"],w=(0,l.cp)(p.c,{name:"MuiSpeedDialAction",slot:"Fab",skipVariantsResolver:!1,overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.fab,!o.open&&t.fabClosed]}})((e=>{let{theme:t,ownerState:o}=e;return(0,r.c)({margin:8,color:(t.vars||t).palette.text.secondary,backgroundColor:(t.vars||t).palette.background.paper,"&:hover":{backgroundColor:t.vars?t.vars.palette.SpeedDialAction.fabHoverBg:(0,s.ct)(t.palette.background.paper,.15)},transition:"".concat(t.transitions.create("transform",{duration:t.transitions.duration.shorter}),", opacity 0.8s"),opacity:1},!o.open&&{opacity:0,transform:"scale(0)"})})),S=(0,l.cp)("span",{name:"MuiSpeedDialAction",slot:"StaticTooltip",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.staticTooltip,!o.open&&t.staticTooltipClosed,t["tooltipPlacement".concat((0,h.c)(o.tooltipPlacement))]]}})((e=>{let{theme:t,ownerState:o}=e;return{position:"relative",display:"flex",alignItems:"center",["& .".concat(g.staticTooltipLabel)]:(0,r.c)({transition:t.transitions.create(["transform","opacity"],{duration:t.transitions.duration.shorter}),opacity:1},!o.open&&{opacity:0,transform:"scale(0.5)"},"left"===o.tooltipPlacement&&{transformOrigin:"100% 50%",right:"100%",marginRight:8},"right"===o.tooltipPlacement&&{transformOrigin:"0% 50%",left:"100%",marginLeft:8})}})),y=(0,l.cp)("span",{name:"MuiSpeedDialAction",slot:"StaticTooltipLabel",overridesResolver:(e,t)=>t.staticTooltipLabel})((e=>{let{theme:t}=e;return(0,r.c)({position:"absolute"},t.typography.body1,{backgroundColor:(t.vars||t).palette.background.paper,borderRadius:(t.vars||t).shape.borderRadius,boxShadow:(t.vars||t).shadows[1],color:(t.vars||t).palette.text.secondary,padding:"4px 16px",wordBreak:"keep-all"})})),k=i.forwardRef((function(e,t){const o=(0,d.c)({props:e,name:"MuiSpeedDialAction"}),{className:s,delay:l=0,FabProps:p={},icon:m,id:v,open:g,TooltipClasses:k,tooltipOpen:C=!1,tooltipPlacement:D="left",tooltipTitle:R}=o,I=(0,n.c)(o,x),M=(0,r.c)({},o,{tooltipPlacement:D}),E=(e=>{const{open:t,tooltipPlacement:o,classes:n}=e,r={fab:["fab",!t&&"fabClosed"],staticTooltip:["staticTooltip","tooltipPlacement".concat((0,h.c)(o)),!t&&"staticTooltipClosed"],staticTooltipLabel:["staticTooltipLabel"]};return(0,c.c)(r,f,n)})(M),[z,P]=i.useState(C),T={transitionDelay:"".concat(l,"ms")},N=(0,b.jsx)(w,(0,r.c)({size:"small",className:(0,a.c)(E.fab,s),tabIndex:-1,role:"menuitem",ownerState:M},p,{style:(0,r.c)({},T,p.style),children:m}));return C?(0,b.jsxs)(S,(0,r.c)({id:v,ref:t,className:E.staticTooltip,ownerState:M},I,{children:[(0,b.jsx)(y,{style:T,id:"".concat(v,"-label"),className:E.staticTooltipLabel,ownerState:M,children:R}),i.cloneElement(N,{"aria-labelledby":"".concat(v,"-label")})]})):(!g&&z&&P(!1),(0,b.jsx)(u.c,(0,r.c)({id:v,ref:t,title:R,placement:D,onClose:()=>{P(!1)},onOpen:()=>{P(!0)},open:g&&z,classes:k},I,{children:N})))}))},9084:(e,t,o)=>{o.d(t,{c:()=>w});var n=o(5656),r=o(5072),i=o(9060),a=o(9736),c=o(1412),s=o(2556),l=o(3456),d=o(48),p=o(2496);const u=(0,d.c)((0,p.jsx)("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),"Add");var h=o(99),m=o(3448);function v(e){return(0,m.cp)("MuiSpeedDialIcon",e)}const f=(0,h.c)("MuiSpeedDialIcon",["root","icon","iconOpen","iconWithOpenIconOpen","openIcon","openIconOpen"]),g=["className","icon","open","openIcon"],b=(0,s.cp)("span",{name:"MuiSpeedDialIcon",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[{["& .".concat(f.icon)]:t.icon},{["& .".concat(f.icon)]:o.open&&t.iconOpen},{["& .".concat(f.icon)]:o.open&&o.openIcon&&t.iconWithOpenIconOpen},{["& .".concat(f.openIcon)]:t.openIcon},{["& .".concat(f.openIcon)]:o.open&&t.openIconOpen},t.root]}})((e=>{let{theme:t,ownerState:o}=e;return{height:24,["& .".concat(f.icon)]:(0,r.c)({transition:t.transitions.create(["transform","opacity"],{duration:t.transitions.duration.short})},o.open&&(0,r.c)({transform:"rotate(45deg)"},o.openIcon&&{opacity:0})),["& .".concat(f.openIcon)]:(0,r.c)({position:"absolute",transition:t.transitions.create(["transform","opacity"],{duration:t.transitions.duration.short}),opacity:0,transform:"rotate(-45deg)"},o.open&&{transform:"rotate(0deg)",opacity:1})}})),x=i.forwardRef((function(e,t){const o=(0,l.c)({props:e,name:"MuiSpeedDialIcon"}),{className:s,icon:d,openIcon:h}=o,m=(0,n.c)(o,g),f=o,x=(e=>{const{classes:t,open:o,openIcon:n}=e,r={root:["root"],icon:["icon",o&&"iconOpen",n&&o&&"iconWithOpenIconOpen"],openIcon:["openIcon",o&&"openIconOpen"]};return(0,c.c)(r,v,t)})(f);function w(e,t){return i.isValidElement(e)?i.cloneElement(e,{className:t}):e}return(0,p.jsxs)(b,(0,r.c)({className:(0,a.c)(x.root,s),ref:t,ownerState:f},m,{children:[h?w(h,x.openIcon):null,d?w(d,x.icon):(0,p.jsx)(u,{className:x.icon})]}))}));x.muiName="SpeedDialIcon";const w=x},6412:(e,t,o)=>{o.d(t,{c:()=>A});var n=o(5656),r=o(5072),i=o(9060),a=(o(3184),o(9736)),c=o(1412),s=o(8428),l=o(5608),d=o(2556),p=o(3456),u=o(3288),h=o(9192),m=o(3352),v=o(6268),f=o(2496);const g=["addEndListener","appear","children","easing","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","style","timeout","TransitionComponent"],b={entering:{transform:"none"},entered:{transform:"none"}},x=i.forwardRef((function(e,t){const o=(0,u.c)(),a={enter:o.transitions.duration.enteringScreen,exit:o.transitions.duration.leavingScreen},{addEndListener:c,appear:s=!0,children:l,easing:d,in:p,onEnter:x,onEntered:w,onEntering:S,onExit:y,onExited:k,onExiting:C,style:D,timeout:R=a,TransitionComponent:I=h.cp}=e,M=(0,n.c)(e,g),E=i.useRef(null),z=(0,v.c)(E,l.ref,t),P=e=>t=>{if(e){const o=E.current;void 0===t?e(o):e(o,t)}},T=P(S),N=P(((e,t)=>{(0,m.E)(e);const n=(0,m.M)({style:D,timeout:R,easing:d},{mode:"enter"});e.style.webkitTransition=o.transitions.create("transform",n),e.style.transition=o.transitions.create("transform",n),x&&x(e,t)})),L=P(w),A=P(C),F=P((e=>{const t=(0,m.M)({style:D,timeout:R,easing:d},{mode:"exit"});e.style.webkitTransition=o.transitions.create("transform",t),e.style.transition=o.transitions.create("transform",t),y&&y(e)})),V=P(k);return(0,f.jsx)(I,(0,r.c)({appear:s,in:p,nodeRef:E,onEnter:N,onEntered:L,onEntering:T,onExit:F,onExited:V,onExiting:A,addEndListener:e=>{c&&c(E.current,e)},timeout:R},M,{children:(e,t)=>i.cloneElement(l,(0,r.c)({style:(0,r.c)({transform:"scale(0)",visibility:"exited"!==e||p?void 0:"hidden"},b[e],D,l.props.style),ref:z},t))}))}));var w=o(2904),S=o(5832),y=o(8276),k=o(1124),C=o(99),D=o(3448);function R(e){return(0,D.cp)("MuiSpeedDial",e)}const I=(0,C.c)("MuiSpeedDial",["root","fab","directionUp","directionDown","directionLeft","directionRight","actions","actionsClosed"]),M=["ref"],E=["ariaLabel","FabProps","children","className","direction","hidden","icon","onBlur","onClose","onFocus","onKeyDown","onMouseEnter","onMouseLeave","onOpen","open","openIcon","TransitionComponent","transitionDuration","TransitionProps"],z=["ref"];function P(e){return"up"===e||"down"===e?"vertical":"right"===e||"left"===e?"horizontal":void 0}const T=(0,d.cp)("div",{name:"MuiSpeedDial",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,t["direction".concat((0,S.c)(o.direction))]]}})((e=>{let{theme:t,ownerState:o}=e;return(0,r.c)({zIndex:(t.vars||t).zIndex.speedDial,display:"flex",alignItems:"center",pointerEvents:"none"},"up"===o.direction&&{flexDirection:"column-reverse",["& .".concat(I.actions)]:{flexDirection:"column-reverse",marginBottom:-32,paddingBottom:48}},"down"===o.direction&&{flexDirection:"column",["& .".concat(I.actions)]:{flexDirection:"column",marginTop:-32,paddingTop:48}},"left"===o.direction&&{flexDirection:"row-reverse",["& .".concat(I.actions)]:{flexDirection:"row-reverse",marginRight:-32,paddingRight:48}},"right"===o.direction&&{flexDirection:"row",["& .".concat(I.actions)]:{flexDirection:"row",marginLeft:-32,paddingLeft:48}})})),N=(0,d.cp)(w.c,{name:"MuiSpeedDial",slot:"Fab",overridesResolver:(e,t)=>t.fab})((()=>({pointerEvents:"auto"}))),L=(0,d.cp)("div",{name:"MuiSpeedDial",slot:"Actions",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.actions,!o.open&&t.actionsClosed]}})((e=>{let{ownerState:t}=e;return(0,r.c)({display:"flex",pointerEvents:"auto"},!t.open&&{transition:"top 0s linear 0.2s",pointerEvents:"none"})})),A=i.forwardRef((function(e,t){const o=(0,p.c)({props:e,name:"MuiSpeedDial"}),d=(0,u.c)(),h={enter:d.transitions.duration.enteringScreen,exit:d.transitions.duration.leavingScreen},{ariaLabel:m,FabProps:{ref:g}={},children:b,className:w,direction:C="up",hidden:D=!1,icon:I,onBlur:A,onClose:F,onFocus:V,onKeyDown:j,onMouseEnter:O,onMouseLeave:H,onOpen:W,open:B,TransitionComponent:K=x,transitionDuration:U=h,TransitionProps:Z}=o,q=(0,n.c)(o.FabProps,M),G=(0,n.c)(o,E),[J,Q]=(0,k.c)({controlled:B,default:!1,name:"SpeedDial",state:"open"}),X=(0,r.c)({},o,{open:J,direction:C}),Y=(e=>{const{classes:t,open:o,direction:n}=e,r={root:["root","direction".concat((0,S.c)(n))],fab:["fab"],actions:["actions",!o&&"actionsClosed"]};return(0,c.c)(r,R,t)})(X),$=(0,s.c)(),_=i.useRef(0),ee=i.useRef(),te=i.useRef([]);te.current=[te.current[0]];const oe=i.useCallback((e=>{te.current[0]=e}),[]),ne=(0,v.c)(g,oe),re=(e,t)=>o=>{te.current[e+1]=o,t&&t(o)};i.useEffect((()=>{J||(_.current=0,ee.current=void 0)}),[J]);const ie=e=>{"mouseleave"===e.type&&H&&H(e),"blur"===e.type&&A&&A(e),$.clear(),"blur"===e.type?$.start(0,(()=>{Q(!1),F&&F(e,"blur")})):(Q(!1),F&&F(e,"mouseLeave"))},ae=e=>{"mouseenter"===e.type&&O&&O(e),"focus"===e.type&&V&&V(e),$.clear(),J||$.start(0,(()=>{if(Q(!0),W){W(e,{focus:"focus",mouseenter:"mouseEnter"}[e.type])}}))},ce=m.replace(/^[^a-z]+|[^\w:.-]+/gi,""),se=i.Children.toArray(b).filter((e=>i.isValidElement(e))),le=se.map(((e,t)=>{const o=e.props,{FabProps:{ref:a}={},tooltipPlacement:c}=o,s=(0,n.c)(o.FabProps,z),l=c||("vertical"===P(C)?"left":"top");return i.cloneElement(e,{FabProps:(0,r.c)({},s,{ref:re(t,a)}),delay:30*(J?t:se.length-t),open:J,tooltipPlacement:l,id:"".concat(ce,"-action-").concat(t)})}));return(0,f.jsxs)(T,(0,r.c)({className:(0,a.c)(Y.root,w),ref:t,role:"presentation",onKeyDown:e=>{j&&j(e);const t=e.key.replace("Arrow","").toLowerCase(),{current:o=t}=ee;if("Escape"===e.key)return Q(!1),te.current[0].focus(),void(F&&F(e,"escapeKeyDown"));if(P(t)===P(o)&&void 0!==P(t)){e.preventDefault();const n=t===o?1:-1,r=(0,l.c)(_.current+n,0,te.current.length-1);te.current[r].focus(),_.current=r,ee.current=o}},onBlur:ie,onFocus:ae,onMouseEnter:ae,onMouseLeave:ie,ownerState:X},G,{children:[(0,f.jsx)(K,(0,r.c)({in:!D,timeout:U,unmountOnExit:!0},Z,{children:(0,f.jsx)(N,(0,r.c)({color:"primary","aria-label":m,"aria-haspopup":"true","aria-expanded":J,"aria-controls":"".concat(ce,"-actions")},q,{onClick:e=>{q.onClick&&q.onClick(e),$.clear(),J?(Q(!1),F&&F(e,"toggle")):(Q(!0),W&&W(e,"toggle"))},className:(0,a.c)(Y.fab,q.className),ref:ne,ownerState:X,children:i.isValidElement(I)&&(0,y.c)(I,["SpeedDialIcon"])?i.cloneElement(I,{open:J}):I}))})),(0,f.jsx)(L,{id:"".concat(ce,"-actions"),role:"menu","aria-orientation":P(C),className:(0,a.c)(Y.actions,!J&&Y.actionsClosed),ownerState:X,children:le})]}))}))}}]);
//# sourceMappingURL=841.a9521957.chunk.js.map