# PROTOCOLO DE OPERAÇÃO AUTÔNOMA — LARCARE

Este protocolo é regra permanente deste projeto. Vale para qualquer agente (Claude Code, Antigravity ou outro) que opere neste repositório. Leia e obedeça em TODA sessão.

## Princípios inegociáveis

1. **Modo autônomo total.** Não pergunte ao owner sob ambiguidade. Decida sozinho com base neste CLAUDE.md e nos arquivos do repo. Documente a decisão no commit message.
2. **Sem checkpoint humano entre etapas.** Quando o owner pedir uma cadeia de tarefas, execute a cadeia inteira até o fim. Não pause para confirmação.
3. **Sem oferecer opções.** Não responda com "1, 2 ou 3" nem peça preferência. Escolha a melhor opção tecnicamente e siga.
4. **Sem updates intermediários no meio da execução.** Relatório só ao terminar TUDO.
5. **Ultrathink antes de cada decisão técnica.** Pense profundo, depois execute rápido. Velocidade vem de pensamento prévio, não de pular pensamento.
6. **Working tree sempre limpo ao final.** Commits atômicos, mensagens em português, prefixo convencional (feat:, fix:, chore:, docs:, style:, perf:, a11y:, refactor:).

## Padrões técnicos não-negociáveis

- **Mobile-first sempre.** Anjo/usuário abre no celular.
- **Sem framework de build.** Vanilla HTML/CSS/JS.
- **Sem backend nesta fase.** Mock data em js/mock_data.js.
- **Paleta exata:** `#FAF8F4` background, `#3E6B5C` primary, `#D4A574` accent. Nunca amarelo/marrom-obra.
- **Tipografia:** Inter (corpo) + Fraunces (títulos), via Google Fonts.
- **Hospedagem:** GitHub Pages, branch main.

## Quando perguntar (única exceção)

Só pergunte ao owner se a tarefa exigir:
- Decisão estratégica de negócio (pricing, posicionamento, escolha de feature do roadmap).
- Compra ou contratação de serviço pago.
- Mudança que afete o domínio público já no ar.
- Operação destrutiva irreversível (deletar branch remota, force push, apagar histórico).

Em TODAS as outras situações: decida, execute, documente no commit.

## Formato do relatório final

Ao terminar uma cadeia de tarefas, responda com:
1. Lista de commits feitos (uma linha cada).
2. O que foi alterado em alto nível.
3. Decisões tomadas sob ambiguidade e justificativa breve.
4. Próximo passo sugerido (uma frase).

Nada além disso. Sem floreio, sem repetir o pedido do owner.

---

# CLAUDE.md — LarCare

> **Cuidar do lar, sem depender de ninguém.**
>
> Plataforma de pequenos reparos domésticos com curadoria de prestadores e dataset proprietário como ativo central de longo prazo.
>
> **Status do projeto:** ativação para construção de protótipo navegável apresentável a investidor anjo
> **Mantenedor:** Renato Cesar Rodrigues
> **Última atualização:** Abril de 2026
> **Forma de leitura:** este arquivo deve ser lido inteiro antes de qualquer linha de código ser escrita

---

## 0. INSTRUÇÕES PARA O AGENTE EXECUTOR (Claude Code)

Este documento é especificação completa, não briefing. Ao ativar o projeto, o Claude Code deve:

1. Ler este arquivo até o fim antes de gerar qualquer arquivo
2. Não inventar requisitos não escritos aqui — perguntar antes
3. Entregar PWA single-file estática primeiro, sem backend, com dados mockados realistas
4. Garantir que toda a navegação proposta funcione no celular
5. Garantir que cada tela transmita autoridade institucional, não cara de MVP de fim de semana
6. Confirmar comigo antes de iniciar a próxima fase do desenvolvimento (ver seção 17)

A meta deste protótipo não é validar mercado nem testar produto. É **fazer o investidor anjo abrir o celular, percorrer as telas em 3 minutos e fechar a sessão entendendo o tamanho do projeto**.

---

## 1. SUMÁRIO EXECUTIVO

LarCare é plataforma de conexão entre clientes que precisam de pequenos reparos domésticos e prestadores autônomos verificados. Não compete em construção, reforma ou obra. Compete em **cuidado cotidiano** — troca de lâmpada, conserto de torneira, montagem de móvel, instalação de suporte de TV, pintura de pequena área, jardinagem leve, hidráulica básica.

A plataforma se posiciona como serviço premium em vertical estreito, com tom de marca compatível com público feminino urbano de classe B/C (35-55 anos), em domicílios sem homem de referência ou com homens indisponíveis. Estimativa de mercado endereçável principal: 35 milhões de mulheres adultas no Brasil em domicílios sem homem (IBGE), em crescimento contínuo nas últimas duas décadas.

A tese de valor da plataforma não é margem por serviço. É a construção, ao longo do tempo, de **dataset proprietário enriquecido das duas pontas** (prestador autônomo georreferenciado + classe média urbana com casa). Esse dataset, após massa crítica, é monetizado por parcerias B2B com financeiras, seguradoras, varejo, construtoras, planos de saúde popular e operadoras de telefonia, num mercado endereçável secundário superior a R$ 15 bilhões anuais no Brasil.

A operação tradicional de comissão por serviço tem comissão simbólica e finalidade exclusiva de financiar manutenção da plataforma na fase pré-monetização do dataset.

---

## 2. PROPOSTA DE VALOR PARA TRÊS ATORES

### 2.1. Para o cliente final

Resolução de problema doméstico pequeno e urgente sem precisar:

- Pedir favor a homem da família ou amigo
- Caçar prestador desconhecido em rede social
- Aceitar prestador sem avaliação ou referência
- Lidar com profissional que cobra a mais ao chegar
- Ficar dias com problema porque não acha quem topa serviço pequeno

Ganho concreto: lâmpada acesa, torneira sem vazar, móvel montado, em prazo combinado, com prestador identificado, avaliado e verificado.

### 2.2. Para o prestador autônomo

Acesso a fluxo recorrente de demandas de pequeno porte que clientes geralmente:

- Pagam à vista
- Não negociam tanto preço
- Não exigem deslocamento longo
- Não exigem orçamento prévio prolongado
- Recompensam bom atendimento com indicação direta

Ganho concreto: agenda preenchida, receita previsível, sem custo de captação no boca a boca.

### 2.3. Para parceiros institucionais B2B (longo prazo)

Acesso, mediante contrato, a dataset segmentado e georreferenciado de:

- Microempreendedores autônomos do setor de manutenção doméstica
- Classes B/C urbanas com casa própria ou alugada de longo prazo

Aplicações concretas previstas:

- Concessão de crédito ao prestador via fintechs
- Oferta de seguros residenciais para clientes
- Lead qualificado para construtoras (cliente que reforma é cliente que troca de casa)
- Lead para varejo de ferramenta e material de construção (prestador é comprador recorrente)
- Plano de saúde popular para autônomos
- Operadoras de telefonia com plano voltado a profissional móvel

---

## 3. PÚBLICO-ALVO

### 3.1. Cliente principal (75% do uso esperado)

Mulher entre 30 e 60 anos, classe B/C, residente em capital ou cidade média, em domicílio sem homem de referência ou com homem indisponível/sem habilidade prática. Renda familiar R$ 4-15k. Tem casa ou apartamento próprio ou alugado de longo prazo. Usa WhatsApp diariamente, faz compras online ocasionalmente, valoriza atendimento humano e confiabilidade acima de preço.

### 3.2. Cliente secundário (25% do uso esperado)

Homem ou mulher entre 25 e 70 anos, classe B/C, residente em centro urbano, ocupado profissionalmente, sem tempo ou disposição para resolver pequenos reparos pessoalmente. Mesma renda e perfil de consumo do cliente principal.

