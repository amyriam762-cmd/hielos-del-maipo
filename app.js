"use strict";

const formatos = {
  "bolsa-2": {
    nombre: "Bolsa de 2 kg",
    peso: 2
  },
  "bolsa-5": {
    nombre: "Bolsa de 5 kg",
    peso: 5
  },
  "bolsa-10": {
    nombre: "Bolsa de 10 kg",
    peso: 10
  }
};

const formulario = document.querySelector("#formulario-solicitud");
const resultado = document.querySelector("#resultado");

const campos = {
  nombre: document.querySelector("#nombre"),
  correo: document.querySelector("#correo"),
  formato: document.querySelector("#formato"),
  cantidad: document.querySelector("#cantidad"),
  sector: document.querySelector("#sector")
};

const resumen = {
  formato: document.querySelector("#resumen-formato"),
  cantidad: document.querySelector("#resumen-cantidad"),
  peso: document.querySelector("#resumen-peso"),
  sector: document.querySelector("#resumen-sector")
};

function obtenerFormato() {
  const valor = campos.formato.value;

  return Object.hasOwn(formatos, valor) ? formatos[valor] : null;
}

function limpiarResultado() {
  resultado.textContent = "";
  resultado.className = "resultado";
}

function actualizarResumen() {
  const formato = obtenerFormato();
  const cantidad = Number(campos.cantidad.value);

  const cantidadValida =
    Number.isInteger(cantidad) &&
    cantidad >= 1 &&
    cantidad <= 100;

  resumen.formato.textContent = formato
    ? formato.nombre
    : "Sin seleccionar";

  resumen.cantidad.textContent = cantidadValida
    ? `${cantidad} ${cantidad === 1 ? "bolsa" : "bolsas"}`
    : "Indica un número entero entre 1 y 100";

  resumen.peso.textContent = formato && cantidadValida
    ? `${formato.peso * cantidad} kg`
    : "Sin calcular";

  resumen.sector.textContent =
    campos.sector.value || "Sin seleccionar";
}

function obtenerError(campo) {
  const valor = campo.value.trim();

  if (campo.id === "nombre" && valor.length < 3) {
    return "Escribe un nombre de prueba de al menos 3 caracteres.";
  }

  if (campo.id === "correo") {
    if (!valor) {
      return "Escribe un correo electrónico de prueba.";
    }

    if (campo.validity.typeMismatch) {
      return "Escribe un correo con formato válido, como persona@example.com.";
    }
  }

  if (campo.id === "formato" && !obtenerFormato()) {
    return "Selecciona uno de los formatos disponibles.";
  }

  if (campo.id === "cantidad") {
    const cantidad = Number(valor);

    if (
      !valor ||
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > 100
    ) {
      return "La cantidad debe ser un número entero entre 1 y 100.";
    }
  }

  if (campo.id === "sector" && !valor) {
    return "Selecciona un sector de ejemplo.";
  }

  return "";
}

function validarCampo(campo) {
  const mensaje = obtenerError(campo);

  const contenedorError = document.querySelector(
    `#error-${campo.id}`
  );

  contenedorError.textContent = mensaje;

  campo.setAttribute(
    "aria-invalid",
    String(Boolean(mensaje))
  );

  return mensaje === "";
}

Object.values(campos).forEach((campo) => {
  campo.addEventListener("blur", () => {
    validarCampo(campo);
  });

  const evento = campo.tagName === "SELECT"
    ? "change"
    : "input";

  campo.addEventListener(evento, () => {
    limpiarResultado();
    actualizarResumen();

    if (campo.hasAttribute("aria-invalid")) {
      validarCampo(campo);
    }
  });
});

document.querySelectorAll(".seleccionar-producto").forEach((boton) => {
  boton.addEventListener("click", () => {
    campos.formato.value = boton.dataset.formato;

    limpiarResultado();
    validarCampo(campos.formato);
    actualizarResumen();

    campos.formato.focus();
  });
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const estados = Object.values(campos).map((campo) => {
    return validarCampo(campo);
  });

  if (estados.includes(false)) {
    resultado.className = "resultado fallo";

    resultado.textContent =
      "No se puede confirmar la simulación. " +
      "Revisa los campos indicados.";

    const primerCampoInvalido = Object.values(campos).find((campo) => {
      return campo.getAttribute("aria-invalid") === "true";
    });

    primerCampoInvalido.focus();
    return;
  }

  const formato = obtenerFormato();
  const cantidad = Number(campos.cantidad.value);

  resultado.className = "resultado exito";

  resultado.textContent =
    `Simulación completada para ${campos.nombre.value.trim()}: ` +
    `${cantidad} ${cantidad === 1 ? "bolsa" : "bolsas"} del formato ` +
    `${formato.nombre}, para ${campos.sector.value}. ` +
    "No se ha enviado ningún pedido, realizado cobros ni reservado stock.";
});

formulario.addEventListener("reset", () => {
  limpiarResultado();

  Object.values(campos).forEach((campo) => {
    campo.removeAttribute("aria-invalid");

    document.querySelector(
      `#error-${campo.id}`
    ).textContent = "";
  });

  setTimeout(actualizarResumen, 0);
});

actualizarResumen();