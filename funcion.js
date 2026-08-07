const NOMBRE_BASE_DATOS = "RegistroLaboralDB";
const VERSION_BASE_DATOS = 2;

let baseDatos;
let registrosActuales = [];
let cierreActual = null;
let enlaceInformeActual = "";
let reconocimientoActivo = null;
let diasLicenciaTotales = 0;
let diasLicenciaUsados = 0;

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
const formularioDiasLicencia = document.getElementById("formularioDiasLicencia");
const diasLicenciaTotalesInput = document.getElementById("diasLicenciaTotales");
const diasLicenciaRestantesTexto = document.getElementById("diasLicenciaRestantes");
const detalleDiasLicencia = document.getElementById("detalleDiasLicencia");

const botonCerrarMes = document.getElementById("botonCerrarMes");
const modalCierre = document.getElementById("modalCierre");
const formularioCierre = document.getElementById("formularioCierre");
const nombreTrabajadorInput = document.getElementById("nombreTrabajador");
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

const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "setiembre",
    "octubre",
    "noviembre",
    "diciembre"
];

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

function iniciarAplicacion() {
    if (cargarInformeDesdeEnlace()) {
        prepararEventosInforme();
        return;
    }

    fechaInput.value = convertirFechaParaInput(new Date());
    mesSeleccionadoInput.value = obtenerMesActual();

    nombreTrabajadorInput.value =
        localStorage.getItem("nombreTrabajador") || "";

    prepararEventos();

    abrirBaseDatos()
        .then(function () {
            cargarMesSeleccionado();
        })
        .catch(function () {
            mostrarNotificacion(
                "No se pudo iniciar la base de datos.",
                true
            );
        });
}

function prepararEventos() {
    formularioRegistro.addEventListener("submit", guardarRegistro);
    formularioDiasLicencia.addEventListener("submit", guardarCantidadLicencia);
    mesSeleccionadoInput.addEventListener("change", cargarMesSeleccionado);

    document.querySelectorAll(".boton-microfono").forEach(function (boton) {
        boton.addEventListener("click", function () {
            iniciarReconocimientoVoz(
                boton.dataset.campo,
                boton
            );
        });
    });

    botonCerrarMes.addEventListener("click", abrirCierre);
    cancelarCierre.addEventListener("click", cerrarModalCierre);
    formularioCierre.addEventListener("submit", generarCierre);

    prepararEventosInforme();

    cerrarQR.addEventListener("click", function () {
        modalQR.close();
    });
}

function prepararEventosInforme() {
    botonVolver.addEventListener("click", volverAplicacion);
    botonImprimir.addEventListener("click", imprimirInforme);
    botonPDF.addEventListener("click", descargarPDF);
    botonQR.addEventListener("click", mostrarCodigoQR);
    botonCompartir.addEventListener("click", compartirInforme);
}

function abrirBaseDatos() {
    return new Promise(function (resolver, rechazar) {
        const solicitud = indexedDB.open(
            NOMBRE_BASE_DATOS,
            VERSION_BASE_DATOS
        );

        solicitud.onupgradeneeded = function (evento) {
            const db = evento.target.result;

            if (!db.objectStoreNames.contains("registros")) {
                const registros = db.createObjectStore("registros", {
                    keyPath: "id",
                    autoIncrement: true
                });

                registros.createIndex("mes", "mes", {
                    unique: false
                });

                registros.createIndex("fecha", "fecha", {
                    unique: false
                });
            }

            if (!db.objectStoreNames.contains("cierres")) {
                db.createObjectStore("cierres", {
                    keyPath: "mes"
                });
            }

            if (!db.objectStoreNames.contains("configuracion")) {
                db.createObjectStore("configuracion", {
                    keyPath: "clave"
                });
            }
        };

        solicitud.onsuccess = function (evento) {
            baseDatos = evento.target.result;
            resolver();
        };

        solicitud.onerror = function () {
            rechazar(solicitud.error);
        };
    });
}

function obtenerAlmacen(nombre, modo) {
    const transaccion = baseDatos.transaction(nombre, modo);
    return transaccion.objectStore(nombre);
}

function ejecutarSolicitud(solicitud) {
    return new Promise(function (resolver, rechazar) {
        solicitud.onsuccess = function () {
            resolver(solicitud.result);
        };

        solicitud.onerror = function () {
            rechazar(solicitud.error);
        };
    });
}