### 3.3. Prestador

Homem entre 25 e 65 anos, classe C/D, com habilidade prática consolidada em pelo menos uma especialidade técnica (eletricista, encanador, marceneiro, pedreiro, jardineiro, pintor, montador). Renda atual variável entre R$ 1.500 e R$ 6.000 mensais. Tem CNH e veículo próprio em metade dos casos. Usa WhatsApp diariamente. Já tenta captar serviço por Facebook, Instagram, indicação ou panfleto, sem método estruturado.

---

## 4. ESPECIFICAÇÃO TÉCNICA DO PROTÓTIPO

### 4.1. Stack obrigatória para o protótipo

- HTML5 + CSS3 + JavaScript vanilla — single-file ou estrutura mínima de arquivos separados
- Sem framework de build (sem React, Vue, Vite, Next)
- Sem backend nesta fase — todos os dados são mockados em arrays JavaScript
- Hospedagem alvo: GitHub Pages
- Tipografia: Inter (corpo) e Fraunces (títulos), via Google Fonts
- PWA completa: manifest.json, service worker, ícones 192 e 512 PNG
- Responsiva mobile-first — anjo abre no celular
- Animação suave de transição entre telas (cubic-bezier)

### 4.2. Paleta de cores obrigatória

Tom premium feminino urbano, não construção, não pedreiro:

- Background base: `#FAF8F4` (off-white quente)
- Surface: `#FFFFFF` puro
- Primary: `#3E6B5C` (verde-sálvia profundo, peso institucional)
- Primary soft: `#7AA294` (variação para hover)
- Accent: `#D4A574` (dourado terroso, sutil)
- Text dark: `#1F2A28`
- Text dim: `#5C6661`
- Border: `#E8E2D5`
- Success: `#5F8B6E`
- Warning: `#C68A4D`

Não usar: amarelo, vermelho-tijolo, marrom-pedreiro, preto puro, qualquer cor saturada de obra.

### 4.3. Componentes visuais base

- Cantos arredondados (border-radius 12-16px em cards, 8px em inputs, 24px em botões)
- Sombras suaves e baixas (`box-shadow: 0 4px 12px rgba(0,0,0,0.04)`)
- Espaçamento generoso (padding 24-32px em containers principais)
- Tipografia hierárquica clara (h1 32-40px Fraunces, h2 22-26px Fraunces, body 15-16px Inter)
- Botões grandes (mínimo 48px de altura), com label claro, sem ícone-only
- Inputs largos com label explícita, placeholder neutro
- Avatares circulares com iniciais em fallback de imagem
- Estados de loading com skeleton, não spinner

### 4.4. Identidade visual

- Logotipo: tipografia Fraunces, palavra "LarCare", letra L estilizada como traço suave que se conecta ao a (à direita), sugerindo continuidade e cuidado. Cor primary `#3E6B5C`.
- Slogan: "Cuidar do lar, sem depender de ninguém"
- Símbolo (favicon e icon PWA): casa estilizada, traço fino, dentro de círculo. Cor primary.

---

## 5. ARQUITETURA DE NAVEGAÇÃO

A PWA tem **dois fluxos principais paralelos** que precisam ser navegáveis no protótipo:

### Fluxo A — Cliente
### Fluxo B — Prestador

Mais o **fluxo institucional de marca** (landing pública, sobre, segurança, dataset).

A primeira tela é uma landing pública. A partir dela, o usuário escolhe identificar-se como cliente ou como prestador (cadastro/login simulado), e cai no fluxo correspondente.

Diagrama de telas obrigatórias para o protótipo:

```
[1] Landing pública
    ├── [2] Sobre o LarCare
    ├── [3] Como funciona (cliente)
    ├── [4] Como funciona (prestador)
    ├── [5] Segurança e dataset
    │
    ├── Sou cliente
    │   ├── [6] Cadastro do cliente
    │   ├── [7] Tela inicial do cliente (dashboard com demandas ativas)
    │   ├── [8] Nova demanda — formulário em etapas
    │   ├── [9] Demanda publicada — aguardando propostas
    │   ├── [10] Lista de propostas recebidas (leilão)
    │   ├── [11] Detalhe da proposta + perfil do prestador
    │   ├── [12] Confirmação e liberação de contato
    │   ├── [13] Tela de avaliação pós-serviço
    │   └── [14] Histórico de serviços concluídos
    │
    └── Sou prestador
        ├── [15] Cadastro do prestador (multi-etapa)
        ├── [16] Status do cadastro (em análise / aprovado)
        ├── [17] Tela inicial do prestador (feed de demandas disponíveis)
        ├── [18] Detalhe da demanda + envio de proposta
        ├── [19] Minhas propostas enviadas
        ├── [20] Proposta aceita — contato liberado
        ├── [21] Tela de avaliação pós-serviço (espelho)
        └── [22] Perfil do prestador (editável)
```

Telas adicionais transversais:

```
[23] Política de privacidade e LGPD
[24] Termos de uso
[25] FAQ
[26] Contato e suporte
```

---

## 6. ESPECIFICAÇÃO DETALHADA DE CADA TELA

### Tela 1 — Landing pública

**Função:** primeira impressão. O anjo abre aqui. Tem que comunicar instituição, não MVP.

**Estrutura:**

- Header sticky com logo LarCare (esquerda), navegação textual (centro: "Como funciona", "Segurança", "Sobre"), e dois botões à direita: "Sou cliente" (outline) e "Sou prestador" (preenchido primary)
- Hero ocupando 80% da viewport inicial:
  - Eyebrow em pill discreto: "Cuidado verificado para seu lar"
  - Título Fraunces 48px: "Pequenos reparos, sem depender de ninguém."
  - Subtítulo Inter 18px: "Encontre quem resolve o que precisa ser resolvido em casa. Prestadores verificados, propostas transparentes, contato direto."
  - Dois botões grandes empilhados em mobile, lado a lado em desktop: "Quero contratar um serviço" (primary) e "Quero oferecer meus serviços" (outline)
  - Imagem ilustrativa à direita (em mobile, abaixo): foto editorial de mulher em casa, ambiente claro e arrumado, atmosfera tranquila — não pedreiro, não obra
- Faixa de números abaixo do hero:
  - "Mais de 50 categorias de serviço cobertas"
  - "Verificação de antecedentes em 100% dos prestadores"
  - "Avaliação cruzada após cada serviço"
- Seção "Como funciona em 3 passos" (cards horizontais com ícone, título, descrição curta)
  - "Você descreve o que precisa"
  - "Prestadores verificados enviam propostas"
  - "Você escolhe e fala direto com quem topou"
- Seção "Categorias mais pedidas" (grid de 8 chips clicáveis: Elétrica, Hidráulica, Marcenaria, Pintura, Jardinagem, Montagem, Reparos gerais, Limpeza pesada)
- Seção "Por que confiar no LarCare" (3 colunas: Verificação, Avaliação cruzada, Suporte humano)
- Seção depoimentos (3 cards com foto, nome, cidade, depoimento curto — dados mockados realistas)
- Footer institucional (links, contato, redes sociais, política, LGPD)

### Tela 2 — Sobre o LarCare

**Função:** explicar a missão, o time e o posicionamento institucional.

**Estrutura:**

- Hero curto com título "O lar como prioridade"
- Texto institucional em três blocos:
  - Por que existimos (foco em autonomia doméstica e cuidado verificado)
  - Para quem trabalhamos (cliente e prestador)
  - O que defendemos (verificação, transparência, respeito mútuo, proteção de dados)
- Seção "Nosso compromisso com a integridade" (referência à seção 5 sobre segurança e LGPD)
- Call-to-action duplo no final

