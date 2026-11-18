
const express = require('express');
const { randomUUID } = require('crypto');
const db = require('../database');

const router = express.Router();

// Consultar todos los jugadores
router.get('/', (req, res) => {
    try {
        const players = db.prepare(`
            SELECT
                p.id,
                p.name,
                p.created_at,
                p.last_activity,
                cp.current_level,
                cp.max_unlocked_level,
                cp.total_coins,
                cp.lives
            FROM players p
            LEFT JOIN campaign_progress cp
                ON cp.player_id = p.id
            ORDER BY p.name COLLATE NOCASE
        `).all();

        res.json(players);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'No se pudieron consultar los jugadores'
        });
    }
});

// Crear un jugador
router.post('/', (req, res) => {
    const name = typeof req.body.name === 'string'
        ? req.body.name.trim()
        : '';

    if (!name || name.length > 30) {
        return res.status(400).json({
            error: 'El nombre debe tener entre 1 y 30 caracteres'
        });
    }

    const createPlayer = db.transaction(() => {
        const id = randomUUID();

        db.prepare(`
            INSERT INTO players (id, name)
            VALUES (?, ?)
        `).run(id, name);

        db.prepare(`
            INSERT INTO campaign_progress (player_id)
            VALUES (?)
        `).run(id);

        db.prepare(`
            INSERT INTO player_statistics (player_id)
            VALUES (?)
        `).run(id);

        return db.prepare(`
            SELECT id, name, created_at
            FROM players
            WHERE id = ?
        `).get(id);
    });

    try {
        const player = createPlayer();

        res.status(201).json({
            message: 'Jugador creado correctamente',
            player
        });

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                error: 'Ya existe un jugador con ese nombre'
            });
        }

        if (error.code === 'SQLITE_CONSTRAINT_TRIGGER') {
            return res.status(409).json({
                error: 'Se alcanzó el límite de cinco jugadores'
            });
        }

        console.error(error);
        res.status(500).json({
            error: 'No se pudo crear el jugador'
        });
    }
});

// Seleccionar el último jugador utilizado
router.post('/:id/select', (req, res) => {
    try {
        const player = db.prepare(`
            SELECT id, name
            FROM players
            WHERE id = ?
        `).get(req.params.id);

        if (!player) {
            return res.status(404).json({
                error: 'Jugador no encontrado'
            });
        }

        const selectPlayer = db.transaction(() => {
            db.prepare(`
                UPDATE app_settings
                SET last_player_id = ?
                WHERE id = 1
            `).run(player.id);

            db.prepare(`
                UPDATE players
                SET last_activity = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(player.id);
        });

        selectPlayer();

        res.json({
            message: 'Jugador seleccionado correctamente',
            player
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'No se pudo seleccionar el jugador'
        });
    }
});

// Consultar el último jugador seleccionado
router.get('/last-selected', (req, res) => {
    try {
        const player = db.prepare(`
            SELECT p.id, p.name
            FROM app_settings a
            LEFT JOIN players p
                ON p.id = a.last_player_id
            WHERE a.id = 1
        `).get();

        res.json(player || null);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'No se pudo consultar el último jugador'
        });
    }
});

// Eliminar un jugador
router.delete('/:id', (req, res) => {
    try {
        const result = db.prepare(`
            DELETE FROM players
            WHERE id = ?
        `).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Jugador no encontrado'
            });
        }

        res.json({
            message: 'Jugador eliminado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'No se pudo eliminar el jugador'
        });
    }
});

module.exports = router;
