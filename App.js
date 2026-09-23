import React, { useMemo, useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { mercearia } from './mercearia';
import { catalogo } from './catalogo';
const logo = require('./logo.jpeg');

const produtos = [...catalogo, ...mercearia.map((p, i) => ({...p, id: `OLD-${p.id || p.codigo || i}`, unidade: String(p.unidade || 'un').toLowerCase(), grupo:'Mercearia', emoji:p.emoji || '🛒'}))];
const categorias = ['Bovinos','Suínos','Frangos','Churrasco','Mercearia'];
const subs = ['Todos','Cervejas','Cervejas Caixa','Refrigerantes 2L','Refrigerantes Lata','Refrigerantes','Energéticos','Doces','Molhos','Massas','Laticínios','Outros'];
const dinheiro = v => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;
const ofertas = [
 {titulo:'🥩 Carnes selecionadas',texto:'Escolha o peso e receba do jeito que você precisa.',cat:'Bovinos'},
 {titulo:'🍺 Bebidas geladas',texto:'Cervejas, caixas, refrigerantes e energéticos.',cat:'Mercearia',sub:'Cervejas'},
 {titulo:'🔥 Hora do churrasco',texto:'Carnes e espetos para o seu churrasco.',cat:'Churrasco'},
];

export default function App(){
 const [categoria,setCategoria]=useState('Bovinos');
 const [subcategoria,setSubcategoria]=useState('Todos');
 const [busca,setBusca]=useState('');
 const [quantidades,setQuantidades]=useState({});
 const [recebimento,setRecebimento]=useState('Delivery');
 const [endereco,setEndereco]=useState('');
 const [bairro,setBairro]=useState('');
 const [pagamento,setPagamento]=useState('Pix');

 const visiveis=useMemo(()=>produtos.filter(p=>{
   const area=categoria==='Mercearia' ? p.grupo==='Mercearia' && (subcategoria==='Todos'||p.categoria===subcategoria) : p.categoria===categoria;
   const q=busca.trim().toLowerCase();
   return area && (!q || `${p.nome} ${p.codigo||''}`.toLowerCase().includes(q));
 }),[categoria,subcategoria,busca]);
 const alterar=(p,d)=>setQuantidades(a=>{const passo=p.unidade==='kg'?0.5:1;const n=Math.max(0,Number(((a[p.id]||0)+d*passo).toFixed(1)));return {...a,[p.id]:n};});
 const carrinho=useMemo(()=>produtos.filter(p=>(quantidades[p.id]||0)>0).map(p=>({...p,quantidade:quantidades[p.id]})),[quantidades]);
 const total=useMemo(()=>carrinho.reduce((s,p)=>s+p.preco*p.quantidade,0),[carrinho]);
 const qtdItens=useMemo(()=>carrinho.reduce((s,p)=>s+p.quantidade,0),[carrinho]);
 const qtd=p=>p.unidade==='kg'?`${(quantidades[p.id]||0).toFixed(1).replace('.',',')} kg`:`${quantidades[p.id]||0} un`;
 const ir=(cat,sub='Todos')=>{setCategoria(cat);setSubcategoria(sub);setBusca('');};

 const finalizar=async()=>{
   if(!carrinho.length)return Alert.alert('Carrinho vazio','Adicione algum produto ao pedido.');
   if(recebimento==='Delivery'&&!endereco.trim())return Alert.alert('Informe o endereço','Digite o endereço para receber o pedido.');
   const itens=carrinho.map(p=>`• ${p.nome} — ${p.unidade==='kg'?p.quantidade.toFixed(1).replace('.',',')+' kg':p.quantidade+' un'} — ${dinheiro(p.preco*p.quantidade)}`).join('\n');
   const entrega=recebimento==='Delivery'?`🚚 Delivery\n📍 ${endereco}\n🏘️ ${bairro||'Bairro não informado'}`:'🏪 Retirada no Açougue do Alemão';
   const msg=`Olá! Quero fazer um pedido no Açougue do Alemão 🥩\n\n🛒 PEDIDO\n${itens}\n\n💰 TOTAL: ${dinheiro(total)}\n\n${entrega}\n\n💳 Pagamento: ${pagamento}`;
   try{await Linking.openURL(`https://wa.me/5511975187941?text=${encodeURIComponent(msg)}`)}catch{Alert.alert('Erro','Não foi possível abrir o WhatsApp.')}
 };

 return <View style={s.safe}><StatusBar style="light"/><ScrollView style={s.container} contentContainerStyle={[s.content,carrinho.length&&{paddingBottom:125}]} keyboardShouldPersistTaps="handled">
   <View style={s.topo}><Image source={logo} style={s.logo} resizeMode="contain"/><Text style={s.brand}>AÇOUGUE DO ALEMÃO</Text><Text style={s.subtitle}>Casa de Carnes & Mercearia</Text></View>
   <View style={s.hero}><Text style={s.heroMini}>🛵 DELIVERY • 🏪 RETIRADA</Text><Text style={s.heroTitle}>Peça sem sair de casa</Text><Text style={s.heroText}>Carnes, mercearia e bebidas em um só lugar.</Text></View>
   <TextInput style={s.search} value={busca} onChangeText={setBusca} placeholder="🔎 Buscar produto ou código..." placeholderTextColor="#777"/>

   <Text style={s.title}>🔥 Destaques</Text>
   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.offers}>{ofertas.map(o=><TouchableOpacity key={o.titulo} style={s.offer} onPress={()=>ir(o.cat,o.sub)}><Text style={s.offerTitle}>{o.titulo}</Text><Text style={s.offerText}>{o.texto}</Text><Text style={s.offerLink}>VER PRODUTOS →</Text></TouchableOpacity>)}</ScrollView>

   <Text style={s.title}>🛒 Nossos produtos</Text>
   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cats}>{categorias.map(x=><TouchableOpacity key={x} style={[s.cat,categoria===x&&s.active]} onPress={()=>ir(x)}><Text style={[s.catText,categoria===x&&s.activeText]}>{x}</Text></TouchableOpacity>)}</ScrollView>
   {categoria==='Mercearia'&&<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cats}>{subs.map(x=><TouchableOpacity key={x} style={[s.sub,subcategoria===x&&s.active]} onPress={()=>setSubcategoria(x)}><Text style={[s.subText,subcategoria===x&&s.activeText]}>{x}</Text></TouchableOpacity>)}</ScrollView>}
   <Text style={s.count}>{visiveis.length} produtos encontrados</Text>
   {visiveis.length===0&&<View style={s.noResults}><Text style={s.noResultsTitle}>Nenhum produto encontrado</Text><Text style={s.noResultsText}>Tente outra busca ou categoria.</Text></View>}
   {visiveis.map((p,i)=><View style={s.card} key={`${p.id}-${i}`}><View style={s.iconBox}><Text style={s.emoji}>{p.emoji||'🛒'}</Text></View><View style={s.info}><Text style={s.name}>{p.nome}</Text><Text style={s.code}>Cód. {p.codigo||'-'}</Text><Text style={s.price}>{dinheiro(p.preco)}<Text style={s.unit}>/{p.unidade}</Text></Text><Text style={s.hint}>{p.unidade==='kg'?'Escolha de 500 g em 500 g':'Venda por unidade'}</Text></View><View style={s.qty}><TouchableOpacity style={s.qbtn} onPress={()=>alterar(p,-1)}><Text style={s.qtxt}>−</Text></TouchableOpacity><Text style={s.qvalue}>{qtd(p)}</Text><TouchableOpacity style={[s.qbtn,s.qplus]} onPress={()=>alterar(p,1)}><Text style={s.qtxt}>+</Text></TouchableOpacity></View></View>)}

   <View style={s.cart}><Text style={s.cartTitle}>🛒 Seu carrinho</Text>{!carrinho.length?<Text style={s.empty}>Seu carrinho ainda está vazio.</Text>:carrinho.map(p=><View style={s.cartLine} key={p.id}><Text style={s.cartItem}>{p.nome} × {p.unidade==='kg'?`${p.quantidade.toFixed(1).replace('.',',')}kg`:p.quantidade}</Text><Text style={s.cartValue}>{dinheiro(p.preco*p.quantidade)}</Text></View>)}<View style={s.totalLine}><Text style={s.totalLabel}>TOTAL</Text><Text style={s.totalValue}>{dinheiro(total)}</Text></View></View>
   <Text style={s.title}>🚚 Como deseja receber?</Text><View style={s.row}>{['Delivery','Retirada'].map(x=><TouchableOpacity key={x} style={[s.option,recebimento===x&&s.active]} onPress={()=>setRecebimento(x)}><Text style={[s.optionText,recebimento===x&&s.activeText]}>{x==='Delivery'?'🚚 Delivery':'🏪 Retirada'}</Text></TouchableOpacity>)}</View>
   {recebimento==='Delivery'&&<View style={s.form}><Text style={s.formLabel}>Endereço de entrega</Text><TextInput style={s.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, número e complemento" placeholderTextColor="#777"/><TextInput style={s.input} value={bairro} onChangeText={setBairro} placeholder="Bairro" placeholderTextColor="#777"/></View>}
   <Text style={s.title}>💳 Forma de pagamento</Text><View style={s.row}>{['Pix','Débito','Crédito'].map(x=><TouchableOpacity key={x} style={[s.option,pagamento===x&&s.active]} onPress={()=>setPagamento(x)}><Text style={[s.optionText,pagamento===x&&s.activeText]}>{x}</Text></TouchableOpacity>)}</View>
   <TouchableOpacity style={s.whats} onPress={finalizar}><Text style={s.whatsText}>📲 FINALIZAR PEDIDO NO WHATSAPP</Text></TouchableOpacity><Text style={s.address}>📍 Rua Maringá, 216 — Jundiaí</Text>
 </ScrollView>
 {carrinho.length>0&&<TouchableOpacity style={s.floatingCart} onPress={()=>Alert.alert('Seu carrinho',`${carrinho.length} produtos • ${dinheiro(total)}\n\nRole a tela para revisar e finalizar o pedido.`)}><View><Text style={s.floatingTitle}>🛒 {carrinho.length} {carrinho.length===1?'produto':'produtos'}</Text><Text style={s.floatingSmall}>{qtdItens.toFixed(1).replace('.0','')} itens/quantidade</Text></View><Text style={s.floatingValue}>{dinheiro(total)}  ›</Text></TouchableOpacity>}
 </View>
}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#0b0b0b'},container:{flex:1,backgroundColor:'#f5f1eb'},content:{paddingBottom:55},topo:{backgroundColor:'#0b0b0b',alignItems:'center',paddingBottom:24},logo:{width:'100%',height:155},brand:{color:'#fff',fontSize:28,fontWeight:'900'},subtitle:{color:'#e1b44f',fontSize:16,marginTop:4,fontWeight:'700'},hero:{margin:18,padding:22,borderRadius:24,backgroundColor:'#b4161e'},heroMini:{color:'#ffd36b',fontSize:12,fontWeight:'900',marginBottom:8},heroTitle:{color:'#fff',fontSize:28,fontWeight:'900'},heroText:{color:'#fff',fontSize:17,marginTop:8,lineHeight:24},search:{backgroundColor:'#fff',marginHorizontal:18,padding:17,borderRadius:18,fontSize:16,borderWidth:1,borderColor:'#ded8d0'},title:{fontSize:24,fontWeight:'900',marginHorizontal:18,marginTop:25,marginBottom:12,color:'#111'},offers:{paddingHorizontal:16,paddingBottom:4},offer:{width:255,minHeight:142,backgroundColor:'#111',borderRadius:22,padding:18,marginRight:10,justifyContent:'space-between'},offerTitle:{color:'#fff',fontSize:19,fontWeight:'900'},offerText:{color:'#cfcfcf',fontSize:13,lineHeight:18,marginVertical:8},offerLink:{color:'#e4b650',fontSize:12,fontWeight:'900'},cats:{paddingHorizontal:16,paddingBottom:10},cat:{backgroundColor:'#fff',paddingHorizontal:22,paddingVertical:13,borderRadius:26,marginRight:9,borderWidth:1,borderColor:'#eee9e2'},sub:{backgroundColor:'#e5e0d9',paddingHorizontal:16,paddingVertical:11,borderRadius:22,marginRight:8},active:{backgroundColor:'#b51920',borderColor:'#b51920'},catText:{fontWeight:'900',fontSize:16},subText:{fontWeight:'800',fontSize:14},activeText:{color:'#fff'},count:{marginHorizontal:20,color:'#777',fontWeight:'700',marginBottom:7},card:{backgroundColor:'#fff',marginHorizontal:16,marginVertical:6,padding:14,borderRadius:22,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#f0ece6'},iconBox:{width:54,height:54,borderRadius:16,backgroundColor:'#f4f1ec',alignItems:'center',justifyContent:'center',marginRight:10},emoji:{fontSize:29},info:{flex:1},name:{fontSize:16,fontWeight:'900',lineHeight:20},code:{fontSize:11,color:'#999',marginTop:3},price:{fontSize:19,fontWeight:'900',color:'#b51920',marginTop:4},unit:{fontSize:13},hint:{fontSize:11,color:'#777',marginTop:3},qty:{alignItems:'center',marginLeft:5},qbtn:{width:42,height:42,borderRadius:13,backgroundColor:'#111',alignItems:'center',justifyContent:'center'},qplus:{backgroundColor:'#b51920'},qtxt:{color:'#fff',fontSize:25,fontWeight:'900'},qvalue:{fontWeight:'900',paddingVertical:6,fontSize:12},noResults:{backgroundColor:'#fff',margin:18,padding:24,borderRadius:18,alignItems:'center'},noResultsTitle:{fontWeight:'900',fontSize:17},noResultsText:{color:'#777',marginTop:5},cart:{backgroundColor:'#111',margin:18,padding:20,borderRadius:22},cartTitle:{color:'#fff',fontSize:24,fontWeight:'900',marginBottom:12},empty:{color:'#bbb'},cartLine:{flexDirection:'row',justifyContent:'space-between',paddingVertical:6},cartItem:{color:'#fff',flex:1,fontSize:13},cartValue:{color:'#fff',fontWeight:'800'},totalLine:{borderTopWidth:1,borderTopColor:'#555',marginTop:14,paddingTop:14,flexDirection:'row',justifyContent:'space-between'},totalLabel:{color:'#fff',fontSize:20,fontWeight:'900'},totalValue:{color:'#d9ad54',fontSize:22,fontWeight:'900'},row:{flexDirection:'row',marginHorizontal:14},option:{flex:1,backgroundColor:'#fff',padding:15,borderRadius:14,marginHorizontal:4,alignItems:'center',borderWidth:1,borderColor:'#ece7e0'},optionText:{fontWeight:'900'},form:{marginHorizontal:18,marginTop:14},formLabel:{fontWeight:'900',marginBottom:8,fontSize:15},input:{backgroundColor:'#fff',padding:15,borderRadius:14,fontSize:16,marginBottom:9,borderWidth:1,borderColor:'#ece7e0'},whats:{backgroundColor:'#25D366',marginHorizontal:18,marginTop:28,paddingVertical:19,borderRadius:18,alignItems:'center'},whatsText:{color:'#fff',fontWeight:'900',fontSize:16},address:{textAlign:'center',color:'#555',marginTop:20},floatingCart:{position:'absolute',left:14,right:14,bottom:16,backgroundColor:'#111',borderRadius:20,paddingHorizontal:18,paddingVertical:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderWidth:2,borderColor:'#d9ad54'},floatingTitle:{color:'#fff',fontSize:16,fontWeight:'900'},floatingSmall:{color:'#aaa',fontSize:11,marginTop:2},floatingValue:{color:'#e4b650',fontSize:18,fontWeight:'900'}
});