// pages/_app.js
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "../Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import "@/styles/globals.scss";
import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css/thumbs";
import "swiper/css";
import "photoswipe/dist/photoswipe.css";
import "react-toastify/dist/ReactToastify.css";
import Context from "@/context/Context";
import { storeEntityId, storeCurrency } from "../Redux/action";
import { ToastContainer } from "react-toastify";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import Loader from "@/CommanUIComp/Loader/Loader";
import ScrollTopBehaviour from "@/components/common/ScrollTopBehaviour";

// Lazy load only critical components that are needed initially
const Header1 = dynamic(() => import("@/components/headers/Header9"), { ssr: true });
const MobileHeader = dynamic(() => import("@/components/headers/MobileHeader"), { ssr: false });
const Footer1 = dynamic(() => import("@/components/footers/Footer1"), { ssr: true });
const MobileFooter1 = dynamic(() => import("@/components/footers/MobileFooter1"), { ssr: false });

// Lazy load components that can be loaded later
const CartDrawer = dynamic(() => import("@/components/shopCartandCheckout/CartDrawer"), { ssr: false });
const CustomerLogin = dynamic(() => import("@/components/asides/CustomerLogin"), { ssr: false });
const ShopFilter = dynamic(() => import("@/components/asides/ShopFilter"), { ssr: false });
const ProductAdditionalInformation = dynamic(() => import("@/components/asides/ProductAdditionalInformation"), { ssr: false });

// MainApp fetches store data and initializes Redux
function MainApp({ Component, pageProps }) {
  // const seo = pageProps?.seoData;
  const [storeData, setStoreData] = useState(pageProps?.storeEntityIds || {});
  const [loaded, setLoaded] = useState(Boolean(pageProps?.storeEntityIds));
  const isCallRef = useRef(false);

  const fetchStoreData = useCallback(async () => {
    try {
      const payload = { a: "GetStoreData", store_domain: domain, SITDeveloper: "1" };
      const res = await defaultService.postApi("/EmbeddedPageMaster", payload);
      const result = await res.json();

      if (result?.success === 1) {
        const data = result.data;
        setStoreData(data);
        store.dispatch(storeEntityId(data));
        store.dispatch(storeCurrency(data?.store_currency));
        sessionStorage.setItem("storeData", JSON.stringify(data));
        sessionStorage.setItem("storeCurrency", data?.store_currency);
      } else {
        setStoreData({});
        sessionStorage.setItem("storeData", "false");
      }
    } catch (err) {
      console.error("Store data load failed:", err);
      setStoreData({});
      sessionStorage.setItem("storeData", "false");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isCallRef.current) return;

    const cached = JSON.parse(sessionStorage.getItem("storeData")) || null;

    const initialize = async () => {
      if (cached) {
        setStoreData(cached);
        store.dispatch(storeEntityId(cached));
      } else {
        await fetchStoreData();
      }
      setLoaded(true);
    };

    initialize();
    isCallRef.current = true;
  }, [fetchStoreData]);

  useEffect(() => {
    const isReloading = localStorage.getItem("isReloading");

    if (isReloading) {
      localStorage.removeItem("journeyList")
      localStorage.removeItem("sectionDataLists")
      localStorage.removeItem("sliderData")
      localStorage.removeItem("isReloading");
    }

    const handleBeforeUnload = () => {
      localStorage.setItem("isReloading", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (!loaded) return <Loader />;

  return (
    <Context>
      <Header1 storeData={storeData} />
      <MobileHeader storeData={storeData} />
      <Component {...pageProps} storeData={storeData} />
      <MobileFooter1 storeData={storeData} />
      <Footer1 storeData={storeData} />
      <Suspense fallback={<Loader />}>
        <CartDrawer />
        <CustomerLogin />
        <ShopFilter />
        <ProductAdditionalInformation />
        <ScrollTopBehaviour/>
      </Suspense>
      <ToastContainer />
      <div id="pageOverlay" className="page-overlay" />
    </Context>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>{pageProps?.seoData?.title}</title>
        <meta name="description" content={pageProps?.seoData?.description} />
        <meta name="keywords" content={pageProps?.seoData?.keywords} />

        <meta property="og:title" content={pageProps?.seoData?.title} />
        <meta
          property="og:description"
          content={pageProps?.seoData?.description}
        />
        <meta property="og:image" content={pageProps?.seoData?.image} />
        <meta property="og:url" content={pageProps?.seoData?.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageProps?.seoData?.title} />
        <meta
          name="twitter:description"
          content={pageProps?.seoData?.description}
        />
        <meta name="twitter:image" content={pageProps?.seoData?.image} />
      </Head>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp Component={Component} pageProps={pageProps} />
      </PersistGate>
    </Provider>
  );
}
