controller.init();
display.init();

var gameSession = {
    playerId: null,
    request: async function(url, options) {
        var response = await fetch(url, Object.assign({
            headers: { 'Content-Type': 'application/json' }
        }, options || {}));
        var data = await response.json().catch(function() { return {}; });
        if (!response.ok) {
            throw new Error(data.error || 'La solicitud al servidor falló.');
        }
        return data;
    },
    post: function(url, body) {
        return gameSession.request(url, {
            method: 'POST',
            body: JSON.stringify(body || {})
        });
    },
    startLevel: function(level, mode) {
        return gameSession.post('/api/progress/' + gameSession.playerId + '/start-level', {
            level: level,
            mode: mode
        });
    },
    saveCheckpoint: function(lives) {
        return gameSession.post('/api/progress/' + gameSession.playerId + '/checkpoint', {
            lives: lives
        });
    },
    completeLevel: function(level, lives, coinIds) {
        return gameSession.post('/api/progress/' + gameSession.playerId + '/complete-level', {
            level: level,
            lives: lives,
            coinIds: coinIds
        });
    },
    report: function(message) {
        document.getElementById('game-message').textContent = message || '';
    },
    showEnd: function(message) {
        gameSession.report(message);
        document.getElementById('abandon-level').hidden = true;
        document.getElementById('return-menu').hidden = false;
    }
};

var platformerEngineStarted = false;

(function() {
    var menu = document.getElementById('player-menu');
    var select = document.getElementById('player-select');
    var message = document.getElementById('menu-message');
    var controls = document.getElementById('game-controls');
    var continueButton = document.getElementById('continue-game');
    var newGameButton = document.getElementById('new-game');
    var createButton = document.getElementById('create-player');
    var statisticsButton = document.getElementById('show-statistics');
    var statisticsPanel = document.getElementById('statistics-panel');
    var statisticsMessage = document.getElementById('statistics-message');
    var abandonButton = document.getElementById('abandon-level');
    var returnButton = document.getElementById('return-menu');

    async function refreshPlayers(preferredId) {
        var players = await gameSession.request('/api/players');
        var last = await gameSession.request('/api/players/last-selected');
        select.innerHTML = '';

        players.forEach(function(player) {
            var option = document.createElement('option');
            option.value = player.id;
            option.textContent = player.name;
            select.appendChild(option);
        });

        if (preferredId || (last && last.id)) {
            select.value = preferredId || last.id;
        }
        continueButton.disabled = players.length === 0;
        newGameButton.disabled = players.length === 0;
        statisticsButton.disabled = players.length === 0;
    }

    function formatLastActivity(value) {
        if (!value) return 'Sin actividad registrada';
        var date = new Date(String(value).replace(' ', 'T') + 'Z');
        if (Number.isNaN(date.getTime())) return value;
        return new Intl.DateTimeFormat('es-CO', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    }

    statisticsButton.addEventListener('click', async function() {
        var playerId = select.value;
        if (!playerId) return;

        var selectedOption = select.options[select.selectedIndex];
        document.getElementById('statistics-player').textContent = selectedOption
            ? selectedOption.textContent
            : '';
        statisticsPanel.hidden = false;
        statisticsMessage.textContent = 'Cargando estadísticas…';

        try {
            var statistics = await gameSession.request('/api/statistics/' + playerId);
            document.getElementById('stat-games').textContent = Number(statistics.games_started || 0).toLocaleString('es-CO');
            document.getElementById('stat-levels').textContent = Number(statistics.levels_completed || 0).toLocaleString('es-CO');
            document.getElementById('stat-coins').textContent = Number(statistics.coins_collected || 0).toLocaleString('es-CO');
            document.getElementById('stat-defeats').textContent = Number(statistics.defeats || 0).toLocaleString('es-CO');
            document.getElementById('stat-best-level').textContent = 'Nivel ' + (statistics.best_level || 1);
            document.getElementById('stat-last-activity').textContent = formatLastActivity(statistics.last_activity);
            statisticsMessage.textContent = '';
        } catch (error) {
            statisticsMessage.textContent = error.message;
        }
    });

    document.getElementById('close-statistics').addEventListener('click', function() {
        statisticsPanel.hidden = true;
    });

    select.addEventListener('change', function() {
        statisticsPanel.hidden = true;
    });

    async function begin(playerId, newGame) {
        message.textContent = 'Conectando con el servidor…';
        try {
            await gameSession.post('/api/players/' + playerId + '/select');
            var progress;

            if (newGame) {
                progress = await gameSession.post('/api/progress/' + playerId + '/new-game');
            } else {
                progress = await gameSession.request('/api/progress/' + playerId);
            }

            gameSession.playerId = playerId;
            var level = newGame ? 1 : progress.current_level;
            if (level > game.levels.length) {
                message.textContent = 'La campaña ya está completada. Inicia una nueva partida.';
                return;
            }

            var start = await gameSession.startLevel(level, 'principal');
            gameSession.playerId = playerId;
            game.init();
            game.gameMode = 'principal';
            game.lives = newGame ? progress.lives : start.saved_lives;
            game.itemsCollected = newGame ? 0 : progress.total_coins;
            game.loadLevel(level - 1);
            menu.hidden = true;
            controls.hidden = false;
            abandonButton.hidden = false;
            returnButton.hidden = true;
            gameSession.report(progress.recovered_after_interruption
                ? 'Partida recuperada. Se conservó el progreso guardado.'
                : '');
            if (!platformerEngineStarted) {
                platformerEngineStarted = true;
                engine.init(game);
                engine.run();
            }
        } catch (error) {
            message.textContent = error.message;
        }
    }

    continueButton.addEventListener('click', function() {
        if (select.value) begin(select.value, false);
    });

    newGameButton.addEventListener('click', function() {
        if (select.value && window.confirm('¿Iniciar una nueva partida y reiniciar el progreso de este jugador?')) {
            begin(select.value, true);
        }
    });

    createButton.addEventListener('click', async function() {
        var input = document.getElementById('new-player-name');
        var name = input.value.trim();
        if (!name) {
            message.textContent = 'Escribe un nombre para el jugador.';
            return;
        }
        try {
            var result = await gameSession.post('/api/players', { name: name });
            input.value = '';
            await refreshPlayers(result.player.id);
            await begin(result.player.id, true);
        } catch (error) {
            message.textContent = error.message;
        }
    });

    abandonButton.addEventListener('click', async function() {
        try {
            await gameSession.post('/api/progress/' + gameSession.playerId + '/abandon-level', {
                lives: game.lives
            });
            game.gameOver = true;
            controls.hidden = true;
            menu.hidden = false;
            await refreshPlayers(gameSession.playerId);
            message.textContent = 'Nivel abandonado. El progreso guardado se conserva.';
        } catch (error) {
            gameSession.report(error.message);
        }
    });

    returnButton.addEventListener('click', async function() {
        controls.hidden = true;
        menu.hidden = false;
        message.textContent = '';
        try {
            await refreshPlayers(gameSession.playerId);
        } catch (error) {
            message.textContent = error.message;
        }
    });

    refreshPlayers().catch(function(error) {
        message.textContent = error.message + ' Comprueba que el servidor esté iniciado.';
    });
}());
