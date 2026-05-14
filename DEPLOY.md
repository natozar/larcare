# LarCare — Guia de Deploy em Domínio Próprio

> Tempo total esperado: 30 min de trabalho + 15 min a 2h de propagação DNS.

## Pré-requisitos

- Repositório `natozar/larcare` no GitHub Pages ativo
- Cartão de crédito ou Pix (registros de domínio são pagos)
- Acesso ao painel do registrador de domínio (Registro.br, GoDaddy, etc.)
- 30 minutos sem interrupção

---

## Passo 1 — Comprar o domínio

### Opção A: domínio `.com.br` (Registro.br — recomendado para LarCare)

1. Acesse <https://registro.br/dominio/larcare.com.br>
2. Se disponível, clique em "Registrar"
3. Preencha dados (CPF/CNPJ — não exige CNPJ para `.com.br` pessoa física)
4. Pague (R$ 40/ano)
5. Aguarde e-mail de confirmação (até 24h)

### Opção B: domínio `.com` ou `.app` (Cloudflare/Namecheap)

1. <https://www.cloudflare.com/products/registrar/> ou <https://www.namecheap.com>
2. Buscar `larcare.com` ou `larcare.app`
3. Comprar (USD 8-15/ano)

---

## Passo 2 — Configurar DNS

No painel do registrador, vá para **Editar DNS** (ou "Zona DNS"):

### Registros A (apex `larcare.com.br`)

```
Tipo  Nome  Valor                       TTL
A     @     185.199.108.153             3600
A     @     185.199.109.153             3600
A     @     185.199.110.153             3600
A     @     185.199.111.153             3600
```

### Registro CNAME (www)

```
Tipo   Nome  Valor                  TTL
CNAME  www   natozar.github.io.     3600
```

> **Atenção**: o ponto final em `natozar.github.io.` é obrigatório no Registro.br. Em outros registradores pode ser opcional.

---

## Passo 3 — Editar o arquivo CNAME no repo

O arquivo `CNAME` já existe na raiz com placeholder `larcare.com.br`. Se você usar outro domínio:

```bash
# Edite o arquivo:
echo "seudominio.com" > CNAME
git add CNAME
git commit -m "chore: domínio próprio em seudominio.com"
git push origin main
```

---

## Passo 4 — Ativar no GitHub Pages

1. Vá em <https://github.com/natozar/larcare/settings/pages>
2. Em **Custom domain**, digite `larcare.com.br` (ou seu domínio)
3. Clique **Save**
4. Aguarde até 24h para validação DNS
5. Quando o ✓ verde aparecer, marque **Enforce HTTPS**

---

## Passo 5 — Verificar propagação

### No celular ou outro device
```
nslookup larcare.com.br
```

Deve retornar um dos 4 IPs do GitHub (185.199.xxx.xxx). Se ainda não:

- Aguarde mais tempo (DNS pode levar até 48h em casos extremos, normal 15min-2h)
- Tente `dig larcare.com.br` para mais detalhes

### Verificação visual

Abra <https://larcare.com.br> no navegador. Deve carregar o LarCare com cadeado HTTPS.

---

## Passo 6 — Pós-deploy

### Atualizações que precisa fazer no código

1. **Sitemap.xml**: já usa caminhos relativos, nada a alterar.
2. **manifest.json**: `start_url` e `scope` relativos — funciona.
3. **OG/canonical**: já apontam para `natozar.github.io`. Atualizar para domínio novo:

```bash
# em index.html e app.html, substituir:
# https://natozar.github.io/larcare/
# por:
# https://larcare.com.br/
```

4. **JSON-LD LocalBusiness em index.html**: atualizar `url` e `image`.

### Smoke test após deploy

- [ ] Carrega em <https://seu-dominio>
- [ ] HTTPS verde (cadeado)
- [ ] PWA instala (botão na tela ou banner)
- [ ] Logo + favicon corretos
- [ ] OG preview funciona ao compartilhar link no WhatsApp
- [ ] Console sem erros novos (verifique DevTools mobile)

---

## Rollback

Se algo der errado:

```bash
# Reverter para o estado anterior do GitHub Pages:
# 1. Remova o domínio em github.com/natozar/larcare/settings/pages
# 2. Edite o CNAME do repo: vazio ou deletado
echo "" > CNAME
git commit -am "chore: rollback domínio próprio"
git push

# 3. Restaure URLs antigas se necessário
# 4. App fica acessível em natozar.github.io/larcare/ novamente
```

---

## Custo total recorrente

- **`.com.br`** via Registro.br: R$ 40/ano
- **`.com`** via Cloudflare: USD 9.15/ano (sem markup, registrar at-cost)
- HTTPS via Let's Encrypt: gratuito (GitHub Pages cuida)
- GitHub Pages: gratuito (público)

**Total**: ~R$ 40-50/ano para domínio.

---

## Domínios alternativos a considerar

Se `larcare.com.br` estiver indisponível:

- `usarcare.com.br`
- `lar-care.com.br`
- `larcare.app` (USD)
- `larcare.com` (USD)
- `cuidardolar.com.br`
- `larlimpo.com.br`
