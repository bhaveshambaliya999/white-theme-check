// pages/index.js
import Head from "next/head";
import ContactUs from "@/components/otherPages/Contact/Contact";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { isEmpty, RandomId } from "@/CommanFunctions/commanFunctions";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import commanService from "../CommanService/commanService";


const STORE_DOMAIN = domain;
export async function getServerSideProps() {
  const payload = {
    a: "GetStoreData",
    store_domain: STORE_DOMAIN,
    SITDeveloper: "1",
  };

  const response = await defaultService.postApi("/EmbeddedPageMaster", payload);
  const result = await response.json()
  const storeEntityIds = result?.success === 1 ? result?.data : {};
  if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
    return { notFound: true };
  }
  const obj = {
    SITDeveloper: "1",
    a: "getHomeFooterDetail",
    store_id: storeEntityIds.mini_program_id,
    tenant_id: storeEntityIds.tenant_id,
    entity_id: storeEntityIds.entity_id,
    origin: storeEntityIds.cmp_origin,
    user_id: RandomId,
    type: "B2C",
  }
  const menuRes = await defaultService.postApi("/StoreCart", obj);

  const menuDatas = (await menuRes.json())?.data?.content_data || [];
  const flatMenu = [];
  const flattenMenu = (items) => {
    items.forEach((item) => {
      item.data.forEach((elm) => {
        flatMenu.push(elm)
        if (Array.isArray(elm.child)) flattenMenu(elm.child)
      }
      )
    })
  };
  flattenMenu(menuDatas);
  const matchedSeoData =
    flatMenu?.find(
      (item) =>
        item?.ecm_code?.toLowerCase() ===
        "customersupport"
    ) || null;
  return {
    props: {
      storeEntityIds,
      seoData: {
        title: matchedSeoData?.seo_titles || matchedSeoData?.ecm_name || storeEntityIds.seo_titles,
        description: matchedSeoData?.seo_description || "",
        keywords: matchedSeoData?.seo_keyword || "",
        image: storeEntityIds?.preview_image,
        url: `${STORE_DOMAIN}/contact-us`,
      },
    },
  };
}

export default function ContactPage({ storeEntityIds, seoData }) {
  const isCallRef = useRef(false)
  const footerAllContentDatas = useSelector((state) => state.footerAllContentData);
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [mapUrl, setMapUrl] = useState("");
  const [onceUpdate, setOnceUpdated] = useState(false);

  const contactUsData = useCallback(() => {
    const obj = {
      a: "GetContactUs",
      store_id: storeEntityIds.mini_program_id,
      per_page: "0",
      number: "0",
      status: "1",
      primary: "1",
    };
    setLoading(true);
    commanService.postLaravelApi("/ContactUs", obj)
      .then((res) => {
        if (res?.data?.success === 1) {
          if (res?.data?.data?.length > 0) {
            for (var i = 0; i < res?.data?.data.length; i++) {
              var data = res?.data?.data;
              data[i].address = data[i].building + ", " + data[i].building_name;
              if (isEmpty(data[i].building_name) !== "") {
                data[i].address = data[i].address + ", " + data[i].street;
              }
              if (isEmpty(data[i].city) != "") {
                data[i].address = data[i].address + ", " + data[i].city;
              }
              if (isEmpty(data[i].pincode) != "") {
                data[i].address = data[i].address + ", " + data[i].pincode;
              }
              data[i].address =
                data[i].address +
                ", " +
                data[i].state +
                ", " +
                data[i].country +
                ".";
            }
            setContactData(data);
            setMapUrl(data?.embed_url);
            setLoading(false);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [storeEntityIds]);

  useEffect(() => {
    setOnceUpdated(false);
    window.scrollTo(0, 0);
    if (onceUpdate == false && !isCallRef.current) {
      contactUsData();
      isCallRef.current = true;
      // countryDrp(countryDataDrp);
    }
  }, [onceUpdate, storeEntityIds, contactUsData]);
  return (
    <>
      <Head>
        <title>{seoData?.title}</title>
        <meta name="description" content={seoData?.description} />
        <meta name="keywords" content={seoData?.keywords} />

        <meta property="og:title" content={seoData?.title} />
        <meta property="og:description" content={seoData?.description} />
        <meta property="og:image" content={seoData?.image} />
        <meta property="og:url" content={seoData?.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData?.title} />
        <meta name="twitter:description" content={seoData?.description} />
        <meta name="twitter:image" content={seoData?.image} />
      </Head>
      <ContactUs contactDatas={contactData} loading={loading} entityData={storeEntityIds} seoData={seoData} />
    </>
  )
}
