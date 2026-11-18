
// Coordenadas de las monedas originales de cada nivel.
// Las filas y columnas comienzan desde cero.

const coinCoordinates = {
    1: [
        [4, 16],
        [6, 9],
        [9, 16],
        [13, 4],
        [13, 9]
    ],

    2: [
        [7, 11],
        [9, 14],
        [10, 6],
        [13, 10]
    ],

    3: [
        [7, 3],
        [7, 11],
        [7, 25],
        [7, 34],
        [9, 30],
        [10, 5],
        [10, 14],
        [11, 23],
        [11, 36],
        [13, 3],
        [13, 10],
        [13, 15],
        [13, 28],
        [13, 34]
    ]
};

// Obtener los identificadores válidos de un nivel.
function getValidCoinIds(level) {
    const coordinates = coinCoordinates[level];

    if (!coordinates) {
        return [];
    }

    return coordinates.map(([row, col]) =>
        `nivel${level}_fila${row}_columna${col}`
    );
}

function getLevelCount() {
    return Object.keys(coinCoordinates).length;
}

module.exports = { getValidCoinIds, getLevelCount };
