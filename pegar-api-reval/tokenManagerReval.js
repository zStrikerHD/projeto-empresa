const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const TOKEN_FILE = './token_reval.json';

// 🔄 Função para obter um token válido
async function getValidToken() {
    let tokenData;

    // 📂 Tenta ler o token do arquivo JSON
    try {
        tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
        if (tokenData.expires_at > Date.now()) {
            console.log("✅ Token válido encontrado.");
            return tokenData.access_token;
        } else {
            console.log("⚠️ Token expirado, gerando um novo...");
        }
    } catch (error) {
        console.log("⚠️ Arquivo de token não encontrado ou inválido. Gerando um novo...");
    }

    // 🔑 Obtém um novo token da Reval
    try {
        const response = await axios.post("http://api.reval.net/api/auth", {
            username: process.env.REVAL_USERNAME,
            password: process.env.REVAL_PASSWORD
        });

        const newToken = response.data.access_token;
        tokenData = {
            access_token: newToken,
            expires_at: Date.now() + 3600 * 1000 // Expira em 1 hora
        };

        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
        console.log("✅ Novo token salvo com sucesso!");

        return newToken;
    } catch (error) {
        console.error("❌ Erro ao obter token da Reval:", error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = { getValidToken };
