import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { mercearia } from './mercearia';
const logo = require('./logo.jpeg');

const produtos = [
  { id: 1, categoria: 'Bovinos', nome: 'Picanha', preco: 99.90, unidade: 'kg', emoji: '🥩' },
  { id: 2, categoria: 'Bovinos', nome: 'Contra Filé', preco: 64.90, unidade: 'kg', emoji: '🥩' },
  { id: 3, categoria: 'Bovinos', nome: 'Maminha', preco: 63.90, unidade: 'kg', emoji: '🥩' },

  { id: 4, categoria: 'Suínos', nome: 'Linguiça', preco: 19.90, unidade: 'kg', emoji: '🌭' },
  { id: 5, categoria: 'Suínos', nome: 'Panceta', preco: 19.90, unidade: 'kg', emoji: '🥓' },

  { id: 6, categoria: 'Frangos', nome: 'Peito de Frango', preco: 19.90, unidade: 'kg', emoji: '🍗' },
  { id: 7, categoria: 'Frangos', nome: 'Tulipa', preco: 29.90, unidade: 'kg', emoji: '🍗' },

  { id: 8, categoria: 'Churrasco', nome: 'Coração', preco: 39.90, unidade: 'kg', emoji: '🥩' },
  { id: 9, categoria: 'Churrasco', nome: 'Queijo Coalho', preco: 25.00, unidade: 'un', emoji: '🧀' },
  { id: 10, categoria: 'Churrasco', nome: 'Pão de Alho', preco: 14.00, unidade: 'un', emoji: '🥖' },
...mercearia,
];

const categorias = ['Bovinos', 'Suínos', 'Frangos', 'Churrasco', 'Mercearia'];

const dinheiro = (valor) =>
  `R$ ${valor.toFixed(2).replace('.', ',')}`;

export default function App() {
const [categoria, setCategoria] = useState('Bovinos');
const [subcategoria, setSubcategoria] = useState('Todos');
const [quantidades, setQuantidades] = useState({});
  const [recebimento, setRecebimento] = useState('Delivery');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [pagamento, setPagamento] = useState('Pix');

  const alterarQuantidade = (produto, alteracao) => {
    setQuantidades((anterior) => {
      const atual = anterior[produto.id] || 0;
      const passo = produto.unidade === 'kg' ? 0.5 : 1;

      let nova = atual + alteracao * passo;
      if (nova < 0) nova = 0;

      return {
        ...anterior,
        [produto.id]: Number(nova.toFixed(1)),
      };
    });
  };

  const carrinho = useMemo(() => {
    return produtos
      .filter((produto) => (quantidades[produto.id] || 0) > 0)
      .map((produto) => ({
        ...produto,
        quantidade: quantidades[produto.id],
      }));
  }, [quantidades]);

  const total = useMemo(() => {
    return carrinho.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    );
  }, [carrinho]);

  const quantidadeFormatada = (produto) => {
    const qtd = quantidades[produto.id] || 0;

    if (produto.unidade === 'kg') {
      return `${qtd.toFixed(1).replace('.', ',')}kg`;
    }

    return `${qtd} un`;
  };

  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione algum produto ao pedido.');
      return;
    }

    if (recebimento === 'Delivery' && !endereco.trim()) {
      Alert.alert(
        'Informe o endereço',
        'Digite o endereço para receber o pedido.'
      );
      return;
    }

    const itens = carrinho
      .map((item) => {
        const qtd =
          item.unidade === 'kg'
            ? `${item.quantidade.toFixed(1).replace('.', ',')} kg`
            : `${item.quantidade} un`;

        const subtotal = item.preco * item.quantidade;

        return `• ${item.nome} — ${qtd} — ${dinheiro(subtotal)}`;
      })
      .join('\n');

    const entrega =
      recebimento === 'Delivery'
        ? `🚚 Delivery\n📍 Endereço: ${endereco}\n🏘️ Bairro: ${bairro || 'Não informado'}`
        : '🏪 Retirada no Açougue do Alemão';

    const mensagem =
