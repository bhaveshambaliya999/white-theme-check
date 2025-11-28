import Head from "next/head";
import dynamic from "next/dynamic";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";

const HomePageDefault = dynamic(() => import("@/components/homes/home-9/homePageDefault"), { ssr: false });
const Terms = dynamic(() => import("@/components/otherPages/Terms"), { ssr: false });
const CertificateDiamond = dynamic(() => import("@/components/shoplist/CertificateDiamond"), { ssr: false });

const origin = domain;
export async function getServerSideProps(context) {
  let { slug = [] } = context.params;
  const getStoreData = async () => {
    const payload = {
      a: "GetStoreData",
      store_domain: origin,
      SITDeveloper: "1",
    }
    const res = await defaultService.postApi("/EmbeddedPageMaster", payload)
    const result = await res.json();
    return result?.success === 1 ? result?.data : {};
  };

  let storeEntityIds = {};
  let menuData = {};
  let matchedSeoData = null;

  //  Homepag
  storeEntityIds = await getStoreData();
  if (slug.length === 0 || slug[0] === "index.php") {
    menuData = {
      seo_titles: storeEntityIds?.seo_titles || "",
      seo_description: storeEntityIds?.seo_description || "",
      seo_keyword: storeEntityIds?.seo_keyword || "",
      preview_image: storeEntityIds?.preview_image || "",
      url: origin,
    };
    const seoData = menuData;
    return { props: { type: "home", storeEntityIds, seoData } };
  }

  //  Content page
  if ((!slug[0].includes("diamond") || !slug[0].includes("gemstone")) && slug?.length === 1) {
    const payload = {
      a: "GetContentType",
      code: slug[0].split("-"),
      store_id: storeEntityIds.mini_program_id,
      status: "1",
      per_page: "0",
      number: "0",
      type: "B2C",
    }
    const menuRes = await defaultService.postLaravelApi("/ContentType", payload);
    const menuJson = await menuRes.json();
    menuData = menuJson?.data?.[0] || {};
  }

  //  Diamond certificate page
  if (slug[0].includes("diamond") || slug[0].includes("gemstone")) {

    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
      return { notFound: true };
    }
    const obj = {
      a: "GetHomeNavigation",
      SITDeveloper: "1",
      origin: storeEntityIds.cmp_origin,
      store_id: storeEntityIds.mini_program_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      type: "B2C",
    };
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
    matchedSeoData =
      flatMenu?.find(
        (item) =>
          item.menu_name?.replaceAll(" ", "-")?.toLowerCase() ===
          slug[0]
      ) || null;
    menuData = {
      seo_titles: matchedSeoData?.seo_titles || matchedSeoData?.menu_name,
      seo_description: matchedSeoData?.seo_description || "",
      seo_keyword: matchedSeoData?.seo_keyword || "",
    };
  }

  return {
    props: {
      type: slug[0].includes("diamond") || slug[0].includes("gemstone") ? "diamond" : "content",
      storeEntityIds,
      seoData: {
        title: menuData?.seo_titles ?? null,
        description: menuData?.seo_description ?? null,
        keywords: menuData?.seo_keyword ?? null,
        image: storeEntityIds?.preview_image ?? null,
        url: `${origin}/${slug[0]}`,
      },
      policyName: slug[0],
    },
  };
}

export default function DynamicPage({ type, storeEntityIds, seoData, policyName }) {
  const SeoHead = () => (
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
  );
  if (type === "home") {
    return (
      <>
        <SeoHead />
        <main className="page-wrapper"><HomePageDefault entityData={storeEntityIds} /></main>
      </>
    );
  }

  if (type === "diamond") {
    return (
      <>
        <SeoHead />
        <CertificateDiamond storeEntityIds={storeEntityIds} />
      </>
    );
  }

  return (
    <>
      <SeoHead />
      <Terms entityData={storeEntityIds} seoData={seoData} policyName={policyName} />
    </>
  );
}