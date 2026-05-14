# LarCare — Copy Guidelines

Este documento é a bíblia da copy do LarCare. Toda string visível ao usuário — botão, label, placeholder, toast, FAQ, meta tag, mensagem de simulador — passa por este filtro antes de entrar no produto.

Mantenedor: Renato Cesar Rodrigues
Última revisão: 2026-05-14 (v2.2.0)

---

## 1. Voz da marca

O LarCare fala como uma vizinha competente que resolve. Não fala como startup, não fala como banco, não fala como manual de eletrodoméstico.

| Característica | Sim | Não |
| --- | --- | --- |
| Tom | Acolhedor sem ser piegas | "Querida, vamos te ajudar" |
| Postura | Direta sem ser fria | "Operação concluída" |
| Origem | Brasileira de boca | "Plataforma inovadora" |
| Especificidade | Cita bairro, cita prestador, cita valor | "Profissionais qualificados" |
| Voz | Ativa | "Sua demanda foi recebida" |
| CTAs | Imperativos | "Confirmar" |

Quando estiver em dúvida entre duas versões da mesma frase, escolha a que faz menos voltas pra dizer o que tem que ser dito.

---

## 2. Vocabulário-chave

Usar SEMPRE:

| Vocabulário LarCare | Em vez de |
| --- | --- |
| Cuidar da casa | Manutenção doméstica |
| Prestador | Profissional / Especialista |
| Pedir um serviço | Criar uma demanda |
| Combinar com o prestador | Negociar com o profissional |
| Resolver | Atender / Executar |
| Sem dor de cabeça | Sem complicação |
| Ribeirão Preto | RP / Ribeirão (nunca abreviar) |
| A gente | Nós (em copy informal) |
| Em até 30 minutos | Rapidamente / Em pouco tempo |
| Bairro X | Sua região (quando puder ser específico) |

**Palavra-âncora primária:** *resolver*
**Palavra-âncora secundária:** *cuidar*
**Sentimento-âncora:** *em dia*

---

## 3. Vocabulário proibido

NUNCA usar em copy visível ao usuário:

- Marketplace, plataforma, ecossistema, solução
- Conectamos, intermediamos, viabilizamos
- Empoderar, transformar, revolucionar
- Inovador, disruptivo, único, exclusivo
- Profissionais qualificados (sem qualificar o quê)
- Excelência, qualidade (adjetivos vazios)
- Querida, amiga, querido, fofinho (infantilização)
- Demanda (no sentido de pedido — use "pedido" ou "serviço")
- Cliente parceiro, prestador parceiro (jargão B2B vazio)
- Premium, elite, top, master
- Workflow, fluxo, journey, jornada do usuário
- Tecnologia de ponta

Adjetivos vazios em geral: se o adjetivo descreve qualquer empresa, ele descreve nenhuma.

---

## 4. Dual público — peso narrativo 75/25

LarCare atende dois públicos com necessidades diferentes:

**PRIMÁRIO (75% do peso narrativo):**
Mulher 30-60, classe B/C, chefe de casa em Ribeirão Preto. Sem homem de referência ou com homem indisponível. Resolve sozinha o que precisa ser resolvido.

**SECUNDÁRIO (25% do peso narrativo):**
Profissional ocupado (homem ou mulher, 25-70). Tem tempo escasso, prefere terceirizar manutenção. Valoriza eficiência acima do custo.

### Como honrar os dois sem segmentar

Em vez de ter "modo feminino" e "modo profissional ocupado", a copy aplica **pivote universal** que ambos enxergam:

- **75% das linhas falam pra chefe de casa** em pé de igualdade, sem infantilizar, sem chamar de querida. Tom de quem resolve junto.
- **25% das linhas têm pivote pra "tempo"** sem nomear gênero. Exemplos:
  - "Pra quem cuida da casa OU pra quem prefere terceirizar"
  - "Você decide se acompanha o serviço ou se chega depois e está pronto"
  - "Sem precisar pegar emprestado o sábado de ninguém"

