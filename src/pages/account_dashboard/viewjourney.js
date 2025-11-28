// pages/index.js
import Head from "next/head";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import JourneyCatalogueView from "@/components/otherPages/Journey/JourneyCatalogueView";
import BreadCumb from "@/components/shoplist/BreadCumb";

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

  return {
    props: {
      storeEntityIds,
      seoData: {
        title: storeEntityIds?.seo_titles || "",
        description: storeEntityIds?.seo_description || "",
        keywords: storeEntityIds?.seo_keyword || "",
        image: storeEntityIds?.preview_image,
        url: STORE_DOMAIN,
      },
    },
  };
}

function ViewJourney({ storeEntityIds, seoData }) {
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  const uniqueId = params.getAll("unique_id")[0];
  const type = params.getAll("type")[0];
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
      <main className="page-wrapper">
        <div className="mb-4 pb-0 pb-md-4"></div>
        <section className="my-account container">
          <BreadCumb/>
          <div className="row">
            <JourneyCatalogueView uniqueId={uniqueId} type={type} />
          </div>
        </section>
      </main>
      <div className="section-gap"></div>
    </>
  )
}
export default ViewJourney