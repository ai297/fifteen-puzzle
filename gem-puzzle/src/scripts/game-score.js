const GAME_SCORE_KEY = 'ai297-puzzle_game-score';
const SCORE_COUNTS = 10;

class Score {
    constructor() {
        const SCORE_COEFFICIENTS = {
            3: [1.0, 60, 40],
            4: [1.2, 180, 100],
            5: [1.4, 540, 300],
            6: [1.6, 960, 550],
            7: [1.8, 1260, 900],
            8: [2.0, 1560, 1500],
        };
        
        const loadScore = () => {
            let savedScore = localStorage.getItem(GAME_SCORE_KEY);
            if (savedScore === null) this.score = [];
            else this.score = JSON.parse(savedScore);
        }

        const saveScore = () => {
            if (this.score === undefined || this.score.length === 0) return;
            localStorage.setItem(GAME_SCORE_KEY, JSON.stringify(this.score));
        }

        this.calculateScore = (size, time, moves) => {
            if (SCORE_COEFFICIENTS[size] === undefined) return 0;
            let coefs = SCORE_COEFFICIENTS[size];
            return Math.ceil(100 * coefs[0] + 400 * (coefs[1] / time) + 600 * (coefs[2] / moves));
        };

        this.addToScore = (fieldSize, points, name) => {
            if (points <= this.score[this.score.length].points) return;

            const scorOnj = { field: fieldSize, points: points, player: name, date: Date.now() };
            this.score.push(scorOnj);

            this.score.sort((a, b) => b.points - a.points);
            this.score = this.score.slice(0, SCORE_COUNTS);

            saveScore();
        }

        Object.defineProperties(this, {
            bestPoints: {
                get: () => this.score.length > 0 ? this.score[0].points : 0,
            },
            minPointsInScore: {
                get: () => this.score.length > 0 ? this.score[this.score.length - 1].points : 0,
            },
        });

        loadScore();
    }
}
const GameScore = new Score();
export default GameScore;
