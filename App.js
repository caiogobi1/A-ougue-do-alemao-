import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const produtos = [
  { id: 1, categoria: 'Bovinos', nome: 'Picanha', preco: 99.90, unidade: 'kg', emoji: '🥩' },
  { id: 2, categoria: 'Bovinos', nome: 'Contra Filé', preco: 64.90, unidade: 'kg', emoji: '🥩' },
  { id: 3, categoria: 'Bovinos', nome: 'Maminha', preco: 63.90, unidade: 'kg', emoji: '🥩' },
  { id: 4, categoria: 'Suínos', nome: 'Linguiça', preco: 19.90, unidade: 'kg', emoji: '🌭' },
  { id: 5, categoria: 'Suínos', nome: 'Panceta', preco: 19.90, unidade: 'kg', emoji: '🥓' },
  { id: 6, categoria: 'Frangos', nome: 'Peito de Frango', preco: 19.90, unidade: 'kg', emoji: '🍗' },
  { id: 7, categoria: 'Frangos', nome: 'Tulipa', preco: 29.90, unidade: 'kg', emoji: '🍗' },
  { id: 8, categoria: 'Churrasco', nome: 'Coração', preco: 39.90, unidade: 'kg', emoji: '🍖' },
  { id: 9, categoria: 'Churrasco', nome: 'Queijo Coalho', preco: 25.00, unidade: 'un', emoji: '🧀' },
  { id: 10, categoria: 'Churrasco', nome: 'Pão de Alho', preco: 14.00, unidade: 'un', emoji: '🥖' },
];

const dinheiro = v => `R$ ${v.toFixed(2).replace('.', ',')}`;

