"use strict";(()=>{var e={};e.id=6463,e.ids=[6463],e.modules={5600:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6762:(e,t)=>{Object.defineProperty(t,"M",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},9486:(e,t,r)=>{r.r(t),r.d(t,{config:()=>d,default:()=>c,routeModule:()=>l});var a={};r.r(a),r.d(a,{default:()=>u});var n=r(9947),o=r(325),i=r(6762),s=r(3209);async function u(e,t){if("GET"===e.method){let e;try{e=await (0,s.$)();let[r]=await e.execute("SELECT * FROM cadpaciente");t.status(200).json(r)}catch(e){console.error("Erro ao buscar pacientes:",e),t.status(500).json({message:"Erro ao buscar pacientes."})}}else t.status(405).json({message:"M\xe9todo n\xe3o permitido"})}let c=(0,i.M)(a,"default"),d=(0,i.M)(a,"config"),l=new n.PagesAPIRouteModule({definition:{kind:o.A.PAGES_API,page:"/api/getpacientes",pathname:"/api/getpacientes",bundlePath:"",filename:""},userland:a})},3209:(e,t,r)=>{let a;r.d(t,{$:()=>i});let n=require("mysql2/promise");var o=r.n(n);let i=async()=>(a||(a=o().createPool({host:"marcofriorefrigeracao.com.br",user:"marcofri_user",password:"SenhaNova123@",database:"marcofri_citymedical",waitForConnections:!0,connectionLimit:10,queueLimit:0})),a)},325:(e,t)=>{Object.defineProperty(t,"A",{enumerable:!0,get:function(){return r}});var r=function(e){return e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE",e}({})},9947:(e,t,r)=>{e.exports=r(5600)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=9486);module.exports=r})();