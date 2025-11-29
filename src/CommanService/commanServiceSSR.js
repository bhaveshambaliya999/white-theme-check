function getEnv(origin) {
  const isBrowser = typeof window !== "undefined";
  // const source = origin || (isBrowser ? window.location.origin : "https://zurahjewellery.com");
  const source = origin || (isBrowser ? window.location.origin : 'https://white-theme-check.vercel.app/');
  // const source = origin || (isBrowser ? window.location.origin : "https://uat-direct.upqor.com");
  // const source = origin || (isBrowser ? window.location.origin : "https://phpstack-1028231-5794626.cloudwaysapps.com");
  // const source = origin || (isBrowser ? window.location.origin : "https://uat-d2c.artisanalparfumhouse.com");

  if (source.includes("localhost")) {
    return {
      imageUrl: "http://192.168.84.66:8080",
      laravelBaseUrl: "http://192.168.84.66:8080/api/call",
      nodeBaseUrl: "http://192.168.84.45/sit-ci-api/call",
      domain: 'https://uat-direct.rpdiamondsandjewellery.com'

      // imageUrl: "https://api-ecom-store.upqor.com",
      // laravelBaseUrl: "https://api-ecom-store.upqor.com/api/call",
      // nodeBaseUrl: "https://api-ecom.upqor.com/call",
      // // domain: "https://uat-direct.upqor.com",
      // domain: "https://zurahjewellery.com",
      // domain: "https://phpstack-1028231-5794626.cloudwaysapps.com",

      // imageUrl: "https://api-uat-store.artisanalparfumhouse.com",
      // laravelBaseUrl: "https://api-uat-store.artisanalparfumhouse.com/api/call",
      // nodeBaseUrl: "https://api-uat.artisanalparfumhouse.com/call",
      // domain: 'https://uat-d2c.artisanalparfumhouse.com'
    };
  }
  if (source.includes("staging")) {
    return {
      imageUrl: "https://apistaging-ecom-store.upqor.com",
      laravelBaseUrl: "https://apistaging-ecom-store.upqor.com/api/call",
      nodeBaseUrl: "https://apistaging-ecom.upqor.com/call",
      domain: source,
    };
  }
  if (source.includes("uat")) {
    return {
      // imageUrl: "https://apiuat-ecom-store.upqor.com",
      // laravelBaseUrl: "https://apiuat-ecom-store.upqor.com/api/call",
      // nodeBaseUrl: "https://apiuat-ecom.upqor.com/call",
      // domain: source,

      imageUrl: "http://192.168.84.66:8080",
      laravelBaseUrl: "http://192.168.84.66:8080/api/call",
      nodeBaseUrl: "http://192.168.84.45/sit-ci-api/call",
      domain: 'https://uat-direct.rpdiamondsandjewellery.com',

      // imageUrl: "https://api-uat-store.artisanalparfumhouse.com",
      // laravelBaseUrl: "https://api-uat-store.artisanalparfumhouse.com/api/call",
      // nodeBaseUrl: "https://api-uat.artisanalparfumhouse.com/call",
      // domain: 'https://uat-d2c.artisanalparfumhouse.com'
    };
  }

  return {
    // imageUrl: "https://apiuat-ecom-store.upqor.com",
    // laravelBaseUrl: "https://apiuat-ecom-store.upqor.com/api/call",
    // nodeBaseUrl: "https://apiuat-ecom.upqor.com/call",
    // domain: source,
     imageUrl: "https://apiuat-ecom-store.upqor.com",
      laravelBaseUrl: "https://apiuat-ecom-store.upqor.com/api/call",
      nodeBaseUrl: "https://apiuat-ecom.upqor.com/call",
      domain: "https://white-theme-check.vercel.app/",
  };
}

class CommanServiceSSR {
  constructor(origin = null) {
    const env = getEnv(origin);
    this.imageUrl = env.imageUrl;
    this.laravelBaseUrl = env.laravelBaseUrl;
    this.nodeBaseUrl = env.nodeBaseUrl;
    // this.domain = env.domain || 'https://phpstack-1028231-5794626.cloudwaysapps.com';
    // this.domain = env.domain || 'https://zurahjewellery.com';
    // this.domain = env.domain || 'https://uat-direct.upqor.com';
    this.domain = env.domain || 'https://white-theme-check.vercel.app/';
    // this.domain = env.domain || 'https://uat-d2c.artisanalparfumhouse.com';

    // this.storeDomain = env.domain || 'https://phpstack-1028231-5794626.cloudwaysapps.com';
    // this.storeDomain = env.domain || 'https://zurahjewellery.com';
    // this.storeDomain = env.domain || 'https://uat-direct.upqor.com';
    this.storeDomain = env.domain || 'https://white-theme-check.vercel.app/';
    // this.storeDomain = env.domain || 'https://uat-d2c.artisanalparfumhouse.com';
  }

  async postLaravelApi(controller, bodyPayload) {
    return await fetch(`${this.laravelBaseUrl}${controller}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ...this.doamin,
        prefer: this.domain,
        origin: this.domain,
      },
      body: JSON.stringify(bodyPayload),
      cache: "no-store",
    });
  }
  async postApi(controller, bodyPayload) {
    return await fetch(`${this.nodeBaseUrl}${controller}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ...this.doamin,
        prefer: this.domain,
        origin: this.domain,
      },
      body: JSON.stringify(bodyPayload),
      cache: "no-store",
    });
  }

}

const { domain } = getEnv();

const defaultService = new CommanServiceSSR();

export { CommanServiceSSR, getEnv, defaultService as default, domain };

