const jwt = require('jsonwebtoken');

// Demo login — admin / kotosh360
exports.login = (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'kotosh360') {
    const token = jwt.sign(
      { user: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, error: 'Credenciales inválidas' });
};
