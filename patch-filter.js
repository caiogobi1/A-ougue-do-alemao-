const fs=require('fs');
const p='App.js';
let s=fs.readFileSync(p,'utf8');
const old="if(!nome||!preco)continue; const grupo=classificar(nome,cat,ncm); if(!grupo)continue;";
const novo="if(!nome||!preco)continue; const grupo=classificar(nome,cat,ncm); if(!grupo)continue; const codigoLimpo=String(codigo).trim(); const codigoBalanca=/^\\d{6}$/.test(codigoLimpo); const vendidoPorKg=un==='kg'; const carnePeso=['Bovinos','Suínos','Frangos'].includes(grupo)&&vendidoPorKg; if(carnePeso&&!codigoBalanca)continue;";
if(!s.includes(old)){console.error('Trecho esperado nao encontrado. Nenhuma alteracao feita.');process.exit(1)}
s=s.replace(old,novo);
fs.writeFileSync(p,s);
console.log('Filtro aplicado: carnes por kg somente com codigo numerico de 6 digitos; hortifruti preservado.');
