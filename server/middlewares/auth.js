import jwt from "jsonwebtoken";

const pageNotFoundRedirect = `/error?status=404&message=Page%20Not%20Found`;

export const extractAccessToken = (req) => {
    const authHeader = req.headers['authorization'];
    
    if(authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
  
    return req.cookies?.accessToken || null;
};

export const authRequired = (req, res, next) => {
    try {
        const token = extractAccessToken(req);
        
        if(!token) {
            return res.redirect(`/error?status=401&message=Authorization%20Token%20Required`);
        }
    
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } 
    catch(err) {
        return res.redirect(`/error?status=401&message=Invalid%20Or%20Expired%20Token`);
    }
};

export const optionalAuth = (req, res, next) => {
    try {
        const token = extractAccessToken(req);
    
        if(!token) {
            return next();
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
    } 
    catch(err) {
    
    }

    next();
};

export const apiOnly = (req, res, next) => {
    const referer = req.headers.referer || req.headers.origin;
    const allowedOrigins = [
        process.env.CLIENT_URL || 'http://localhost:8080',
        'http://localhost:' + process.env.PORT,
        'http://127.0.0.1:' + process.env.PORT
    ];
    
    const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept?.includes('application/json');
    const hasValidReferer = referer && allowedOrigins.some(origin => referer.startsWith(origin));
    
    if(isAjax || hasValidReferer) {
        return next();
    }
    
    return res.redirect(pageNotFoundRedirect);
};

export const adminOnly = (req, res, next) => {
    try {
        const token = extractAccessToken(req);

        if(!token) {
            if(req.headers.accept?.includes('text/html')) {
                return res.redirect(pageNotFoundRedirect);
            }

            return res.redirect(pageNotFoundRedirect);
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if(payload.role !== 'admin') {
            if(req.headers.accept?.includes('text/html')) {
                return res.redirect(pageNotFoundRedirect);
            }

            return res.redirect(pageNotFoundRedirect);
        }

        req.user = payload;
        next();
    }
    catch(err) {
        if(req.headers.accept?.includes('text/html')) {
             return res.redirect(pageNotFoundRedirect);
        }

        return res.redirect(pageNotFoundRedirect);
    }
};

export const authenticateToken = (req, res, next) => {
    try {
        const token = extractAccessToken(req);

        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch(err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
