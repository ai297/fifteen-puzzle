function victory(score, time, moves) {

    const starsCount = Math.floor(score / 500);

    let starsImage = `
    <svg viewBox="0 0 431 160" xmlns="http://www.w3.org/2000/svg">
        <path d="m48.6 27.47c3.96-0.973 22.5 29.6 26.2 31.2 3.77 1.54 38.4-7.4 40.6-3.93 2.15 3.46-21.3 30.5-21.6
            34.6-0.298 4.06 18.9 34.3 16.3 37.4-2.63 3.11-35.6-10.8-39.6-9.81-4 0.99-26.7 28.6-30.5
            27s-0.748-37.2-2.9-40.7c-2.15-3.46-35.4-16.6-35.1-20.7 0.298-4.06 35.1-12.2 37.8-15.3 2.63-3.11
            4.84-38.8 8.79-39.8z" fill="${starsCount > 1 ? 'currentColor' : 'none'}" stroke="${starsCount <= 1 ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-width="10"/>
        <path d="m210.5 4.044c5.553 0 20.07 46.53 24.57 49.77 4.491 3.267 53.28 2.709 54.99 7.992 1.719
            5.283-38.07 33.48-39.78 38.79-1.719 5.283 13.86 51.48 9.36 54.72-4.491 3.267-43.65-25.83-49.14-25.83s-44.64
            29.16-49.14 25.83 11.07-49.5 9.36-54.72c-1.719-5.283-41.49-33.48-39.78-38.79s50.49-4.725 54.99-7.992
            18.99-49.77 24.57-49.77z" fill="${starsCount > 0 ? 'currentColor' : 'none'}" stroke="${starsCount == 0 ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-width="10"/>
        <path d="m384.7 36.41c2.87-3.066 2.023 35.66 4.206 38.96 2.183 3.254 34.57 14.71 34.48 18.63-0.1435
        3.913-33.33 12.93-35.73 16.05-2.415 3.084-3.279 37.44-7.04 38.51s-22.63-27.63-26.29-29.06c-3.68-1.346-36.62
        8.451-38.76 5.206-2.183-3.254 19.34-30.04 19.43-33.96 0.1435-3.913-19.34-32.18-16.93-35.3 2.415-3.084 34.57
        9.093 38.32 8.023 3.76-1.07 28.34-27.01 28.34-27.01z" fill="${starsCount > 2 ? 'currentColor' : 'none'}" stroke="${starsCount <= 2 ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-width="10"/>
    </svg>
    `;

    return `
    <div class="victory">
        <div class="victory__stars">${starsImage}</div>
        <h2 class="victory__caption">Congratulations!</h2>
        <p>You score is</p>
        <div class="victory__score">${score}</div>
        <p>You solved the puzzle in ${time} and ${moves} moves.</p>
    </div>
    `;
}
export default victory;
