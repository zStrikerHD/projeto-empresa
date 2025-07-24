# Integração Estoque Bling ↔ Reval

Este projeto sincroniza produtos entre a API do Bling e a API da Reval.

## 📦 Estrutura

```
.
├── pegar-api-bling
│   ├── blingAPI.js
│   ├── token-bling.json        (IGNORADO)
│   ├── .env                    (IGNORADO)
│   └── ...
├── pegar-api-reval
│   ├── revalAPI.js
│   ├── token_reval.json        (IGNORADO)
│   ├── .env                    (IGNORADO)
│   └── ...
├── syncStock.js
└── .gitignore
```

## ⚙️ Configuração

1. Clone o repositório:

```bash
git clone https://github.com/sua-empresa/nome-do-repo.git
```

2. Instale as dependências:

```bash
cd pegar-api-bling
npm install
cd ../pegar-api-reval
npm install
```

3. Copie os arquivos de exemplo e configure as variáveis de ambiente:

```bash
cp pegar-api-bling/.env.example pegar-api-bling/.env
cp pegar-api-reval/.env.example pegar-api-reval/.env
```

4. Edite os `.env` com as suas próprias credenciais (API Keys, client ID, etc).

## 🚀 Uso

Execute o script principal:

```bash
node syncStock.js
```

---

## 🛡️ Segurança

Os arquivos `.env` e os tokens (`token-bling.json`, `token_reval.json`) estão **ignorados no Git** por padrão, e **não são incluídos no repositório público**.

---

## 📄 Licença

Este projeto é aberto para uso e adaptação, mas recomenda-se manter os créditos originais se for reutilizado.
