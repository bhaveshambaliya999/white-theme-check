"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import BreadCumb from "@/components/shoplist/BreadCumb";

const CampaignPreview = ({ campaign_id, email, un_id, name }) => {
    const params = useParams();
    const storeEntityIds = useSelector((state) => state.storeEntityId);

    const [url, setUrl] = useState("");

    useEffect(() => {
        if (!storeEntityIds?.origin || !campaign_id) return;

        const origin = isEmpty(storeEntityIds.origin);
        const unId = isEmpty(un_id);

        const generatedUrl = `https://${origin}/multiple-template/?campaign_id=${campaign_id}&un_id=${unId}&customer_id=&type=preview&is_customer=0&user_type=consumer`;

        setUrl(generatedUrl);
    }, [storeEntityIds?.origin, campaign_id, un_id]);
    return (
        <>
            <main className="page-wrapper">
                <div className="mb-4"></div>
                <section className="container">
                    <BreadCumb />
                    <div className="pb-2">
                        <p className="fs-18 text-capitalize fw-medium my-1">{name?.toString().replaceAll("-", " ")}</p>

                        <div className="iframe-ht-cust">
                            <iframe id="iframe" src={url} width={"100%"}
                                height={"100vh"} />
                        </div>

                    </div>
                </section>
            </main>

        </>
    );
};

export default CampaignPreview;
