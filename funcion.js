const URL_SUPABASE = "https://ldyczacdmhmprvbtpvku.supabase.co";
const CLAVE_PUBLICA_SUPABASE =
  "sb_publishable_wYDLIYIC8gAUw8Z4JKxnaQ_QnEGTsue";

const CORREO_ADMINISTRADOR = "pirotec50@gmail.com";

// Número de cuenta Prex que se muestra en la opción de aportes.
const NUMERO_CUENTA_PREX = "1188359";

// PENDIENTE: pegá acá el enlace completo de pago de PayPal cuando recuperes la cuenta.
// Ejemplo: "https://paypal.me/tuUsuario"
const ENLACE_PAYPAL = "";

let clienteSupabase;
let usuarioActual = null;
let perfilUsuarioActual = null;
let registrosActuales = [];
let usuariosAdministrador = [];
let cierreActual = null;
let enlaceInformeActual = "";
let reconocimientoActivo = null;
let diasLicenciaTotales = 0;
let diasLicenciaUsados = 0;
let modoAdministrador = false;

const vistaAcceso = document.getElementById("vistaAcceso");
const formularioAcceso = document.getElementById("formularioAcceso");
const correoAccesoInput = document.getElementById("correoAcceso");
const contrasenaAccesoInput = document.getElementById("contrasenaAcceso");
const mensajeAcceso = document.getElementById("mensajeAcceso");
const botonAcceder = document.getElementById("botonAcceder");
const botonMostrarRegistro = document.getElementById("botonMostrarRegistro");
const correoUsuario = document.getElementById("correoUsuario");
const botonCerrarSesion = document.getElementById("botonCerrarSesion");

const modalRegistroUsuario = document.getElementById("modalRegistroUsuario");
const formularioRegistroUsuario = document.getElementById(
  "formularioRegistroUsuario"
);
const correoRegistroInput = document.getElementById("correoRegistro");
const contrasenaRegistroInput = document.getElementById(
  "contrasenaRegistro"
);
const repetirContrasenaRegistroInput = document.getElementById(
  "repetirContrasenaRegistro"
);
const mensajeRegistroUsuario = document.getElementById(
  "mensajeRegistroUsuario"
);
const botonCrearUsuario = document.getElementById("botonCrearUsuario");
const cancelarRegistroUsuario = document.getElementById(
  "cancelarRegistroUsuario"
);

const formularioRegistro = document.getElementById("formularioRegistro");
const fechaInput = document.getElementById("fecha");
const horasInput = document.getElementById("horas");
const licenciaInput = document.getElementById("esLicencia");
const observacionesInput = document.getElementById("observaciones");
const mesSeleccionadoInput = document.getElementById("mesSeleccionado");
const mensajeFormulario = document.getElementById("mensajeFormulario");
const tituloMes = document.getElementById("tituloMes");
const cantidadJornadas = document.getElementById("cantidadJornadas");
const totalHoras = document.getElementById("totalHoras");
const contadorRegistros = document.getElementById("contadorRegistros");
const listaRegistros = document.getElementById("listaRegistros");

const panelSaldoLicencia = document.getElementById("panelSaldoLicencia");
const formularioDiasLicencia = document.getElementById(
  "formularioDiasLicencia"
);
const diasLicenciaTotalesInput = document.getElementById(
  "diasLicenciaTotales"
);
const diasLicenciaRestantesTexto = document.getElementById(
  "diasLicenciaRestantes"
);
const detalleDiasLicencia = document.getElementById(
  "detalleDiasLicencia"
);

const botonCerrarMes = document.getElementById("botonCerrarMes");
const modalCierre = document.getElementById("modalCierre");
const formularioCierre = document.getElementById("formularioCierre");
const nombreTrabajadorInput = document.getElementById(
  "nombreTrabajador"
);
const totalModalCierre = document.getElementById("totalModalCierre");
const cancelarCierre = document.getElementById("cancelarCierre");

const aplicacion = document.getElementById("aplicacion");
const vistaInforme = document.getElementById("vistaInforme");
const botonVolver = document.getElementById("botonVolver");
const botonCompartir = document.getElementById("botonCompartir");
const botonQR = document.getElementById("botonQR");
const botonImprimir = document.getElementById("botonImprimir");
const botonPDF = document.getElementById("botonPDF");
const modalQR = document.getElementById("modalQR");
const codigoQR = document.getElementById("codigoQR");
const cerrarQR = document.getElementById("cerrarQR");
const advertenciaQR = document.getElementById("advertenciaQR");
const notificacion = document.getElementById("notificacion");

const selectorRol = document.getElementById(
  "selectorRolAdministrador"
);
const interruptorRol = document.getElementById(
  "cambiarRolAdministrador"
);
const textoRolActual = document.getElementById("textoRolActual");

const contenidoUsuario =
  document.getElementById("contenidoUsuario") ||
  document.querySelector(".contenido-principal");

const panelAdministrador = document.getElementById(
  "panelAdministrador"
);

const buscarUsuarioInput =
  document.getElementById("buscarUsuario") ||
  document.getElementById("busquedaUsuarios") ||
  document.getElementById("buscadorUsuarios");

const contadorUsuariosAdministrador =
  document.getElementById("contadorUsuariosAdministrador") ||
  document.getElementById("contadorUsuarios");

const listaUsuariosAdministrador = document.getElementById(
  "listaUsuariosAdministrador"
);

const mensajeAdministrador = document.getElementById(
  "mensajeAdministrador"
);

const botonApoyar = document.getElementById("botonApoyar");
const modalApoyo = document.getElementById("modalApoyo");
const botonCerrarApoyo = document.getElementById(
  "botonCerrarApoyo"
);
const numeroCuentaPrex = document.getElementById(
  "numeroCuentaPrex"
);
const botonCopiarPrex = document.getElementById(
  "botonCopiarPrex"
);
const codigoQRPaypal = document.getElementById("codigoQRPaypal");
const enlacePaypal = document.getElementById("enlacePaypal");
const mensajePaypal = document.getElementById("mensajePaypal");

const numerosTexto = {
  cero: 0,
  un: 1,
  uno: 1,
  una: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  trece: 13,
  catorce: 14,
  quince: 15,
  dieciseis: 16,
  diecisiete: 17,
  dieciocho: 18,
  diecinueve: 19,
  veinte: 20,
  veintiuno: 21,
  veintidos: 22,
  veintitres: 23,
  veinticuatro: 24
};

document.addEventListener("DOMContentLoaded", iniciarAplicacion);

