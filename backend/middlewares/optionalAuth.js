const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, _res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return next();

    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findByPk(payload.id);
    if (user) req.user = user;
    return next();
  } catch (_err) {
    return next();
  }
};
