import { lazy } from "react";

export const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const changeUrl = (text) => {
  return text
    ?.toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ç/g, "c")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/[\s_-]+/g, "-");
};

export const isEmpty = (val) => {
  if (
    val === "" ||
    val === null ||
    val === undefined ||
    val === "null" ||
    val === "undefined"
  ) {
    return "";
  } else {
    return val;
  }
};

export const extractNumber = (str) =>
  typeof str === "string" ? parseFloat(str.replace(/[^0-9.]/g, "")) : 0;

export const firstWordCapital = (string) => {
  if (isEmpty(string) !== "") {
    const arr = string.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
    }
    const str2 = arr.join(" ");
    return str2;
  }
};

export const numberWithCommas = (val) => {
  let x = val.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
};

export const jewelVertical = (val) => {
  if (
    val != "DIAMO" &&
    val != "LGDIA" &&
    val != "GEDIA" &&
    val != "GEMST" &&
    val != "LGLDM" &&
    val != "LDIAM"
  ) {
    return true;
  } else {
    return false;
  }
};

export const perfumeVertical = (val) => {
  if (
    val == "OIL" ||
    val == "FRAGE" ||
    val == "BOTLE" ||
    val == "SPRAY" ||
    val == "CAP" ||
    val == 'PACKG') {
    return true;
  } else {
    return false;
  }
};

export const validateWithOnlyLetters = (value) => {
  if (value === "") {
    return true;
  } else {
    return String(value)
      .toLowerCase()
      .match(/^[A-Za-z]+$/);
  }
};

export const onlyNumbers = (value) => {
  if (value === "") {
    return true;
  } else {
    return String(value)
      .toLowerCase()
      .match(/^[0-9]+$/);
  }
};

export const safeParse = (jsonString, fallbackValue = null) => {
  if (typeof jsonString === 'string' && jsonString.trim() !== '') {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return fallbackValue;
    }
  }
  return fallbackValue;
}


export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      typeof window !="undefined" && window.localStorage.getItem("page-has-been-force-refreshed") || "false"
    );

    try {
      const component = await componentImport();
      typeof window !="undefined" && window.localStorage.setItem("page-has-been-force-refreshed", "false");
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        typeof window !="undefined" && window.localStorage.setItem("page-has-been-force-refreshed", "true");
        return typeof window !="undefined" && window.location.reload();
      }
      throw error;
    }
  });

const localStorageId = typeof window !== "undefined" && localStorage.getItem("storeRandomId");

export const RandomId = localStorageId === null ? makeid(10) : localStorageId;

if (localStorageId === null) {
  localStorage.setItem("storeRandomId", RandomId);
}