async function iniciarAplicacion() {
  prepararEventos();
  configurarCuentaPrex();
  configurarPaypal();

  if (!window.supabase) {
    mostrarMensajeAcceso(
      "No se pudo cargar la conexión con Supabase.",
      true
    );
    return;
  }

  clienteSupabase = window.supabase.createClient(
    URL_SUPABASE,
    CLAVE_PUBLICA_SUPABASE
  );

  if (cargarInformeDesdeEnlace()) {
    return;
  }

  fechaInput.value = convertirFechaParaInput(new Date());
  mesSeleccionadoInput.value = obtenerMesActual();

  nombreTrabajadorInput.value =
    localStorage.getItem("nombreTrabajador") || "";

  try {
    const respuesta = await clienteSupabase.auth.getSession();

    if (respuesta.error) {
      throw respuesta.error;
    }

    if (respuesta.data.session) {
      await activarAplicacion(respuesta.data.session.user);
    } else {
      mostrarVistaAcceso();
    }
  } catch (error) {
    mostrarVistaAcceso();
    mostrarMensajeAcceso(
      "No se pudo comprobar la sesión.",
      true
    );
  }
}

function prepararEventos() {
  formularioAcceso.addEventListener("submit", iniciarSesion);
  botonCerrarSesion.addEventListener("click", cerrarSesion);
  botonMostrarRegistro.addEventListener(
    "click",
    abrirRegistroUsuario
  );
  cancelarRegistroUsuario.addEventListener(
    "click",
    cerrarRegistroUsuario
  );
  formularioRegistroUsuario.addEventListener(
    "submit",
    crearCuentaUsuario
  );
  formularioRegistro.addEventListener("submit", guardarRegistro);
  formularioDiasLicencia.addEventListener(
    "submit",
    guardarCantidadLicencia
  );
  mesSeleccionadoInput.addEventListener(
    "change",
    cargarMesSeleccionado
  );

  document
    .querySelectorAll(".boton-microfono")
    .forEach(function (boton) {
      boton.addEventListener("click", function () {
        iniciarReconocimientoVoz(boton.dataset.campo, boton);
      });
    });

  botonCerrarMes.addEventListener("click", abrirCierre);
  cancelarCierre.addEventListener("click", cerrarModalCierre);
  formularioCierre.addEventListener("submit", generarCierre);
  botonVolver.addEventListener("click", volverAplicacion);
  botonImprimir.addEventListener("click", imprimirInforme);
  botonPDF.addEventListener("click", descargarPDF);
  botonQR.addEventListener("click", mostrarCodigoQR);
  botonCompartir.addEventListener("click", compartirInforme);

  cerrarQR.addEventListener("click", function () {
    modalQR.close();
  });

  if (interruptorRol) {
    interruptorRol.addEventListener("change", cambiarModoRol);
  }

  if (buscarUsuarioInput) {
    buscarUsuarioInput.addEventListener(
      "input",
      renderizarUsuariosAdministrador
    );
  }

  if (botonApoyar) {
    botonApoyar.addEventListener("click", abrirModalApoyo);
  }

  if (botonCerrarApoyo) {
    botonCerrarApoyo.addEventListener(
      "click",
      cerrarModalApoyo
    );
  }

  if (botonCopiarPrex) {
    botonCopiarPrex.addEventListener("click", copiarCuentaPrex);
  }

  if (modalApoyo) {
    modalApoyo.addEventListener("click", function (evento) {
      if (evento.target === modalApoyo) {
        cerrarModalApoyo();
      }
    });
  }

  if (enlacePaypal) {
    enlacePaypal.addEventListener("click", function (evento) {
      if (!esEnlacePaypalValido()) {
        evento.preventDefault();
      }
    });
  }
}

function abrirModalApoyo() {
  if (!modalApoyo) {
    return;
  }

  configurarCuentaPrex();
  configurarPaypal();
  modalApoyo.showModal();
}

function cerrarModalApoyo() {
  if (modalApoyo && modalApoyo.open) {
    modalApoyo.close();
  }
}

function configurarCuentaPrex() {
  if (numeroCuentaPrex) {
    numeroCuentaPrex.textContent = NUMERO_CUENTA_PREX;
  }

  if (botonCopiarPrex) {
    botonCopiarPrex.disabled = !NUMERO_CUENTA_PREX;
  }
}

function configurarPaypal() {
  if (!codigoQRPaypal || !enlacePaypal || !mensajePaypal) {
    return;
  }

  codigoQRPaypal.innerHTML = "";

  if (!esEnlacePaypalValido()) {
    codigoQRPaypal.innerHTML = `
      <span class="qr-paypal-pendiente" aria-hidden="true">
        QR
      </span>
    `;

    enlacePaypal.removeAttribute("href");
    enlacePaypal.setAttribute("aria-disabled", "true");
    enlacePaypal.classList.add("deshabilitado");

    mensajePaypal.textContent =
      "Enlace pendiente de configurar.";

    return;
  }

  enlacePaypal.href = ENLACE_PAYPAL;
  enlacePaypal.setAttribute("aria-disabled", "false");
  enlacePaypal.classList.remove("deshabilitado");

  mensajePaypal.textContent =
    "También podés abrir PayPal en este dispositivo.";

  if (window.QRCode) {
    new QRCode(codigoQRPaypal, {
      text: ENLACE_PAYPAL,
      width: 118,
      height: 118,
      colorDark: "#173734",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    codigoQRPaypal.textContent =
      "No se pudo generar el QR.";
  }
}

function esEnlacePaypalValido() {
  return /^https:\/\/(www\.)?(paypal\.me|paypal\.com)\//i.test(
    ENLACE_PAYPAL.trim()
  );
}

async function copiarCuentaPrex() {
  if (!NUMERO_CUENTA_PREX) {
    mostrarNotificacion(
      "La cuenta Prex todavía no está configurada.",
      true
    );
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(NUMERO_CUENTA_PREX);
    } else {
      copiarTextoAlternativo(NUMERO_CUENTA_PREX);
    }

    mostrarNotificacion("Cuenta Prex copiada.", false);
  } catch (error) {
    mostrarNotificacion(
      "No se pudo copiar. La cuenta es " +
        NUMERO_CUENTA_PREX +
        ".",
      true
    );
  }
}

function copiarTextoAlternativo(texto) {
  const campoTemporal = document.createElement("textarea");

  campoTemporal.value = texto;
  campoTemporal.setAttribute("readonly", "");
  campoTemporal.style.position = "fixed";
  campoTemporal.style.opacity = "0";

  document.body.appendChild(campoTemporal);
  campoTemporal.select();

  const copiado = document.execCommand("copy");

  campoTemporal.remove();

  if (!copiado) {
    throw new Error("No se pudo copiar el texto.");
  }
}

function abrirRegistroUsuario() {
  formularioRegistroUsuario.reset();
  ocultarMensajeRegistroUsuario();
  modalRegistroUsuario.showModal();
  correoRegistroInput.focus();
}

function cerrarRegistroUsuario() {
  modalRegistroUsuario.close();
}

