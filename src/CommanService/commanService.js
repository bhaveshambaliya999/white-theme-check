// commanService.js
import axios from "axios";

function getEnv(origin) {
  const isBrowser = typeof window !== "undefined";
  let env = {};

  // const source = origin || (isBrowser ? window.location.origin : "https://zurahjewellery.com");
  // const source = origin || (isBrowser ? window.location.origin : "https://phpstack-1028231-5794626.cloudwaysapps.com");
  // const source = origin || (isBrowser ? window.location.origin : "https://uat-direct.upqor.com");
  const source = origin || (isBrowser ? window.location.origin : 'https://white-theme-check.vercel.app/');
  // const source = origin || (isBrowser ? window.location.origin : "https://uat-d2c.artisanalparfumhouse.com");

  if (source?.includes("localhost")) {
    env = {
      imageUrl: "http://192.168.84.21:8080",
      baseUrl1: "http://192.168.84.21:8080/api/call",
      baseUrl2: "http://192.168.84.45/sit-ci-api/call",
      domain: 'https://uat-direct.rpdiamondsandjewellery.com'
    };
    // env = {
    //   imageUrl: "https://api-uat-store.artisanalparfumhouse.com",
    //   baseUrl1: "https://api-uat-store.artisanalparfumhouse.com/api/call",
    //   baseUrl2: "https://api-uat.artisanalparfumhouse.com/call",
    //   domain: 'https://uat-d2c.artisanalparfumhouse.com'
    // };
    // env = {
    //   imageUrl: "https://api-ecom-store.upqor.com",
    //   baseUrl1: "https://api-ecom-store.upqor.com/api/call",
    //   baseUrl2: "https://api-ecom.upqor.com/call",
    //   domain: 'https://zurahjewellery.com'
    //   // domain: 'https://uat-direct.upqor.com'
    //   // domain: 'https://phpstack-1028231-5794626.cloudwaysapps.com'
    // };
  } else if (source?.includes("staging")) {
    env = {
      imageUrl: "https://apistaging-ecom-store.upqor.com",
      baseUrl1: "https://apistaging-ecom-store.upqor.com/api/call",
      baseUrl2: "https://apistaging-ecom.upqor.com/call",
      domain: source,
    };
  } else if (source?.includes("uat")) {
    env = {
      imageUrl: "https://apiuat-ecom-store.upqor.com",
      baseUrl1: "https://apiuat-ecom-store.upqor.com/api/call",
      baseUrl2: "https://apiuat-ecom.upqor.com/call",
      domain: source,
    };
  } else {
    env = {
      imageUrl: "https://apiuat-ecom-store.upqor.com",
      baseUrl1: "https://apiuat-ecom-store.upqor.com/api/call",
      baseUrl2: "https://apiuat-ecom.upqor.com/call",
      domain: "https://white-theme-check.vercel.app/",
    };
  }

  return env;
}

class Commanservice {
  constructor(origin = null) {
    const env = getEnv(origin);
    this.imageUrl = env.imageUrl;
    this.baseUrl1 = env.baseUrl1;
    this.baseUrl2 = env.baseUrl2;
    this.domain = env.domain;
  }

  postLaravelApi(controller, obj) {
    return axios.post(this.baseUrl1 + controller, obj);
  }

  postApi(controller, obj, config = {}) {
    return axios.post(this.baseUrl2 + controller, obj, config);
  }

  postApiFile(controller, obj) {
    return axios.post(this.imageUrl + controller, obj);
  }

  obj_json(obj, value) {
    const data = {};
    data["a"] = value;
    for (const pair of obj) {
      data[pair[0]] = pair[1];
    }
    return JSON.stringify(data);
  }
}

// Default browser-safe instance
const defaultService = new Commanservice();
const domain =
  typeof window !== "undefined"
    ? getEnv(window.location.origin).domain
    : getEnv().domain;
const imageUrl = getEnv().imageUrl
export { Commanservice, getEnv, domain, imageUrl };
export default defaultService;
