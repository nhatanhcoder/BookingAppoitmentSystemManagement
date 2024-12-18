import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        
        const { token } = req.headers;

 
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
 
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = token_decode.id;

        
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

export default authUser;
