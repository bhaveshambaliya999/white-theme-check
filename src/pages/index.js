import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import dynamic from "next/dynamic";
import Head from "next/head";
const HomePageDefault = dynamic(() => import("@/components/homes/home-9/homePageDefault"));


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
  const seoData = {
    title: storeEntityIds?.seo_titles || "",
    description: storeEntityIds?.seo_description || "",
    keywords: storeEntityIds?.seo_keyword || "",
    image: storeEntityIds?.preview_image || "",
    url: domain,
  };
  return {
    props: {
      storeEntityIds,
      seoData,
    },
  };
}

export default function HomePage({ storeEntityIds, seoData, ...pageProps }) {
    const storeEntityData = pageProps.storeData;
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
                <meta name="robots" content="index,follow" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoData?.title} />
                <meta name="twitter:description" content={seoData?.description} />
                <meta name="twitter:image" content={seoData?.image} />
            </Head>
            <main className="page-wrapper">
                <HomePageDefault entityData={storeEntityData} seoData={seoData} />
            </main>
        </>
    );
}