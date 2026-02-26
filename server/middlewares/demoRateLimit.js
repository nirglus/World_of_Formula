const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 15;
const store = new Map();

function getClientKey(req) {
    return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || "unknown";
}

module.exports = function demoRateLimit(req, res, next) {
    const key = getClientKey(req);
    const now = Date.now();
    let record = store.get(key);

    if (!record) {
        record = { count: 0, resetAt: now + WINDOW_MS };
        store.set(key, record);
    }
    if (now >= record.resetAt) {
        record.count = 0;
        record.resetAt = now + WINDOW_MS;
    }
    record.count += 1;

    if (record.count > MAX_REQUESTS) {
        return res.status(429).send("Too many demo login attempts. Try again later.");
    }
    next();
};
