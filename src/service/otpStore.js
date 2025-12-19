const OTP_TTL_MS = 5 * 60 * 1000;
const otpStore = new Map();

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function clearOtp(email) {
    const key = normalizeEmail(email);
    const entry = otpStore.get(key);
    if (entry && entry.timeoutId) {
        clearTimeout(entry.timeoutId);
    }
    otpStore.delete(key);
}

function getEntry(email) {
    const key = normalizeEmail(email);
    const entry = otpStore.get(key);
    if (!entry) {
        return null;
    }
    if (Date.now() > entry.expiresAt) {
        clearOtp(key);
        return null;
    }
    return entry;
}

function saveOtp(email, otp) {
    const key = normalizeEmail(email);
    const expiresAt = Date.now() + OTP_TTL_MS;
    const existing = otpStore.get(key);
    if (existing && existing.timeoutId) {
        clearTimeout(existing.timeoutId);
    }
    const timeoutId = setTimeout(() => {
        otpStore.delete(key);
    }, OTP_TTL_MS);
    otpStore.set(key, { otp, expiresAt, verified: false, timeoutId });
}

function verifyOtp(email, otp) {
    const entry = getEntry(email);
    if (!entry) {
        return { ok: false, reason: 'expired' };
    }
    if (entry.otp !== String(otp || '').trim()) {
        return { ok: false, reason: 'invalid' };
    }
    entry.verified = true;
    return { ok: true };
}

function getVerifiedEntry(email) {
    const entry = getEntry(email);
    if (!entry || !entry.verified) {
        return null;
    }
    return entry;
}

module.exports = {
    OTP_TTL_MS,
    clearOtp,
    generateOtp,
    getVerifiedEntry,
    saveOtp,
    verifyOtp,
};
