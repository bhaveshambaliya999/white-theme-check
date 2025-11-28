"use client";

import commanService from "@/CommanService/commanService";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import Image from "next/image";
import NotFoundImg from "@/assets/images/RecordNotfound.png";

export default function Terms(props) {
  const isRefCall = useRef(false);
  const { policyName } = props;
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [storePrivacyData, setPrivacyData] = useState([]);
  const [storePolicyName, setStorePolicyName] = useState(policyName);

  const storeEntityIds = useSelector((state) => state.storeEntityId);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (policyName !== storePolicyName) {
      isRefCall.current = false;
    }
    if (Object.keys(storeEntityIds).length > 0 && !isRefCall.current) {
      setLoader(true);
      const data = storeEntityIds;
      const obj = {
        a: "GetContentType",
        code: policyName?.split("-") || [],
        store_id: data.mini_program_id,
        type: "",
        status: "1",
        per_page: "0",
        number: "0",
        type: "B2C",
      };

      contentTypeData("/ContentType", obj);
      isRefCall.current = true;
    }
  }, [router.asPath, storeEntityIds, policyName]);

  const contentTypeData = (val, obj) => {
    setLoader(true);
    commanService
      .postLaravelApi(val, obj)
      .then((res) => {
        if (res.data.success === 1) {
          setPrivacyData(res.data.data);
          setLoader(false);
        } else {
          toast.error(res.data.message);
          setLoader(false);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };

  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-4"></div>
      <section className="container lh-30">
        {storePrivacyData.length > 0 ? (
          <>
            {storePrivacyData.map((e, index) => {
              return (
                <div key={index} className="PrivacyPolicy">
                  {parse(`<div> ${e.publish_detail}</div>`)}
                </div>
              );
            })}
          </>
        ) : (
          !loader && (
            <div className="d-flex justify-content-center w-100 not-found">
              <Image
                src={NotFoundImg}
                loading="lazy"
                width={500}
                height={500}
                alt="Record Not found"
                // quality={100}
              />
            </div>
          )
        )}
      </section>
      <div className="section-gap"></div>
    </main>
  );
}
