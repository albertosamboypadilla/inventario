// Vercel: entrega a la página la dirección del servidor de tu PC.
// Se configura en Vercel → Project → Settings → Environment Variables → SERVIDOR_URL
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ servidorUrl: process.env.SERVIDOR_URL || '' }));
};
