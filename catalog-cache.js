export const CACHE_KEY = 'catalogo_alemao_v1';
export function isCatalog(value) {
  return Array.isArray(value) && value.every(p => p && p.id != null && typeof p.nome === 'string' && Number.isFinite(Number(p.preco)) && typeof p.categoria === 'string');
}
// Only replace the cache after every page succeeds. An empty result is valid
// and must clear previously available products.
export async function fetchCatalog(client, signal) {
  const products = [];
  const size = 500;
  for (let start = 0; ; start += size) {
    const { data, error } = await client.from('produtos_app')
      .select('id,codigo,nome,preco,unidade,categoria,disponivel,oferta,preco_oferta')
      .eq('disponivel', true).order('id').range(start, start + size - 1).abortSignal(signal);
    if (error) throw error;
    if (!isCatalog(data)) throw new Error('Catálogo inválido');
    products.push(...data);
    if (data.length < size) return products;
  }
}
