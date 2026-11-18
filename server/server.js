const express = require('express');
const path = require('path');
const db = require('./database');
const playersRouter = require('./routes/players');
const progressRouter = require('./routes/progress');
const statisticsRouter = require('./routes/statistics');

const app = express();
const PORT = 3000;

// Permitir recibir y procesar datos JSON
app.use(express.json());

app.use('/api/players', playersRouter);
app.use('/api/progress', progressRouter);
app.use('/api/statistics', statisticsRouter);

// Servir solo los archivos del juego. El servidor y la base de datos quedan fuera.
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta de comprobación del servidor y la base de datos
app.get('/api/status', (req, res) => {
    try {
        const result = db.prepare('SELECT 1 AS connected').get();

        res.json({
            server: 'Funcionando',
            database: result.connected === 1 ? 'Conectada' : 'Desconectada'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error al comprobar la base de datos'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Platformer disponible en http://localhost:${PORT}`);
    console.log('Servidor conectado a SQLite');
});
