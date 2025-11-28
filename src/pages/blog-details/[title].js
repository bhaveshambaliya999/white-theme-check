// pages/index.js
import Head from "next/head";
import { changeUrl } from "@/CommanFunctions/commanFunctions";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import BlogDetails from "@/components/blogs/BlogDetails";

const origin = domain;
export async function getServerSideProps(context) {
  const { params, req } = context;
  const { title } = params;

  let storeEntityIds = {};
  let blogData = [];
  let detailPageData = [];
  let getAllData = {};
  let seoData = {};
  try {
    const payload = {
      a: "GetStoreData",
      store_domain: origin,
      SITDeveloper: "1",
    }
    // Get Store Data
    const response = await defaultService.postApi("/EmbeddedPageMaster", payload);
    const result = await response.json();
    storeEntityIds = result?.success === 1 ? result?.data : {};
    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
      return { notFound: true };
    }

    const obj = {
      a: "getBlog",
      store_id: storeEntityIds.mini_program_id,
      per_page: 0,
      number: 0,
      status: "1",
      type: "B2C",
    }
    // Get Menu Navigation Data
    const menuRes = await defaultService.postLaravelApi("/BlogMaster", obj);
    const blogDatas = await menuRes.json();

    blogData = blogDatas?.data || [];

    const getAllData = blogData?.filter((item) =>
      title.includes(changeUrl(item?.title))
    )?.[0];

    seoData = {
      title: getAllData?.seo_titles || "",
      description: getAllData?.seo_description || "",
      keywords: getAllData?.seo_keyword || "",
      image: getAllData?.featured_image || "",
      url: `${origin}/blog/${title}`,
    };
  } catch (error) {
    console.error("SSR Error:", error.message);
  }

  return {
    props: {
      storeEntityIds,
      seoData,
    },
  };
}

export default function BlogDetailPage({ storeEntityIds, seoData }) {
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
      <BlogDetails entityData={storeEntityIds} seoData={seoData} />
    </>
  );
}
