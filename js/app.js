const criptomonedasSelector = document.querySelector("#criptomonedas"),
  moneda = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario"),
  resultado = document.querySelector("#resultado");

let objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  moneda.addEventListener("change", leerValor);
  criptomonedasSelector.addEventListener("change", leerValor);
});

function submitFormulario(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const alerta = document.querySelector("bg-red-100");

  if (!alerta) {
    const alerta = document.createElement("div");

    alerta.classList.add("error");
    alerta.textContent = mensaje;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

async function consultarCriptomonedas() {
  const url = `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    const criptomonedas = await obtenerCriptomonedas(result.Data);
    selectCriptomonedas(criptomonedas);
  } catch (error) {
    console.log(error);
  }

  // fetch(url)
  //   .then((response) => response.json())
  //   .then((result) => obtenerCriptomonedas(result.Data))
  //   .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function obtenerCriptomonedas(criptomonedas) {
  return new Promise((resolve) => {
    resolve(criptomonedas);
  });
}

function selectCriptomonedas(criptos) {
  criptos.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelector.appendChild(option);
  });
}

async function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  try {
    const response = await fetch(url);
    const result = await response.json();
    mostrarCotizacionHTML(result.DISPLAY[criptomoneda][moneda]);
  } catch (error) {
    console.log(error);
  }

  // fetch(url)
  //   .then((response) => response.json())
  //   .then((result) =>
  //     mostrarCotizacionHTML(result.DISPLAY[criptomoneda][moneda])
  //   );
}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement("div");

  spinner.classList.add("spinner");
  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  `;

  resultado.appendChild(spinner);
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, LASTUPDATE, CHANGEPCT24HOUR } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `El precio mas alto fue: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `El precio mas bajo fue: <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `Variacion de las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement("p");
  ultimaActualizacion.innerHTML = `Ultima actualizacion: <span>${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}
