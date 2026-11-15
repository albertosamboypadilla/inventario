@echo off
cd /d C:\Desarrollos\inventario
git pull
git add index.html js/app.js css/minimal.css
git commit -m "Venta rapida: confirmar con Enter y aviso ELIMINADO grande"
git push
