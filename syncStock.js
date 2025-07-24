const axios = require('axios');
const tokenManagerReval = require('./pegar-api-reval/tokenManagerReval');
const revalAPI = require('./pegar-api-reval/revalAPI');

require('dotenv').config();

// 🔄 Função para buscar o estoque da Reval
async function getRevalStock() {
    try {
        const accessToken = await getValidToken();
        if (!accessToken) {
            console.error("❌ Token inválido! Verifique as credenciais.");
            return [];
        }

        const apiUrl = `http://api.reval.net/api/produto/get-all-tabela?usuario=${process.env.REVAL_USERNAME}`;

        console.log(`📡 Fazendo requisição para: ${apiUrl}`);
        console.log(`🔑 Usando token: ${accessToken}`);

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!Array.isArray(response.data)) {
            console.error("❌ A resposta da API da Reval não é um array válido:", response.data);
            return [];
        }

        console.log(`✅ Estoque carregado: ${response.data.length} produtos`);
        return response.data;
    } catch (error) {
        console.error("❌ Erro ao obter estoque da Reval:", error.response ? error.response.data : error.message);
        return [];
    }
}

// 🚀 Executa a sincronização automaticamente a cada 1 hora
setInterval(getRevalStock, 3600000);
getRevalStock();
