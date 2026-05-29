# 🇧🇷 Dominó Brasil — Guia de Deploy Completo

## Estrutura do Projeto
```
domino-brasil/
├── public/
│   ├── index.html          ← App completo (login + lobby + jogo)
│   └── js/
│       ├── firebase-config.js   ← Suas chaves Firebase (não commitar!)
│       └── game.js              ← Lógica do jogo (referência)
├── firestore.rules         ← Regras de segurança do banco
├── firestore.indexes.json  ← Índices do Firestore
├── firebase.json           ← Configuração de hosting
└── README.md               ← Este arquivo
```

---

## PASSO 1 — Criar projeto no Firebase

1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome: `dominobrasil` (ou como preferir)
4. Desative o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

---

## PASSO 2 — Ativar Authentication (Google)

1. No painel Firebase → **Authentication** → **Começar**
2. Aba **"Sign-in method"** → clique em **Google**
3. Ative e configure:
   - Nome do projeto: `Dominó Brasil`
   - Email de suporte: seu email
4. Clique **Salvar**

---

## PASSO 3 — Criar Firestore Database

1. No painel → **Firestore Database** → **Criar banco de dados**
2. Escolha: **"Iniciar no modo de produção"**
3. Localização: `southamerica-east1` (São Paulo — mais rápido para BR)
4. Clique **Concluído**

---

## PASSO 4 — Pegar suas chaves do Firebase

1. No painel → ⚙️ Configurações do projeto → **Seus aplicativos**
2. Clique em **"</> Web"** para registrar um app web
3. Nome: `Dominó Brasil Web`
4. ✅ Ative **Firebase Hosting**
5. Copie o objeto `firebaseConfig` que aparece

---

## PASSO 5 — Colar as chaves no index.html

Abra `public/index.html` e encontre este trecho:

```javascript
const firebaseConfig = {
  apiKey:            "COLE_SUA_API_KEY_AQUI",
  authDomain:        "dominobrasil.firebaseapp.com",
  projectId:         "dominobrasil",
  storageBucket:     "dominobrasil.appspot.com",
  messagingSenderId: "COLE_SEU_SENDER_ID",
  appId:             "COLE_SEU_APP_ID"
};
```

Substitua pelos valores reais do seu projeto.

---

## PASSO 6 — Configurar domínio autorizado no Google Auth

1. Firebase Console → Authentication → **Sign-in method**
2. Role até **"Domínios autorizados"**
3. Adicione seu domínio:
   - `dominobrasil.com.br`
   - `dominobrasil.web.app` (subdomínio Firebase gratuito)

---

## PASSO 7 — Instalar Firebase CLI e fazer deploy

```bash
# Instalar Firebase CLI (precisa de Node.js instalado)
npm install -g firebase-tools

# Login
firebase login

# Dentro da pasta do projeto:
cd domino-brasil

# Inicializar (selecione Hosting + Firestore)
firebase init

# Deploy completo
firebase deploy
```

Quando rodar `firebase init`, selecione:
- ✅ **Hosting** → pasta pública: `public`
- ✅ **Firestore** → use os arquivos já existentes

---

## PASSO 8 — Conectar domínio dominobrasil.com.br

1. Firebase Console → Hosting → **"Adicionar domínio personalizado"**
2. Digite: `dominobrasil.com.br`
3. O Firebase vai mostrar os registros DNS para configurar
4. No painel do seu registrador de domínio, adicione os registros A ou CNAME mostrados
5. Aguarde propagação (alguns minutos a poucas horas)

---

## CONFIGURAÇÃO DO GOOGLE AUTH — Credenciais separadas

Como você quer credenciais separadas do bolão:

1. No **Google Cloud Console** (console.cloud.google.com)
2. Certifique-se de estar no projeto `dominobrasil`
3. API & Services → **Credenciais**
4. O Firebase já cria um OAuth client automaticamente
5. Clique nele e adicione URIs de redirecionamento autorizados:
   - `https://dominobrasil.firebaseapp.com/__/auth/handler`
   - `https://dominobrasil.com.br/__/auth/handler`

Esse projeto Firebase é completamente separado do bolão — credenciais diferentes, banco diferente.

---

## Estrutura do Firestore (banco de dados)

```
/rooms/{roomId}
  ownerId: string           ← uid do criador
  ownerName: string
  status: "waiting" | "playing" | "finished"
  maxPlayers: 4
  mode: "Draw Game"
  createdAt: timestamp
  players: {
    [uid]: {
      name: string
      photo: string
      ready: boolean
      seat: number (0-3)
    }
  }
  playerIds: string[]       ← para queries
  gameState: {              ← estado do jogo em tempo real
    chain: []
    leftEnd: number | null
    rightEnd: number | null
    boneyard: []
    hands: { [uid]: [] }
    turnOrder: string[]
    turnIndex: number
    scores: { [uid]: number }
    round: number
  }

/users/{uid}
  name: string
  photo: string
  email: string
  lastSeen: timestamp
```

---

## Melhorias futuras que você pode pedir

- [ ] Chat em tempo real dentro da sala
- [ ] Sistema de pontuação por torneio / ranking
- [ ] Modo 2x2 com duplas (Equipe A vs Equipe B)
- [ ] Timer por jogada
- [ ] Sons e animações de peça caindo
- [ ] Perfil do jogador com estatísticas
- [ ] Sala privada com senha
- [ ] Modo All Fives (pontuação especial)
- [ ] Notificação quando é sua vez
- [ ] PWA (instalar como app no celular)

---

## Custos estimados (Firebase)

O Firebase tem plano **Spark (gratuito)** generoso:
- Firestore: 1GB storage, 50k leituras/dia, 20k escritas/dia
- Hosting: 10GB/mês, 125k requisições/dia
- Auth: ilimitado

Para um jogo casual, o plano gratuito aguenta bem. Só upgrade se virar viral! 🚀