### Tela 3 — Como funciona (cliente)

**Função:** explicar o passo a passo do lado do cliente, com confiança institucional.

**Estrutura:**

- Hero curto: "Resolva o que precisa em quatro passos"
- Stepper visual horizontal com 4 etapas:
  1. Descreva sua necessidade (ícone + 2 frases)
  2. Receba propostas de prestadores verificados (ícone + 2 frases)
  3. Compare e escolha (ícone + 2 frases)
  4. Combine direto com quem topou (ícone + 2 frases)
- Seção "O que é considerado um pequeno reparo" (lista de exemplos concretos, evita "qualquer serviço")
- Seção "O que esperar de um prestador LarCare" (verificação, postura, transparência)
- Botão "Quero contratar agora"

### Tela 4 — Como funciona (prestador)

**Função:** explicar o passo a passo para o prestador, com tom de oportunidade séria.

**Estrutura:**

- Hero: "Tenha agenda recorrente sem precisar caçar serviço"
- Stepper de 4 etapas:
  1. Cadastre-se com seus dados completos
  2. Aguarde aprovação (24-72h)
  3. Visualize demandas próximas e envie propostas
  4. Atenda com excelência e construa sua reputação
- Seção "Por que vale a pena estar no LarCare" (tráfego qualificado, recorrência, reputação acumulada, sem caça-cliente)
- Seção "O que pedimos de você" (verificação, postura, pontualidade)
- Botão "Quero me cadastrar como prestador"

### Tela 5 — Segurança e dataset

**Função:** comunicar o compromisso com proteção de dados e o uso responsável da informação.

**Estrutura:**

- Hero: "Seus dados, sua segurança, nosso compromisso"
- Seção "Como protegemos seus dados" (criptografia, conformidade LGPD, equipe dedicada)
- Seção "O que fazemos com a informação" (transparência sobre uso interno, nunca venda de dados pessoais identificados, anonimização para insights agregados)
- Seção "Verificação de prestadores" (checklist visual: identidade, antecedente criminal, validação cruzada, avaliação contínua)
- Seção "Em caso de problemas" (canal de denúncia, suporte humano, resolução em 48h)
- Texto em destaque sobre LGPD, com link para política completa

### Tela 6 — Cadastro do cliente

**Função:** capturar dados do cliente em fluxo amigável, sem parecer formulário longo.

**Estrutura em multi-etapas (4 passos):**

Etapa 1 — Identificação básica:
- Nome completo
- E-mail
- Telefone com WhatsApp
- Senha (mínimo 8 caracteres)

Etapa 2 — Dados pessoais:
- CPF (com máscara)
- Data de nascimento
- Sexo (masculino, feminino, prefere não informar)

Etapa 3 — Endereço:
- CEP (busca automática endereço via mock)
- Logradouro
- Número
- Complemento
- Bairro
- Cidade
- Estado

Etapa 4 — Confirmação e LGPD:
- Resumo dos dados informados
- Aceite explícito de termos de uso
- Aceite explícito de política de privacidade
- Aceite opcional de comunicação por e-mail e WhatsApp
- Botão "Concluir cadastro"

A cada etapa, barra de progresso visível no topo. Botão "Voltar" sempre disponível. Validação inline em cada campo.

### Tela 7 — Tela inicial do cliente (dashboard)

**Função:** mostrar visão geral do que o cliente tem em andamento, com ação clara.

**Estrutura:**

- Header com saudação personalizada ("Boa tarde, Maria")
- Card grande de chamada principal: "Precisa de ajuda em casa? Comece descrevendo o serviço" + botão "Nova solicitação"
- Seção "Suas solicitações em andamento" (cards com status: aguardando propostas, propostas recebidas, contratado, concluído)
- Seção "Histórico recente" (lista compacta de serviços concluídos)
- Seção "Recomendações" (categorias populares no bairro, baseadas em mock)
- Footer fixo com navegação: Início, Solicitações, Perfil

### Tela 8 — Nova demanda (formulário em etapas)

**Função:** capturar a demanda do cliente de forma estruturada, prevenindo demandas mal descritas.

**Estrutura em multi-etapas (5 passos):**

Etapa 1 — Categoria:
- Grid visual de 8 categorias com ícone e nome
- Possibilidade de selecionar "Outro" se nenhuma se aplica

Etapa 2 — Descrição do problema:
- Campo de texto livre com placeholder informativo ("Ex: a torneira da pia da cozinha está pingando há dois dias")
- Upload opcional de até 3 fotos
- Mensagem explicativa: "Quanto mais detalhes, melhores serão as propostas"

Etapa 3 — Local do serviço:
- Confirmação do endereço cadastrado
- Possibilidade de informar endereço diferente

Etapa 4 — Quando você precisa:
- Opções: Hoje, Até 3 dias, Até 7 dias, Sem pressa
- Sub-opções de horário: Manhã, Tarde, Noite, Qualquer

Etapa 5 — Orçamento estimado (opcional):
- Faixa de valor que considera razoável (slider de R$ 50 a R$ 1.500)
- Texto explicativo: "Isso ajuda os prestadores a calibrar a proposta"
- Possibilidade de pular ("Aguardar propostas livres")

Após confirmação:
- Tela de "Demanda publicada" com mensagem de sucesso
- Tempo médio estimado para receber primeira proposta
- Botão para acompanhar status

### Tela 9 — Demanda publicada (aguardando propostas)

**Função:** transmitir confiança de que o sistema está trabalhando, mesmo sem propostas ainda.

**Estrutura:**

- Header com título da demanda e categoria
- Card grande "Sua demanda está visível para prestadores qualificados"
- Indicador de tempo desde publicação ("Publicada há 12 minutos")
- Indicador de prestadores notificados (mock realista: "27 prestadores qualificados na sua região foram notificados")
- Mensagem: "Você receberá notificação quando a primeira proposta chegar. Isso costuma acontecer em até 2 horas."
- Botão "Ver minha demanda" (mostra como o prestador vê)
- Botão secundário "Cancelar solicitação"

### Tela 10 — Lista de propostas recebidas (leilão)

**Função:** **a tela mais importante do protótipo para o anjo.** É aqui que ele vê o conceito do "leilão" funcionando.

**Estrutura:**

- Header com título da demanda e contador ("4 propostas recebidas")
- Filtros: Ordenar por (Mais recente, Menor preço, Melhor avaliado, Mais perto)
- Lista de cards de proposta, cada card mostrando:
  - Foto do prestador (avatar circular)
  - Nome (primeiro nome + inicial do sobrenome)
  - Estrelas de avaliação acumulada (ex: 4.8 com 32 avaliações)
  - Tags visuais: "Verificado", "Antecedente OK", "Leva material próprio" (quando aplicável)
  - Distância em km até o cliente
  - Especialidade principal e anos de experiência
  - Valor proposto, em destaque grande
  - Disponibilidade para começar ("Pode ir hoje à tarde")
  - Mensagem do prestador (até 2 linhas, com "ver mais")
  - Botão "Ver perfil completo" + Botão primary "Aceitar proposta"

Mock obrigatório: pelo menos 4 propostas variadas. Diferentes valores, diferentes prazos, diferentes prestadores, diferentes níveis de avaliação. Para o anjo perceber a diversidade do leilão.

### Tela 11 — Detalhe da proposta + perfil do prestador

**Função:** o cliente vai a fundo no prestador antes de aceitar.

**Estrutura:**

- Header com nome do prestador e botão de fechar
- Foto grande de perfil
- Nome completo (primeiro nome + inicial)
- Especialidades como chips
- Anos de experiência por especialidade
- Card de verificações:
  - Identidade verificada (checkmark verde)
  - Antecedente criminal verificado (checkmark verde)
  - Cadastro completo (checkmark verde)
  - Última atualização (data)
