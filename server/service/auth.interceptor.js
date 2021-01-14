const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        let tokenSplit = req.headers.authorization.split(" ");
        if (tokenSplit.length == 2 && tokenSplit[0] === 'Bearer') {
            jwt.verify(tokenSplit[1], process.env.JWT_SECRET, (error, decoded) => {
                if (error) {
                    console.log("Error Occured in Auth Interceptor:", error);
                    res.status(401).send("Not Authorized! Please Append valid Auth token.");
                } else {
                    req.userProfile = decoded;
                    next();
                }
            });
        } else {
            res.status(401).send("Not Authorized! Please Append valid Auth token.");
        }
    } else {
        res.status(401).send("Not Authorized! Please Append valid Auth token.");
    }
}