const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './pegar-api-bling/.env' });

const TOKEN_FILE = './token-bling.json'; // Arquivo para armazenar os tokens

// Função para carregar o token salvo
function loadToken() {
    try {
        const data = fs.readFileSync(TOKEN_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

// Função para salvar o novo token
function saveToken(tokenData) {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
}

// Função para verificar se o token ainda é válido
function isTokenValid(tokenData) {
    return tokenData && tokenData.expires_at && new Date().getTime() < tokenData.expires_at;
}

// 🔄 **Renovar token usando refresh_token**
async function refreshAccessToken(refreshToken) {
    console.log('🔄 Tentando renovar o token com refresh_token...');
    try {
        const response = await axios.post(
            'https://www.bling.com.br/Api/v3/oauth/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
                }
            }
        );

        // Atualiza os tokens no arquivo
        const tokenData = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token, // Garante que o novo refresh token é salvo
            expires_at: new Date().getTime() + response.data.expires_in * 1000
        };

        saveToken(tokenData);
        console.log('✅ Access Token renovado com sucesso:', tokenData.access_token);
        return tokenData.access_token;
    } catch (error) {
        console.error('❌ Erro ao renovar o token:', error.response ? error.response.data : error);
        return null;
    }
}

// 🚀 **Gerar um novo token com AUTH_CODE**
async function generateNewToken() {
    console.error('⚠️ Seu AUTH_CODE expirou! Gere um novo no Bling e atualize o .env');
    console.log('⚠️ Nenhum token válido encontrado. Gerando um novo...');

    try {
        const response = await axios.post(
            'https://www.bling.com.br/Api/v3/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: process.env.AUTH_CODE, // Código gerado no primeiro acesso
                redirect_uri: process.env.REDIRECT_URI,
                state: '12345'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
                }
            }
        );

        // Salva os novos tokens
        const tokenData = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_at: new Date().getTime() + response.data.expires_in * 1000
        };

        saveToken(tokenData);
        console.log('✅ Novo Access Token gerado:', tokenData.access_token);
        return tokenData.access_token;
    } catch (error) {
        console.error('❌ Erro ao gerar novo token:', error.response ? error.response.data : error);
        return null;
    }
}

// 🎯 **Obter um token válido**
async function getValidToken() {
    let tokenData = loadToken();

    if (isTokenValid(tokenData)) {
        console.log('🔄 Usando Access Token válido:', tokenData.access_token);
        return tokenData.access_token;
    } else if (tokenData && tokenData.refresh_token) {
        console.log('🔄 Token expirado. Tentando renovar com Refresh Token...');
        const newToken = await refreshAccessToken(tokenData.refresh_token);
        if (newToken) return newToken;
    }

    // Se o refresh falhou, precisa de um novo AUTH_CODE
    return await generateNewToken();
}

module.exports = { getValidToken };
