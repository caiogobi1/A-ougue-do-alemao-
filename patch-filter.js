const fs=require('fs');
const p='App.js';
let s=fs.readFileSync(p,'utf8');

// Ordem das categorias.
s=s.replace(/const categorias=\[[^;]+\];/,"const categorias=['Bovinos','Suínos','Frangos','Churrasco','Peixes','Hortfruti','Bebidas','Mercearia','Padaria','Laticínios','Limpeza','Perfumaria','Utensílios Domésticos','Animal'];");

// Substitui a função de classificação inteira.
const ini=s.indexOf('function classificar(nome,categoria,ncm){');
const fim=s.indexOf('function montar(',ini);
if(ini<0||fim<0){console.error('Nao encontrei classificar/montar.');process.exit(1)}
const nova=`function classificar(nome,categoria,ncm){
 const n=norm(nome),c=norm(categoria);
 if((n.includes('FILE DE TILAPIA')||n.includes('FILE DE MERLUZA'))&&!n.includes('ISCA')) return 'Peixes';
 if(/TILAPIA|MERLUZA|BACALHAU|PEIXE/.test(n)) return null;
 if(/CERVEJA|REFRIG|COCA|GUARANA|FANTA|SPRITE|ENERGET|SUCO|AGUA |AGUA$|CHA |ISOTON|GATORADE/.test(n)) return 'Bebidas';
 if(/LINGUICA|ESPETO|CARVAO|SAL GROSSO|PAO DE ALHO|QUEIJO COALHO/.test(n)) return 'Churrasco';
 if(/FRANGO|COXA|COXINHA|SOBRECOXA|ASA INTEIRA|TULIPA|SASSAMI|PEITO DE FRANGO|FILE DE COXA|GALINHA|CORACAO DE FRANGO/.test(n)) return 'Frangos';
 if(/SUIN|PORCO|PANCETA|BISTECA|LOMBO|PERNIL|COSTELA SUINA|BARRIGA|BANHA/.test(n)) return 'Suínos';
 if(/PICANHA|ALCATRA|ACEM|PATINHO|COXAO|CONTRA FILE|CONTRAFILE|MAMINHA|FRALDINHA|CUPIM|MUSCULO|PALETA|COSTELA BOV|CARNE MOIDA|BIFE|BOVIN|MOCOTO|BUCHO|RABO BOV|FIGADO/.test(n)) return 'Bovinos';
 if(/TOMATE|BATATA|CEBOLA|ALHO|BANANA|MACA|LARANJA|LIMAO|CENOURA|BROCOLIS|ALFACE|MAMAO|MANGA|ABACAXI|MELANCIA|MELAO|UVA|PERA|PIMENTAO|PEPINO|ABOBORA|MANDIOCA|BETERRABA|REPOLHO|COUVE|CHEIRO VERDE|SALSINHA|CEBOLINHA/.test(n)) return 'Hortfruti';
 if(/PAO |PAO$|BOLO|ROSCA|BISCOITO|BOLACHA|TORRADA/.test(n)) return 'Padaria';
 if(/LEITE|QUEIJO|IOGUR|REQUEIJAO|MANTEIGA|MARGARINA|CREME DE LEITE/.test(n)) return 'Laticínios';
 if(/DETERGENTE|DESINFET|AMACIANTE|SABAO|AGUA SANIT|LIMPADOR|ESPONJA|VASSOURA|SACO LIXO/.test(n)) return 'Limpeza';
 if(/SHAMPOO|CONDICIONADOR|SABONETE|DESODORANTE|CREME DENTAL|ESCOVA DENTAL|PAPEL HIGIENICO/.test(n)) return 'Perfumaria';
 if(/RACAO|PETISCO.*(CAO|GATO)|AREIA.*GATO/.test(n)) return 'Animal';
 if(/PAPEL ALUMINIO|FILME PVC|PALITO|PRATO PLAST|TALHER|ISQUEIRO|PILHA|LAMPADA|EXTENSAO/.test(n)) return 'Utensílios Domésticos';
 return 'Mercearia';
}\n`;
s=s.slice(0,ini)+nova+s.slice(fim);

s=s.replace(/ const codigoLimpo=String\(codigo\)\.trim\(\); const carne=\['Bovinos','Suínos','Frangos'\]\.includes\(grupo\); const codigoBalanca=\/\^000\\d\{3\}\$\/\.test\(codigoLimpo\); if\(carne&&!codigoBalanca\)continue;/g,'');
const ancora="if(!nome||!preco)continue; const grupo=classificar(nome,cat,ncm); if(!grupo)continue;";
const filtro=" const codigoLimpo=String(codigo).trim(); const carne=['Bovinos','Suínos','Frangos'].includes(grupo); const codigoBalanca=/^000\\d{3}$/.test(codigoLimpo); if(carne&&!codigoBalanca)continue;";
if(!s.includes(ancora)){console.error('Nao encontrei ponto do filtro.');process.exit(1)}
s=s.replace(ancora,ancora+filtro);
fs.writeFileSync(p,s);
console.log('OK - carnes somente 000xxx e categorias separadas.');
