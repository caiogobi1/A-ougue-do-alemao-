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
 const qtd=p=>p.unidade==='kg'?`${(quantidades[p.id]||0).toFixed(1).replace('.',',')}kg`:`${quantidades[p.id]||0} un`;

 const finalizar=async()=>{
   if(!carrinho.length)return Alert.alert('Carrinho vazio','Adicione algum produto ao pedido.');
   if(recebimento==='Delivery'&&!endereco.trim())return Alert.alert('Informe o endereço','Digite o endereço para receber o pedido.');
   const itens=carrinho.map(p=>`• ${p.nome} — ${p.unidade==='kg'?p.quantidade.toFixed(1).replace('.',',')+' kg':p.quantidade+' un'} — ${dinheiro(p.preco*p.quantidade)}`).join('\n');
   const entrega=recebimento==='Delivery'?`🚚 Delivery\n📍 ${endereco}\n🏘️ ${bairro||'Bairro não informado'}`:'🏪 Retirada no Açougue do Alemão';
   const msg=`Olá! Quero fazer um pedido no Açougue do Alemão 🥩\n\n🛒 PEDIDO\n${itens}\n\n💰 TOTAL: ${dinheiro(total)}\n\n${entrega}\n\n💳 Pagamento: ${pagamento}`;
   try{await Linking.openURL(`https://wa.me/5511975187941?text=${encodeURIComponent(msg)}`)}catch{Alert.alert('Erro','Não foi possível abrir o WhatsApp.')}
 };

 return <View style={s.safe}><StatusBar style="light"/><ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
   <View style={s.topo}><Image source={logo} style={s.logo} resizeMode="contain"/><Text style={s.brand}>AÇOUGUE DO ALEMÃO</Text><Text style={s.subtitle}>Qualidade sempre com você</Text></View>
   <View style={s.hero}><Text style={s.heroTitle}>Peça sem sair de casa</Text><Text style={s.heroText}>Carnes, mercearia e bebidas em um só lugar.</Text></View>
   <TextInput style={s.search} value={busca} onChangeText={setBusca} placeholder="🔎 Buscar produto ou código..." placeholderTextColor="#777"/>
   <Text style={s.title}>🛒 Nossos produtos</Text>
   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cats}>{categorias.map(x=><TouchableOpacity key={x} style={[s.cat,categoria===x&&s.active]} onPress={()=>{setCategoria(x);setSubcategoria('Todos')}}><Text style={[s.catText,categoria===x&&s.activeText]}>{x}</Text></TouchableOpacity>)}</ScrollView>
   {categoria==='Mercearia'&&<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cats}>{subs.map(x=><TouchableOpacity key={x} style={[s.sub,subcategoria===x&&s.active]} onPress={()=>setSubcategoria(x)}><Text style={[s.subText,subcategoria===x&&s.activeText]}>{x}</Text></TouchableOpacity>)}</ScrollView>}
   <Text style={s.count}>{visiveis.length} produtos encontrados</Text>
   {visiveis.map((p,i)=><View style={s.card} key={`${p.id}-${i}`}><Text style={s.emoji}>{p.emoji||'🛒'}</Text><View style={s.info}><Text style={s.name}>{p.nome}</Text><Text style={s.code}>Cód. {p.codigo||'-'}</Text><Text style={s.price}>{dinheiro(p.preco)}/{p.unidade}</Text><Text style={s.hint}>{p.unidade==='kg'?'Cada toque = 500 g':'Cada toque = 1 unidade'}</Text></View><View style={s.qty}><TouchableOpacity style={s.qbtn} onPress={()=>alterar(p,-1)}><Text style={s.qtxt}>−</Text></TouchableOpacity><Text style={s.qvalue}>{qtd(p)}</Text><TouchableOpacity style={s.qbtn} onPress={()=>alterar(p,1)}><Text style={s.qtxt}>+</Text></TouchableOpacity></View></View>)}
   <View style={s.cart}><Text style={s.cartTitle}>🛒 Seu carrinho</Text>{!carrinho.length?<Text style={s.empty}>Seu carrinho ainda está vazio.</Text>:carrinho.map(p=><View style={s.cartLine} key={p.id}><Text style={s.cartItem}>{p.nome} × {p.unidade==='kg'?`${p.quantidade.toFixed(1).replace('.',',')}kg`:p.quantidade}</Text><Text style={s.cartValue}>{dinheiro(p.preco*p.quantidade)}</Text></View>)}<View style={s.totalLine}><Text style={s.totalLabel}>TOTAL</Text><Text style={s.totalValue}>{dinheiro(total)}</Text></View></View>
   <Text style={s.title}>🚚 Como deseja receber?</Text><View style={s.row}>{['Delivery','Retirada'].map(x=><TouchableOpacity key={x} style={[s.option,recebimento===x&&s.active]} onPress={()=>setRecebimento(x)}><Text style={[s.optionText,recebimento===x&&s.activeText]}>{x==='Delivery'?'🚚 Delivery':'🏪 Retirada'}</Text></TouchableOpacity>)}</View>
   {recebimento==='Delivery'&&<View style={s.form}><TextInput style={s.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, número e complemento" placeholderTextColor="#777"/><TextInput style={s.input} value={bairro} onChangeText={setBairro} placeholder="Bairro" placeholderTextColor="#777"/></View>}
   <Text style={s.title}>💳 Forma de pagamento</Text><View style={s.row}>{['Pix','Débito','Crédito'].map(x=><TouchableOpacity key={x} style={[s.option,pagamento===x&&s.active]} onPress={()=>setPagamento(x)}><Text style={[s.optionText,pagamento===x&&s.activeText]}>{x}</Text></TouchableOpacity>)}</View>
   <TouchableOpacity style={s.whats} onPress={finalizar}><Text style={s.whatsText}>📲 FINALIZAR PEDIDO NO WHATSAPP</Text></TouchableOpacity><Text style={s.address}>📍 Rua Maringá, 216 — Jundiaí</Text>
 </ScrollView></View>
}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#0b0b0b'},container:{flex:1,backgroundColor:'#f4f1ec'},content:{paddingBottom:50},topo:{backgroundColor:'#0b0b0b',alignItems:'center',paddingBottom:24},logo:{width:'100%',height:150},brand:{color:'#fff',fontSize:27,fontWeight:'900'},subtitle:{color:'#d9ad54',fontSize:16,marginTop:4},hero:{margin:18,padding:22,borderRadius:22,backgroundColor:'#a5161d'},heroTitle:{color:'#fff',fontSize:27,fontWeight:'900'},heroText:{color:'#fff',fontSize:17,marginTop:8},search:{backgroundColor:'#fff',marginHorizontal:18,padding:16,borderRadius:16,fontSize:16,borderWidth:1,borderColor:'#e2ddd5'},title:{fontSize:24,fontWeight:'900',marginHorizontal:18,marginTop:24,marginBottom:12,color:'#111'},cats:{paddingHorizontal:16,paddingBottom:10},cat:{backgroundColor:'#fff',paddingHorizontal:22,paddingVertical:13,borderRadius:26,marginRight:9},sub:{backgroundColor:'#e5e0d9',paddingHorizontal:16,paddingVertical:11,borderRadius:22,marginRight:8},active:{backgroundColor:'#b51920'},catText:{fontWeight:'900',fontSize:16},subText:{fontWeight:'800',fontSize:14},activeText:{color:'#fff'},count:{marginHorizontal:20,color:'#777',fontWeight:'700',marginBottom:6},card:{backgroundColor:'#fff',marginHorizontal:16,marginVertical:6,padding:15,borderRadius:20,flexDirection:'row',alignItems:'center'},emoji:{fontSize:30,marginRight:9},info:{flex:1},name:{fontSize:16,fontWeight:'900'},code:{fontSize:11,color:'#888',marginTop:2},price:{fontSize:18,fontWeight:'900',color:'#b51920',marginTop:3},hint:{fontSize:11,color:'#777',marginTop:3},qty:{alignItems:'center'},qbtn:{width:40,height:40,borderRadius:12,backgroundColor:'#111',alignItems:'center',justifyContent:'center'},qtxt:{color:'#fff',fontSize:25,fontWeight:'900'},qvalue:{fontWeight:'900',paddingVertical:6,fontSize:13},cart:{backgroundColor:'#111',margin:18,padding:20,borderRadius:22},cartTitle:{color:'#fff',fontSize:24,fontWeight:'900',marginBottom:12},empty:{color:'#bbb'},cartLine:{flexDirection:'row',justifyContent:'space-between',paddingVertical:6},cartItem:{color:'#fff',flex:1,fontSize:13},cartValue:{color:'#fff',fontWeight:'800'},totalLine:{borderTopWidth:1,borderTopColor:'#555',marginTop:14,paddingTop:14,flexDirection:'row',justifyContent:'space-between'},totalLabel:{color:'#fff',fontSize:20,fontWeight:'900'},totalValue:{color:'#d9ad54',fontSize:22,fontWeight:'900'},row:{flexDirection:'row',marginHorizontal:14},option:{flex:1,backgroundColor:'#fff',padding:15,borderRadius:14,marginHorizontal:4,alignItems:'center'},optionText:{fontWeight:'900'},form:{marginHorizontal:18,marginTop:14},input:{backgroundColor:'#fff',padding:15,borderRadius:14,fontSize:16,marginBottom:9},whats:{backgroundColor:'#25D366',marginHorizontal:18,marginTop:28,paddingVertical:19,borderRadius:18,alignItems:'center'},whatsText:{color:'#fff',fontWeight:'900',fontSize:16},address:{textAlign:'center',color:'#555',marginTop:20}
});