function agregarRegistroBase(registro) {
    return ejecutarSolicitud(
        obtenerAlmacen("registros", "readwrite").add(registro)
    );
}

function eliminarRegistroBase(id) {
    return ejecutarSolicitud(
        obtenerAlmacen("registros", "readwrite").delete(id)
    );
}

function obtenerRegistrosDelMes(mes) {
    return new Promise(function (resolver, rechazar) {
        const almacen = obtenerAlmacen("registros", "readonly");
        const indice = almacen.index("mes");
        const solicitud = indice.getAll(mes);

        solicitud.onsuccess = function () {
            resolver(solicitud.result || []);
        };

        solicitud.onerror = function () {
            rechazar(solicitud.error);
        };
    });
}

function obtenerTodosLosRegistros() {
    return ejecutarSolicitud(
        obtenerAlmacen("registros", "readonly").getAll()
    );
}

function guardarCierreBase(cierre) {
    return ejecutarSolicitud(
        obtenerAlmacen("cierres", "readwrite").put(cierre)
    );
}

function obtenerCierreBase(mes) {
    return ejecutarSolicitud(
        obtenerAlmacen("cierres", "readonly").get(mes)
    );
}

function guardarConfiguracion(clave, valor) {
    return ejecutarSolicitud(
        obtenerAlmacen("configuracion", "readwrite").put({
            clave: clave,
            valor: valor
        })
    );
}

function obtenerConfiguracion(clave) {
    return ejecutarSolicitud(
        obtenerAlmacen("configuracion", "readonly").get(clave)
    );
}

