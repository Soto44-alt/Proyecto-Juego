
const express = require('express');
const db = require('../database');
const { getValidCoinIds, getLevelCount } = require('../levelCoins');

const router = express.Router();

// Validar vidas recibidas
function validLives(lives) {
    return Number.isInteger(lives) && lives >= 0 && lives <= 3;
}

// Consultar progreso de un jugador
router.get('/:playerId', (req, res) => {
    try {
        const progress = db.prepare(`
            SELECT *
            FROM campaign_progress
            WHERE player_id = ?
        `).get(req.params.playerId);

        if (!progress) {
            return res.status(404).json({
                error: 'No se encontró el progreso del jugador'
            });
        }

        // Si había un nivel en curso, se considera una
        // interrupción inesperada. Se conservan las vidas guardadas.
        const interrupted = progress.level_in_progress !== null;

        if (interrupted) {
            db.prepare(`
                UPDATE campaign_progress
                SET level_in_progress = NULL
                WHERE player_id = ?
            `).run(req.params.playerId);
        }

        res.json({
            ...progress,
            level_in_progress: null,
            recovered_after_interruption: interrupted
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'No se pudo consultar el progreso'
        });
    }
});

// Registrar el inicio de un nivel
router.post('/:playerId/start-level', (req, res) => {
    const { level, mode } = req.body;

    if (!Number.isInteger(level) || level < 1 || level > getLevelCount()) {
        return res.status(400).json({
            error: 'El nivel indicado no es válido'
        });
    }

    if (!['principal', 'repeticion'].includes(mode)) {
        return res.status(400).json({
            error: 'La modalidad de juego no es válida'
        });
    }

    try {
        const progress = db.prepare(`
            SELECT *
            FROM campaign_progress
            WHERE player_id = ?
        `).get(req.params.playerId);

        if (!progress) {
            return res.status(404).json({
                error: 'Jugador no encontrado'
            });
        }

        if (progress.level_in_progress !== null) {
            return res.status(409).json({
                error: 'Ya hay un nivel activo para este jugador'
            });
        }

        if (mode === 'principal' && level !== progress.current_level) {
            return res.status(400).json({
                error: 'El nivel no corresponde al avance actual de la campaña'
            });
        }

        if (mode === 'repeticion' && level > progress.max_unlocked_level) {
            return res.status(400).json({
                error: 'El nivel todavía no está desbloqueado'
            });
        }

        db.prepare(`
            UPDATE campaign_progress
            SET level_in_progress = ?,
                game_mode = ?
            WHERE player_id = ?
        `).run(level, mode, req.params.playerId);

        res.json({
            message: 'Nivel iniciado correctamente',
            level,
            mode,
            saved_lives: progress.lives
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'No se pudo registrar el inicio del nivel'
        });
    }
});