async function crearCuentaUsuario(evento) {
  evento.preventDefault();

  const correo = correoRegistroInput.value.trim();
  const contrasena = contrasenaRegistroInput.value;
  const repetirContrasena =
    repetirContrasenaRegistroInput.value;

  ocultarMensajeRegistroUsuario();

  if (contrasena.length < 8) {
    mostrarMensajeRegistroUsuario(
      "La contraseña debe tener al menos 8 caracteres.",
      true
    );
    return;
  }

  if (contrasena !== repetirContrasena) {
    mostrarMensajeRegistroUsuario(
      "Las contraseñas no coinciden.",
      true
    );
    return;
  }

  botonCrearUsuario.disabled = true;
  botonCrearUsuario.textContent = "Creando...";

  try {
    const respuesta = await clienteSupabase.auth.signUp({
      email: correo,
      password: contrasena,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (respuesta.error) {
      throw respuesta.error;
    }

    if (respuesta.data.session) {
      modalRegistroUsuario.close();
      await activarAplicacion(respuesta.data.user);
      mostrarNotificacion("Cuenta creada correctamente.", false);
    } else {
      formularioRegistroUsuario.reset();
      mostrarMensajeRegistroUsuario(
        "Cuenta creada. Revisá tu correo para confirmarla.",
        false
      );
    }
  } catch (error) {
    mostrarMensajeRegistroUsuario(
      "No se pudo crear la cuenta. Verificá el correo y la contraseña.",
      true
    );
  } finally {
    botonCrearUsuario.disabled = false;
    botonCrearUsuario.textContent = "Crear cuenta";
  }
}

async function iniciarSesion(evento) {
  evento.preventDefault();

  const correo = correoAccesoInput.value.trim();
  const contrasena = contrasenaAccesoInput.value;

  ocultarMensajeAcceso();

  botonAcceder.disabled = true;
  botonAcceder.textContent = "Ingresando...";

  try {
    const respuesta =
      await clienteSupabase.auth.signInWithPassword({
        email: correo,
        password: contrasena
      });

    if (respuesta.error) {
      throw respuesta.error;
    }

    contrasenaAccesoInput.value = "";
    await activarAplicacion(respuesta.data.user);
  } catch (error) {
    mostrarMensajeAcceso(
      "Correo o contraseña incorrectos.",
      true
    );
  } finally {
    botonAcceder.disabled = false;
    botonAcceder.textContent = "Ingresar";
  }
}

async function cerrarSesion() {
  botonCerrarSesion.disabled = true;

  try {
    const respuesta = await clienteSupabase.auth.signOut();

    if (respuesta.error) {
      throw respuesta.error;
    }

    limpiarSesionLocal();
    mostrarVistaAcceso();
  } catch (error) {
    mostrarNotificacion(
      "No se pudo cerrar la sesión.",
      true
    );
  } finally {
    botonCerrarSesion.disabled = false;
  }
}

function limpiarSesionLocal() {
  usuarioActual = null;
  perfilUsuarioActual = null;
  registrosActuales = [];
  usuariosAdministrador = [];
  cierreActual = null;
  modoAdministrador = false;
  diasLicenciaTotales = 0;
  diasLicenciaUsados = 0;

  listaRegistros.innerHTML = "";

  tituloMes.textContent = "Cargando...";
  cantidadJornadas.textContent = "0 jornadas registradas";
  totalHoras.textContent = "0 h";
  totalModalCierre.textContent = "0 h";
  contadorRegistros.textContent = "0";

  diasLicenciaRestantesTexto.textContent =
    "0 días disponibles";

  detalleDiasLicencia.textContent =
    "Cargando saldo de licencia...";

  botonCerrarMes.disabled = true;

  if (interruptorRol) {
    interruptorRol.checked = false;
  }

  if (buscarUsuarioInput) {
    buscarUsuarioInput.value = "";
  }
}

async function activarAplicacion(usuario) {
  usuarioActual = usuario;

  aplicacion.classList.add("oculto");
  vistaInforme.classList.add("oculto");

  try {
    perfilUsuarioActual = await obtenerOCrearPerfilUsuario(
      usuario
    );

    if (
      perfilUsuarioActual.eliminado === true ||
      perfilUsuarioActual.activo === false
    ) {
      await clienteSupabase.auth.signOut();

      limpiarSesionLocal();
      mostrarVistaAcceso();

      mostrarMensajeAcceso(
        perfilUsuarioActual &&
          perfilUsuarioActual.eliminado === true
          ? "Esta cuenta fue eliminada."
          : "Esta cuenta se encuentra desactivada.",
        true
      );

      return;
    }
  } catch (error) {
    await clienteSupabase.auth.signOut();

    limpiarSesionLocal();
    mostrarVistaAcceso();

    mostrarMensajeAcceso(
      "No se pudo verificar el estado de la cuenta.",
      true
    );

    return;
  }

  correoUsuario.textContent = usuario.email || "Usuario";

  registrosActuales = [];
  cierreActual = null;
  diasLicenciaTotales = 0;
  diasLicenciaUsados = 0;

  tituloMes.textContent = "Cargando...";
  cantidadJornadas.textContent = "Cargando registros...";
  totalHoras.textContent = "0 h";
  totalModalCierre.textContent = "0 h";
  contadorRegistros.textContent = "0";

  diasLicenciaRestantesTexto.textContent =
    "Cargando saldo...";

  detalleDiasLicencia.textContent =
    "Esperá un momento.";

  botonCerrarMes.disabled = true;
  panelSaldoLicencia.classList.remove("sin-saldo");

  listaRegistros.innerHTML = `
    <div class="estado-vacio">

      <div class="estado-vacio-icono">
        ⌛
      </div>

      <h3>
        Cargando registros
      </h3>

      <p>
        Esperá un momento.
      </p>

    </div>
  `;

  configurarSelectorAdministrador();
  mostrarModoUsuario();

  await cargarMesSeleccionado();

  vistaAcceso.classList.add("oculto");
  aplicacion.classList.remove("oculto");
}




async function obtenerOCrearPerfilUsuario(usuario) {
  let respuesta = await clienteSupabase
    .from("perfiles_usuarios")
    .select(
      "usuario_id, correo, activo, eliminado, creado_en"
    )
    .eq("usuario_id", usuario.id)
    .maybeSingle();

  if (respuesta.error) {
    throw respuesta.error;
  }

  if (respuesta.data) {
    return respuesta.data;
  }

  respuesta = await clienteSupabase
    .from("perfiles_usuarios")
    .insert({
      usuario_id: usuario.id,
      correo: usuario.email || ""
    })
    .select(
      "usuario_id, correo, activo, eliminado, creado_en"
    )
    .single();

  if (respuesta.error) {
    if (respuesta.error.code === "23505") {
      const consulta = await clienteSupabase
        .from("perfiles_usuarios")
        .select(
          "usuario_id, correo, activo, eliminado, creado_en"
        )
        .eq("usuario_id", usuario.id)
        .single();

      if (consulta.error) {
        throw consulta.error;
      }

      return consulta.data;
    }

    throw respuesta.error;
  }

  return respuesta.data;
}

function esAdministradorPrincipal() {
  if (!usuarioActual || !usuarioActual.email) {
    return false;
  }

  return (
    usuarioActual.email.trim().toLowerCase() ===
    CORREO_ADMINISTRADOR.toLowerCase()
  );
}

function configurarSelectorAdministrador() {
  if (!selectorRol) {
    return;
  }

  selectorRol.classList.toggle(
    "oculto",
    !esAdministradorPrincipal()
  );

  if (interruptorRol) {
    interruptorRol.checked = false;
  }
}

async function cambiarModoRol() {
  if (!interruptorRol) {
    return;
  }

  if (
    interruptorRol.checked &&
    esAdministradorPrincipal()
  ) {
    await mostrarModoAdministrador();
  } else {
    mostrarModoUsuario();
  }
}

function mostrarModoUsuario() {
  modoAdministrador = false;

  if (interruptorRol) {
    interruptorRol.checked = false;
  }

  if (textoRolActual) {
    textoRolActual.textContent = "Modo usuario";
  }

  if (contenidoUsuario) {
    contenidoUsuario.classList.remove("oculto");
  }

  if (panelAdministrador) {
    panelAdministrador.classList.add("oculto");
  }
}

async function mostrarModoAdministrador() {
  if (!esAdministradorPrincipal()) {
    mostrarModoUsuario();
    return;
  }

  modoAdministrador = true;

  if (textoRolActual) {
    textoRolActual.textContent = "Modo administrador";
  }

  if (contenidoUsuario) {
    contenidoUsuario.classList.add("oculto");
  }

  if (panelAdministrador) {
    panelAdministrador.classList.remove("oculto");
  }

  await cargarUsuariosAdministrador();
}

function mostrarVistaAcceso() {
  aplicacion.classList.add("oculto");
  vistaInforme.classList.add("oculto");
  vistaAcceso.classList.remove("oculto");

  if (panelAdministrador) {
    panelAdministrador.classList.add("oculto");
  }

  ocultarMensajeAdministrador();
  correoAccesoInput.focus();
}

async function cargarUsuariosAdministrador() {
  if (!esAdministradorPrincipal()) {
    return;
  }

  ocultarMensajeAdministrador();

  if (listaUsuariosAdministrador) {
    listaUsuariosAdministrador.innerHTML = `
      <div class="estado-vacio">
        <div class="estado-vacio-icono">⌛</div>
        <h3>Cargando usuarios</h3>
        <p>Esperá un momento.</p>
      </div>
    `;
  }

  try {
    const respuesta = await clienteSupabase
      .from("perfiles_usuarios")
      .select(
        "usuario_id, correo, activo, eliminado, creado_en"
      )
      .eq("eliminado", false)
      .order("creado_en", {
        ascending: true
      });

    if (respuesta.error) {
      throw respuesta.error;
    }

    usuariosAdministrador = respuesta.data || [];

    usuariosAdministrador.sort(function (
      usuarioA,
      usuarioB
    ) {
      const correoA = usuarioA.correo || "";
      const correoB = usuarioB.correo || "";

      if (
        correoA.toLowerCase() ===
        CORREO_ADMINISTRADOR.toLowerCase()
      ) {
        return -1;
      }

      if (
        correoB.toLowerCase() ===
        CORREO_ADMINISTRADOR.toLowerCase()
      ) {
        return 1;
      }

      return correoA.localeCompare(correoB, "es");
    });

    renderizarUsuariosAdministrador();
  } catch (error) {
    usuariosAdministrador = [];
    renderizarUsuariosAdministrador();

    mostrarMensajeAdministrador(
      "No se pudieron cargar los usuarios.",
      true
    );
  }
}

function renderizarUsuariosAdministrador() {
  if (
    !listaUsuariosAdministrador ||
    !contadorUsuariosAdministrador
  ) {
    return;
  }

  const textoBusqueda = buscarUsuarioInput
    ? buscarUsuarioInput.value.trim().toLowerCase()
    : "";

  const usuariosFiltrados =
    usuariosAdministrador.filter(function (usuario) {
      const correo = usuario.correo || "";

      return correo
        .toLowerCase()
        .includes(textoBusqueda);
    });

  contadorUsuariosAdministrador.textContent =
    usuariosFiltrados.length;

  listaUsuariosAdministrador.innerHTML = "";

  if (usuariosFiltrados.length === 0) {
    listaUsuariosAdministrador.innerHTML = `
      <div class="estado-vacio">
        <div class="estado-vacio-icono">👤</div>
        <h3>No se encontraron usuarios</h3>
        <p>Probá con otro correo electrónico.</p>
      </div>
    `;

    return;
  }

  usuariosFiltrados.forEach(function (usuario) {
    const articulo = document.createElement("article");

    articulo.className = usuario.activo
      ? "usuario-administrador"
      : "usuario-administrador inactivo";

    const informacion = document.createElement("div");
    informacion.className =
      "usuario-administrador-informacion";

    const correo = document.createElement("strong");
    correo.className = "usuario-administrador-correo";
    correo.textContent =
      usuario.correo || "Correo no disponible";

    const detalle = document.createElement("div");
    detalle.className = "usuario-administrador-detalle";

    const estado = document.createElement("span");
    estado.className = usuario.activo
      ? "estado-usuario activo"
      : "estado-usuario inactivo";

    estado.textContent = usuario.activo
      ? "Cuenta activa"
      : "Cuenta desactivada";

    const fecha = document.createElement("span");
    fecha.className = "usuario-administrador-fecha";

    fecha.textContent =
      usuario.correo &&
      usuario.correo.toLowerCase() ===
        CORREO_ADMINISTRADOR.toLowerCase()
        ? "Administrador principal"
        : formatearFechaRegistroUsuario(
            usuario.creado_en
          );

    detalle.appendChild(estado);
    detalle.appendChild(fecha);
    informacion.appendChild(correo);
    informacion.appendChild(detalle);

    const acciones = document.createElement("div");
    acciones.className =
      "acciones-usuario-administrador";

    const botonEstado = document.createElement("button");
    botonEstado.type = "button";

    botonEstado.className = usuario.activo
      ? "boton-estado-usuario"
      : "boton-estado-usuario activar";

    botonEstado.textContent = usuario.activo
      ? "Desactivar"
      : "Activar";

    const botonBorrar = document.createElement("button");
    botonBorrar.type = "button";
    botonBorrar.className = "boton-borrar-usuario";
    botonBorrar.textContent = "Borrar usuario";

    const esCuentaAdministrador =
      usuario.correo &&
      usuario.correo.toLowerCase() ===
        CORREO_ADMINISTRADOR.toLowerCase();

    botonEstado.disabled = esCuentaAdministrador;
    botonBorrar.disabled = esCuentaAdministrador;

    botonEstado.addEventListener("click", function () {
      cambiarEstadoUsuario(usuario);
    });

    botonBorrar.addEventListener("click", function () {
      borrarUsuarioLogicamente(usuario);
    });

    acciones.appendChild(botonEstado);
    acciones.appendChild(botonBorrar);
    articulo.appendChild(informacion);
    articulo.appendChild(acciones);

    listaUsuariosAdministrador.appendChild(articulo);
  });
}

async function cambiarEstadoUsuario(usuario) {
  if (
    !esAdministradorPrincipal() ||
    esCorreoAdministrador(usuario.correo)
  ) {
    return;
  }

  const nuevoEstado = !usuario.activo;

  try {
    const respuesta = await clienteSupabase
      .from("perfiles_usuarios")
      .update({
        activo: nuevoEstado,
        actualizado_en: new Date().toISOString()
      })
      .eq("usuario_id", usuario.usuario_id)
      .eq("eliminado", false)
      .select("usuario_id")
      .maybeSingle();

    if (respuesta.error) {
      throw respuesta.error;
    }

    if (!respuesta.data) {
      throw new Error("No se encontró el usuario.");
    }

    await cargarUsuariosAdministrador();

    mostrarMensajeAdministrador(
      nuevoEstado
        ? "La cuenta fue activada correctamente."
        : "La cuenta fue desactivada correctamente.",
      false
    );
  } catch (error) {
    mostrarMensajeAdministrador(
      "No se pudo cambiar el estado de la cuenta.",
      true
    );
  }
}

async function borrarUsuarioLogicamente(usuario) {
  if (
    !esAdministradorPrincipal() ||
    esCorreoAdministrador(usuario.correo)
  ) {
    return;
  }

  const confirmar = window.confirm(
    "¿Querés borrar la cuenta " +
      usuario.correo +
      "?\n\nEl usuario perderá el acceso, pero sus datos se conservarán."
  );

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await clienteSupabase
      .from("perfiles_usuarios")
      .update({
        activo: false,
        eliminado: true,
        actualizado_en: new Date().toISOString()
      })
      .eq("usuario_id", usuario.usuario_id)
      .select("usuario_id")
      .maybeSingle();

    if (respuesta.error) {
      throw respuesta.error;
    }

    if (!respuesta.data) {
      throw new Error("No se encontró el usuario.");
    }

    await cargarUsuariosAdministrador();

    mostrarMensajeAdministrador(
      "El usuario fue borrado lógicamente.",
      false
    );
  } catch (error) {
    mostrarMensajeAdministrador(
      "No se pudo borrar el usuario.",
      true
    );
  }
}

function esCorreoAdministrador(correo) {
  return (
    typeof correo === "string" &&
    correo.trim().toLowerCase() ===
      CORREO_ADMINISTRADOR.toLowerCase()
  );
}

function formatearFechaRegistroUsuario(fechaTexto) {
  if (!fechaTexto) {
    return "Fecha no disponible";
  }

  const fecha = new Date(fechaTexto);

  if (Number.isNaN(fecha.getTime())) {
    return "Fecha no disponible";
  }

  return (
    "Registrado el " +
    new Intl.DateTimeFormat("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(fecha)
  );
}

function mostrarMensajeAdministrador(texto, esError) {
  if (!mensajeAdministrador) {
    return;
  }

  mensajeAdministrador.textContent = texto;
  mensajeAdministrador.classList.add("visible");
  mensajeAdministrador.classList.toggle(
    "error",
    esError
  );
}

function ocultarMensajeAdministrador() {
  if (!mensajeAdministrador) {
    return;
  }

  mensajeAdministrador.textContent = "";
  mensajeAdministrador.classList.remove(
    "visible",
    "error"
  );
}

async function agregarRegistroBase(registro) {
  const respuesta = await clienteSupabase
    .from("registros_laborales")
    .insert({
      usuario_id: usuarioActual.id,
      fecha: registro.fecha,
      minutos: registro.minutos,
      observaciones: registro.observaciones,
      es_licencia: registro.esLicencia
    })
    .select()
    .single();

  if (respuesta.error) {
    throw respuesta.error;
  }

  return convertirRegistroSupabase(respuesta.data);
}

async function eliminarRegistroBase(id) {
  const respuesta = await clienteSupabase
    .from("registros_laborales")
    .delete()
    .eq("id", id)
    .eq("usuario_id", usuarioActual.id);

  if (respuesta.error) {
    throw respuesta.error;
  }
}

async function obtenerRegistrosDelMes(mes) {
  const respuesta = await clienteSupabase
    .from("registros_laborales")
    .select(
      "id, fecha, minutos, observaciones, es_licencia, creado_en"
    )
    .eq("usuario_id", usuarioActual.id)
    .gte("fecha", mes + "-01")
    .lt("fecha", obtenerInicioMesSiguiente(mes))
    .order("fecha", {
      ascending: false
    });

  if (respuesta.error) {
    throw respuesta.error;
  }

  return (respuesta.data || []).map(
    convertirRegistroSupabase
  );
}

async function obtenerTodosLosRegistros() {
  const respuesta = await clienteSupabase
    .from("registros_laborales")
    .select(
      "id, fecha, minutos, observaciones, es_licencia, creado_en"
    )
    .eq("usuario_id", usuarioActual.id);

  if (respuesta.error) {
    throw respuesta.error;
  }

  return (respuesta.data || []).map(
    convertirRegistroSupabase
  );
}

async function guardarCierreBase(cierre) {
  const respuesta = await clienteSupabase
    .from("cierres_mensuales")
    .upsert(
      {
        usuario_id: usuarioActual.id,
        mes: cierre.mes + "-01",
        total_minutos: cierre.totalMinutos,
        dias_licencia_restantes:
          cierre.diasLicenciaRestantes,
        detalle: cierre,
        creado_en: cierre.fechaCierre
      },
      {
        onConflict: "usuario_id,mes"
      }
    );

  if (respuesta.error) {
    throw respuesta.error;
  }
}

async function obtenerCierreBase(mes) {
  const respuesta = await clienteSupabase
    .from("cierres_mensuales")
    .select("detalle")
    .eq("usuario_id", usuarioActual.id)
    .eq("mes", mes + "-01")
    .maybeSingle();

  if (respuesta.error) {
    throw respuesta.error;
  }

  return respuesta.data
    ? respuesta.data.detalle
    : null;
}

async function guardarConfiguracion(clave, valor) {
  const respuesta = await clienteSupabase
    .from("configuracion_licencia")
    .upsert(
      {
        usuario_id: usuarioActual.id,
        dias_totales: valor,
        actualizado_en: new Date().toISOString()
      },
      {
        onConflict: "usuario_id"
      }
    );

  if (respuesta.error) {
    throw respuesta.error;
  }
}

async function obtenerConfiguracion(clave) {
  const respuesta = await clienteSupabase
    .from("configuracion_licencia")
    .select("dias_totales")
    .eq("usuario_id", usuarioActual.id)
    .maybeSingle();

  if (respuesta.error) {
    throw respuesta.error;
  }

  if (!respuesta.data) {
    return null;
  }

  return {
    clave: clave,
    valor: respuesta.data.dias_totales
  };
}

function convertirRegistroSupabase(fila) {
  return {
    id: fila.id,
    fecha: fila.fecha,
    mes: fila.fecha.substring(0, 7),
    minutos: Number(fila.minutos),
    observaciones: fila.observaciones || "",
    esLicencia: fila.es_licencia === true,
    creadoEn: fila.creado_en
  };
}

async function guardarCantidadLicencia(evento) {
  evento.preventDefault();

  const cantidad = Number(
    diasLicenciaTotalesInput.value
  );

  if (!Number.isInteger(cantidad) || cantidad < 0) {
    mostrarNotificacion(
      "Ingresá una cantidad válida de días.",
      true
    );
    return;
  }

  try {
    await guardarConfiguracion(
      "diasLicenciaTotales",
      cantidad
    );

    diasLicenciaTotales = cantidad;
    await actualizarSaldoLicencia();

    mostrarNotificacion(
      "Cantidad de días guardada.",
      false
    );
  } catch (error) {
    mostrarNotificacion(
      "No se pudo guardar la cantidad de días.",
      true
    );
  }
}

async function actualizarSaldoLicencia() {
  const configuracion = await obtenerConfiguracion(
    "diasLicenciaTotales"
  );

  const todosLosRegistros =
    await obtenerTodosLosRegistros();

  diasLicenciaTotales = configuracion
    ? Number(configuracion.valor)
    : 0;

  const fechasDeLicencia = new Set();

  todosLosRegistros.forEach(function (registro) {
    if (registro.esLicencia) {
      fechasDeLicencia.add(registro.fecha);
    }
  });

  diasLicenciaUsados = fechasDeLicencia.size;

  const diasRestantes = Math.max(
    diasLicenciaTotales - diasLicenciaUsados,
    0
  );

  diasLicenciaRestantesTexto.textContent =
    diasRestantes +
    (diasRestantes === 1
      ? " día disponible"
      : " días disponibles");

  detalleDiasLicencia.textContent =
    diasLicenciaUsados +
    " utilizados de " +
    diasLicenciaTotales +
    " configurados";

  diasLicenciaTotalesInput.value =
    diasLicenciaTotales;

  panelSaldoLicencia.classList.toggle(
    "sin-saldo",
    diasRestantes === 0
  );
}

async function guardarRegistro(evento) {
  evento.preventDefault();

  const fecha = fechaInput.value;
  const horasDecimales = convertirHorasDecimales(
    horasInput.value
  );
  const esLicencia = licenciaInput.checked;
  const observaciones = observacionesInput.value.trim();

  ocultarMensajeFormulario();

  if (!fecha) {
    mostrarMensajeFormulario(
      "Ingresá una fecha válida.",
      true
    );
    return;
  }

  if (horasDecimales === null) {
    mostrarMensajeFormulario(
      "Ingresá una cantidad válida, por ejemplo 6,5.",
      true
    );
    return;
  }

  try {
    if (esLicencia) {
      const todosLosRegistros =
        await obtenerTodosLosRegistros();

      const fechaYaMarcada = todosLosRegistros.some(
        function (registro) {
          return (
            registro.esLicencia &&
            registro.fecha === fecha
          );
        }
      );

      const diasRestantes =
        diasLicenciaTotales - diasLicenciaUsados;

      if (!fechaYaMarcada && diasRestantes <= 0) {
        mostrarMensajeFormulario(
          "No quedan días de licencia disponibles.",
          true
        );
        return;
      }
    }

    const registro = {
      fecha: fecha,
      mes: fecha.substring(0, 7),
      minutos: Math.round(horasDecimales * 60),
      observaciones: observaciones,
      esLicencia: esLicencia,
      creadoEn: new Date().toISOString()
    };

    await agregarRegistroBase(registro);

    horasInput.value = "";
    observacionesInput.value = "";
    licenciaInput.checked = false;
    mesSeleccionadoInput.value = registro.mes;

    await cargarMesSeleccionado();

    mostrarMensajeFormulario(
      esLicencia
        ? "Día de licencia guardado y descontado."
        : "Jornada guardada correctamente.",
      false
    );
  } catch (error) {
    const mensaje =
      error && error.code === "23505"
        ? "Ya existe una jornada registrada para esa fecha."
        : "No se pudo guardar el registro.";

    mostrarMensajeFormulario(mensaje, true);
  }
}

async function cargarMesSeleccionado() {
  const mes = mesSeleccionadoInput.value;

  if (!mes || !usuarioActual) {
    return;
  }

  try {
    registrosActuales =
      await obtenerRegistrosDelMes(mes);

    cierreActual = await obtenerCierreBase(mes);

    registrosActuales.sort(function (
      registroA,
      registroB
    ) {
      return registroB.fecha.localeCompare(
        registroA.fecha
      );
    });

    await actualizarSaldoLicencia();

    renderizarResumen();
    renderizarRegistros();
  } catch (error) {
    mostrarNotificacion(
      "No se pudieron cargar los registros.",
      true
    );
  }
}

function renderizarResumen() {
  const totalMinutos = calcularTotalMinutos(
    registrosActuales
  );

  const cantidad = registrosActuales.length;

  tituloMes.textContent = obtenerNombreMes(
    mesSeleccionadoInput.value
  );

  cantidadJornadas.textContent =
    cantidad +
    (cantidad === 1
      ? " día registrado"
      : " días registrados");

  totalHoras.textContent = mostrarHoras(totalMinutos);
  totalModalCierre.textContent =
    mostrarHoras(totalMinutos);

  contadorRegistros.textContent = cantidad;
  botonCerrarMes.disabled = cantidad === 0;

  botonCerrarMes.textContent = cierreActual
    ? "✓ Actualizar cierre"
    : "✓ Pasar raya";
}

function renderizarRegistros() {
  listaRegistros.innerHTML = "";

  if (registrosActuales.length === 0) {
    listaRegistros.innerHTML = `
      <div class="estado-vacio">

        <div class="estado-vacio-icono">
          🗓
        </div>

        <h3>
          Todavía no hay registros
        </h3>

        <p>
          Agregá tu primera jornada de este mes.
        </p>

      </div>
    `;

    return;
  }

  registrosActuales.forEach(function (registro) {
    const articulo = document.createElement("article");

    articulo.className = registro.esLicencia
      ? "registro registro-licencia"
      : "registro";

    const fecha = document.createElement("div");
    fecha.className = "registro-fecha";
    fecha.textContent = mostrarFecha(registro.fecha);

    const contenido = document.createElement("div");
    contenido.className = "registro-contenido";

    const horas = document.createElement("strong");
    horas.textContent = mostrarHoras(registro.minutos);

    const observacion = document.createElement("p");
    observacion.textContent =
      registro.observaciones || "Sin observaciones";

    contenido.appendChild(horas);
    contenido.appendChild(observacion);

    if (registro.esLicencia) {
      const distintivo = document.createElement("span");

      distintivo.className = "distintivo-licencia";
      distintivo.textContent = "Licencia";

      contenido.appendChild(distintivo);
    }

    const botonEliminar =
      document.createElement("button");

    botonEliminar.type = "button";
    botonEliminar.className = "boton-eliminar";
    botonEliminar.textContent = "🗑";

    botonEliminar.setAttribute(
      "aria-label",
      "Eliminar registro"
    );

    botonEliminar.addEventListener("click", function () {
      confirmarEliminacion(registro.id);
    });

    articulo.appendChild(fecha);
    articulo.appendChild(contenido);
    articulo.appendChild(botonEliminar);

    listaRegistros.appendChild(articulo);
  });
}

async function confirmarEliminacion(id) {
  const confirmar = window.confirm(
    "¿Querés eliminar este registro?"
  );

  if (!confirmar) {
    return;
  }

  try {
    await eliminarRegistroBase(id);
    await cargarMesSeleccionado();

    mostrarNotificacion(
      "Registro eliminado correctamente.",
      false
    );
  } catch (error) {
    mostrarNotificacion(
      "No se pudo eliminar el registro.",
      true
    );
  }
}

function abrirCierre() {
  if (registrosActuales.length === 0) {
    return;
  }

  totalModalCierre.textContent = mostrarHoras(
    calcularTotalMinutos(registrosActuales)
  );

  modalCierre.showModal();
}

function cerrarModalCierre() {
  modalCierre.close();
}

async function generarCierre(evento) {
  evento.preventDefault();

  const nombre = nombreTrabajadorInput.value.trim();

  if (!nombre) {
    return;
  }

  localStorage.setItem("nombreTrabajador", nombre);

  const mes = mesSeleccionadoInput.value;

  const cierre = {
    version: 1,
    mes: mes,
    trabajador: nombre,
    totalMinutos: calcularTotalMinutos(
      registrosActuales
    ),
    fechaCierre: new Date().toISOString(),
    identificador: generarIdentificador(),
    diasLicenciaTotales: diasLicenciaTotales,
    diasLicenciaUsados: diasLicenciaUsados,
    diasLicenciaRestantes: Math.max(
      diasLicenciaTotales - diasLicenciaUsados,
      0
    ),
    registros: registrosActuales
      .slice()
     .sort(function (a, b) {
  return b.fecha.localeCompare(a.fecha);
})
      .map(function (registro) {
        return {
          fecha: registro.fecha,
          minutos: registro.minutos,
          observaciones: registro.observaciones,
          esLicencia: registro.esLicencia === true
        };
      })
  };

  try {
    await guardarCierreBase(cierre);

    cierreActual = cierre;
    modalCierre.close();

    mostrarInforme(cierre, false);
  } catch (error) {
    mostrarNotificacion(
      "No se pudo guardar el cierre.",
      true
    );
  }
}

function mostrarInforme(cierre, esPublico) {
  cierreActual = cierre;
  enlaceInformeActual = crearEnlaceInforme(cierre);

  document.getElementById(
    "informeTrabajador"
  ).textContent = cierre.trabajador;

  document.getElementById(
    "informePeriodo"
  ).textContent = obtenerNombreMes(cierre.mes);

  document.getElementById(
    "informeFechaCierre"
  ).textContent = formatearFechaHora(
    cierre.fechaCierre
  );

  document.getElementById(
    "informeTotal"
  ).textContent = mostrarHoras(cierre.totalMinutos);

  const diasRestantes = Number.isFinite(
    Number(cierre.diasLicenciaRestantes)
  )
    ? Number(cierre.diasLicenciaRestantes)
    : 0;

  document.getElementById(
    "informeLicenciaRestante"
  ).textContent =
    diasRestantes +
    (diasRestantes === 1 ? " día" : " días");

  document.getElementById(
    "identificadorInforme"
  ).textContent =
    "Identificador: " + cierre.identificador;

  const cuerpoInforme =
    document.getElementById("cuerpoInforme");

  cuerpoInforme.innerHTML = "";

  cierre.registros.forEach(function (registro) {
    const fila = document.createElement("tr");

    if (registro.esLicencia) {
      fila.classList.add("fila-licencia");
    }

    fila.innerHTML = `
      <td>
        ${mostrarFechaCompleta(registro.fecha)}
      </td>

      <td>
        ${mostrarHoras(registro.minutos)}
      </td>

      <td>
        ${escaparHTML(
          registro.observaciones || "Sin observaciones"
        )}
      </td>
    `;

    cuerpoInforme.appendChild(fila);
  });

  vistaAcceso.classList.add("oculto");
  aplicacion.classList.add("oculto");
  vistaInforme.classList.remove("oculto");

  botonVolver.classList.toggle("oculto", esPublico);

  window.scrollTo(0, 0);
}

function volverAplicacion() {
  vistaInforme.classList.add("oculto");
  aplicacion.classList.remove("oculto");

  if (modoAdministrador) {
    mostrarModoAdministrador();
  } else {
    mostrarModoUsuario();
    cargarMesSeleccionado();
  }
}

function imprimirInforme() {
  window.print();
}

function descargarPDF() {
  html2pdf()
    .set({
      margin: 8,
      filename:
        "registro-laboral-" +
        cierreActual.mes +
        ".pdf",
      pagebreak: {
        mode: ["css", "legacy"],
        avoid: [".tabla-informe tr"]
      },
      html2canvas: {
        scale: 2
      },
      jsPDF: {
        unit: "mm",
        format: "a4"
      }
    })
    .from(
      document.getElementById("informeImprimible")
    )
    .save();
}

function mostrarCodigoQR() {
  enlaceInformeActual = crearEnlaceInforme(
    cierreActual
  );

  codigoQR.innerHTML = "";

  try {
    new QRCode(codigoQR, {
      text: enlaceInformeActual,
      width: 220,
      height: 220,
      colorDark: "#173734",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L
    });

    advertenciaQR.textContent =
      window.location.protocol === "file:"
        ? "Publicá primero la aplicación para abrirlo desde otro dispositivo."
        : "Cualquier persona con este código podrá ver el informe.";

    modalQR.showModal();
  } catch (error) {
    mostrarNotificacion(
      "El informe es demasiado extenso para generar el código QR.",
      true
    );
  }
}

async function compartirInforme() {
  enlaceInformeActual = crearEnlaceInforme(
    cierreActual
  );

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Registro Laboral",
        url: enlaceInformeActual
      });

      return;
    }

    window.open(
      "https://wa.me/?text=" +
        encodeURIComponent(enlaceInformeActual),
      "_blank",
      "noopener,noreferrer"
    );
  } catch (error) {
    if (error.name !== "AbortError") {
      mostrarNotificacion(
        "No se pudo compartir el informe.",
        true
      );
    }
  }
}

