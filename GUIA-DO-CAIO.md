# App do Açougue do Alemão

## O que funciona sem internet

Na primeira abertura é necessário ter internet e atualizar o catálogo. Ao abrir com internet, o app baixa o catálogo atual e o salva apenas no celular. Sem conexão, mostra a última cópia salva. Sem uma cópia salva, pede a primeira conexão. Os produtos e preços do banco não são incluídos no repositório. Preços e disponibilidade salvos podem estar desatualizados.

Busca, categorias e montagem do carrinho funcionam com o catálogo salvo. As fotos remotas são substituídas por imagens locais/identidade da loja nesse modo. Favoritos e dados do cliente permanecem salvos. O carrinho ainda não é persistido ao encerrar o aplicativo.

Toque em **Atualizar catálogo** para buscar alterações. O app também atualiza quando volta ao primeiro plano. Para enviar um pedido é necessário atualizar o catálogo e ter internet para WhatsApp e validação do endereço. Copiar uma chave Pix não confirma um pagamento; o app não tem integração que confirme pagamentos online.

## Tirar ou recolocar um produto

1. Entre em https://supabase.com/dashboard com a conta dona do projeto.
2. Abra o projeto e **Table Editor → produtos_app**.
3. Localize pelo campo `nome` ou `codigo`.
4. Para esconder, altere `disponivel` para `false` e salve. Para recolocar, use `true`.
5. No aplicativo conectado, toque em **Atualizar catálogo**.

Prefira esconder a apagar a linha: assim você consegue recolocar o mesmo produto. Um celular offline continuará mostrando a cópia antiga até atualizar.

## Mudar preço

Na mesma linha, altere `preco` e salve. Exemplo: 39.90 para R$ 39,90. Não inclua “R$”. O app atual usa o campo `preco`; `preco_oferta` não é aplicado ao total. O campo `oferta=true` apenas destaca o produto na seção de ofertas.

## Cadastrar um produto

No Table Editor, use **Insert → Insert row**:

| Campo | Exemplo |
|---|---|
| codigo | Um código novo, que ainda não existe |
| nome | LINGUIÇA TOSCANA |
| preco | 19.90 |
| categoria | Churrasco |
| unidade | kg (ou un para unidade) |
| disponivel | true |
| oferta | false (ou true para destacar) |

Mantenha os padrões automáticos de `id` e `created_at` mostrados no formulário; se não houver padrão, não invente um ID. Confira a definição da tabela antes de salvar.

Use a categoria exatamente como no cadastro existente: Bovinos, Suínos, Frangos, Churrasco, Peixes, Mercearia, Bebidas, Padaria, Hortfruti, Laticínios, Limpeza, Perfumaria, Utensílios Domésticos ou Animal. Bebidas são separadas no app por palavras do nome. Fotos ainda seguem regras do código; o cadastro não tem upload de fotos integrado.

## Instalar sem depender do terminal

O QR do `expo start --tunnel` é para desenvolvimento. Ele não equivale a uma versão independente instalada. O arquivo `eas.json` prepara builds Release internos, sem servidor de desenvolvimento.

Antes de trocar de branch no Codespaces, salve os arquivos e confira `git status`. Não descarte alterações locais. Compare especialmente qualquer painel de administração local que não esteja no GitHub.

Depois de aplicar esta alteração:

```bash
npm ci
npx eas-cli@latest login
npx eas-cli@latest build:configure
```

Entre na sua conta Expo; nunca envie senha ou código de verificação no chat.

### Android

```bash
npx eas-cli@latest build --platform android --profile preview
```

Ao terminar, abra o link do build no Android e instale o APK. Não exige publicar na Play Store.

### iPhone

O caminho de distribuição interna do EAS exige Apple Developer paga e registro do aparelho:

```bash
npx eas-cli@latest device:create
npx eas-cli@latest build --platform ios --profile preview
```

Siga o registro do iPhone e os prompts de assinatura. Conta Expo, conta Apple, credenciais e custos não foram configurados nesta alteração. A geração/instalação nativa ainda precisa ser feita. Para publicar aos clientes, há outra etapa de distribuição e revisão das lojas.

## Conferência no aparelho

1. Abra a versão instalada com internet e atualize o catálogo.
2. Feche o app, ative modo avião e abra novamente pelo ícone.
3. Confira busca, categorias, preços salvos e aviso de catálogo salvo.
4. Volte à internet e atualize: confirme que um produto ocultado no painel desaparece.
5. Durante o horário de atendimento, teste retirada e delivery até a revisão e confira o destino do WhatsApp antes de enviar uma mensagem de teste.

Não publicar para clientes antes dessa validação. A exportação do código não substitui o teste no iPhone.