- Avaliações acumuladas:
  - Média geral (4.8/5) com 32 avaliações
  - Distribuição visual (quantos 5, 4, 3, 2, 1)
  - Lista de últimas 5 avaliações textuais (mockadas)
- Currículo livre escrito pelo prestador (até 200 palavras)
- Detalhes da proposta atual em destaque:
  - Valor proposto
  - Tempo estimado de execução
  - Disponibilidade
  - Mensagem específica para esta demanda
- Botões: "Voltar para lista" + "Aceitar esta proposta" (primary)

### Tela 12 — Confirmação e liberação de contato

**Função:** marcar o momento da contratação e transferir a relação para fora da plataforma.

**Estrutura:**

- Animação curta de confirmação (checkmark verde grande, fade-in)
- Mensagem grande: "Pronto! Aqui está o contato de [Nome do prestador]"
- Card grande com:
  - Foto do prestador
  - Nome completo
  - Telefone com botão "Falar no WhatsApp" (deeplink wa.me)
  - Endereço de e-mail
  - Botão "Ver detalhes da proposta novamente"
- Texto explicativo: "A partir daqui, vocês combinam direto. Lembre-se que sua avaliação após o serviço ajuda outros clientes."
- Botão "Voltar para o início"

### Tela 13 — Tela de avaliação pós-serviço (cliente)

**Função:** capturar avaliação cruzada de forma simples e rápida.

**Estrutura:**

- Header: "Como foi seu serviço com [Nome]?"
- Imagem ilustrativa pequena
- Quatro estrelas em linha vertical, cada uma com label:
  - Pontualidade
  - Qualidade do serviço
  - Postura e comportamento
  - Preço justo
- Cada item tem 5 estrelas clicáveis
- Campo de texto opcional: "Quer deixar um comentário? (opcional)"
- Toggle: "Recomendaria este profissional? (Sim / Não)"
- Botão grande primary: "Enviar avaliação"
- Botão secundário: "Avaliar depois"

### Tela 14 — Histórico de serviços concluídos

**Função:** mostrar histórico do cliente.

**Estrutura:**

- Lista cronológica de serviços
- Cada item: data, categoria, prestador, valor pago, avaliação dada
- Filtros: Ano, Categoria, Avaliação dada
- Possibilidade de "Contratar novamente o mesmo prestador" como atalho

### Tela 15 — Cadastro do prestador (multi-etapa)

**Função:** capturar dados completos do prestador, com sensação de seriedade institucional.

**Estrutura em multi-etapas (6 passos):**

Etapa 1 — Identificação básica (igual ao cliente etapa 1)
Etapa 2 — Documentos pessoais:
- CPF
- RG ou CNH (upload de imagem)
- Data de nascimento
- Selfie segurando documento (upload)

Etapa 3 — Endereço (igual ao cliente etapa 3)

Etapa 4 — Atuação profissional:
- Especialidades (seleção múltipla com chips)
- Anos de experiência por especialidade selecionada
- Currículo livre (até 500 palavras)
- Capacidade de levar material próprio (sim, não, depende do serviço)
- Veículo próprio (sim/não)
- Raio de atendimento em km (slider)

Etapa 5 — Disponibilidade:
- Grade visual de dias da semana × períodos (manhã, tarde, noite)
- Marcação por toque

Etapa 6 — Documentos de verificação:
- Antecedente criminal (upload obrigatório, com explicação de como obter gratuitamente em <90 segundos via internet)
- Comprovante de residência
- Aceite de termos específicos do prestador

Após envio:
- Tela de "Cadastro enviado para análise"
- Tempo estimado de aprovação: 24-72 horas
- Indicação de status visual

### Tela 16 — Status do cadastro

**Função:** transmitir profissionalismo e expectativa clara.

**Estrutura:**

- Card de status atual (em análise, documentação adicional necessária, aprovado, recusado)
- Linha do tempo visual do que foi feito e o que falta
- Botão "Falar com suporte" se ficar travado
- Tempo médio para próxima etapa

### Tela 17 — Tela inicial do prestador (feed de demandas)

**Função:** **a segunda tela mais importante para o anjo.** Aqui ele vê o leilão do lado oposto.

**Estrutura:**

- Header com saudação ("Bom dia, Carlos") e indicador de status (online/offline toggle)
- Resumo do dia: propostas enviadas, propostas em análise, serviços agendados
- Filtros: Categoria (chips), Distância (slider km), Urgência (chips)
- Lista de cards de demanda, cada um mostrando:
  - Categoria
  - Título da demanda (gerado a partir da descrição)
  - Bairro do cliente (sem endereço completo até proposta aceita)
  - Distância
  - Urgência
  - Faixa de orçamento (se cliente informou)
  - Tempo desde publicação
  - Quantos prestadores já enviaram proposta (transparência: "3 propostas recebidas")
  - Botão "Ver detalhes" + botão primary "Enviar proposta"

Mock obrigatório: pelo menos 8 demandas variadas em categorias e regiões diferentes.

### Tela 18 — Detalhe da demanda + envio de proposta

**Função:** prestador analisa e propõe.

**Estrutura:**

- Topo: título, categoria, urgência, bairro, distância
- Descrição completa do cliente
- Fotos enviadas pelo cliente (se houver, swipe horizontal)
- Endereço aproximado em mapa (apenas bairro e logradouro, sem número)
- Faixa de orçamento informada pelo cliente
- Disponibilidade do cliente
- Card "Outras propostas neste serviço": quantidade e faixa de preço (transparência completa)
- Formulário de envio de proposta:
  - Valor (input numérico)
  - Tempo estimado (input em horas ou dias)
  - Disponibilidade ("Posso ir hoje à tarde", "Amanhã de manhã", etc — calendário mini)
  - Mensagem para o cliente (textarea, até 300 caracteres)
- Botão grande primary: "Enviar proposta"

### Tela 19 — Minhas propostas enviadas

**Função:** prestador acompanha status do leilão dele.

**Estrutura:**

- Lista de propostas enviadas com status:
  - Aguardando resposta
  - Visualizada pelo cliente (com timestamp)
  - Recusada (cliente escolheu outra)
  - Aceita
- Cada item com possibilidade de "Ver demanda original"

### Tela 20 — Proposta aceita (contato liberado)

**Função:** espelho da tela 12, do lado do prestador.

**Estrutura:**

- Animação de confirmação
- "Sua proposta foi aceita por [Nome da cliente]!"
- Card com:
  - Foto e nome da cliente
  - Endereço completo
  - Telefone com botão WhatsApp
  - Resumo da demanda
- Texto: "Combine os detalhes diretamente com a cliente. Lembre-se que sua avaliação após o serviço impacta sua reputação."
- Botão "Voltar"

### Tela 21 — Tela de avaliação pós-serviço (prestador)

**Função:** espelho da tela 13.

**Estrutura:**

- "Como foi atender [Nome da cliente]?"
- Quatro estrelas em linha vertical:
  - Clareza da demanda
  - Cordialidade do cliente
  - Pagamento conforme combinado
  - Acessibilidade do local
- Comentário opcional
- Botão "Enviar avaliação"

### Tela 22 — Perfil do prestador (editável)

**Função:** prestador gerencia o próprio perfil.

**Estrutura:**

- Foto de perfil editável
- Dados pessoais (visualização e edição)
- Especialidades e experiência (edição)
- Currículo (edição)
- Disponibilidade (edição)
- Estatísticas:
  - Total de serviços concluídos
  - Avaliação média
  - Tempo médio de resposta a propostas
  - Taxa de aceite

### Telas 23 a 26