function crearEnlaceInforme(cierre) {
  const comprimido =
    LZString.compressToEncodedURIComponent(
      JSON.stringify(cierre)
    );

  return (
    window.location.href.split("#")[0] +
    "#informe=" +
    comprimido
  );
}

function cargarInformeDesdeEnlace() {
  if (
    !window.location.hash.startsWith("#informe=")
  ) {
    return false;
  }

  try {
    const contenido =
      window.location.hash.substring(9);

    const texto =
      LZString.decompressFromEncodedURIComponent(
        contenido
      );

    const cierre = JSON.parse(texto);

    if (
      !cierre ||
      !cierre.mes ||
      !Array.isArray(cierre.registros)
    ) {
      return false;
    }

    mostrarInforme(cierre, true);
    return true;
  } catch (error) {
    return false;
  }
}

function iniciarReconocimientoVoz(campo, boton) {
  const ConstructorReconocimiento =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!ConstructorReconocimiento) {
    mostrarNotificacion(
      "El reconocimiento de voz no está disponible en este navegador.",
      true
    );
    return;
  }

  if (reconocimientoActivo) {
    reconocimientoActivo.stop();
  }

  const reconocimiento =
    new ConstructorReconocimiento();

  reconocimiento.lang = "es-UY";
  reconocimientoActivo = reconocimiento;

  boton.classList.add("escuchando");

  reconocimiento.onresult = function (evento) {
    procesarTextoReconocido(
      campo,
      evento.results[0][0].transcript.trim()
    );
  };

  reconocimiento.onerror = function () {
    mostrarNotificacion(
      "No se pudo reconocer la voz.",
      true
    );
  };

  reconocimiento.onend = function () {
    boton.classList.remove("escuchando");
    reconocimientoActivo = null;
  };

  reconocimiento.start();
}

