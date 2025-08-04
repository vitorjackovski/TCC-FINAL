require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const productionRoutes = require('./routes/productionRoutes');
const transportRoutes = require('./routes/transportRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportRoutes = require('./routes/reportRoutes'); 
const partnerRoutes = require('./routes/partnerRoutes');

// ✅ Somente a pasta `pagins` é pública
app.use(express.static(path.join(__dirname, 'frontend', 'pagins')));

// ✅ API routes
app.use('/api/usuarios', userRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/producao', productionRoutes);
app.use('/api/transportes', transportRoutes);
app.use('/api/armazens', warehouseRoutes);
app.use('/api/rastreamento', trackingRoutes);
app.use('/api/alertas', alertRoutes);
app.use('/api/relatorios', reportRoutes); 
app.use('/api/parceiros', partnerRoutes);

// Página inicial (teste)
app.get('/', (req, res) => {
  res.send('API de Rastreamento funcionando! ✅');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

