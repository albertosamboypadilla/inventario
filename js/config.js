
/* ════════════════════════════════════════════════════════════════════════
   CONFIGURACIÓN DE SINCRONIZACIÓN ENTRE ORDENADORES
   Pega aquí los datos de tu proyecto Firebase (ver instrucciones).
   Con esto, TODO lo escaneado se guarda en la nube y aparece en todos los
   ordenadores en tiempo real, aun antes de presionar "Cerrar Entrada".
   Si lo dejas vacío, la página sigue funcionando solo en este equipo.
   ════════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════════
   GUARDADO EN TU GITHUB (recomendado)
   Escribe aquí tu usuario y el repositorio donde se guardarán los datos.
   El token NO va aquí (la página es pública): se pide una sola vez en cada
   ordenador al hacer clic en el indicador de abajo a la izquierda.
   ════════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════════
   SERVIDOR DE TU PC (principal)
   En Vercel se toma solo de la variable de entorno SERVIDOR_URL (vía /api/config).
   Si abres la página desde otro lugar, puedes escribir la dirección aquí.
   ════════════════════════════════════════════════════════════════════════ */
window.EUROTRUCK_SERVER = {
  url: ""   // ej. "https://desktop-bv2qia0.tu-red.ts.net"
};

window.GITHUB_SYNC = {
  owner: "",                 // tu usuario de GitHub, ej. "albertosamboy"
  repo: "",                  // repositorio de datos, ej. "eurotruck-datos"
  branch: "inventario-datos",// rama donde se guardan (se crea sola)
  folder: "datos"            // carpeta dentro del repositorio
};

window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
