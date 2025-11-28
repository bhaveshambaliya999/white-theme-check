
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import Shop1 from "@/components/shoplist/Shop1";
import Head from "next/head";
import { useRouter } from "next/router";

const origin = domain;
export async function getServerSideProps(context) {
  let storeEntityIds = {};
  let seoData = {};
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

    const object = {
      SITDeveloper: "1",
      a: "GetHomeNavigation",
      origin: storeEntityIds.cmp_origin,
      store_id: storeEntityIds.mini_program_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      type: "B2C",
    }
    const menuRes = await defaultService.postApi("/StoreCart", object);

    const menuData = (await menuRes.json())?.data?.navigation_data || [];
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
          item.menu_name?.replaceAll(" ", "-").toLowerCase() ===
          "make-your-customization"
      ) || null;
    seoData = {
      title: matchedSeo?.seo_titles || "",
      description: matchedSeo?.seo_description || "",
      keywords: matchedSeo?.seo_keyword || "",
      image: storeEntityIds?.preview_image || "",
      url: `${origin}/make-your-customization}`,
    };
  } catch (error) {
    console.error("SSR Error:", error.message);
  }

  return {
    props: {
      storeEntityIds,
      seoData,
    }
  }
}

export default function ProductsPage({
  storeEntityIds,
  seoData,
}) {
  const router = useRouter();
  const currentSlug = router.query.slug || [];

  if (currentSlug?.length === 1) {
    // /products/:verticalCode
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
        <Shop1
          storeEntityIds={storeEntityIds}
        />
      </>
    );
  }

  return;
}