function procesarTextoReconocido(campo, texto) {
  if (campo === "horas") {
    const horas = interpretarHorasDictadas(texto);

    if (horas !== null) {
      horasInput.value = String(horas).replace(
        ".",
        ","
      );
    }
  }

  if (campo === "fecha") {
    const fecha = interpretarFechaDictada(texto);

    if (fecha) {
      fechaInput.value = fecha;
    }
  }

  if (campo === "observaciones") {
    observacionesInput.value =
      observacionesInput.value.trim() === ""
        ? texto
        : observacionesInput.value.trim() +
          " " +
          texto;
  }
}

function interpretarHorasDictadas(texto) {
  const limpio = limpiarTexto(texto).replace(
    ",",
    "."
  );

  const numero = limpio.match(/\d+(?:\.\d+)?/);

  if (numero) {
    return Number(numero[0]);
  }

  const palabra = Object.keys(numerosTexto).find(
    function (clave) {
      return limpio.includes(clave);
    }
  );

  if (!palabra) {
    return null;
  }

  let resultado = numerosTexto[palabra];

  if (limpio.includes("media")) {
    resultado += 0.5;
  }

  return resultado;
}

function interpretarFechaDictada(texto) {
  const limpio = limpiarTexto(texto);
  const fecha = new Date();

  if (limpio.includes("hoy")) {
    return convertirFechaParaInput(fecha);
  }

  if (limpio.includes("ayer")) {
    fecha.setDate(fecha.getDate() - 1);
    return convertirFechaParaInput(fecha);
  }

  const coincidencia = limpio.match(
    /(\d{1,2})\s+de\s+([a-z]+)(?:\s+de\s+(\d{4}))?/
  );

  if (!coincidencia) {
    return null;
  }

  const nombresMeses = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    setiembre: 8,
    septiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11
  };

  const numeroMes = nombresMeses[coincidencia[2]];

  if (numeroMes === undefined) {
    return null;
  }

  const anio = coincidencia[3]
    ? Number(coincidencia[3])
    : new Date().getFullYear();

  const fechaInterpretada = new Date(
    anio,
    numeroMes,
    Number(coincidencia[1])
  );

  if (
    fechaInterpretada.getMonth() !== numeroMes ||
    fechaInterpretada.getDate() !==
      Number(coincidencia[1])
  ) {
    return null;
  }

  return convertirFechaParaInput(fechaInterpretada);
}