`Olá! Quero fazer um pedido no Açougue do Alemão 🥩

🛒 PEDIDO
${itens}

💰 TOTAL: ${dinheiro(total)}

${entrega}

💳 Pagamento: ${pagamento}`;

    const url =
      `https://wa.me/5511975187941?text=${encodeURIComponent(mensagem)}`;

    try {
      await Linking.openURL(url);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    }
  };

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.header}>
          <Text style={styles.brand}>AÇOUGUE DO ALEMÃO</Text>
          <Text style={styles.subtitle}>Qualidade na sua mesa 🥩</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Peça sem sair de casa</Text>
          <Text style={styles.heroText}>
            Escolha seus produtos e receba por delivery ou retire no açougue.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>🛒 Nossos produtos</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categorias.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                categoria === item && styles.categoryButtonActive,
              ]}
              onPress={() => setCategoria(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  categoria === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
{categoria === 'Mercearia' && (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categories}
  >
    {[
      'Todos',
      'Cervejas',
      'Refrigerantes',
      'Doces',
      'Molhos',
      'Massas',
      'Laticínios',
      'Outros'
    ].map((item) => (
      <TouchableOpacity
        key={item}
        style={[
          styles.categoryButton,
          subcategoria === item && styles.categoryButtonActive,
        ]}
        onPress={() => setSubcategoria(item)}
      >
        <Text
          style={[
            styles.categoryText,
            subcategoria === item && styles.categoryTextActive,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)}
{produtos
  .filter((produto) => {
    if (categoria !== 'Mercearia') {
      return produto.categoria === categoria;
    }

    if (subcategoria === 'Todos') {
      return produto.categoria === 'Mercearia';
    }

    return produto.categoria === subcategoria;
  })
  .map((produto, index) => (
  <View
    style={styles.productCard}
    key={`${produto.codigo || produto.id || 'produto'}-${index}`}
  >
              <Text style={styles.productEmoji}>{produto.emoji}</Text>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{produto.nome}</Text>
                <Text style={styles.productPrice}>
                  {dinheiro(produto.preco)}/{produto.unidade}
                </Text>
                <Text style={styles.productHint}>
                  {produto.unidade === 'kg'
                    ? 'Cada toque = 500 g'
                    : 'Cada toque = 1 unidade'}
                </Text>
              </View>

              <View style={styles.quantityArea}>
  <TouchableOpacity
    style={styles.quantityButton}
    onPress={() => alterarQuantidade(produto, -1)}
  >
    <Text style={styles.quantityButtonText}>-</Text>
  </TouchableOpacity>

  <Text style={styles.quantityText}>
    {quantidadeFormatada(produto)}
  </Text>

  <TouchableOpacity
    style={styles.quantityButton}
    onPress={() => alterarQuantidade(produto, 1)}
  >
    <Text style={styles.quantityButtonText}>+</Text>
  </TouchableOpacity>
</View>
</View>
))}
        
        <View style={styles.cart}>
          <Text style={styles.cartTitle}>🛒 Seu carrinho</Text>

          {carrinho.length === 0 ? (
            <Text style={styles.emptyCart}>
              Seu carrinho ainda está vazio.
            </Text>
          ) : (
            carrinho.map((item) => (
              <View style={styles.cartLine} key={item.id}>
                <Text style={styles.cartItem}>
                  {item.nome} ×{' '}
                  {item.unidade === 'kg'
                    ? `${item.quantidade.toFixed(1).replace('.', ',')}kg`
                    : item.quantidade}
                </Text>

                <Text style={styles.cartValue}>
                  {dinheiro(item.preco * item.quantidade)}
                </Text>
              </View>
            ))
          )}

          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{dinheiro(total)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>🚚 Como deseja receber?</Text>

        <View style={styles.optionRow}>
          {['Delivery', 'Retirada'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                recebimento === item && styles.optionActive,
              ]}
              onPress={() => setRecebimento(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  recebimento === item && styles.optionTextActive,
                ]}
              >
                {item === 'Delivery' ? '🚚 Delivery' : '🏪 Retirada'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {recebimento === 'Delivery' && (
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Endereço de entrega</Text>

            <TextInput
              style={styles.input}
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, número e complemento"
              placeholderTextColor="#777"
            />

            <TextInput
              style={styles.input}
              value={bairro}
              onChangeText={setBairro}
              placeholder="Bairro"
              placeholderTextColor="#777"
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>💳 Forma de pagamento</Text>

        <View style={styles.paymentArea}>
          {['Pix', 'Débito', 'Crédito'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.paymentButton,
                pagamento === item && styles.paymentActive,
              ]}
              onPress={() => setPagamento(item)}
            >
              <Text
                style={[
                  styles.paymentText,
                  pagamento === item && styles.paymentTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={finalizarPedido}
        >
          <Text style={styles.whatsappText}>
            📲 FINALIZAR PEDIDO NO WHATSAPP
          </Text>
        </TouchableOpacity>

        <Text style={styles.address}>
          📍 Rua Maringá, 216 — Jundiaí
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#111',
  },

  container: {
    flex: 1,
    backgroundColor: '#f6f2ec',
  },

  content: {
    paddingBottom: 50,
  },

  logo: {
    width: '100%',
    height: 150,
    backgroundColor: '#111',
  },

  header: {
    backgroundColor: '#111',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },

  brand: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },

  subtitle: {
    color: '#d9ad54',
    fontSize: 17,
    marginTop: 6,
  },

  hero: {
    margin: 18,
    padding: 24,
    borderRadius: 22,
    backgroundColor: '#a5161d',
  },

  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },

  heroText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 27,
    marginTop: 12,
  },

  sectionTitle: {
    color: '#111',
    fontSize: 25,
    fontWeight: '900',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },

  categories: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 28,
    marginRight: 10,
  },

  categoryButtonActive: {
    backgroundColor: '#b51920',
  },

  categoryText: {
    color: '#111',
    fontSize: 17,
    fontWeight: '800',
  },

  categoryTextActive: {
    color: '#fff',
  },

  productCard: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginVertical: 7,
    padding: 18,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productEmoji: {
    fontSize: 36,
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    color: '#111',
    fontSize: 19,
    fontWeight: '900',
  },

  productPrice: {
    color: '#b51920',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
  },

  productHint: {
    color: '#777',
    marginTop: 4,
  },

  quantityArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
  },

  quantityText: {
    minWidth: 64,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
  },

  cart: {
    backgroundColor: '#111',
    margin: 18,
    padding: 22,
    borderRadius: 22,
  },

  cartTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 15,
  },

  emptyCart: {
    color: '#ccc',
    fontSize: 16,
  },

  cartLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },

  cartItem: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },

  cartValue: {
    color: '#fff',
    fontWeight: '800',
  },

  totalLine: {
    borderTopWidth: 1,
    borderTopColor: '#555',
    marginTop: 15,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },

  totalValue: {
    color: '#d9ad54',
    fontSize: 24,
    fontWeight: '900',
  },

  optionRow: {
    flexDirection: 'row',
    marginHorizontal: 18,
  },

  optionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  optionActive: {
    backgroundColor: '#b51920',
  },

  optionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },

  optionTextActive: {
    color: '#fff',
  },

  form: {
    marginHorizontal: 18,
    marginTop: 18,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 10,
  },

  paymentArea: {
    flexDirection: 'row',
    marginHorizontal: 18,
  },

  paymentButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  paymentActive: {
    backgroundColor: '#b51920',
  },

  paymentText: {
    fontWeight: '800',
    color: '#111',
  },

  paymentTextActive: {
    color: '#fff',
  },

  whatsappButton: {
    backgroundColor: '#25D366',
    marginHorizontal: 18,
    marginTop: 30,
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: 'center',
  },

  whatsappText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },

  address: {
    textAlign: 'center',
    color: '#555',
    marginTop: 22,
    fontSize: 15,
  },
});