async function guardarCantidadLicencia(evento) {
    evento.preventDefault();

    const cantidad = Number(diasLicenciaTotalesInput.value);

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

    const todosLosRegistros = await obtenerTodosLosRegistros();

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

    diasLicenciaTotalesInput.value = diasLicenciaTotales;

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

    if (esLicencia) {
        const todosLosRegistros = await obtenerTodosLosRegistros();

        const fechaYaMarcada = todosLosRegistros.some(function (registro) {
            return registro.esLicencia && registro.fecha === fecha;
        });

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

    try {
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
        mostrarMensajeFormulario(
            "No se pudo guardar el registro.",
            true
        );
    }
}

async function cargarMesSeleccionado() {
    const mes = mesSeleccionadoInput.value;

    if (!mes) {
        return;
    }

    try {
        registrosActuales = await obtenerRegistrosDelMes(mes);
        cierreActual = await obtenerCierreBase(mes);

        registrosActuales.sort(function (registroA, registroB) {
            return registroB.fecha.localeCompare(registroA.fecha);
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
    const totalMinutos = calcularTotalMinutos(registrosActuales);
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
    totalModalCierre.textContent = mostrarHoras(totalMinutos);
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
                <div class="estado-vacio-icono">🗓</div>
                <h3>Todavía no hay registros</h3>
                <p>Agregá tu primera jornada de este mes.</p>
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

        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.className = "boton-eliminar";
        botonEliminar.textContent = "🗑";

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
        totalMinutos: calcularTotalMinutos(registrosActuales),
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
                return a.fecha.localeCompare(b.fecha);
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

    await guardarCierreBase(cierre);

    cierreActual = cierre;

    modalCierre.close();

    mostrarInforme(cierre, false);
}

function mostrarInforme(cierre, esPublico) {
    cierreActual = cierre;
    enlaceInformeActual = crearEnlaceInforme(cierre);

    document.getElementById("informeTrabajador").textContent =
        cierre.trabajador;

    document.getElementById("informePeriodo").textContent =
        obtenerNombreMes(cierre.mes);

    document.getElementById("informeFechaCierre").textContent =
        formatearFechaHora(cierre.fechaCierre);

    document.getElementById("informeTotal").textContent =
        mostrarHoras(cierre.totalMinutos);

    const diasRestantes = Number.isFinite(
        Number(cierre.diasLicenciaRestantes)
    )
        ? Number(cierre.diasLicenciaRestantes)
        : 0;

    document.getElementById("informeLicenciaRestante").textContent =
        diasRestantes +
        (diasRestantes === 1
            ? " día"
            : " días");

    document.getElementById("identificadorInforme").textContent =
        "Identificador: " + cierre.identificador;

    const cuerpoInforme = document.getElementById("cuerpoInforme");

    cuerpoInforme.innerHTML = "";

    cierre.registros.forEach(function (registro) {
        const fila = document.createElement("tr");

        if (registro.esLicencia) {
            fila.classList.add("fila-licencia");
        }

        fila.innerHTML = `
            <td>${mostrarFechaCompleta(registro.fecha)}</td>
            <td>${mostrarHoras(registro.minutos)}</td>
            <td>${escaparHTML(registro.observaciones || "Sin observaciones")}</td>
        `;

        cuerpoInforme.appendChild(fila);
    });

    aplicacion.classList.add("oculto");
    vistaInforme.classList.remove("oculto");

    botonVolver.classList.toggle("oculto", esPublico);

    window.scrollTo(0, 0);
}

function volverAplicacion() {
    vistaInforme.classList.add("oculto");
    aplicacion.classList.remove("oculto");

    cargarMesSeleccionado();
}

function imprimirInforme() {
    window.print();
}

function descargarPDF() {
    html2pdf()
        .set({
            margin: 8,
            filename: "registro-laboral-" + cierreActual.mes + ".pdf",

            html2canvas: {
                scale: 2
            },

            jsPDF: {
                unit: "mm",
                format: "a4"
            }
        })
        .from(document.getElementById("informeImprimible"))
        .save();
}

function mostrarCodigoQR() {
    enlaceInformeActual = crearEnlaceInforme(cierreActual);

    codigoQR.innerHTML = "";

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
}

async function compartirInforme() {
    enlaceInformeActual = crearEnlaceInforme(cierreActual);

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
        "_blank"
    );
}

function crearEnlaceInforme(cierre) {
    const comprimido =
        LZString.compressToEncodedURIComponent(
            JSON.stringify(cierre)
        );

    return window.location.href.split("#")[0] +
        "#informe=" +
        comprimido;
}

function cargarInformeDesdeEnlace() {
    if (!window.location.hash.startsWith("#informe=")) {
        return false;
    }

    try {
        const contenido = window.location.hash.substring(9);

        const texto =
            LZString.decompressFromEncodedURIComponent(
                contenido
            );

        const cierre = JSON.parse(texto);

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
        return;
    }

    const reconocimiento = new ConstructorReconocimiento();

    reconocimiento.lang = "es-UY";
    reconocimientoActivo = reconocimiento;

    boton.classList.add("escuchando");

    reconocimiento.onresult = function (evento) {
        procesarTextoReconocido(
            campo,
            evento.results[0][0].transcript.trim()
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
            horasInput.value = String(horas).replace(".", ",");
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
                : observacionesInput.value.trim() + " " + texto;
    }
}

function interpretarHorasDictadas(texto) {
    const limpio = limpiarTexto(texto).replace(",", ".");

    const numero = limpio.match(/\d+(?:\.\d+)?/);

    if (numero) {
        return Number(numero[0]);
    }

    const palabra = Object.keys(numerosTexto).find(function (clave) {
        return limpio.includes(clave);
    });

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

    return null;
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
    }).format(
        new Date(fechaTexto + "T12:00:00")
    );
}

function mostrarFechaCompleta(fechaTexto) {
    return new Intl.DateTimeFormat("es-UY", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(
        new Date(fechaTexto + "T12:00:00")
    );
}

function formatearFechaHora(fechaTexto) {
    return new Intl.DateTimeFormat("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(
        new Date(fechaTexto)
    );
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
    return fecha.getFullYear() +
        "-" +
        String(fecha.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(fecha.getDate()).padStart(2, "0");
}

function obtenerMesActual() {
    return convertirFechaParaInput(
        new Date()
    ).substring(0, 7);
}

function limpiarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function generarIdentificador() {
    return crypto.randomUUID()
        .replaceAll("-", "")
        .substring(0, 16)
        .toUpperCase();
}

function escaparHTML(texto) {
    const elemento = document.createElement("div");

    elemento.textContent = texto;

    return elemento.innerHTML;
}

function mostrarMensajeFormulario(texto, esError) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.classList.add("visible");
    mensajeFormulario.classList.toggle("error", esError);
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