export default function App() {
  const [categoria, setCategoria] = useState('Bovinos');
  const [carrinho, setCarrinho] = useState({});
  const [recebimento, setRecebimento] = useState('Retirada');
  const [pagamento, setPagamento] = useState('Pix');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');

  const alterar = (item, delta) => {
    const passo = item.unidade === 'kg' ? 0.5 : 1;
    setCarrinho(atual => ({ ...atual, [item.id]: Math.max(0, (atual[item.id] || 0) + delta * passo) }));
  };

  const total = useMemo(() => produtos.reduce((s, p) => s + (carrinho[p.id] || 0) * p.preco, 0), [carrinho]);
  const selecionados = produtos.filter(p => (carrinho[p.id] || 0) > 0);

  const finalizar = async () => {
    if (!nome.trim()) return Alert.alert('Informe seu nome');
    if (selecionados.length === 0) return Alert.alert('Adicione pelo menos um produto');
    if (recebimento === 'Delivery' && (!endereco.trim() || !bairro.trim())) return Alert.alert('Informe endereço e bairro para o delivery');

    const itens = selecionados.map(p => {
      const q = carrinho[p.id];
      const qtd = p.unidade === 'kg' ? `${q.toFixed(1).replace('.', ',')} kg` : `${q} un`;
      return `• ${p.nome}: ${qtd} - ${dinheiro(q * p.preco)}`;
    }).join('\n');

    const entrega = recebimento === 'Delivery'
      ? `\n📍 Endereço: ${endereco}\nBairro: ${bairro}\nComplemento: ${complemento || 'Não informado'}`
      : '';

    const msg = `Olá! Quero fazer um pedido no Açougue do Alemão 🥩\n\n👤 Nome: ${nome}\n\n${itens}\n\n💰 Total: ${dinheiro(total)}\n📦 Recebimento: ${recebimento}${entrega}\n💳 Pagamento: ${pagamento}\n\nGostaria de confirmar meu pedido.`;
    await Linking.openURL(`https://wa.me/5511975187941?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><Text style={styles.brand}>AÇOUGUE DO ALEMÃO</Text><Text style={styles.subtitle}>Qualidade na sua mesa 🥩</Text></View>
        <View style={styles.hero}><Text style={styles.heroTitle}>Peça sem sair de casa</Text><Text style={styles.heroText}>Escolha seus produtos e receba por delivery ou retire no açougue.</Text></View>

        <Text style={styles.sectionTitle}>🛒 Nossos produtos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {['Bovinos','Suínos','Frangos','Churrasco'].map(c => <TouchableOpacity key={c} onPress={() => setCategoria(c)} style={[styles.category, categoria === c && styles.categoryActive]}><Text style={[styles.categoryText, categoria === c && styles.categoryTextActive]}>{c}</Text></TouchableOpacity>)}
        </ScrollView>

        {produtos.filter(p => p.categoria === categoria).map(p => {
          const q = carrinho[p.id] || 0;
          return <View key={p.id} style={styles.productCard}>
            <Text style={styles.emoji}>{p.emoji}</Text>
            <View style={styles.productInfo}><Text style={styles.productName}>{p.nome}</Text><Text style={styles.price}>{dinheiro(p.preco)}/{p.unidade}</Text>{p.unidade === 'kg' && <Text style={styles.hint}>Cada toque = 500 g</Text>}</View>
            <View style={styles.counter}><TouchableOpacity onPress={() => alterar(p,-1)} style={styles.counterButton}><Text style={styles.counterButtonText}>−</Text></TouchableOpacity><Text style={styles.qty}>{p.unidade === 'kg' ? `${q.toFixed(1).replace('.', ',')}kg` : q}</Text><TouchableOpacity onPress={() => alterar(p,1)} style={styles.counterButton}><Text style={styles.counterButtonText}>+</Text></TouchableOpacity></View>
          </View>;
        })}

        <Text style={styles.sectionTitle}>📦 Como quer receber?</Text>
        <View style={styles.row}>{['Retirada','Delivery'].map(x => <TouchableOpacity key={x} onPress={() => setRecebimento(x)} style={[styles.option, recebimento === x && styles.selected]}><Text style={styles.optionIcon}>{x === 'Retirada' ? '🏪' : '🛵'}</Text><Text style={styles.optionText}>{x}</Text></TouchableOpacity>)}</View>

        <Text style={styles.sectionTitle}>👤 Seus dados</Text>
        <TextInput value={nome} onChangeText={setNome} placeholder="Seu nome" style={styles.input} />
        {recebimento === 'Delivery' && <><TextInput value={endereco} onChangeText={setEndereco} placeholder="Rua e número" style={styles.input}/><TextInput value={bairro} onChangeText={setBairro} placeholder="Bairro" style={styles.input}/><TextInput value={complemento} onChangeText={setComplemento} placeholder="Complemento (opcional)" style={styles.input}/></>}

        <Text style={styles.sectionTitle}>💳 Forma de pagamento</Text>
        <View style={styles.row}>{['Pix','Débito','Crédito'].map(x => <TouchableOpacity key={x} onPress={() => setPagamento(x)} style={[styles.pay, pagamento === x && styles.selected]}><Text style={styles.payText}>{x}</Text></TouchableOpacity>)}</View>

        <View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.total}>{dinheiro(total)}</Text></View>
        <TouchableOpacity onPress={finalizar} style={styles.whatsapp}><Text style={styles.whatsappText}>Finalizar pedido no WhatsApp</Text></TouchableOpacity>
        <Text style={styles.address}>📍 Rua Maringá, 216 • Jundiaí/SP</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#111'}, container:{flex:1,backgroundColor:'#f6f3ed'}, header:{backgroundColor:'#111',padding:24,paddingTop:34}, brand:{color:'#fff',fontSize:25,fontWeight:'900'}, subtitle:{color:'#d8b56a',marginTop:5,fontSize:15}, hero:{margin:16,backgroundColor:'#8f171c',borderRadius:20,padding:24}, heroTitle:{color:'#fff',fontSize:28,fontWeight:'900'}, heroText:{color:'#fff',fontSize:17,lineHeight:25,marginTop:12}, sectionTitle:{fontSize:24,fontWeight:'900',marginHorizontal:16,marginTop:20,marginBottom:12}, categories:{paddingHorizontal:12,gap:8}, category:{backgroundColor:'#fff',paddingVertical:12,paddingHorizontal:22,borderRadius:24}, categoryActive:{backgroundColor:'#a7191f'}, categoryText:{fontWeight:'800',fontSize:16}, categoryTextActive:{color:'#fff'}, productCard:{marginHorizontal:16,marginBottom:10,padding:16,borderRadius:18,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}, emoji:{fontSize:34,width:48}, productInfo:{flex:1}, productName:{fontSize:18,fontWeight:'900'}, price:{fontSize:18,fontWeight:'900',color:'#a7191f',marginTop:3}, hint:{fontSize:11,color:'#777',marginTop:2}, counter:{flexDirection:'row',alignItems:'center',gap:10}, counterButton:{width:45,height:45,borderRadius:10,backgroundColor:'#111',alignItems:'center',justifyContent:'center'}, counterButtonText:{color:'#fff',fontSize:28,fontWeight:'900'}, qty:{fontSize:16,fontWeight:'900',minWidth:42,textAlign:'center'}, row:{flexDirection:'row',marginHorizontal:12}, option:{flex:1,backgroundColor:'#fff',margin:4,padding:20,borderRadius:16,alignItems:'center',borderWidth:2,borderColor:'transparent'}, selected:{borderColor:'#a7191f'}, optionIcon:{fontSize:28}, optionText:{fontWeight:'900',fontSize:17,marginTop:5}, input:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ddd',borderRadius:14,padding:16,fontSize:16,marginHorizontal:16,marginBottom:10}, pay:{flex:1,backgroundColor:'#fff',margin:4,padding:18,borderRadius:14,alignItems:'center',borderWidth:2,borderColor:'transparent'}, payText:{fontSize:17,fontWeight:'900'}, totalRow:{borderTopWidth:1,borderColor:'#ccc',margin:16,paddingTop:18,flexDirection:'row',justifyContent:'space-between'}, totalLabel:{fontSize:24,fontWeight:'900'}, total:{fontSize:27,fontWeight:'900',color:'#b21f24'}, whatsapp:{backgroundColor:'#20a357',marginHorizontal:16,padding:18,borderRadius:14}, whatsappText:{color:'#fff',fontSize:18,fontWeight:'900',textAlign:'center'}, address:{textAlign:'center',color:'#666',fontSize:14,marginVertical:24}
});