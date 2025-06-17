// server/middleware/auth.js
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '/Users/jamesmeegan/Desktop/softwareDev/hospitalDoctorAdmin/.env' });

// Change this line to make 'auth' a named export
exports.auth = function(req, res, next) { // <--- MODIFIED THIS LINE
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user info (id, role) from token payload
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

/**
 * Middleware to check if the authenticated user has one of the required roles.
 * Usage: router.get('/protected', auth, checkRole(['admin', 'doctor']), (req, res) => { ... });
 * @param {Array<string>} roles - An array of roles that are allowed to access the route.
 */
exports.checkRole = (roles) => { // This line remains the same as it's already an export
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ msg: 'Access denied: User role not found.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: Insufficient permissions.' });
        }

        next();
    };
};