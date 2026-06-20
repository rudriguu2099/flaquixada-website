//Mascaras

// Permite apenas a digitação de números puros.
function mascaraApenasNumeros(evento) {
    evento.target.value = evento.target.value.replace(/[^0-9]/g, "");
}

// Permite apenas a digitação de letras (incluindo espaços e acentos).
function mascaraApenasTexto(evento) {
    evento.target.value = evento.target.value.replace(/[^a-zA-Z áéíóúãõçÁÉÍÓÚÃÕÇ]/g, "");
}

// Permite letras e números, mas remove caracteres especiais (@, #, !, etc).
function mascaraTextoENumeros(evento) {
    evento.target.value = evento.target.value.replace(/[^a-zA-Z0-9 áéíóúãõçÁÉÍÓÚÃÕÇ]/g, "");
}

// Máscara para formatação visual de Moeda (BRL). Ex: "1.250,00"
function mascaraMoeda(evento) {
    let valor = evento.target.value;
    valor = valor.replace(/\D/g, ""); // Remove tudo que não for dígito

    if (valor === "") {
        evento.target.value = "";
        return;
    }

    valor = (parseInt(valor, 10) / 100).toFixed(2) + '';
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    evento.target.value = valor;
}

// ----- Funções Auxiliares de Moeda -----

// Transforma a string formatada "1.250,00" de volta para o número real 1250.00
function desmascararMoeda(valorFormatado) {
    if (!valorFormatado) return 0;
    let valor = valorFormatado.replace(/\./g, "").replace(",", ".");
    return parseFloat(valor);
}

// Transforma o número real do banco 1250.00 na string "1.250,00"
function formatarMoedaInput(valorFloat) {
    if (!valorFloat && valorFloat !== 0) return "";
    let valorFormatado = parseFloat(valorFloat).toFixed(2).replace(".", ",");
    return valorFormatado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}