Conteúdo institucional padrão. Para o protótipo, basta texto mockado realista de 2-3 parágrafos por tela, formatação compatível com o resto do site.

---

## 7. DADOS MOCKADOS OBRIGATÓRIOS

Para o anjo navegar fluidamente, o protótipo precisa de dataset mockado realista. Crie em arquivo `mock_data.js`:

### 7.1. Categorias (10)

Elétrica residencial, Hidráulica residencial, Marcenaria leve, Pintura interna, Jardinagem, Montagem de móveis, Instalação de equipamentos, Reparos gerais, Limpeza pesada, Manutenção preventiva.

### 7.2. Demandas mockadas (10)

Cada uma com: id, categoria, descrição realista, bairro paulistano (variado: Pinheiros, Tatuapé, Vila Mariana, Santana, Butantã, Lapa, Aclimação, Ipiranga, Vila Madalena, Perdizes), urgência, faixa de orçamento, fotos (placeholder), data de publicação, número de propostas recebidas, status.

Exemplos:
- "Torneira da pia da cozinha está pingando há 3 dias"
- "Preciso instalar 2 prateleiras na sala (madeira já comprada)"
- "Lâmpada do banheiro queimou e não consigo trocar (pé direito alto)"
- "Suporte de TV de 55 polegadas para fixar na parede"
- "Pintura de quarto pequeno (12m²) — paredes em bom estado"
- "Vazamento em torneira do tanque da área de serviço"
- "Montagem de guarda-roupa Madesa 6 portas"
- "Cortar grama do quintal (cerca de 20m²)"
- "Furadeira não pega — preciso fazer 8 furos para prateleiras"
- "Conserto de fechadura emperrada na porta da frente"

### 7.3. Prestadores mockados (12)

Cada um com: id, nome (primeiro nome + inicial), idade, especialidades, anos de experiência por especialidade, bairro, raio de atendimento, avaliação média, número de avaliações, currículo livre, foto (placeholder consistente), disponibilidade, status de verificação, lista de últimas 5 avaliações textuais.

Variedade obrigatória: prestadores com 4.9 e 4.2 avaliações, prestadores especialistas e generalistas, prestadores com e sem material próprio, prestadores próximos e distantes.

### 7.4. Propostas mockadas (40)

Para popular a Tela 10 (lista de propostas recebidas) com pelo menos 4 propostas em uma demanda específica, e a Tela 17 (feed do prestador) com demandas variadas.

Cada proposta: id, prestador_id, demanda_id, valor, tempo_estimado, disponibilidade, mensagem específica, data de envio, status.

### 7.5. Avaliações mockadas

Pelo menos 5 avaliações textuais por prestador mockado, escritas de forma realista, em português brasileiro coloquial, variando de muito positivas a moderadamente críticas.

### 7.6. Cliente mockado de demonstração

Para o anjo navegar como se já estivesse logado:
- Nome: Maria Cristina
- Bairro: Pinheiros, São Paulo
- Idade: 42 anos
- Histórico: 3 serviços concluídos, 2 demandas em andamento

### 7.7. Prestador mockado de demonstração

- Nome: Carlos H.
- Bairro: Vila Madalena, São Paulo
- Idade: 38 anos
- Especialidade principal: Elétrica residencial
- Anos de experiência: 15
- Avaliação: 4.8 com 32 avaliações
- Status: aprovado, ativo

---

## 8. NAVEGAÇÃO DEMO PARA O ANJO

O protótipo deve ter um modo de navegação rápida pré-configurado, acessível por botão flutuante no canto inferior direito da landing pública: **"Ver demonstração rápida"**.

Esse botão aciona um tour guiado de 90 segundos que percorre:

1. Landing pública (5 segundos, scroll automático)
2. Cadastro do cliente — etapa 1 (5 segundos, preenchimento automático)
3. Tela inicial do cliente (5 segundos, dashboard ativo)
4. Nova demanda — etapas 1, 2, 3 (15 segundos, preenchimento automático)
5. Demanda publicada (5 segundos)
6. Lista de propostas recebidas (15 segundos, parado para o anjo absorver as 4 propostas)
7. Perfil do prestador escolhido (10 segundos)
8. Confirmação e liberação de contato (5 segundos)
9. Inversão para o lado do prestador (transição clara)
10. Tela inicial do prestador — feed de demandas (10 segundos)
11. Detalhe de demanda + envio de proposta (10 segundos)
12. Tela de avaliação pós-serviço (5 segundos)

A cada tela, overlay opcional com legenda institucional curta (1-2 linhas) explicando o que está acontecendo. O anjo pode pausar a qualquer momento e navegar manualmente.

Esse modo demo é o que o Renato vai acionar no celular durante a conversa com o investidor anjo. Não é gimmick — é ferramenta de pitch silencioso.

---

## 9. PWA — MANIFEST E SERVICE WORKER

### 9.1. manifest.json

```json
{
  "name": "LarCare — Cuidar do lar, sem depender de ninguém",
  "short_name": "LarCare",
  "description": "Pequenos reparos domésticos com prestadores verificados",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF8F4",
  "theme_color": "#3E6B5C",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 9.2. service worker

Estratégia cache-first para assets estáticos, network-first para HTML. Sem complicações.

### 9.3. Banner de instalação

Implementar banner próprio (não confiar só no nativo do Chrome) com:
- Detecção de iOS vs Android
- Instrução visual diferente para cada plataforma
- Persistência de "não mostrar de novo" em localStorage
- Aparição apenas após 30 segundos de uso, não imediatamente

---

## 10. ARQUITETURA DE ARQUIVOS

```
larcare/
├── index.html                    (single-page com router próprio)
├── manifest.json
├── sw.js
├── 404.html
├── offline.html
├── robots.txt
├── README.md
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── favicon.ico
├── css/
│   └── styles.css
├── js/
│   ├── app.js                    (router e bootstrap)
│   ├── mock_data.js              (todos os dados mockados)
│   ├── views/
│   │   ├── landing.js
│   │   ├── client_dashboard.js
│   │   ├── client_new_demand.js
│   │   ├── client_proposals_list.js
│   │   ├── provider_dashboard.js
│   │   ├── provider_demand_detail.js
│   │   └── ...
│   ├── components/
│   │   ├── header.js
│   │   ├── card.js
│   │   ├── button.js
│   │   ├── proposal_card.js
│   │   ├── stepper.js
│   │   └── ...
│   └── demo_tour.js              (tour guiado para o anjo)
└── assets/
    ├── images/
    │   ├── hero-illustration.svg
    │   ├── icons-categories/
    │   └── avatars/
    └── fonts/
