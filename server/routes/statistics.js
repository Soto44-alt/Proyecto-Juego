
const express = require('express');
const db = require('../database');

const router = express.Router();

// Consultar estadísticas históricas de un jugador
router.get('/:playerId', (req, res) => {
    try {
        const statistics = db.prepare(`
            SELECT
                ps.games_started,
                ps.levels_completed,
                ps.coins_collected,
                ps.defeats,
                ps.best_level,
                p.last_activity
            FROM player_statistics ps
            INNER JOIN players p
                ON p.id = ps.player_id
            WHERE ps.player_id = ?
        `).get(req.params.playerId);

        if (!statistics) {
            return res.status(404).json({
                error: 'No se encontraron estadísticas para este jugador'
            });
        }

        res.json(statistics);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'No se pudieron consultar las estadísticas'
        });
    }
});

module.exports = router;