### Validador

Antes de cada copy nova, pergunte:
- Uma mulher 45 anos chefe de casa em Ribeirão Preto leria isso e se sentiria respeitada?
- Um profissional 35 anos que trabalha o dia inteiro leria isso e enxergaria que é pra ele também?

Se a resposta pra **qualquer** das duas for "não", reescreve.

---

## 5. Hierarquia de mensagem por tela

Uma tela bem escrita carrega **uma** ideia. Cada elemento serve a essa ideia.

- **1 promessa por tela** (no hero, no card principal, no CTA grande)
- **1 CTA primário por tela** (verde-sálvia, grande, claro)
- **Suporte sempre embaixo** (sub-tagline, microcopy, depoimentos)
- **Números concretos > adjetivos** ("12 minutos" > "rápido"; "4 propostas" > "várias opções"; "R$ 95 a R$ 220" > "preços acessíveis")

---

## 6. Tagline oficial

**Tagline principal:** Casa em dia, sem dor de cabeça.

Aplicações:
- Hero da landing pública (Fraunces grande)
- Open Graph + Twitter Card
- JSON-LD `slogan`
- Topo da página Sobre
- Variantes em redes sociais

**Variantes aprovadas por contexto:**

- App contextual: "O que precisa hoje?" (saudação operacional, sem repetir tagline principal)
- Para clientes (landing dedicada): "Sua casa pede atenção. A gente resolve."
- Para prestadores (landing dedicada): "Trabalho sério, com cliente que respeita."
- Emergência: "Algo urgente? A gente resolve agora."
- Recorrência: "Sua casa funciona melhor com manutenção em dia."

**Slogan legado (mantido em alguns lugares por reconhecimento):** "Cuidar do lar, sem depender de ninguém."
Usado apenas no footer e como sub-eyebrow institucional. Não substitui a tagline principal.

---

## 7. Estrutura por tipo de copy

### 7.1. Empty states

Estrutura obrigatória:
1. Ilustração (SVG ou emoji discreto)
2. Título amigável e específico (não "Nada por aqui")
3. Descrição curta com o que normalmente acontece nesse estado
4. CTA explicando o próximo passo natural

Exemplo bom:
> 📋
> **Sem propostas ainda**
> Os prestadores estão olhando seu pedido. Em alguns minutos chegam as primeiras propostas.
> [Voltar pra início]

Exemplo ruim:
> ⚠️ Nenhum resultado encontrado.

### 7.2. Toasts

Curto, direto, sem ponto final em mensagens de uma frase.

- **Sucesso:** "Pedido enviado" / "Salvo" / "Pagamento confirmado"
- **Info:** "Em alguns minutos chegam as propostas"
- **Aviso:** "Verifique sua conexão"
- **Erro:** "Algo saiu do trilho. Tenta de novo?"

Proibido: "Operação concluída com sucesso" / "Erro 500" / "Tente novamente mais tarde"

### 7.3. Loading states

Específico do que está carregando:

- "Buscando prestadores perto de você..."
- "Confirmando sua escolha..."
- "Carregando suas conversas..."

Proibido: "Carregando..." / "Aguarde..." / "Processando..."

### 7.4. Botões

Sempre verbo + objeto. Nunca verbo isolado.

- ✅ "Pedir orçamento"
- ✅ "Aceitar proposta"
- ✅ "Combinar com o prestador"
- ✅ "Avaliar serviço"
- ❌ "OK" / "Enviar" / "Confirmar" / "Continuar"

### 7.5. Placeholders de input

Exemplo concreto, não instrução abstrata.

- ✅ "Conta o que precisa resolver. Pode ser específico."
- ✅ "Ex: torneira da cozinha está pingando há 2 dias"
- ❌ "Digite aqui sua demanda"
- ❌ "Descreva o problema"

### 7.6. Mensagens do simulador (eventos)

Sempre nome do prestador + ação clara.