// Confirmar la finalización de un nivel
router.post('/:playerId/complete-level', (req, res) => {
    const { level, lives, coinIds = [] } = req.body;

    if (
        !Number.isInteger(level) ||
        level < 1 ||
        level > getLevelCount() ||
        !validLives(lives)
    ) {
        return res.status(400).json({
            error: 'El nivel o la cantidad de vidas no son válidos'
        });
    }

    if (
        !Array.isArray(coinIds) ||
        coinIds.some(id => typeof id !== 'string' || !id.trim())
    ) {
        return res.status(400).json({
            error: 'La lista de monedas no es válida'
        });
    }

    const uniqueCoinIds = [...new Set(coinIds.map(id => id.trim()))];
    const allowedCoins = new Set(getValidCoinIds(level));
    const invalidCoinId = uniqueCoinIds.find(id => !allowedCoins.has(id));

    if (invalidCoinId) {
        return res.status(400).json({
            error: 'La moneda indicada no existe en este nivel',
            coinId: invalidCoinId
        });
    }

    try {
        const completeLevel = db.transaction(() => {
            const progress = db.prepare(`
                SELECT *
                FROM campaign_progress
                WHERE player_id = ?
            `).get(req.params.playerId);

            if (!progress) {
                throw new Error('PLAYER_NOT_FOUND');
            }

            if (progress.level_in_progress !== level) {
                throw new Error('LEVEL_NOT_IN_PROGRESS');
            }

            const isMainCampaign = progress.game_mode === 'principal';

            if (isMainCampaign && level !== progress.current_level) {
                throw new Error('INVALID_CAMPAIGN_LEVEL');
            }

            let newCoins = 0;
            let totalCoins = progress.total_coins;
            let updatedLives = lives;

            if (isMainCampaign) {
                const insertCoin = db.prepare(`
                    INSERT OR IGNORE INTO collected_coins
                    (player_id, level_id, coin_id)
                    VALUES (?, ?, ?)
                `);

                for (const coinId of uniqueCoinIds) {
                    const result = insertCoin.run(
                        req.params.playerId,
                        level,
                        coinId
                    );

                    newCoins += result.changes;
                }

                totalCoins += newCoins;

                // Una vida adicional por cada 20 monedas acumuladas,
                // respetando el máximo de tres vidas.
                const previousMilestones = Math.floor(
                    progress.total_coins / 20
                );

                const newMilestones = Math.floor(
                    totalCoins / 20
                );

                const earnedLives = newMilestones - previousMilestones;

                updatedLives = Math.min(3, lives + earnedLives);

                // Actualizar estadísticas históricas de campaña.
                db.prepare(`
                    UPDATE player_statistics
                    SET levels_completed = levels_completed + 1,
                        coins_collected = coins_collected + ?,
                        best_level = MAX(best_level, ?)
                    WHERE player_id = ?
                `).run(
                    newCoins,
                    level,
                    req.params.playerId
                );
            }

            // En repetición no se contabilizan monedas ni
            // se modifica el avance principal de la campaña.
            const nextLevel = isMainCampaign
                ? level + 1
                : progress.current_level;

            const maxUnlocked = isMainCampaign
                ? Math.max(progress.max_unlocked_level, level + 1)
                : progress.max_unlocked_level;

            db.prepare(`
                UPDATE campaign_progress
                SET current_level = ?,
                    max_unlocked_level = ?,
                    total_coins = ?,
                    lives = ?,
                    level_in_progress = NULL
                WHERE player_id = ?
            `).run(
                nextLevel,
                maxUnlocked,
                totalCoins,
                updatedLives,
                req.params.playerId
            );

            db.prepare(`
                UPDATE players
                SET last_activity = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(req.params.playerId);

            return {
                mode: progress.game_mode,
                completed_level: level,
                next_level: nextLevel,
                max_unlocked_level: maxUnlocked,
                new_coins: newCoins,
                total_coins: totalCoins,
                lives: updatedLives
            };
        });

        const result = completeLevel();

        res.json({
            message: 'Nivel completado correctamente',
            ...result
        });

    } catch (error) {
        if (error.message === 'PLAYER_NOT_FOUND') {
            return res.status(404).json({
                error: 'Jugador no encontrado'
            });
        }

        if (error.message === 'LEVEL_NOT_IN_PROGRESS') {
            return res.status(409).json({
                error: 'No hay coincidencia con el nivel registrado como activo'
            });
        }

        if (error.message === 'INVALID_CAMPAIGN_LEVEL') {
            return res.status(400).json({
                error: 'El nivel no corresponde a la campaña actual'
            });
        }

        console.error(error);
        res.status(500).json({
            error: 'No se pudo guardar la finalización del nivel'
        });
    }
});

// Guardar las vidas actuales sin cerrar el nivel activo.
router.post('/:playerId/checkpoint', (req, res) => {
    const { lives } = req.body;

    if (!validLives(lives)) {
        return res.status(400).json({
            error: 'La cantidad de vidas no es válida'
        });
    }

    try {
        const result = db.prepare(`
            UPDATE campaign_progress
            SET lives = ?
            WHERE player_id = ?
              AND level_in_progress IS NOT NULL
        `).run(lives, req.params.playerId);

        if (result.changes === 0) {
            return res.status(409).json({
                error: 'No hay ningún nivel activo para guardar'
            });
        }

        res.json({ message: 'Vidas guardadas correctamente', lives });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron guardar las vidas' });
    }
});

// Abandonar un nivel
router.post('/:playerId/abandon-level', (req, res) => {
    const { lives } = req.body;

    if (!validLives(lives)) {
        return res.status(400).json({
            error: 'La cantidad de vidas no es válida'
        });
    }

    try {
        const result = db.prepare(`
            UPDATE campaign_progress
            SET lives = ?,
                level_in_progress = NULL
            WHERE player_id = ?
              AND level_in_progress IS NOT NULL
        `).run(lives, req.params.playerId);

        if (result.changes === 0) {
            return res.status(409).json({
                error: 'No hay ningún nivel activo para abandonar'
            });
        }

        db.prepare(`
            UPDATE players
            SET last_activity = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(req.params.playerId);

        res.json({
            message: 'Nivel abandonado correctamente',
            saved_lives: lives,
            coins_discarded: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'No se pudo guardar el abandono del nivel'
        });
    }
});


// Iniciar una nueva partida
router.post('/:playerId/new-game', (req, res) => {
    try {
        const startNewGame = db.transaction(() => {
            const progress = db.prepare(`
                SELECT *
                FROM campaign_progress
                WHERE player_id = ?
            `).get(req.params.playerId);

            if (!progress) {
                throw new Error('PLAYER_NOT_FOUND');
            }

            if (progress.level_in_progress !== null) {
                throw new Error('LEVEL_IN_PROGRESS');
            }

            // Reiniciar el progreso de campaña
            db.prepare(`
                UPDATE campaign_progress
                SET current_level = 1,
                    max_unlocked_level = 1,
                    total_coins = 0,
                    lives = 3,
                    level_in_progress = NULL,
                    game_mode = 'principal'
                WHERE player_id = ?
            `).run(req.params.playerId);

            // Eliminar las monedas registradas de la campaña anterior
            db.prepare(`
                DELETE FROM collected_coins
                WHERE player_id = ?
            `).run(req.params.playerId);

            // Actualizar las estadísticas sin borrar el historial
            db.prepare(`
                UPDATE player_statistics
                SET games_started = games_started + 1
                WHERE player_id = ?
            `).run(req.params.playerId);

            // Actualizar la última actividad
            db.prepare(`
                UPDATE players
                SET last_activity = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(req.params.playerId);
        });

        startNewGame();

        res.json({
            message: 'Nueva partida iniciada correctamente',
            current_level: 1,
            max_unlocked_level: 1,
            total_coins: 0,
            lives: 3,
            game_mode: 'principal'
        });

    } catch (error) {
        if (error.message === 'PLAYER_NOT_FOUND') {
            return res.status(404).json({
                error: 'Jugador no encontrado'
            });
        }

        if (error.message === 'LEVEL_IN_PROGRESS') {
            return res.status(409).json({
                error: 'Debes abandonar el nivel activo antes de iniciar una nueva partida'
            });
        }

        console.error(error);

        res.status(500).json({
            error: 'No se pudo iniciar una nueva partida'
        });
    }
});


// Registrar una derrota
router.post('/:playerId/defeat', (req, res) => {
    try {
        const registerDefeat = db.transaction(() => {
            const progress = db.prepare(`
                SELECT *
                FROM campaign_progress
                WHERE player_id = ?
            `).get(req.params.playerId);

            if (!progress) {
                throw new Error('PLAYER_NOT_FOUND');
            }

            if (progress.level_in_progress === null) {
                throw new Error('NO_ACTIVE_LEVEL');
            }

            // En una repetición, no se reinicia la campaña.
            if (progress.game_mode === 'repeticion') {
                db.prepare(`
                    UPDATE campaign_progress
                    SET lives = 3,
                        level_in_progress = NULL
                    WHERE player_id = ?
                `).run(req.params.playerId);

                return {
                    mode: 'repeticion',
                    campaign_reset: false,
                    lives: 3
                };
            }

            // Reiniciar el progreso de la campaña principal.
            db.prepare(`
                UPDATE campaign_progress
                SET current_level = 1,
                    max_unlocked_level = 1,
                    total_coins = 0,
                    lives = 3,
                    level_in_progress = NULL,
                    game_mode = 'principal'
                WHERE player_id = ?
            `).run(req.params.playerId);

            // Eliminar las monedas registradas de la campaña anterior.
            db.prepare(`
                DELETE FROM collected_coins
                WHERE player_id = ?
            `).run(req.params.playerId);

            // Registrar la derrota sin borrar otras estadísticas.
            db.prepare(`
                UPDATE player_statistics
                SET defeats = defeats + 1
                WHERE player_id = ?
            `).run(req.params.playerId);

            // Actualizar la última actividad.
            db.prepare(`
                UPDATE players
                SET last_activity = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(req.params.playerId);

            return {
                mode: 'principal',
                campaign_reset: true,
                current_level: 1,
                max_unlocked_level: 1,
                total_coins: 0,
                lives: 3
            };
        });

        const result = registerDefeat();

        res.json({
            message: 'Derrota registrada correctamente',
            ...result
        });

    } catch (error) {
        if (error.message === 'PLAYER_NOT_FOUND') {
            return res.status(404).json({
                error: 'Jugador no encontrado'
            });
        }

        if (error.message === 'NO_ACTIVE_LEVEL') {
            return res.status(409).json({
                error: 'No hay ningún nivel activo'
            });
        }

        console.error(error);

        res.status(500).json({
            error: 'No se pudo registrar la derrota'
        });
    }
});


module.exports = router;
