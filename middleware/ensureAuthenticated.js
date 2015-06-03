function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.sendStatus(403);
  }
};

module.exports = ensureAuthenticated;
