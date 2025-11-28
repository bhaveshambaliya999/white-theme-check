import { RandomId } from "@/CommanFunctions/commanFunctions";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import dynamic from "next/dynamic";
const Shop1 = dynamic(() => import("@/components/shoplist/Shop1"), { ssr: false });
const SingleProduct12 = dynamic(() => import("@/components/singleProduct/SingleProduct12"), { ssr: false });

import Head from "next/head";
import { useRouter } from "next/router";
const origin = domain;
export async function getServerSideProps(context) {
  let { slug = [] } = context.params;

  let lastPart = slug[slug.length - 1]?.split("-")?.pop() || "";
  let variantId = lastPart?.toLowerCase()?.includes("pv") ? lastPart?.toUpperCase() : null;

  let verticalCode = slug[0] || null;

  let storeEntityIds = {};
  let seoData = {};
  let seoDataforDetailsPage = {};
  let vertical_code = "";
  let fetchedData = {};
  const payload = {
    a: "GetStoreData",
    store_domain: origin,
    SITDeveloper: "1",
  };

  try {
    // Fetch store data first
    const storeRes = await defaultService.postApi("/EmbeddedPageMaster", payload);
    const storeResult = await storeRes.json();
    storeEntityIds = storeResult?.success === 1 ? storeResult?.data : {};

    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id)
      return { notFound: true };

    if (variantId) {
      // Fetch PV variant SEO data
      const obj = {
        SITDeveloper: "1",
        a: "GetItemWiseSEO",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        miniprogram_id: storeEntityIds.mini_program_id,
        pv_unique_id: variantId,
        type: "B2C",
      }
      const productRes = await defaultService.postApi("/EmbeddedPageMaster", obj);

      const detailData = await productRes.json();
      const matchedSeo = detailData?.data || {};

      seoDataforDetailsPage = {
        title:
          matchedSeo?.seo_titles ||
          slug[1]?.split("pv")[0]?.replaceAll("-", " ").toUpperCase() ||
          "",
        description: matchedSeo?.seo_description || "",
        keywords: matchedSeo?.seo_keyword || "",
        image: matchedSeo?.image || storeEntityIds?.preview_image,
        url: `${origin}/products/${slug[0]}/${slug[1]}`,
      };
    } else {
      const object = {
        SITDeveloper: "1",
        a: "GetHomeNavigation",
        store_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        origin: storeEntityIds.cmp_origin,
        type: "B2C",
      }
      const menuRes = await defaultService.postApi("/StoreCart", object);
      const object2 = {
        a: "getHomeFooterDetail",
        SITDeveloper: "1",
        store_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        origin: storeEntityIds.cmp_origin,
        user_id: RandomId,
        type: "B2C",
      }
      const menuRes2 = await defaultService.postApi("/StoreCart", object2);

      const menuData1 = (await menuRes.json())?.data?.navigation_data || [];
      const menuData2 = (await menuRes2.json())?.data?.navigation_footer_data || [];
      const menuData = [...menuData1, ...menuData2]
      const flatMenu = [];
      const flattenMenu = (items) => {
        items.forEach((item) => {
          flatMenu.push(item);
          if (Array.isArray(item.child)) flattenMenu(item.child);
        });
      };
      flattenMenu(menuData);

      const matchedSeo =
        flatMenu.find(
          (item) =>
          (item.menu_name?.replaceAll(" ", "-")?.toLowerCase() ===
            verticalCode?.toLowerCase())
        ) || {};
      fetchedData = matchedSeo;
      vertical_code = matchedSeo?.product_vertical_name || ""
      seoData = {
        title: matchedSeo?.menu_name || matchedSeo?.seo_titles || "",
        description: matchedSeo?.seo_description || "",
        keywords: matchedSeo?.seo_keyword || "",
        image: storeEntityIds?.preview_image || "",
        url: `${origin}/products/${slug[0]}`,
      };
    }
  } catch (error) {
    console.error("SSR Error:", error.message);
  }
  return {
    props: {
      seoData: variantId ? seoDataforDetailsPage : seoData,
      fetchedData: !variantId ? fetchedData : null,
      variantId,
      vertical_code,
      seoDataforDetailsPage,
      entityData: {
        storeEntityIds,
        seoData,
        seoDataforDetailsPage,
        verticalCode,
      },
      slug,
    },
  };
}

export default function ProductsPage({
  entityData,
  slug = [],
  variantId,
  seoData,
  vertical_code,
  fetchedData,
  ...pageProps
}) {
  const router = useRouter();
  const currentSlug = slug.length > 0 ? slug : router.query.slug || [];
  // const isVariantIds = currentSlug?.filter((item) => item?.toLowerCase()?.includes("pv"))
  if (!variantId) {
    return (
      <>
        <Head>
          <title>{seoData?.title}</title>
          <meta name="description" content={seoData?.description} />
          <meta name="keywords" content={seoData?.keywords} />

          <meta property="og:title" content={seoData?.title} />
          <meta
            property="og:description"
            content={seoData?.description}
          />
          <meta property="og:image" content={seoData?.image} />
          <meta property="og:url" content={seoData?.url} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData?.title} />
          <meta
            name="twitter:description"
            content={seoData?.description}
          />
          <meta name="twitter:image" content={seoData?.image} />
        </Head>
        <Shop1
          vertical_code={vertical_code}
          verticalCode={currentSlug[0]}
          currentSlug={currentSlug[0]}
          storeEntityIds={pageProps.storeData}
          fetchedData={fetchedData}
        />
      </>
    );
  } else if (variantId && currentSlug[1] === "campaign") {
    return (
      <>
        <Head>
          <title>{seoData?.title}</title>
          <meta
            name="description"
            content={seoData?.description}
          />
          <meta name="keywords" content={seoData?.keywords} />

          <meta property="og:title" content={seoData?.title} />
          <meta
            property="og:description"
            content={seoData?.description}
          />
          <meta property="og:image" content={seoData?.image} />
          <meta property="og:url" content={seoData?.url} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData?.title} />
          <meta
            name="twitter:description"
            content={seoData?.description}
          />
          <meta name="twitter:image" content={seoData?.image} />
        </Head>
        <SingleProduct12
          verticalCode={currentSlug[0]}
          campaignId={currentSlug[2]}
          variantId={currentSlug[currentSlug?.length - 1]}
        />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>{seoData?.title}</title>
          <meta
            name="description"
            content={seoData?.description}
          />
          <meta name="keywords" content={seoData?.keywords} />

          <meta property="og:title" content={seoData?.title} />
          <meta
            property="og:description"
            content={seoData?.description}
          />
          <meta property="og:image" content={seoData?.image} />
          <meta property="og:url" content={seoData?.url} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData?.title} />
          <meta
            name="twitter:description"
            content={seoData?.description}
          />
          <meta name="twitter:image" content={seoData?.image} />
        </Head>
        <SingleProduct12
          verticalCode={currentSlug[0]}
          variantId={currentSlug[1]}
        />
      </>
    );
  }
}
