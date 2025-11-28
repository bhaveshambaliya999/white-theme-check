import { changeUrl, extractNumber, isEmpty, numberWithCommas } from "@/CommanFunctions/commanFunctions";
import { ActiveStepsDiy, DiySteperData, storeProdData, storeSpecData } from "@/Redux/action";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const DIYSetupAP = ({ position, setTypeViewDiy, activeStep, setActiveStep, setLoading, setSpecificationData, setEngravingData, setSelectedOffer, setEmbossingData }) => {
    //State Declaration
    const dispatch = useDispatch();
   const router = useRouter();
    const DiySteperDatas = useSelector((state) => state.DiySteperData);
    const ActiveStepsDiys = useSelector((state) => state.ActiveStepsDiy);
    const [stepss, setStepss] = useState(DiySteperDatas ?? []);

    //Calculate Price
    const calculateTotalPrice = (data) => {
        return data.reduce((total, item) => {
            const price = parseFloat(extractNumber(item.price));
            const qty = parseFloat(item.qty);
            if (isNaN(price) || isNaN(qty)) {
                return total;
            }
            return total + (price * qty);
        }, 0);
    };
    
    // //State updates
    // useEffect(() => {
    //     setStepss(DiySteperDatas);
    // }, [DiySteperDatas, position]);

    //Onclick function for chnage selected steps
    const handleStepClick = (e, position, data, isLastItem) => {

        if (activeStep >= 0 && activeStep !== position) {
            e.preventDefault();
            if (!data?.product_name && !data?.variant_unique_id && data?.display_name !== "Complete") {
                return
            } else {
                if (data?.display_name === "Complete") {
                    if (DiySteperDatas.some((item) => item.position === DiySteperDatas.length - 2 && isEmpty(item.product_name)!=="")) {
                        setActiveStep(position);
                        dispatch(ActiveStepsDiy(position));
                        setTypeViewDiy(true)
                    } else {
                        return
                    }
                } else {

                    dispatch(storeSpecData([]));
                    dispatch(storeProdData([]));
                    setEngravingData([]);
                    setEmbossingData([]);
                    setActiveStep(position);
                    dispatch(ActiveStepsDiy(position));
                    setTypeViewDiy(false)
                    setSelectedOffer([])
                    sessionStorage.setItem("DIYVertical",data?.vertical)
                    router.push(`/make-your-customization/start-with-a-item/${changeUrl(`${data.product_name + "-" + data.variant_unique_id}`)}`)
                }
            }
        }
    };

    return (
        <div className="container checkout-steps product-stepper mb-3">
            {DiySteperDatas?.map((elm, i) => {
                const isLastItem = i === DiySteperDatas.length - 1;
                return (
                    <div
                        key={i}
                        // onClick={(e) => { if (isLastItem) { return } handleStepClick(e, elm.position, elm) }}
                        onClick={(e) => { handleStepClick(e, elm.position, elm, isLastItem) }}
                        className={`checkout-steps__item cursor-pointer d-flex flex-column ${ActiveStepsDiys === elm.position ? "active" : ""
                            }`}
                    >
                        <div className="d-flex gap-2 align-items-center">
                            <span className="checkout-steps__item-number">{elm.position + 1}</span>
                            <span className="checkout-steps__item-title">
                                <span>{elm.display_name}</span>
                            </span>
                        </div>
                        {elm?.image_urls && elm?.image_urls?.length > 0 ?
                            <div className="d-flex flex-row align-items-center gap-3">
                                <img className="steps-img" src={elm?.image_urls[0]} width={45}
                                    height={45} />
                                <div className="fs-14px h2 mb-0">
                                    {elm?.currency} {elm?.price}
                                </div>
                            </div >
                            : ""}
                        {
                            isEmpty(DiySteperDatas[0]?.currency) !== "" && isEmpty(elm.position) !== "" && isEmpty(elm.position + 1) === DiySteperDatas?.length && (
                                <div className="fs-14px h2 mb-0">Total {DiySteperDatas[0]?.currency} {numberWithCommas(Number(calculateTotalPrice(DiySteperDatas)).toFixed(2))}</div>
                            )
                        }
                    </div>
                )
            })
            }
        </div >
    );
};

export default DIYSetupAP;
