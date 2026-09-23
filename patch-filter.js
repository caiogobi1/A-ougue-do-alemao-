const fs=require('fs');
const p='App.js';
let s=fs.readFileSync(p,'utf8');

// Limpa filtros já aplicados em execuções anteriores.
s=s.replace(" const codigoLimpo=String(codigo).trim(); const codigoBalanca=/^\\d{6}$/.test(codigoLimpo); const vendidoPorKg=un==='kg'; const carnePeso=['Bovinos','Suínos','Frangos'].includes(grupo)&&vendidoPorKg; if(carnePeso&&!codigoBalanca)continue;",'');
s=s.replace(" const codigoLimpo=String(codigo).trim(); const carne=['Bovinos','Suínos','Frangos'].includes(grupo); const codigoBalanca=/^000\\d{3}$/.test(codigoLimpo); if(carne&&!codigoBalanca)continue;",'');

// Reordena as categorias na tela.
s=s.replace("const categorias=['Bovinos','Suínos','Frangos','Churrasco','Peixes','Mercearia','Bebidas','Padaria','Hortifruti','Laticínios','Limpeza','Perfumaria','Utensílios Domésticos','Animal'];",
"const categorias=['Bovinos','Suínos','Frangos','Churrasco','Peixes','Hortifruti','Bebidas','Mercearia','Padaria','Laticínios','Limpeza','Perfumaria','Utensílios Domésticos','Animal'];");

// Classificação mais rígida e em ordem de prioridade.
const ini=s.indexOf('function classificar(nome,categoria,ncm){');
const fim=s.indexOf('\nfunction montar(texto){',ini);
if(ini<0||fim<0){console.error('Funcao classificar nao encontrada.');process.exit(1)}
const nova=`function classificar(nome,categoria,ncm){
 const n=norm(nome),c=norm(categoria),x=String(ncm||'');
 if((n.includes('FILE DE TILAPIA')||n.includes('FILE DE MERLUZA'))&&!n.includes('ISCA')) return 'Peixes';
 if(n.includes('TILAPIA')||n.includes('MERLUZA')||n.includes('BACALHAU')||n.includes('PEIXE')) return null;
 if(/CERVEJA|REFRIG|COCA|GUARANA|FANTA|SPRITE|ENERGET|SUCO|AGUA|CHA |ISOTON|GATORADE/.test(n)) return 'Bebidas';
 if(/LINGUICA|ESPETO|CARVAO|SAL GROSSO|PAO DE ALHO|QUEIJO COALHO/.test(n)) return 'Churrasco';
 if(/FRANGO|COXA|COXINHA|SOBRECOXA|ASA INTEIRA|TULIPA|SASSAMI|PEITO DE FRANGO|FILE DE COXA|GALINHA|CORACAO DE FRANGO/.test(n)) return 'Frangos';
 if(/SUIN|PORCO|PANCETA|BISTECA|LOMBO|PERNIL|COSTELA SUINA|BARRIGA|BANHA/.test(n)) return 'Suínos';
 if(/PICANHA|ALCATRA|ACEM|PATINHO|COXAO|CONTRA FILE|CONTRAFILE|MAMINHA|FRALDINHA|CUPIM|MUSCULO|PALETA|COSTELA BOV|CARNE MOIDA|BIFE|BOVIN|MOCOTO|BUCHO|RABO BOV|FIGADO/.test(n)) return 'Bovinos';
 if(/TOMATE|BATATA|CEBOLA|ALHO|BANANA|MACA|LARANJA|LIMAO|CENOURA|BROCOLIS|ALFACE|MAMAO|MANGA|ABACAXI|MELANCIA|MELAO|UVA|PERA|PIMENTAO|PEPINO|ABOBORA|MANDIOCA|BETERRABA|REPOLHO|COUVE|CHEIRO VERDE|SALSINHA|CEBOLINHA/.test(n)) return 'Hortifruti';
 if(/PAO |PAO$|BOLO|ROSCA|BISCOITO|BOLACHA|TORRADA/.test(n)) return 'Padaria';
 if(/LEITE|QUEIJO|IOGUR|REQUEIJAO|MANTEIGA|MARGARINA|CREME DE LEITE/.test(n)) return 'Laticínios';
 if(/DETERGENTE|DESINFET|AMACIANTE|SABAO|SABÃO|AGUA SANIT|LIMPADOR|ESPONJA|VASSOURA|SACO LIXO/.test(n)) return 'Limpeza';
 if(/SHAMPOO|CONDICIONADOR|SABONETE|DESODORANTE|CREME DENTAL|ESCOVA DENTAL|PAPEL HIGIENICO/.test(n)) return 'Perfumaria';
 if(/RACAO|RAÇÃO|PETISCO.*(CAO|CÃO|GATO)|AREIA.*GATO/.test(n)) return 'Animal';
 if(/PAPEL ALUMINIO|FILME PVC|PALITO|PRATO PLAST|TALHER|ISQUEIRO|PILHA|LAMPADA|EXTENSAO|EXTENSÃO/.test(n)) return 'Utensílios Domésticos';
 return 'Mercearia';
}`;
s=s.slice(0,ini)+nova+s.slice(fim);

// Somente códigos 000xxx nas três categorias de carnes.
const old="if(!nome||!preco)continue; const grupo=classificar(nome,cat,ncm); if(!grupo)continue;";
const novo="if(!nome||!preco)continue; const grupo=classificar(nome,cat,ncm); if(!grupo)continue; const codigoLimpo=String(codigo).trim(); const carne=['Bovinos','Suínos','Frangos'].includes(grupo); const codigoBalanca=/^000\\d{3}$/.test(codigoLimpo); if(carne&&!codigoBalanca)continue;";
if(!s.includes(old)){console.error('Trecho de montagem nao encontrado.');process.exit(1)}
s=s.replace(old,novo);
fs.writeFileSync(p,s);
console.log('Categorias reorganizadas e separadas; carnes somente 000xxx; hortifruti e bebidas separados.');
