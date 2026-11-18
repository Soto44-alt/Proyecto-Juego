
// Coordenadas de las monedas originales de cada nivel.
// Las filas y columnas comienzan desde cero.

const coinCoordinates = {
    1: [
        [6, 29],
        [6, 30],
        [9, 11],
        [9, 21],
        [11, 7],
        [11, 17],
        [13, 2]
    ],

    2: [
        [6, 31],
        [6, 32],
        [7, 9],
        [7, 20],
        [8, 37],
        [10, 20],
        [11, 7],
        [11, 8],
        [13, 2]
    ],

    3: [
        [7, 6],
        [7, 16],
        [7, 25],
        [7, 35],
        [9, 10],
        [9, 20],
        [9, 31],
        [11, 5],
        [11, 15],
        [11, 27],
        [11, 35],
        [13, 1],
        [13, 12],
        [13, 23]
    ],

    4: [
        [11, 5], [11, 25], [9, 10], [9, 20], [9, 31], [7, 15], [7, 36]
    ],

    5: [
        [11, 4], [11, 14], [11, 24], [11, 34], [9, 9], [9, 19], [9, 29]
    ],

    6: [
        [11, 4], [11, 14], [11, 24], [11, 34], [9, 8], [9, 18], [9, 28]
    ],

    7: [
        [11, 6], [11, 19], [11, 32], [9, 10], [9, 23], [7, 4], [7, 17]
    ],

    8: [
        [11, 4], [11, 12], [11, 20], [11, 28], [11, 35], [9, 7], [9, 16]
    ],

    9: [
        [11, 5], [11, 17], [11, 29], [9, 10], [9, 22], [9, 34], [7, 16]
    ],

    10: [
        [11, 5], [11, 13], [11, 21], [11, 29], [9, 9], [9, 25], [7, 36]
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