```

---

## 11. REGRAS DE QUALIDADE NÃO NEGOCIÁVEIS

Estas regras valem para qualquer entrega:

1. **Mobile-first sem exceção.** Anjo abre no celular. Cada tela é projetada primeiro para 375px, depois adaptada para desktop.
2. **Carregamento em até 3 segundos** em conexão 3G simulada. Sem bibliotecas pesadas. Sem fontes além do necessário (Inter, Fraunces).
3. **Acessibilidade básica.** Contraste mínimo WCAG AA, navegação por teclado, alt em todas as imagens, labels em todos os inputs.
4. **Sem placeholder vazio.** Toda tela tem dados mockados realistas. Nada de "Lorem ipsum" ou "exemplo de descrição".
5. **Sem console.log nem código de debug em produção.**
6. **Sem dependência de fonte externa de imagem.** Todos os assets servidos do próprio domínio. Avatares com iniciais quando não houver foto real.
7. **Animações suaves (cubic-bezier 0.4, 0, 0.2, 1) em todas as transições de tela.** Nada de transição abrupta.
8. **Tipografia em escala harmônica.** Não inventar tamanhos novos. Usar a escala definida.
9. **Cada tela tem título HTML adequado (`<title>`)** para o caso do anjo abrir múltiplas em abas.
10. **PWA testada e funcional.** Banner de instalação testado em Android e iOS antes de declarar pronto.

---

## 12. AVISO LEGAL VISÍVEL NO RODAPÉ

Texto institucional fixo no footer de todas as páginas:

> "LarCare é plataforma de conexão entre clientes e prestadores de serviço autônomos. Não somos empregadores dos prestadores e não respondemos solidariamente pelos serviços prestados, salvo nos limites previstos em contrato e legislação aplicável. Operamos em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Para mais informações, consulte nossos Termos de Uso e Política de Privacidade."

---

## 13. TONS DE VOZ NA INTERFACE

### 13.1. Mensagens de sistema

- Sucesso: "Pronto" + descrição (não "Operação concluída com sucesso")
- Erro: empático + ação ("Algo não deu certo. Vamos tentar novamente?")
- Confirmação: direto + segundo clique ("Tem certeza que quer cancelar a solicitação? Essa ação não pode ser desfeita.")

### 13.2. Microcopy

- Botões: verbo + objeto ("Enviar proposta", "Aceitar serviço", "Ver perfil") — nunca só "OK", "Enviar", "Confirmar"
- Placeholders: exemplo concreto, não instrução abstrata
- Tooltips: explicação curta, sem jargão técnico

### 13.3. Tom geral

Conversa de igual com igual. Não infantilizar a cliente. Não tratar o prestador como subalterno. Não usar "querida", "amiga" ou diminutivos.

---

## 14. MÉTRICAS DE SUCESSO DO PROTÓTIPO

O protótipo é considerado pronto para apresentação ao anjo quando:

1. Anjo abre no celular e acessa a landing em menos de 3 segundos
2. Tour guiado de 90 segundos roda sem travar
3. Navegação manual em qualquer tela é fluida
4. Tela 10 (lista de propostas recebidas) tem 4 propostas variadas e visualmente impressionantes
5. Tela 17 (feed do prestador) tem 8 demandas variadas
6. PWA é instalável no celular do Renato com ícone próprio
7. Modo offline mostra mensagem amigável (não erro)
8. Não há nenhum botão que não funcione, nem fluxo quebrado em meio caminho

---

## 15. ROADMAP PÓS-PROTÓTIPO (REGISTRADO PARA CONTEXTO, NÃO PARA EXECUÇÃO IMEDIATA)

Após a apresentação ao anjo, se o projeto for ativado:

### Fase 2 — Backend e dados reais

- Supabase como backend (auth + database)
- Integração com WhatsApp Business API para notificações
- Verificação real de antecedente criminal via API de parceiro
- Sistema de upload e moderação de fotos
- Painel administrativo para aprovar prestadores

### Fase 3 — Operação inicial

- Cadastro real de 50 prestadores em São Paulo (Pinheiros, Vila Madalena, Vila Mariana, Itaim, Jardins)
- Tráfego orgânico via SEO programático local ("eletricista em Pinheiros", "encanador na Vila Madalena")
- Ads Google e Meta direcionados a público feminino 35-55 em capitais
- Suporte humano por WhatsApp para resolução de impasses

### Fase 4 — Monetização do dataset

- Atingida massa crítica de 100 mil usuários ativos
- Início de conversas com financeiras, seguradoras, varejo
- Anonimização e empacotamento de dataset para venda B2B
- Escalada para outras cidades

### Fase 5 — Expansão lateral

- Inclusão de serviços recorrentes (faxina mensal, jardim quinzenal, manutenção preventiva)
- Inclusão de cuidado com idoso part-time
- Eventual integração com plano de saúde popular para autônomos

---

## 16. INFORMAÇÕES SENSÍVEIS

Não incluir neste arquivo:
- Chaves de API
- Credenciais de qualquer serviço
- Dados pessoais reais
- Informações financeiras

Quando essas informações forem necessárias, criar arquivo `.env.local` separado, ignorado por `.gitignore`.

---

## 17. PROTOCOLO DE EXECUÇÃO POR FASES

O Claude Code deve executar este projeto em fases, confirmando comigo antes de avançar. Em nenhuma hipótese executar tudo de uma vez sem checkpoints.

### Fase 1 — Estrutura

Criar a árvore de arquivos, manifest, service worker, ícones, css base e router. Mostrar para validação.

### Fase 2 — Landing pública e fluxo de cliente

Telas 1, 2, 3, 4, 5, 6, 7, 8, 9. Mostrar para validação.

### Fase 3 — Continuação do fluxo do cliente

Telas 10, 11, 12, 13, 14. Mostrar para validação.

### Fase 4 — Fluxo do prestador

Telas 15, 16, 17, 18, 19, 20, 21, 22. Mostrar para validação.

### Fase 5 — Telas institucionais e tour demo

Telas 23, 24, 25, 26 + demo_tour.js. Mostrar para validação.

### Fase 6 — Polimento, performance, PWA, deploy

Otimização final, testes em mobile real, deploy no GitHub Pages. Mostrar para validação.

A cada fase, o Code reporta:

- O que foi feito
- O que ficou pendente
- Decisões técnicas tomadas
- Próxima fase proposta

Aguarda o "ok, próxima" antes de avançar.

---

## 18. NOTAS FINAIS PARA O AGENTE EXECUTOR

Este projeto é apresentado a um investidor anjo experiente, em encontro presencial. Cada tela do protótipo é juízo silencioso sobre a qualidade do executor. O anjo não vai dizer "está bonito" — vai decidir investir ou não com base em micro-detalhes que ele percebe inconscientemente.

Por isso:

- Cada espaçamento importa
- Cada microcopy importa
- Cada animação importa
- Cada estado vazio importa
- Cada tela de erro importa

Trate cada componente como produto final, não como protótipo descartável.

A meta não é fazer a coisa funcionar. É fazer a coisa **parecer instituição estabelecida**, mesmo sendo PWA single-file de fim de semana.

---

**Fim do CLAUDE.md.**

---

## ANEXO D — SISTEMA DE INSTALAÇÃO PWA (2026-05-14, v1.6.0)

Quarto bloco do projeto. Substitui o banner genérico por sistema dedicado com bottom sheet customizado, detector de plataforma, heurística de engajamento e integração no Perfil.

### Três módulos

1. **`js/install_detector.js`** — API pura `LarCareDetect.*`. Detecta iOS resilientemente (cobre iPadOS-as-Mac via maxTouchPoints+platform+navigator.standalone), Android, standalone (matchMedia+iOS), in-app browser (UA markers de Instagram/FB/WhatsApp/Telegram/Twitter/LinkedIn/TikTok/Snapchat/LINE), e suporte a beforeinstallprompt (Chromium-only).

2. **`js/install_prompt.js`** — `LarCareInstall.*`. Captura `beforeinstallprompt` e `appinstalled`. Renderiza bottom sheet com três variantes condicionais. Implementa heurística: 60s ativos (Visibility API), 5 telas distintas (hashchange unique set), 1ª demanda (`larcare:demand-created`) ou 1ª proposta de prestador (`larcare:provider-proposed`, dispatched no submit do form em `app.js`). Dismiss persiste 72h; 3 dismisses seguidos marcam `never_again`.

3. **CSS dedicado** no fim de `css/styles.css` (~200 linhas). Bottom sheet em mobile (slide-up + drag handle + swipe-down), card centralizado em desktop ≥720px. Backdrop blur, focus trap, prefers-reduced-motion respeitado.

### Variantes visuais

- **Android Chromium**: logo + título "Instalar LarCare" + checklist "atalho / offline / cara de app" + CTA primary "Instalar agora" (chama `deferredPrompt.prompt()`) + secundário "Agora não".
- **iOS Safari**: logo + título "Adicione à Tela de Início" + 3 cards numerados em cascata com ícones SVG inline (botão Compartilhar do Safari, "+", check) + microcopy fallback sobre barra superior + botão único "Entendi".
- **In-app browser**: alerta sálvia + 3 passos para abrir no Safari/Chrome externo + "Entendi".

### Storage (todas em `localStorage`)

| Chave | Conteúdo |
| --- | --- |
| `larcare:installed_at` | timestamp do `appinstalled` |
| `larcare:install_dismissed_at` | último dismiss (TTL 72h) |
| `larcare:install_dismiss_count` | contador (3 → `never_again`) |
| `larcare:install_never_again` | flag boolean `'1'` |
| `larcare:install_seen_at` | log JSONL de exibições |
| `larcare:active_seconds` | tempo ativo acumulado |
| `larcare:screens_visited` | telas distintas (pipe-separated) |
| `larcare:first_demand_done` | flag boolean `'1'` |
| `larcare:first_provider_proposal_done` | flag boolean `'1'` |

Botão **"Resetar estado de instalação"** em Perfil > Modo demonstração (visível como link dev pequeno) limpa todas. API: `LarCareInstall.resetState()`.

### Integração com Perfil

Nova seção "Aplicativo" entre Preferências e Modo demonstração com:
- "Instalar na tela inicial" (abre o sheet sob demanda) OU "✓ Instalado" cinza
- "Verificar atualizações" (botão Atualizar existente, migrado pra cá)
- Link "Sobre o LarCare"

### Limitações conhecidas

- **iOS sem trigger programático**: o botão na variante iOS é só "Entendi" — Safari não tem `beforeinstallprompt`, é mecanismo do navegador. As 3 instruções visuais cobrem o ato.
- **Visual do botão Compartilhar varia entre iOS 15/16/17/18**: o microcopy fallback compensa.
- **Acceptance medida só via `appinstalled`**: em iOS não há esse evento, então `larcare:installed_at` fica vazio mesmo após install real. Detector cai de volta em `navigator.standalone` quando o usuário abre via Home Screen.
- **In-app browser ainda permite o sheet abrir manualmente** via Perfil → o usuário vê a instrução para "abrir no Safari/Chrome". Auto-trigger NÃO acontece em in-app.

---

## ANEXO C — SPRINT NOTURNO: CATÁLOGO EXPANDIDO + BRAND (2026-05-14)

Terceira camada de polish após Fase 2 (Supabase) e Modo App Demo. Foco: aumentar a aparência de produto real do LarCare. Versão `1.5.0`.

### O que mudou

- **Catálogo dobrado**: 8 → 18 categorias organizadas em 4 grupos (Reparos, Limpeza, Cuidado da casa, Família e pet). Inclui agora diarista, faxina pesada, estofados, pós-obra, jardinagem, dedetização, caixa d'água, pet sitter, cuidador de idoso, babá. `LarCareData.GROUPS` novo; `findGroup`, `categoriesByGroup` expostos.
- **Migration 0003 (`20260514150003_catalogo_expandido.sql`)**: tabela `grupos_categoria` + FK `grupo_id` + coluna `emoji` em categorias. RLS pública leitura, admin write.
- **3 prestadores novos** (pro-013 Diana, pro-014 Helena, pro-015 Lúcia) cobrindo limpeza, jardinagem/dedetização e cuidado pessoal.
- **5 demandas novas** (dem-011..015) nas categorias novas.
- **Grid de categorias agrupado** em `clientNewDemand` step 1: cards emoji-first 3-col mobile / 4-col tablet / 6-col desktop com seção por grupo.
- **Logo redesenhado** em `components.js → brandMark()`: casa de cantos arredondados sage primary com coração-folha dourado integrado. Novo `icons/favicon.svg` referenciado em ambas as páginas.
- **Áudio via Web Audio API** em `js/audio.js`: três tons compostos (proposalReceived, proposalAccepted, reviewSubmitted), toggles independentes para sons e vibração (`larcare_sounds`, `larcare_vibration` em localStorage). Hookado em `simulator.js` e em `app.js` no submit de review.
- **Perfil cliente refatorado**: avatar + nome editável (prompt browser), toggle Cliente/Prestador, stats reativos do simulator, card de Preferências com toggles de sons e vibração, card "Modo demonstração" com Avançar timers e Resetar visíveis, link para Sobre.
- **Sobre o LarCare expandido**: nova seção "Onde estamos hoje" com SVG estilizado de Ribeirão Preto + pins de bairros, contato com WhatsApp + e-mail, footer institucional.
- **SEO**: meta tags geo migradas para Ribeirão Preto (geo.position, ICBM), JSON-LD `areaServed` atualizada com `containedInPlace=São Paulo` + `Brasil`. Sitemap.xml regenerado com 6 URLs canônicas.

### Supabase (Etapa 6 pulada)

As 4 envs (URL, ANON, SERVICE_ROLE, ACCESS_TOKEN) não estavam exportadas no shell deste sprint. **Para ativar o backend real**:

```bash
export SUPABASE_URL="https://<ref>.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOi…"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi…"
export SUPABASE_ACCESS_TOKEN="sbp_…"

