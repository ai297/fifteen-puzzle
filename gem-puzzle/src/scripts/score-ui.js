function getScoreTable(score) {
    if (!Array.isArray(score) || score.length === 0) return '<p>No results in score.</p>';

    let scoreTable = '<table class="game-score"><tr><th></th><th>Player</th><th>Puzzle size</th><th>Points</th><th>Date</th></tr>';
    
    score.forEach((data, index) => {
        scoreTable += `
            <tr>
                <td>${index + 1}</td><td class="game-score__username">${data.player}</td><td>${data.field} × ${data.field}</td>
                <td class="game-score__points">${data.points}</td><td>${new Date(data.date).toLocaleDateString('en-GB')}</td>
            </tr>
        `;
    });

    scoreTable += '</table>';
    return scoreTable;
}
export default getScoreTable;
