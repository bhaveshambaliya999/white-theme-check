import commanService from "@/CommanService/commanService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import OutsideClickHandler from "react-outside-click-handler";

const AccountCoupons = () => {
  const isCallRef = useRef(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const storeCurrencys = typeof window !== "undefined" && sessionStorage.getItem("storeCurrency") || useSelector((state) => state.storeCurrency);
  const lastAbortController = useRef();
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [hasMore, setHasMore] = useState(true);
  const [coupon, setCoupon] = useState([]);
  const [count, setCount] = useState(1);
  const [coupanDataList, setCouponDataList] = useState([]);
  const [skeletonLoader, setSkeletenLoader] = useState(false);
  const [storeSkeletonArr, setStoreSkeletonArr] = useState([]);
  const [veiw, setview] = useState(false);
  const [veiwId, setveiwId] = useState("");
  const [coupancopied, setCoupancopy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // One Time API call
  const [onceupdated, setOnceupdate] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCoupanVeiw = (data) => {
    setveiwId(data.unique_id);
    if (!veiw) {
      setview(true);
    } else {
      setview(false);
    }
  };
  const UseCoupancode = (data) => {
    coupon?.map((item, i) => {
      if (item.unique_id == data.unique_id) {
        item.check = true;
        let Cuopancode = data.code;
        navigator.clipboard.writeText(Cuopancode);
        setCoupancopy(true);
        toast.success("Coupan Code Copy To Clipboard");
      } else {
        item.check = false;
        setCoupancopy(false);
      }
    });
  };

  //coupan
  const couponData = useCallback(
    (count) => {
      const Dataofcoupon = {
        a: "GetActiveCoupon",
        status: "1",
        store_id: storeEntityIds.mini_program_id,
        per_page: 15,
        number: count,
        type: "B2C",
      };
      setSkeletenLoader(true);
      commanService
        .postLaravelApi("/CouponController", Dataofcoupon)
        .then((res) => {
          if (res.data.success === 1) {
            setCoupon([]);
            const coupaData = res?.data?.data?.result;
            if (coupaData?.length < 15) {
              setHasMore(false);
            }
            let arr = [];
            if (coupaData?.length > 0) {
              for (let a = 0; a < coupaData.length; a++) {
                coupaData[a].check = false;
                arr.push(coupaData[a]);
              }
              setCoupon(arr);
            }
            setCouponDataList(res.data.data);
            setTimeout(() => {
              setSkeletenLoader(false);
            }, 100);
          } else {
            toast.error(res.data.message);
            setSkeletenLoader(false);
            setLoading(false);
          }
        })
        .catch((error) => {
          setSkeletenLoader(true);
        });
    },
    [storeEntityIds]
  );

  const initiallyRenderFunction = useCallback(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      if (!onceupdated) {
        let arr = [];
        for (let i = 0; i < Number(4); i++) {
          arr.push(i);
        }
        setStoreSkeletonArr(arr);
        setOnceupdate(true);
        couponData(count);
      }
    }
  }, [storeEntityIds, onceupdated]);

  useEffect(() => {
    if (!isCallRef.current) {
      initiallyRenderFunction();
      isCallRef.current = true;
    }
  }, [initiallyRenderFunction]);

  const handleChangeRow = (e) => {
    if (lastAbortController.current) {
      lastAbortController.current.abort();
    }
    const currentAbortController = new AbortController();
    lastAbortController.current = currentAbortController;

    if (hasMore === true) {
      setCount(e.toString());
      couponData(e.toString());
    }
  };

  const handleShowMore = () => {
    const totalRows = coupanDataList?.total_pages
      ? coupanDataList?.total_pages
      : 1;
    if (itemsLength.length >= totalRows) {
      setHasMore(false);
      return;
    } else {
      setHasMore(true);
    }
    if (hasMore === true) {
      setTimeout(() => {
        setItemLength(itemsLength.concat(Array.from({ length: 1 })));
        handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length);
      }, 500);
    }
  };

  return (
    <div className="col-lg-9">
      <div className="page-content">
        <div className="title-content">
          <i className="ic_apply_coupon fs-3 pe-3"></i>
          <h3 className="fw-bold mb-0">Available Coupons</h3>
        </div>
        <div className="row">
          {skeletonLoader ? (
            storeSkeletonArr?.map((_, i) => (
              <div className="col-md-6 mb-30px" key={i}>
                <div className="coupon-container bg-white border-light">
                  <div className="coupon-left border-lights-after border-light">
                    <div className="coupon-left-inner">
                      <div className="coupon-up">
                        <Skeleton height={"25px"} />
                      </div>
                      <div className="coupon-date">
                        <Skeleton height={"10px"} />
                        <Skeleton />
                      </div>
                    </div>
                  </div>
                  <div className="coupon-right">
                    <div className="coupon-detail">
                      <div className="coupon-desc">
                        <div>
                          <Skeleton height={"105px"} />
                        </div>
                        <div className="coupon-text">
                          <Skeleton height={"100%"} />
                        </div>
                      </div>
                      <div className="coupon-code border-light">
                        <Skeleton />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : coupon?.length > 0 ? (
            coupon.map((coupanItem, i) => {
              const date =
                coupanItem?.coupon_status === "Upcoming"
                  ? coupanItem?.start_date
                  : coupanItem?.expiry_date;
              const objectDate = new Date(date);
              const ddate = objectDate.getDate();
              const month = objectDate.getMonth() + 1;
              const year = objectDate.getFullYear();

              return (
                <div
                  className="col-md-6 mb-30px"
                  key={coupanItem?.unique_id || i}
                >
                  <div className="coupon-container">
                    <div className="coupon-left">
                      <div className="coupon-left-inner">
                        <div className="coupon-up">
                          <div
                            className={`${
                              coupanItem?.coupon_status === "Expired"
                                ? "coupon-status-expired"
                                : coupanItem?.coupon_status === "Upcoming"
                                ? "coupon-status-upcoming"
                                : "coupon-status"
                            }`}
                          >
                            {coupanItem?.coupon_status}
                          </div>
                        </div>
                        <div className="coupon-date">
                          <div className="fw-medium">
                            {coupanItem?.coupon_status === "Upcoming"
                              ? "Start on"
                              : "Valid till"}
                          </div>
                          <div className="pt-1">
                            {ddate}-{month}-{year}
                          </div>
                        </div>
                        {coupanItem?.terms_and_condition && (
                          <div
                            className="coupon-rule"
                            onClick={() => handleCoupanVeiw(coupanItem)}
                          >
                            <div className="coupon-rule-terms">
                              View T&C
                              {coupanItem?.unique_id === veiwId && veiw && (
                                <OutsideClickHandler
                                  onOutsideClick={() => setview(false)}
                                >
                                  <div
                                    className="terms_conditions"
                                    key={veiwId}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: coupanItem?.terms_and_condition,
                                      }}
                                    ></div>
                                  </div>
                                </OutsideClickHandler>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="coupon-right">
                      <div className="coupon-detail">
                        <div className="coupon-desc">
                          <div className="desc">
                            <div className="coupon-size">
                              {coupanItem?.discount}
                              {coupanItem?.discount_type === "PERCENTAGE" ? (
                                <span>%</span>
                              ) : (
                                <span>{storeCurrencys}</span>
                              )}
                            </div>
                            <div
                              className="coupon-title"
                              title={coupanItem?.name}
                            >
                              {coupanItem?.name}
                            </div>
                          </div>
                          {/* <div className="coupon-text" title={coupanItem?.remark} >
                            {coupanItem?.remark}
                          </div> */}
                          <div className="coupon-info">
                            <div
                              className={`coupon-text ${
                                isExpanded ? "active" : ""
                              }`}
                              dangerouslySetInnerHTML={{
                                __html: coupanItem?.remark,
                              }}
                            ></div>
                            {coupanItem?.remark.length > 60 && (
                              <span
                                className="show_more"
                                onClick={toggleExpand}
                              >
                                {isExpanded ? "Show less" : "Show more"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className="coupon-code"
                          onClick={() => UseCoupancode(coupanItem)}
                        >
                          {coupanItem?.code}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="d-flex justify-content-center w-100">
              <img src="@/assets/images/RecordNotfound.png" loading="lazy" />
            </div>
          )}
        </div>
      </div>
      {skeletonLoader === false && coupon.length > 16 ? (
        <>
          <div className="text-center">
            <button
              className="btn-link btn-link_lg text-uppercase fw-medium"
              onClick={() => handleShowMore()}
            >
              Show More
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default AccountCoupons;