supabase link --project-ref <ref>
supabase db push                                    # aplica migrations 0001, 0002, 0003
supabase db execute --linked --file supabase/seed.sql  # popular dados

# editar js/config.js:
#   USE_SUPABASE=true
#   SUPABASE_URL, SUPABASE_ANON_KEY com valores reais
```

A migration 0003 e seed correspondente já cobrem a taxonomia expandida.

### Limitações conscientes

- **PNG raster generation deferida**: novo logo existe só como SVG + favicon.svg. Os PNGs 192/512/maskable/apple-touch ainda são da versão anterior. Aceito porque modernos browsers preferem SVG; raster por device pode ser gerado quando houver `canvas`/`sharp` disponível.
- **Splash screens iOS dedicadas** (1290×2796 etc.) não geradas pelo mesmo motivo.
- **Lighthouse não re-medido neste sprint**: comando documentado no TESTING.md, owner deve rodar no Chrome DevTools antes do pitch.
- **Sobre — mapa**: SVG estilizado, não interativo (não usa Mapbox/Google). Suficiente pro pitch; em produção, considerar mapa real com pins clicáveis por bairro.

---

## ANEXO B — MODO APP DEMO COMPLETO (2026-05-14)

Esta sessão pegou o protótipo navegável e o transformou em **demo funcional impecável para celular**. Resumo do estado atual:

### O que mudou

- **Praça é Ribeirão Preto-SP**. Mock e helpers migrados. 12 prestadores em bairros reais (Centro, Jardim Botânico, Iguatemi, Ribeirânia, Castelo, Sumarezinho, Vila Tibério, Alto da Boa Vista, Nova Aliança, Ipiranga, Jardim Paulista). Cliente demo Maria Cristina mora no Jardim Califórnia.
- **8 categorias finais**: Elétrica, Hidráulica, Ar-condicionado, Montagem, Pintura, Chaveiro, Gás, Faz-tudo. Demanda dem-002 virou instalação de split; dem-008 virou cheiro de gás; dem-010 fica como chaveiro urgente.
- **Simulador de vida** em `js/simulator.js`. Demanda criada agenda propostas chegando em 10s/22s/1m15s/3min, com `navigator.vibrate` e toast. Status evolui `hired → em_atendimento → aguardando_avaliacao → completed`. Estado todo persistido em `localStorage` (chave `larcare_sim_v1`); reload preserva. 5 toques no logo abrem painel de debug com fast-forward e reset.
- **PWA hardening**: status-bar-style `black-translucent`, theme-color light/dark, safe-area-inset no header/footer/FAB/bottom-nav, tap-highlight transparente, inputs ≥16px (sem zoom no iOS), touch-action manipulation, sw.js v1.4.0 com precache dos arquivos novos.
- **Bottom nav fixa** em variants client/provider (mobile ≤720px), com badge dinâmica.
- **Banner "Modo demonstração"** sticky no topo (fechável; some quando display=standalone).
- **clientProfile** view nova em `#/cliente/perfil` com botão "Resetar demo". Mirror em `providerProfile`.

