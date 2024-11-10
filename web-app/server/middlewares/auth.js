export const isAuthenticated = (req, res, next) => {
    if (req.session.username) {
      return next(); // User is authenticated
    }
    return res.status(401).json({ error: 'Unauthorized' });
};
