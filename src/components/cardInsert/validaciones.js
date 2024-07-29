//** ESTA FUNCION LO QUE HACE ES TRANSFORMAR UN NUMERO EN UNO DE TARJETA : #### #### #### #### */

export const FuncionNumeroTarjeta = (numero_de_tarjeta) => {
    let nuevoString = "";
  
    for (let i = 0; i < numero_de_tarjeta.length; i++) {
      if (i % 4 === 0 && i !== 0) {
        nuevoString += " ";
      }
      nuevoString += numero_de_tarjeta[i];
    }
  
    return nuevoString;
  };
  
  //** LO QUE HACE ESTA FUNCION ES IDENTIFICAR EL TIPO DE TARJETA (VISA , MASTERCARD y AMERICAN EXPRESS) */
  
  export const FuncionIdentificarTipoTarjeta = (numeroTarjeta) => {
    // Eliminar espacios en blanco y guiones
    let numeroTarjetaLimpiado = numeroTarjeta
      .replace(/\s+/g, "")
      .replace(/-/g, "");
  
    // Verificar el tipo de tarjeta usando expresiones regulares
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(numeroTarjetaLimpiado)) {
      return "Visa";
    } else if (/^5[1-5][0-9]{14}$/.test(numeroTarjetaLimpiado)) {
      return "MasterCard";
    } else if (/^3[47][0-9]{13}$/.test(numeroTarjetaLimpiado)) {
      return "American Express";
    } else {
      return "";
    }
  };
  
  //** FUNCION QUE VERIFICA SI LA FECHA INGRESADA ESTA EXPIRADA */
  
  export const FuncionVerificarVencimientoFecha = (value) => {
    const [mesStr, añoStr] = value.split("/");
  
    const mes = parseInt(mesStr, 10);
    const año = parseInt(añoStr, 10);
  
    const fechaDate = new Date();
  
    const fechaDateAño = Number(
      fechaDate.getFullYear().toString()[2] +
        fechaDate.getFullYear().toString()[3]
    );
  
    // Comparar con el objeto Date
    if (mes >= fechaDate.getMonth() + 1 && año < fechaDateAño) {
      return "TARJETA EXPIRADA";
    } else {
      return "";
    }
  };
  
  //** FUNCION QUE FORMATEA UN STRING EN UNA FECHA DEL TIPO MM/AA */
  
  export const FuncionFormatMesAño = (value) => {
    let mes = "";
    let año = "";
    let nuevoValor = "";
  
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== "/") {
        if (i < 2) {
          if (!isNaN(Number(value[i]))) mes += value[i];
        } else {
          if (!isNaN(Number(value[i]))) año += value[i];
        }
      }
    }
  
    if (mes.length > 0) {
      nuevoValor += mes;
    }
  
    if (año.length > 0) {
      nuevoValor += "/" + año;
    }
  
    return nuevoValor;
  };