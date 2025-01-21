"use strict";(()=>{var e={};e.id=4994,e.ids=[4994],e.modules={5600:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6762:(e,t)=>{Object.defineProperty(t,"M",{enumerable:!0,get:function(){return function e(t,o){return o in t?t[o]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,o)):"function"==typeof t&&"default"===o?t:void 0}}})},3572:(e,t,o)=>{o.r(t),o.d(t,{config:()=>c,default:()=>m,routeModule:()=>s});var n={};o.r(n),o.d(n,{default:()=>r});var i=o(9947),d=o(325),a=o(6762);async function r(e,t){let o;try{if("GET"===e.method){let n,i;let{search:d}=e.query;if(!d)return t.status(400).json({error:"Par\xe2metro de busca \xe9 obrigat\xf3rio."});isNaN(d)?(n=`
         SELECT 
            m.id AS id_medicamento, 
            m.dt_pedido, m.dt_chegada, m.dt_entrega, 
            m.descricao, co.pago, 
            t.nome AS nome_tratamento, 
            d.nome AS nome_medico, 
            p.nome AS nome_paciente
          FROM medicamentos m
          JOIN cadpaciente p ON m.id_paciente = p.id
          JOIN medicos d ON m.id_medico = d.id
          JOIN tratamentos t ON m.id_tratamento = t.id
          JOIN contratos co ON m.id_paciente = co.id_paciente
          WHERE p.nome LIKE ?;
        `,i=[`%${d}%`]):(n=`
         SELECT 
            m.id AS id_medicamento, 
            m.dt_pedido, m.dt_chegada, m.dt_entrega, 
            m.descricao, co.pago, 
            t.nome AS nome_tratamento, 
            d.nome AS nome_medico, 
            p.nome AS nome_paciente
          FROM medicamentos m
          JOIN cadpaciente p ON m.id_paciente = p.id
          JOIN medicos d ON m.id_medico = d.id
          JOIN tratamentos t ON m.id_tratamento = t.id
          JOIN contratos co ON m.id_paciente = co.id_paciente
          WHERE p.id = ?;
        `,i=[d]);let[a]=await o.execute(n,i);if(0===a.length)return t.status(404).json({message:"Nenhum medicamento encontrado."});t.status(200).json(a)}else t.status(405).json({message:`M\xe9todo ${e.method} n\xe3o permitido.`})}catch(e){console.error("Erro no servidor:",e),t.status(500).json({error:"Erro no servidor."})}}let m=(0,a.M)(n,"default"),c=(0,a.M)(n,"config"),s=new i.PagesAPIRouteModule({definition:{kind:d.A.PAGES_API,page:"/api/medicamentos",pathname:"/api/medicamentos",bundlePath:"",filename:""},userland:n})},325:(e,t)=>{Object.defineProperty(t,"A",{enumerable:!0,get:function(){return o}});var o=function(e){return e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE",e}({})},9947:(e,t,o)=>{e.exports=o(5600)}};var t=require("../../webpack-api-runtime.js");t.C(e);var o=t(t.s=3572);module.exports=o})();