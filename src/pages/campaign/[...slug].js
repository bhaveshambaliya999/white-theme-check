
import Head from "next/head";
import defaultService, { domain } from "@/CommanService/commanServiceSSR";
import dynamic from "next/dynamic";
const CampaignPreview = dynamic(() => import("@/components/otherPages/CampaignPreview/campaignPreview"), { ssr: false });

export async function getServerSideProps(context) {
    const { params, req } = context;
    const campaign_id = params.slug[0]
    const email = params.slug[1]
    const un_id = params.slug[2]
    const name = params.slug[3]
    const payload = {
        a: "GetStoreData",
        store_domain: domain,
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
            seoData,
            campaign_id,
            email,
            un_id,
            name
        },
    };
}

function CampaignDetailPage({ seoData, campaign_id, email, un_id, name }) {
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
            <CampaignPreview campaign_id={campaign_id} email={email} un_id={un_id} name={name} />

        </>
    );
}
export default CampaignDetailPage