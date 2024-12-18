import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        
        const { atoken } = req.headers;

 
        if (!atoken) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
 
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        
        if (token_decode.email !== process.env.EMAIL_ADMIN || token_decode.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized, login again' });
        }
        
        next();
    } catch (error) {
        console.error('Authentication Error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export default authAdmin;
