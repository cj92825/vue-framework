(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-00468191"],{"0187":function(t,e,r){"use strict";r.d(e,"d",function(){return a}),r.d(e,"b",function(){return i}),r.d(e,"a",function(){return o}),r.d(e,"c",function(){return s}),r.d(e,"e",function(){return c});var n=r("b775");function a(t){return Object(n["a"])({url:"/sys/roles",method:"get",params:t})}function i(t){return Object(n["a"])({url:"/sys/editRole",method:"post",data:t})}function o(t){return Object(n["a"])({url:"/sys/deleteRole",method:"post",data:t})}function s(t){return Object(n["a"])({url:"/sys/getPermissionByRoleId",method:"get",params:{roleId:t}})}function c(t,e,r){return Object(n["a"])({url:"/sys/grantPermissions",method:"post",data:{roleId:t,addPermissionIds:e,deletePermissionIds:r}})}},"0a49":function(t,e,r){var n=r("9b43"),a=r("626a"),i=r("4bf8"),o=r("9def"),s=r("cd1c");t.exports=function(t,e){var r=1==t,c=2==t,l=3==t,u=4==t,d=6==t,f=5==t||d,h=e||s;return function(e,s,p){for(var v,g,m=i(e),w=a(m),b=n(s,p,3),y=o(w.length),I=0,R=r?h(e,y):c?h(e,0):void 0;y>I;I++)if((f||I in w)&&(v=w[I],g=b(v,I,m),t))if(r)R[I]=g;else if(g)switch(t){case 3:return!0;case 5:return v;case 6:return I;case 2:R.push(v)}else if(u)return!1;return d?-1:l||u?u:R}}},7514:function(t,e,r){"use strict";var n=r("5ca1"),a=r("0a49")(5),i="find",o=!0;i in[]&&Array(1)[i](function(){o=!1}),n(n.P+n.F*o,"Array",{find:function(t){return a(this,t,arguments.length>1?arguments[1]:void 0)}}),r("9c6c")(i)},"9cf6":function(t,e,r){},aa77:function(t,e,r){var n=r("5ca1"),a=r("be13"),i=r("79e5"),o=r("fdef"),s="["+o+"]",c="​",l=RegExp("^"+s+s+"*"),u=RegExp(s+s+"*$"),d=function(t,e,r){var a={},s=i(function(){return!!o[t]()||c[t]()!=c}),l=a[t]=s?e(f):o[t];r&&(a[r]=l),n(n.P+n.F*s,"String",a)},f=d.trim=function(t,e){return t=String(a(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(u,"")),t};t.exports=d},c5f6:function(t,e,r){"use strict";var n=r("7726"),a=r("69a8"),i=r("2d95"),o=r("5dbc"),s=r("6a99"),c=r("79e5"),l=r("9093").f,u=r("11e9").f,d=r("86cc").f,f=r("aa77").trim,h="Number",p=n[h],v=p,g=p.prototype,m=i(r("2aeb")(g))==h,w="trim"in String.prototype,b=function(t){var e=s(t,!1);if("string"==typeof e&&e.length>2){e=w?e.trim():f(e,3);var r,n,a,i=e.charCodeAt(0);if(43===i||45===i){if(r=e.charCodeAt(2),88===r||120===r)return NaN}else if(48===i){switch(e.charCodeAt(1)){case 66:case 98:n=2,a=49;break;case 79:case 111:n=8,a=55;break;default:return+e}for(var o,c=e.slice(2),l=0,u=c.length;l<u;l++)if(o=c.charCodeAt(l),o<48||o>a)return NaN;return parseInt(c,n)}}return+e};if(!p(" 0o1")||!p("0b1")||p("+0x1")){p=function(t){var e=arguments.length<1?0:t,r=this;return r instanceof p&&(m?c(function(){g.valueOf.call(r)}):i(r)!=h)?o(new v(b(e)),r,p):b(e)};for(var y,I=r("9e1e")?l(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),R=0;I.length>R;R++)a(v,y=I[R])&&!a(p,y)&&d(p,y,u(v,y));p.prototype=g,g.constructor=p,r("2aba")(n,h,p)}},cd1c:function(t,e,r){var n=r("e853");t.exports=function(t,e){return new(n(t))(e)}},d869:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"app-container"},[r("el-row",{staticStyle:{width:"100%"}},[r("el-col",{attrs:{span:24}},[r("el-card",{attrs:{shadow:"hover"}},[r("div",{attrs:{slot:"header"},slot:"header"},[r("span",[t._v("\n            当前选择用户：\n            "),r("label",[t._v(t._s(t.userName))])])]),t._v(" "),r("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:t.roleData,"max-height":"650px",border:"",fit:"","header-cell-style":{"text-align":"center"},"cell-style":{"text-align":"center"},"highlight-current-row":""}},[r("el-table-column",{attrs:{label:"角色名","min-width":"120",prop:"name"}}),t._v(" "),r("el-table-column",{attrs:{label:"备注","min-width":"80",prop:"remark"}}),t._v(" "),r("el-table-column",{attrs:{label:"操作",fixed:"right","min-width":"100px"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.grant?r("el-button",{attrs:{type:"warning",size:"small"},on:{click:function(r){return t.revokeRole(e.row)}}},[t._v("回收")]):r("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(r){return t.grantRole(e.row)}}},[t._v("授权")])]}}])})],1)],1)],1)],1)],1)},a=[],i=(r("7514"),r("ac6a"),r("c5f6"),r("0187")),o=r("8930"),s={data:function(){return{roleData:[],loading:!1,waitRoleData:!1,waitUserRole:!1,waitGrant:!1,existRole:[],selectedRole:[]}},created:function(){this.getRoleData()},computed:{listLoading:function(){return this.waitRoleData||this.waitUserRole||this.waitGrant}},props:{userId:Number,userName:String},watch:{userId:function(t,e){t&&this.loadRoleByUserId()}},methods:{getRoleData:function(){var t=this,e={currentPage:1,size:100};this.waitRoleData=!0,Object(i["d"])(e).then(function(e){var r=e.data.data.records;t.roleData=r,t.waitRoleData=!1,t.handleExistRole()}).catch()},loadRoleByUserId:function(){var t=this;this.waitUserRole=!0,Object(o["d"])(this.userId).then(function(e){var r=e.data.data;t.existRole=r,t.waitUserRole=!1,t.handleExistRole()})},handleExistRole:function(){var t=this;this.waitRoleData||this.waitUserRole||this.roleData.forEach(function(e){e.grant=!1;var r=t.existRole.some(function(t){return e.id==t.roleId});r&&(e.grant=!0)})},grantRole:function(t){var e=this,r={userId:this.userId,roleId:t.id};this.waitGrant=!0,Object(o["f"])(r).then(function(t){var r=t.data.data;r?(e.loadRoleByUserId(),e.$notify({title:"成功",message:"授权成功",type:"success",duration:2e3})):e.$notify({title:"失败",message:"授权失败",type:"success"}),e.waitGrant=!1})},revokeRole:function(t){var e=this,r=this.existRole.find(function(e){return e.roleId==t.id});this.waitGrant=!0,Object(o["g"])(r).then(function(r){var n=r.data.data;n?(t.grant=!1,e.$notify({title:"成功",message:"回收成功",type:"success",duration:2e3})):e.$notify({title:"失败",message:"回收失败",type:"success"}),e.waitGrant=!1})}}},c=s,l=(r("fdf3"),r("2877")),u=Object(l["a"])(c,n,a,!1,null,"0aa4527d",null);e["default"]=u.exports},e853:function(t,e,r){var n=r("d3f4"),a=r("1169"),i=r("2b4c")("species");t.exports=function(t){var e;return a(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!a(e.prototype)||(e=void 0),n(e)&&(e=e[i],null===e&&(e=void 0))),void 0===e?Array:e}},fdef:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},fdf3:function(t,e,r){"use strict";var n=r("9cf6"),a=r.n(n);a.a}}]);