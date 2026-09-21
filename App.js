import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ofertas = [
  { nome: 'Picanha', preco: 'R$ 99,90/kg', emoji: '🥩' },
  { nome: 'Contra Filé', preco: 'R$ 64,90/kg', emoji: '🥩' },
  { nome: 'Linguiça', preco: 'R$ 19,90/kg', emoji: '🌭' },
  { nome: 'Peito de Frango', preco: 'R$ 19,90/kg', emoji: '🍗' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brand}>AÇOUGUE DO ALEMÃO</Text>
          <Text style={styles.subtitle}>Qualidade na sua mesa 🥩</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Peça sem sair de casa</Text>
          <Text style={styles.heroText}>Escolha seus produtos e receba por delivery ou retire no açougue.</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>VER PRODUTOS</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>🔥 Ofertas</Text>
        <View style={styles.grid}>
          {ofertas.map((item) => (
            <View key={item.nome} style={styles.card}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.product}>{item.nome}</Text>
              <Text style={styles.price}>{item.preco}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Como quer receber?</Text>
        <View style={styles.deliveryRow}>
          <TouchableOpacity style={styles.option}><Text style={styles.optionIcon}>🛵</Text><Text style={styles.optionText}>Delivery</Text></TouchableOpacity>
          <TouchableOpacity style={styles.option}><Text style={styles.optionIcon}>🏪</Text><Text style={styles.optionText}>Retirada</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.whatsapp}>
          <Text style={styles.whatsappText}>📲 Finalizar pelo WhatsApp</Text>
        </TouchableOpacity>
        <Text style={styles.address}>Rua Maringá, 216 • Jundiaí/SP</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#151515' },
  container: { flex: 1, backgroundColor: '#f6f3ed' },
  header: { backgroundColor: '#151515', padding: 24, paddingTop: 34 },
  brand: { color: '#fff', fontSize: 24, fontWeight: '900' },
  subtitle: { color: '#d8b56a', marginTop: 4, fontSize: 14 },
  hero: { margin: 16, backgroundColor: '#7d1519', borderRadius: 18, padding: 22 },
  heroTitle: { color: '#fff', fontSize: 27, fontWeight: '900' },
  heroText: { color: '#f8eaea', fontSize: 15, lineHeight: 21, marginTop: 8 },
  primaryButton: { backgroundColor: '#fff', padding: 13, borderRadius: 10, marginTop: 18, alignSelf: 'flex-start' },
  primaryButtonText: { color: '#7d1519', fontWeight: '900' },
  sectionTitle: { fontSize: 21, fontWeight: '900', color: '#222', marginHorizontal: 16, marginTop: 16, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  card: { width: '46%', backgroundColor: '#fff', margin: '2%', borderRadius: 14, padding: 14, elevation: 2 },
  emoji: { fontSize: 38 },
  product: { fontWeight: '800', fontSize: 16, marginTop: 8 },
  price: { color: '#7d1519', fontSize: 17, fontWeight: '900', marginTop: 4 },
  addButton: { backgroundColor: '#151515', borderRadius: 8, padding: 9, marginTop: 12 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  deliveryRow: { flexDirection: 'row', marginHorizontal: 12 },
  option: { flex: 1, backgroundColor: '#fff', margin: 4, padding: 18, borderRadius: 14, alignItems: 'center' },
  optionIcon: { fontSize: 30 },
  optionText: { fontWeight: '800', marginTop: 5 },
  whatsapp: { backgroundColor: '#1f9d55', margin: 16, padding: 17, borderRadius: 12 },
  whatsappText: { color: '#fff', textAlign: 'center', fontWeight: '900', fontSize: 16 },
  address: { textAlign: 'center', color: '#666', marginBottom: 30 },
});