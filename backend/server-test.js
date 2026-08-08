// Test minimal — déploie ceci sur Railway pour vérifier que l'infra fonctionne
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => res.send('Fitia Backend OK'));
app.get('/health', (req, res) => res.json({ status: 'ok', time: Date.now() }));

app.listen(PORT, () => console.log(`Test server on port ${PORT}`));