### Como funciona o simulador

`window.LarCareSim` expõe:

| API | Quando usar |
| --- | --- |
| `start()` | Chamado uma vez no boot. Restaura localStorage, liga contadores, registra 5-tap. |
| `createDemand({cat, description, urgency, ...})` | Cliente publica demanda. Insere em `D.DEMANDS`, agenda 4 propostas, emite eventos. |
| `acceptProposal(propId)` | Cliente escolhe. Marca aceita, rejeita as outras, agenda evolução de status. |
| `markCompleted(demandId, rating)` | Cliente envia avaliação. |
| `fastForward()` | Colapsa todos os timers pendentes (debug). |
| `reset()` | Limpa localStorage e dá reload. |
| `setRole('client'\|'provider')` | Troca contexto sem login. |

Eventos no `document` (CustomEvent):

- `larcare:demand-created` `{ id, demand }`
- `larcare:proposal-received` `{ proposal, demand, provider, isFirst }`
- `larcare:proposal-accepted` `{ proposal, demand }`
- `larcare:demand-status` `{ id, status }`
- `larcare:counters` `{ onlineProviders, openInRP, avgResponseMin }`
- `larcare:role-changed` `{ role }`
- `larcare:state-reset`

`app.js` escuta esses eventos e re-renderiza a view atual se ela for uma das que reagem ao tempo (proposalsList, demandPublished, clientDashboard, providerDashboard, demandDetail).

### Como resetar a demo

Três caminhos:

1. **No app, página Perfil** (cliente ou prestador) → botão "Resetar demo" → confirma.
2. **5 toques no logo** → painel "Modo desenvolvedor" → "Resetar demo".
3. **Console** (DevTools mobile remoto): `window.LarCareSim.reset()`.

Os três chamam `localStorage.removeItem('larcare_sim_v1')` e dão `location.reload()`.

### Como ativar Supabase

Inalterado da Fase 2 (Anexo A): provisionar projeto → `supabase db push` → `supabase db execute --file supabase/seed.sql` → editar `js/config.js` para `USE_SUPABASE = true`. O `seed.sql` foi sincronizado com Ribeirão Preto (8 categorias, 12 prestadores em bairros reais, 10 demandas + 3 históricas, 33 propostas) e usa `ON CONFLICT … DO UPDATE` para ser re-executável sem dor.

### Limitações conhecidas

- Pull-to-refresh nativo, swipe horizontal pra aceitar/recusar e confetti em avaliação 5★ ficaram fora (baixo impacto no pitch).
- Splash screens iOS dedicadas por viewport não foram geradas — uso fallback do theme color.
- `seed.sql` Supabase ainda em SP (USE_SUPABASE=false; mock_data.js é a fonte de verdade no demo).
- A oscilação de "X prestadores online agora" emite evento `larcare:counters` mas nenhuma view atualmente o consome visualmente; reservado para uma futura faixa de "atividade ao vivo" no header.

---

## ANEXO A — FASE 2: BACKEND SUPABASE PLUMBADO (2026-05-14)

A camada Supabase foi plugada em modo **opt-in default desligado**. O PWA continua rodando 100% sobre `js/mock_data.js` enquanto `js/config.js → USE_SUPABASE = false`. Detalhes de ativação, schema, RLS e operação ficam no `README.md` (seção "Fase 2 — Backend Supabase"); este anexo registra apenas o que importa para futuros agentes operando sob o protocolo de operação autônoma.

### Arquitetura do hot-swap

- `js/config.js` — flag `USE_SUPABASE` + URL + anon key (pública por design quando RLS está correta).
- `js/data_layer.js` — `LarCareData.bootstrap()` async. Em mock mode é no-op; em supabase mode busca tudo em paralelo, transforma para o shape do mock e **substitui** `window.LarCareData`.
- `js/app.js` — `boot()` virou async e dá `await bootstrap()` + `Object.assign(D, global.LarCareData)` antes do primeiro render. Views permaneceram síncronas.

### Schema

`supabase/migrations/20260514100001_initial_schema.sql` — 7 tabelas + admins, comments em todas, índices em FKs e colunas quentes, trigger `updated_at`, trigger `recalc_prestador_rating()` (denormaliza `rating_avg`/`rating_count` no insert de avaliações).

Decisões assumidas (registrar antes de questionar):

- Lat/lng `double precision` + função `distance_km()` haversine. PostGIS NÃO. Migra para PostGIS só quando busca por raio for hot path.
- `CHECK constraint` em vez de `ENUM type` em todos os campos categóricos. Evolução flexível sem `ALTER TYPE`.
- Soft delete em `profiles`, `prestadores`, `demandas`. Hard delete em `propostas` (churn alta, sem valor histórico). Avaliações são imutáveis.
- IDs textuais (`dem-001`, `pro-001`, `eletrica`) em entidades que viram URL — mantém compatibilidade de rota com o mock. `profiles.user_id uuid` linka com `auth.users` quando há sign-up real; nulo em seeds de demo.
- Admin via tabela `admins` (não JWT claim). `is_admin()` SECURITY DEFINER evita recursão de RLS.

### RLS

`supabase/migrations/20260514100002_rls_policies.sql` — RLS habilitada em todas as tabelas, inclusive lookups. Vetores cobertos: prestador falsificando `prestador_id` em proposta; cliente lendo propostas alheias; auto-avaliação; prestador vendo demanda fora da sua categoria; anônimo enumerando demandas. Detalhe por tabela está no README.

### Seed

`supabase/seed.sql` — equivalente 1:1 ao `js/mock_data.js`: 10 categorias, 12 prestadores, 13 demandas (10 abertas + 3 históricas), 43 propostas, 3 avaliações. Idempotente (`ON CONFLICT DO NOTHING`). Desabilita o trigger de recalc durante o insert para preservar rating_avg agregado.

### Anti-pause guard

`.github/workflows/keepalive.yml` — cron de 6h hitting `/rest/v1/categorias`. Free tier do Supabase pausa em ~7 dias de inatividade. Free, in-repo, zero infra externa. Requer secrets `SUPABASE_URL` e `SUPABASE_ANON_KEY` (não a service_role) no GitHub. Alternativas consideradas e descartadas: edge function self-ping (o projeto pausa antes), UptimeRobot (dependência externa), VPS cron (infra paga).

### O que NÃO foi feito nesta entrega e por quê

- **Não foi criado projeto Supabase**: env vars `SUPABASE_URL`/`SUPABASE_ANON_KEY` ausentes no shell quando esta sessão rodou, e criar projeto na conta do owner cai no item "compra/contratação de serviço" do protocolo. As migrations e o seed estão prontas; aplicar é um `supabase link` + `supabase db push` + `supabase db execute --file supabase/seed.sql` após o owner prover credenciais.
- **Views não foram refatoradas para async**: o bootstrap pattern elimina a necessidade. Quando paginação/realtime/cache offline virarem requisitos, refatorar com cabeça arquitetural; hoje, não.
- **Não há auth UI ainda**: o protótipo só lê dados. Quando entrar sign-up real, integrar Supabase Auth + popular `profiles.user_id` no callback de signup; as policies já estão preparadas para isso.

---
