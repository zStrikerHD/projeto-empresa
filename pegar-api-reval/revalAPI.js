const axios = require('axios');
const { getValidToken } = require('./tokenManagerReval'); // Importa o gerenciador de token
require('dotenv').config(); // Carrega as variáveis de ambiente do .env

async function listarProdutos() {
    try {
        const accessToken = await getValidToken(); // Obtém um token válido da Reval
        const usuario = process.env.REVAL_USERNAME; // Obtém o usuário do .env

        if (!usuario) {
            console.error('❌ ERRO: Variável REVAL_USERNAME não encontrada no .env');
            return;
        }

        const response = await axios.get('http://api.reval.net/api/produto/get-all-tabela', {
            params: { usuario },
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.data || response.data.length === 0) {
            console.warn('⚠️ Nenhum produto encontrado na Reval.');
        } else {
            console.log(`✅ ${response.data.length} produtos carregados da Reval.`);
        }

    } catch (error) {
        if (error.response) {
            console.error(`❌ Erro da API (${error.response.status}):`, error.response.data);
        } else {
            console.error('❌ Erro ao acessar a API da Reval:', error.message);
        }
    }
}

// 🔄 **Executa a primeira chamada imediatamente**
listarProdutos();

// 🔄 **Configura para rodar automaticamente a cada 1 hora (3600000 ms)**
setInterval(async () => {
    console.log("🔄 Atualizando produtos da Reval...");
    await listarProdutos();
    console.log("✅ Atualização concluída!");
}, 3600000);
