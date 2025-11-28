// pages/index.js
import Head from "next/head";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import Faq from "@/components/otherPages/Faq";

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
    a: "GetHomeNavigation",
    origin: storeEntityIds.cmp_origin,
    store_id: storeEntityIds?.mini_program_id,
    tenant_id: storeEntityIds.tenant_id,
    entity_id: storeEntityIds.entity_id,
    type: "B2C",
  }
  const menuRes = await defaultService.postApi("/StoreCart", obj);

  const menuDatas = (await menuRes.json())?.data?.navigation_data || [];
  const flatMenu = [];
  const flattenMenu = (items) => {
    items.forEach((item) => {
      flatMenu.push(item);
      if (Array.isArray(item.child)) flattenMenu(item.child);
    });
  };
  flattenMenu(menuDatas);
  const matchedSeoData =
    flatMenu?.find(
      (item) =>
        item.product_vertical_name?.toLowerCase() ===
        "other"
    ) || null;
  return {
    props: {
      storeEntityIds,
      seoData: {
        title: matchedSeoData?.seo_titles || matchedSeoData?.menu_name || storeEntityIds.seo_titles,
        description: matchedSeoData?.seo_description || "",
        keywords: matchedSeoData?.seo_keyword || "",
        image: storeEntityIds?.preview_image,
        url: `${STORE_DOMAIN}/faq`,
      },
    },
  };
}

export default function FaqPage({ storeEntityIds, seoData }) {
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
      <Faq entityData={storeEntityIds} seoData={seoData}> </Faq>
    </>
  )
}
