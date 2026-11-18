const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Ubicación de la carpeta de la base de datos
const databaseDirectory = path.join(__dirname, '..', 'database');

// Crear la carpeta si todavía no existe
if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

// Conectar con SQLite
const databasePath = path.join(databaseDirectory, 'platformer.db');
const db = new Database(databasePath);

// Activar las claves foráneas
db.pragma('foreign_keys = ON');

// Crear las tablas
db.exec(`

    -- 1. Jugadores
    CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL COLLATE NOCASE UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_activity TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Progreso de campaña
    CREATE TABLE IF NOT EXISTS campaign_progress (
        player_id TEXT PRIMARY KEY,
        current_level INTEGER NOT NULL DEFAULT 1
            CHECK (current_level >= 1),
        max_unlocked_level INTEGER NOT NULL DEFAULT 1
            CHECK (max_unlocked_level >= 1),
        total_coins INTEGER NOT NULL DEFAULT 0
            CHECK (total_coins >= 0),
        lives INTEGER NOT NULL DEFAULT 3
            CHECK (lives BETWEEN 0 AND 3),
        level_in_progress INTEGER
            CHECK (level_in_progress IS NULL OR level_in_progress >= 1),
        game_mode TEXT NOT NULL DEFAULT 'principal'
            CHECK (game_mode IN ('principal', 'repeticion')),

        FOREIGN KEY (player_id)
            REFERENCES players(id)
            ON DELETE CASCADE
    );

    -- 3. Monedas contabilizadas
    CREATE TABLE IF NOT EXISTS collected_coins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id TEXT NOT NULL,
        level_id INTEGER NOT NULL CHECK (level_id >= 1),
        coin_id TEXT NOT NULL,
        collected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (player_id)
            REFERENCES players(id)
            ON DELETE CASCADE,

        UNIQUE (player_id, level_id, coin_id)
    );

    -- 4. Estadísticas históricas
    CREATE TABLE IF NOT EXISTS player_statistics (
        player_id TEXT PRIMARY KEY,
        games_started INTEGER NOT NULL DEFAULT 0
            CHECK (games_started >= 0),
        levels_completed INTEGER NOT NULL DEFAULT 0
            CHECK (levels_completed >= 0),
        coins_collected INTEGER NOT NULL DEFAULT 0
            CHECK (coins_collected >= 0),
        defeats INTEGER NOT NULL DEFAULT 0
            CHECK (defeats >= 0),
        best_level INTEGER NOT NULL DEFAULT 1
            CHECK (best_level >= 1),

        FOREIGN KEY (player_id)
            REFERENCES players(id)
            ON DELETE CASCADE
    );

    -- 5. Configuración general
    CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        last_player_id TEXT,

        FOREIGN KEY (last_player_id)
            REFERENCES players(id)
            ON DELETE SET NULL
    );

    -- Garantizar un máximo de cinco jugadores
    CREATE TRIGGER IF NOT EXISTS limit_players
    BEFORE INSERT ON players
    WHEN (SELECT COUNT(*) FROM players) >= 5
    BEGIN
        SELECT RAISE(ABORT, 'Se alcanzo el limite de cinco jugadores');
    END;

`);

// Crear el registro único de configuración
db.prepare(`
    INSERT OR IGNORE INTO app_settings (id, last_player_id)
    VALUES (1, NULL)
`).run();

// Exportar la conexión para utilizarla desde otros archivos
module.exports = db;