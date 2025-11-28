import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./JourneyCatalogueView.module.scss";
import Loader from "@/CommanUIComp/Loader/Loader";
import { changeUrl, isEmpty } from "@/CommanFunctions/commanFunctions";
import { toast } from "react-toastify";
import commanService from "@/CommanService/commanService";
import Image from "next/image";
import NotFoundImg from "@/assets/images/RecordNotfound.png";
import { useRouter } from "next/router";
import { domain } from "@/CommanService/commanServiceSSR";

const JourneyCatalogueView = (props) => {
  const { uniqueId, type } = props;
  const isCallRef = useRef(false)
  const router = useRouter();
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;
  const isLogin = loginDatas && Object.keys(loginDatas)?.length > 0;
  //   const getAllJourneyDatas = useSelector((state) => state.getAllJourneyData);
  const storeEntityIds = useSelector((state) => state.storeEntityId);

  const [loading, setLoading] = useState(false);
  const [onceUpdated, setOnceUpdated] = useState(false);
  const [catalogDataList, setCatalogDataList] = useState([]);
  const [dd, setDate] = useState("");
  const [Active, setActive] = useState(false);

  const journeyReviewData = () => {
    const catalog = {
      a: "GetJourneyReview",
      store_type: "B2C",
      counsumer_id: isEmpty(loginDatas.member_id),
      store_id: isEmpty(storeEntityIds.mini_program_id),
      unique_id: isEmpty(uniqueId),
    };
    setLoading(true);
    commanService
      .postLaravelApi("/WarrantyCard", catalog)
      .then((res) => {
        if (res.data.success == 1) {
          let data = res["data"]["data"];
          const formattedDate = new Date(data[0].create_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );
          setDate(formattedDate);
          data[0]["data_url"] =
            window.location.origin +
            "/Assets/Js/landing.php?og_title=" +
            encodeURIComponent(data[0]["title"]) +
            "&og_image=" +
            encodeURIComponent(data[0]["image"]) +
            "&og_description=" +
            encodeURIComponent(data[0]["review"]) +
            "&ext_url=" +
            encodeURIComponent("account_dashboard/viewjourney/" + isEmpty(uniqueId));
          setCatalogDataList(data);
          setLoading(false);
        } else {
         toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        // setLoading(false);
      });
  };

  const journeyData = () => {
    var obj = {
      a: "GetJourney",
      store_id: storeEntityIds.mini_program_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      store_type: "B2C",
      unique_id: isEmpty(uniqueId),
    };
    setLoading(true)
    commanService.postLaravelApi("/WarrantyCard", obj).then((res) => {
      if (res.data.success === 1) {
        var data = res.data.data;
        if (data?.length > 0) {
          data[0]["data_url"] =
            domain +
            "/Assets/Js/landing.php?og_title=" +
            encodeURIComponent(data[0]["title"]) +
            "&og_image=" +
            encodeURIComponent(data[0]["image"]) +
            "&og_description=" +
            encodeURIComponent(data[0]["review"]) +
            "&ext_url=" +
            encodeURIComponent("account_dashboard/viewjourney/" + isEmpty(uniqueId));
          setCatalogDataList(data);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    if (!isCallRef.current) {
      setLoading(true)
      if (isEmpty(uniqueId) !== "" && type != "S") {
        if (!onceUpdated) {
          setOnceUpdated(true);
          journeyReviewData();
        }
      } else {
        journeyData();
      }
      isCallRef.current = true
    }
  }, [uniqueId, onceUpdated]);

  return (
    <div id={styles["viewJourney"]}>
      {loading && <Loader />}
      {catalogDataList && catalogDataList?.length > 0 ? (
        <div className={`container my-2`}>
          <div className={styles["cunsumer_detail"]}>
            <div className={styles["apply_detail"]}>
              <p className="d-flex flex-wrap">
                {type != "S" && (
                  <>
                    <span>
                      {catalogDataList[0]?.order_id}&nbsp;&nbsp;|&nbsp;&nbsp;
                    </span>
                    <span>
                      Created At {isEmpty(dd)}&nbsp;&nbsp;|&nbsp;&nbsp;
                    </span>
                  </>
                )}
                <span className="share" onClick={() => setActive(!Active)}>
                  <a className="share_icon">
                    <i className="ic_share fw-bold" />
                  </a>
                </span>
                <div
                  className={`${Active ? styles["active"] : styles["icons"]}`}
                >
                  <a
                    href={`https://twitter.com/intent/tweet?original_referer=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.publish_url)
                    )}&source=${encodeURIComponent(
                      "tweetbutton"
                    )}&text=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.title) +
                        " #proposal #engagement"
                    )}&url=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.publish_url)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ic_twitter fw-bold" />
                  </a>
                  <a
                    href={`http://www.facebook.com/sharer.php?u=${encodeURIComponent(
                      catalogDataList[0]?.data_url
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ic_facebook fw-bold" />
                  </a>
                  {/* <a href={`https://www.instagram.com/sharer.php?u=${(encodeURIComponent(isEmpty(catalogDataList[0]?.publish_url)))}`} target="_blank"><i className="ic_instagram fw-bold" /></a> */}
                </div>
              </p>
            </div>
            {type != "S" && (
              <div className={styles["share_back"]}>
                {/* <button type="button" className='back_btn' onClick={() => router.push(`/profile/journey-catalog/${true}`)}><i className='ic_left' />Back To Journey</button> */}
                <button
                  type="button"
                  className={styles["back_btn"]}
                  onClick={() => router.push(isLogin ? `/account_journey` : `/`)}
                >
                  <i className="ic_left" />
                  Back To Journey
                </button>
              </div>
            )}
          </div>
          <iframe
            src={catalogDataList[0]?.publish_url}
            width={"100%"}
            height={"100vh"}
            title="External Content"
          />
        </div>
      ) : (
        loading=== false && catalogDataList?.length === 0 && (
          <div className="d-flex justify-content-center w-100">
            <Image
              src={NotFoundImg}
              loading="lazy"
              width={500}
              height={500}
              alt="Record Not found"
            />
          </div>
        )
      )}
    </div>
  );
};

export default JourneyCatalogueView;
