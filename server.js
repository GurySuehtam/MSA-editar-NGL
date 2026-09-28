const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Config
app.use(cors());
app.use(express.json({ limit: '10mb' })); // pra receber imagem base64 se precisar
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos (seu html, css, imagens)
app.use(express.static(__dirname));

// ROTA PRINCIPAL - mostra seu gerador
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'msa-anonymous.html'));
});

// ROTA DA API - salva os dados quando alguém gera
app.post('/api/salvar', (req, res) => {
  const { mensagem, data } = req.body;
  
  const log = {
    mensagem,
    data: data || new Date().toLocaleString('pt-BR'),
    ip: req.ip
  };

  // 1. Salva local num arquivo (pra você ver depois)
  const linha = `${log.data} - "${log.mensagem}"\n`;
  fs.appendFileSync('leads.txt', linha);

  // 2. AQUI você coloca seu link do Google Sheets
  // fetch('https://script.google.com/macros/s/SEU_LINK/exec?mensagem=' + mensagem)

  console.log('Novo anonymous gerado:', log);
  res.json({ ok: true, message: 'Salvo!' });
});

// ROTA PRA VOCÊ VER QUEM GEROU
app.get('/leads', (req, res) => {
  if (!fs.existsSync('leads.txt')) return res.send('Nenhum lead ainda');
  const conteudo = fs.readFileSync('leads.txt', 'utf-8');
  res.send(`<pre>${conteudo}</pre>`);
});

app.listen(PORT, () => {
  console.log(`🚀 MSA Anonymous rodando em http://localhost:${PORT}`);
});