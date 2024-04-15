
export default {
    SoundVolume: 0.05,
    BackgroundMusicVolume: 0.5,

    valueHint:{
        opacity: 1,
    },
    units: {
        opacityAfterPlacement: 0.75,
        monsters: {
            fadeSpeedMs: 1250,
        },
        enemies: {
            fadeSpeedMs: 2000,
        }
    },

    startingPuzzle: 0,
    puzzles: {
        0: {
            grid: [
                [2, 5],
                [3, 1]
            ],
        },
        1: {
            grid: [
                [5, 2, 2],
                [5, 3, 5],
                [1, 5, 'p']
            ],
        },
        2: {
            grid: [
                [3, 1, 1, 2],
                [-5, 2, 1,'w'],
                [2, 1, 2, 5],
                ['p', 5, 2, -2]
            ]
        },
        3: {
            grid: [
                [2, 1, 'w', 2, 'w'],
                [1, 'r', 3, 5, -2],
                [-5, 2, 5, 'p', 'p'],
                [3, 1, 5, 3, 3],
                ['p', -2, -5, 1, 'r']
            ]
        }
    }
};