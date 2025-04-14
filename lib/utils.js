export function randomUserAgent() {
    const agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'curl/7.68.0',
    ];
    return agents[Math.floor(Math.random() * agents.length)];
}
