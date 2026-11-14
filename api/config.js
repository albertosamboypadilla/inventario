// Vercel: entrega a la página las direcciones de los servidores.
// Se configuran en Vercel → Project → Settings → Environment Variables:
//   SERVIDOR_URL    = SAMBOY1 (principal)
//   SERVIDOR_URL_2  = SAMBOY2 (respaldo: la página pasa sola a este si SAMBOY1 no responde)
// limpia espacios y caracteres invisibles (BOM) que a veces se cuelan al pegar la dirección en Vercel
const limpia = v => String(v || '').replace(/^[\uFEFF\s]+|[\uFEFF\s/]+$/g, '');
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ servidorUrl: limpia(process.env.SERVIDOR_URL), servidorUrl2: limpia(process.env.SERVIDOR_URL_2) }));
};
