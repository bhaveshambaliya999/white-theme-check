// pages/index.js
import { RandomId } from "@/CommanFunctions/commanFunctions";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import About from "@/components/otherPages/about/About";
import Head from "next/head";

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
    tenant_id: storeEntityIds.tenant_id,
    entity_id: storeEntityIds.entity_id,
    origin: storeEntityIds.cmp_origin,
    store_id: storeEntityIds?.mini_program_id,
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
        "aboutus"
    ) || null;
  return {
    props: {
      storeEntityIds,
      seoData: {
        title: matchedSeoData?.seo_titles || matchedSeoData?.ecm_name || storeEntityIds.seo_titles,
        description: matchedSeoData?.seo_description || "",
        keywords: matchedSeoData?.seo_keyword || "",
        image: storeEntityIds?.preview_image,
        url: `${STORE_DOMAIN}/about-us`,
      },
    },
  };
}


export default function AboutPage({ storeEntityIds, seoData }) {
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
      <About entityData={storeEntityIds} seoData={seoData}></About>
    </>
  )
}