- ✅ "Roberto enviou uma proposta"
- ✅ "Carlos aceitou seu pedido"
- ✅ "Felipe está a caminho"
- ❌ "Nova proposta recebida"
- ❌ "Pedido aceito"

---

## 8. Especificidade Ribeirão Preto

Cidade é sempre por extenso: **Ribeirão Preto**. Nunca "RP", nunca "Ribeirão" sem "Preto".

Bairros principais a citar quando fizer sentido:
Centro, Jardim Botânico, Iguatemi, Ribeirânia, Castelo, Sumarezinho, Vila Tibério, Jardim Califórnia, Alto da Boa Vista, Nova Aliança, Ipiranga, Jardim Paulista.

Frases-modelo:
- "Prestadores verificados em Ribeirão Preto."
- "Atende bairros como Pinheiros... [em outras cidades: ler do bairros configurados]."
- "Começando por Ribeirão Preto. Próxima: Araraquara."

**Importante:** no app operacional, sempre "atendemos Ribeirão Preto". No material institucional/pitch, "começando por Ribeirão Preto" — ambas verdadeiras, diferença é onde a expansão fica explícita.

---

## 9. Tese do dataset — linguagem acessível

Quando precisar comunicar o modelo de negócio (Sobre, FAQ "Como o LarCare ganha dinheiro?"), usar **linguagem cotidiana**, não jargão de startup.

Modelo aprovado:

> A gente cobra 5% sobre cada serviço resolvido. Isso paga a operação no curto prazo.
>
> No longo prazo, o LarCare está construindo algo que ninguém em Ribeirão Preto tem: um mapa completo dos prestadores autônomos confiáveis da cidade e dos lares que precisam de manutenção regular.
>
> Esse mapa, com o tempo, vira o ativo mais valioso da plataforma — útil para parceiros como construtoras, seguradoras, varejistas de materiais de construção, financeiras populares. A monetização desse ativo é o que viabiliza manter a comissão baixa pra cliente e prestador.

Proibido nesta seção: "dataset proprietário", "monetização B2B", "ativo de longo prazo", "tese de valor", "endereçável".

---

## 10. Exemplos antes / depois

### Hero da landing

❌ Antes: "Pequenos reparos, sem depender de ninguém."
✅ Depois: "Casa em dia, sem dor de cabeça."

### Sub-tagline

❌ Antes: "Encontre eletricistas, encanadores, marceneiros e montadores verificados perto de você."
✅ Depois: "Eletricista, encanador, diarista, faz-tudo — verificados, perto de você em Ribeirão Preto."

### CTA primário

❌ Antes: "Quero contratar um serviço"
✅ Depois: "Pedir um reparo"

### Empty state propostas

❌ Antes: "Nenhuma proposta recebida"
✅ Depois: "Os prestadores estão olhando seu pedido. Em alguns minutos chegam as primeiras propostas."

### Toast de sucesso

❌ Antes: "Demanda criada com sucesso!"
✅ Depois: "Pedido enviado. Aguarde as propostas."

### Tela de FAQ

❌ Antes: "Como funciona o LarCare?"
✅ Depois: "Como peço um serviço?"

---

## 11. Checklist antes de publicar copy

- [ ] Usa palavra-âncora (*resolver*, *cuidar*, *em dia*) onde faz sentido?
- [ ] Evita todas as palavras proibidas da seção 3?
- [ ] Honra os dois públicos (75/25 sem segmentar)?
- [ ] Cita Ribeirão Preto onde for relevante?
- [ ] CTA é verbo + objeto?
- [ ] Empty state tem ilustração + título + descrição + CTA?
- [ ] Toast é curto, direto, sem ponto final em uma frase?
- [ ] Loading explica o que está carregando?
- [ ] Placeholder dá exemplo concreto?
- [ ] Tom é acolhedor sem infantilizar, direto sem ser frio?

Se passou nos 10, a copy entra.

---

**Fim do COPY_GUIDELINES.md.**
