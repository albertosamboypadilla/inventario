# Página Eurotruck (inventario) — reglas para Claude

Este proyecto se trabaja desde DOS PC (SAMBOY1 y SAMBOY2) y GitHub es la fuente de verdad.

1. **Antes de cambiar cualquier archivo:** `git pull` (o `git fetch` + revisar). Nunca sobrescribas archivos con una copia vieja: otra PC pudo haberlos cambiado.
2. **Después de cambiar:** `git add`, `git commit`, `git push`. Vercel publica solo desde GitHub (no hace falta `vercel deploy`).
3. **No quites el cambio automático de servidor** (`srvProbe`, `srvVigilar`, `srvCambiar` en `js/app.js`; `probe`, `vigilar`, `cambiar` en `movil/index.html`; `servidorUrl2` en `api/config.js`). Si SAMBOY1 no responde, la página pasa sola a SAMBOY2 (`SERVIDOR_URL_2` en Vercel) y vuelve cuando SAMBOY1 regresa.
4. Si `git pull` da conflicto, combínalo conservando los cambios de las dos PC; no descartes ninguno.
