

module.exports.saveRedirectUrl = (req, res, next) => {
    if ((req.session.redirectUrl)) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isAuthenticated = (req, res, next)=> {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to upload documents.');
    res.redirect('/login/student');
};