function convertirHorasDecimales(valor) {
  const numero = Number(
    valor.trim().replace(",", ".")
  );

  if (
    !Number.isFinite(numero) ||
    numero <= 0 ||
    numero > 24
  ) {
    return null;
  }

  return numero;
}

function calcularTotalMinutos(registros) {
  return registros.reduce(function (total, registro) {
    return total + Number(registro.minutos);
  }, 0);
}

function mostrarHoras(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  return resto === 0
    ? horas + " h"
    : horas + " h " + resto + " min";
}

function mostrarFecha(fechaTexto) {
  return new Intl.DateTimeFormat("es-UY", {
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).format(new Date(fechaTexto + "T12:00:00"));
}

function mostrarFechaCompleta(fechaTexto) {
  return new Intl.DateTimeFormat("es-UY", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(fechaTexto + "T12:00:00"));
}

function formatearFechaHora(fechaTexto) {
  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(fechaTexto));
}

function obtenerNombreMes(mesTexto) {
  const partes = mesTexto.split("-");

  return new Intl.DateTimeFormat("es-UY", {
    month: "long",
    year: "numeric"
  }).format(
    new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      1
    )
  );
}

function convertirFechaParaInput(fecha) {
  return (
    fecha.getFullYear() +
    "-" +
    String(fecha.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(fecha.getDate()).padStart(2, "0")
  );
}

function obtenerMesActual() {
  return convertirFechaParaInput(
    new Date()
  ).substring(0, 7);
}

function obtenerInicioMesSiguiente(mesTexto) {
  const partes = mesTexto.split("-");

  let anio = Number(partes[0]);
  let mes = Number(partes[1]);

  if (mes === 12) {
    anio += 1;
    mes = 1;
  } else {
    mes += 1;
  }

  return (
    anio +
    "-" +
    String(mes).padStart(2, "0") +
    "-01"
  );
}

function limpiarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function generarIdentificador() {
  if (crypto.randomUUID) {
    return crypto
      .randomUUID()
      .replaceAll("-", "")
      .substring(0, 16)
      .toUpperCase();
  }

  return (
    Date.now().toString(16) +
    Math.random().toString(16).substring(2)
  )
    .substring(0, 16)
    .toUpperCase();
}

function escaparHTML(texto) {
  const elemento = document.createElement("div");
  elemento.textContent = texto;

  return elemento.innerHTML;
}

function mostrarMensajeAcceso(texto, esError) {
  mensajeAcceso.textContent = texto;
  mensajeAcceso.classList.add("visible");
  mensajeAcceso.classList.toggle("error", esError);
}

function ocultarMensajeAcceso() {
  mensajeAcceso.textContent = "";
  mensajeAcceso.classList.remove("visible", "error");
}

function mostrarMensajeRegistroUsuario(
  texto,
  esError
) {
  mensajeRegistroUsuario.textContent = texto;
  mensajeRegistroUsuario.classList.add("visible");
  mensajeRegistroUsuario.classList.toggle(
    "error",
    esError
  );
}

function ocultarMensajeRegistroUsuario() {
  mensajeRegistroUsuario.textContent = "";
  mensajeRegistroUsuario.classList.remove(
    "visible",
    "error"
  );
}

function mostrarMensajeFormulario(texto, esError) {
  mensajeFormulario.textContent = texto;
  mensajeFormulario.classList.add("visible");
  mensajeFormulario.classList.toggle(
    "error",
    esError
  );
}

function ocultarMensajeFormulario() {
  mensajeFormulario.textContent = "";
  mensajeFormulario.classList.remove(
    "visible",
    "error"
  );
}

function mostrarNotificacion(texto, esError) {
  notificacion.textContent = texto;
  notificacion.classList.toggle("error", esError);
  notificacion.classList.add("visible");

  setTimeout(function () {
    notificacion.classList.remove("visible");
  }, 3200);
}