export const COUNTRIES = {
  mexico: "México",
  españa: "España",
};

export const IG_PROFILE_URL = "https://www.instagram.com/tirandovino";

export const EMAIL_JS_TEMPLATE_ID = "contact_form";
export const EMAIL_JS_SERVICE_ID = "contact_service";
export const EMAIL_JS_ADMIN = "Tirando Vino";

export const CURRENCY = "MXN";

export const ENV = process.env.NODE_ENV;

export const HOME_URL = "https://tirando-vino.vercel.app/";
export const DEV_HOME_URL = "http://localhost:3000";

export const FIELD_LABELS = {
  wine: {
    name: "Nombre",
    color: "Color",
    variety: "Variedad",
    house: "Bodega",
    region: "Región",
    country: "País",
    price: "Precio",
    year: "Año",
    imageURL: "Imagen",
  },
  merch: {
    name: "Nombre",
    variety: "Variedad",
    price: "Precio",
    imageURL: "Imagen",
  },
  house: {
    name: "Nombre",
  },
};

export const TYPE_LABELS = {
  wine: "Vino",
  merch: "Merch",
  house: "Bodega",
};

export const INITIAL_DATA = {
  wine: {
    name: "",
    house: "",
    variety: "",
    year: "",
    color: "",
    country: "",
    region: "",
    price: "",
    imageURL: "",
    status: "active",
  },
  merch: {
    name: "",
    variety: "",
    price: "",
    imageURL: "",
    status: "active",
  },
  house: {
    name: "",
    status: "active",
  },
};
