import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  allFilteredData,
  caratVlaues,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  DiySteperData,
  engravingObj,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  isLoginModal,
  isRegisterModal,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  previewImageDatas,
  saveEmbossings,
  serviceAllData,
  storeActiveFilteredData,
  storeDiamondArrayImage,
  storeDiamondNumber,
  storeEmbossingData,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
import { numberWithCommas } from "@/CommanFunctions/commanFunctions";
import Image from "next/image";

export default function DIYSteps(props) {

  //State Declarations
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activePathIndex, setactivePathIndex] = useState("Clear");
  const dispatch = useDispatch();
  const storeSelectedDiamondDatas = useSelector(
    (state) => state.storeSelectedDiamondData
  );
  const jeweleryDIYimages = useSelector((state) => state.jeweleryDIYimage);
  const diamondDIYimages = useSelector((state) => state.diamondDIYimage);
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;

  const activeDIYtabss = useSelector((state) => state.activeDIYtabs);
  const addedDiamondDatas = useSelector((state) => state.addedDiamondData);
  const addedRingDatas = useSelector((state) => state.addedRingData);
  const storeSpecDatas = useSelector((state) => state.storeSpecData);
  const saveEmbossingss = useSelector((state) => state.saveEmbossings);
  const storeEmbossingDatas = useSelector((state) => state.storeEmbossingData);

  const storeSelectedDiamondPrices = useSelector(
    (state) => state.storeSelectedDiamondPrice
  );

  const extractNumber = (str) =>
    typeof str === "string" ? parseFloat(str.replace(/[^0-9.]/g, "")) : 0;
  const data = props.finalCanBeSet?.[0]?.no_of_stone_array;
  const [selectedDiamond, setSelectedDiamond] = useState(
    data ?? storeSelectedDiamondDatas
  );
  const [totalDiamondPrice, setTotalDiamondPrice] = useState(0);
  //Get total Price for selected Diamonds
  useEffect(() => {
    const shouldReset =
      props.resetTrigger

    if (shouldReset) {
      setSelectedDiamond([]);
      setTotalDiamondPrice(0);
      // 🔥 Clear Redux store too
      dispatch(storeSelectedDiamondData([]));
      dispatch(storeSelectedDiamondPrice(0));
    }
  }, [props.resetTrigger, addedRingDatas, props.finalCanBeSet]);

  useEffect(() => {
    if (selectedDiamond && selectedDiamond.length > 0) {
      dispatch(storeSelectedDiamondData(selectedDiamond));
      const totalPrice = selectedDiamond
        .flatMap((diamond) => diamond.stone_arr || [])
        .map(
          (item) =>
            parseFloat(item?.ex_store_price_display?.replace(/,/g, "")) || 0
        )
        .reduce((acc, price) => acc + price, 0);
      const formattedTotalPrice = numberWithCommas(
        Number(totalPrice)?.toFixed(2)
      );

      setTotalDiamondPrice(formattedTotalPrice);
      dispatch(storeSelectedDiamondPrice(formattedTotalPrice));
    }
  }, [props.finalCanBeSet, selectedDiamond, props.resetTrigger]);

  //Get Certificate Number with format
  const certificateNumbers =
    selectedDiamond?.length > 0
      ? selectedDiamond
          .flatMap((item) => item?.stone_arr || [])
          .map((stone) => stone?.st_cert_no)
          .filter((certNo) => certNo)
      : [];

  //Get diamonds currency code
  const currency_diamond =
    selectedDiamond?.length > 0
      ? selectedDiamond
          .flatMap((item) => item?.stone_arr || [])
          .map((stone) => stone?.currency_code)
      : [];

  //Selected Index Update for stepper
  useEffect(() => {
    const activeTab = steps.filter((elm) => elm.id == activeDIYtabss)[0];

    const activeTabIndex = activeTab?.id;
    setactivePathIndex(activeTabIndex);
  }, [pathname]);

  //DIY stepper All Steps
  const steps = [
    {
      id: "Clear",
      title: "Design Your Ring",
      description: "Clear Ring",
    },
    {
      id: pathname.includes("/start-with-a-setting") ? "Jewellery" : "Diamond",
      number: "1.",
      img: pathname.includes("/start-with-a-setting") ? (
        jeweleryDIYimages !== "" ? (
          <Image
            src={jeweleryDIYimages}
            width={70}
            height={70}
            alt="Product Image"
          />
        ) : (
          <i className="ic_step_setting fs-40px" />
        )
      ) : addedDiamondDatas.display_image ? (
        <Image
          src={addedDiamondDatas.display_image}
          width={70}
          height={70}
          alt="Product Image"
        />
      ) : (
        <i className="ic_step_diamond fs-40px"></i>
      ),
      title: pathname.includes("/start-with-a-setting")
        ? "Design Your Ring"
        : "Select a Diamond",
      description: {
        sku: pathname.includes("/start-with-a-setting")
          ? props.productSKU && (
              <span className="fw-600">
                {" "}
                SKU : <span>{props.productSKU}</span>
              </span>
            )
          : addedDiamondDatas.st_cert_no && (
              <span className="fw-600">
                {" "}
                Certificate :<span>{addedDiamondDatas.st_cert_no}</span>
              </span>
            ),
        price: pathname.includes("/start-with-a-setting") ? (
          props.finalTotal && props.finalTotal !== 0 ? (
            <span>
              {storeCurrencys}{" "}
              {props.calculatePrice(storeSpecDatas, props.selectedOffer, props.isEngraving, props.isEmbossing, props.embossingData, props.serviceData)}
            </span>
          ) : (
            ""
          )
        ) : (
          storeCurrencys &&
          addedDiamondDatas.ex_store_price_display && (
            <span>
              {addedDiamondDatas?.currency_code}{" "}
              {addedDiamondDatas.final_total_display}
            </span>
          )
        ),
      },
    },
    {
      id: pathname.includes("/start-with-a-setting") ? "Diamond" : "Jewellery",
      number: "2.",
      img: pathname.includes("/start-with-a-setting") ? (
        diamondDIYimages !== "" ? (
          <Image
            src={diamondDIYimages}
            width={70}
            height={70}
            alt="Product Image"
          />
        ) : (
          <i className="ic_step_diamond fs-40px"></i>
        )
      ) : addedRingDatas?.images?.[0] ? (
        <Image
          src={addedRingDatas?.images?.[0]}
          width={70}
          height={70}
          alt="Product Image"
        />
      ) : (
        <i className="ic_step_setting fs-40px" />
      ),
      title: pathname.includes("/start-with-a-setting")
        ? "Select a Diamond"
        : "Design Your Ring",
      description: {
        certi: pathname.includes("/start-with-a-setting")
          ? selectedDiamond && (
              <div className="d-flex flex-column">
                {totalDiamondPrice !== "0" &&
                  certificateNumbers?.length > 0 && (
                    <span className="fs-12px fw-600">
                      <span> Certificate </span>:{" "}
                      {certificateNumbers.toString()}
                    </span>
                  )}
                {totalDiamondPrice !== "0" &&
                  certificateNumbers?.length > 0 && (
                    <span className="fs-12px fw-600">
                      {currency_diamond[0]}{" "}
                      {numberWithCommas(storeSelectedDiamondPrices)}
                    </span>
                  )}
              </div>
            )
          : addedRingDatas.variant_data?.length && (
              <div className="d-flex flex-column">
                <span className="fs-12px fw-600">
                  <span> SKU </span>:{" "}
                  {addedRingDatas.variant_data?.[0].product_sku}
                </span>

                <span className="fs-12px fw-600">
                  {storeCurrencys}{" "}
                {numberWithCommas(props.calculatePrice(storeSpecDatas ?? addedRingDatas, props.selectedOffer, props.isEngraving, props.isEmbossing, props.embossingData, props.serviceData))}
                  {/* {numberWithCommas(
                  props.isOffers && props.selectedOffer.length > 0
                    ? props.selectedOffer?.[0]?.final_total_display
                    : storeSpecDatas.final_total_display ??
                    addedRingDatas.final_total_display
                )} */}
                </span>
              </div>
            ),
      },
    },
    {
      id: "Complete",
      number: "3.",
      img: pathname.includes("/start-with-a-setting") ? (
        props.complete === true && jeweleryDIYimages !== "" ? (
          <Image
            src={jeweleryDIYimages}
            width={70}
            height={70}
            alt="Product Image"
          />
        ) : (
          <i className="ic_certi_diamond_jewelry fs-40px"></i>
        )
      ) : addedRingDatas?.images?.[0] ? (
        <Image
          src={addedRingDatas?.images?.[0]}
          width={70}
          height={70}
          alt="Product Image"
        />
      ) : (
        <i className="ic_certi_diamond_jewelry fs-40px"></i>
      ),
      title: "Complete",
      description: {
        total: pathname.includes("/start-with-a-diamond") ? (
          // storeCurrencys &&
          //   (addedDiamondDatas.final_total_display ||
          //     addedRingDatas.final_total_display) ? (
          //   <div className="fs-6 fw-600">
          //     {props.isEngraving
          //       ? props.specificationData.engraving_price
          //         ? storeCurrencys +
          //         " " +
          //         numberWithCommas(
          //           (
          //             extractNumber(props.specificationData.engraving_price) +
          //             extractNumber(addedDiamondDatas.final_total_display) +
          //             extractNumber(
          //               props.isOffers && props.selectedOffer.length > 0
          //                 ? props.selectedOffer?.[0]?.final_total_display
          //                 : storeSpecDatas.final_total_display ??
          //                 addedRingDatas.final_total_display
          //             )
          //           ).toFixed(2)
          //         )
          //         : storeCurrencys +
          //         " " +
          //         numberWithCommas(
          //           (
          //             extractNumber(addedDiamondDatas.final_total_display) +
          //             extractNumber(
          //               props.isOffers && props.selectedOffer.length > 0
          //                 ? props.selectedOffer?.[0]?.final_total_display
          //                 : storeSpecDatas.final_total_display ??
          //                 addedRingDatas.final_total_display
          //             )
          //           ).toFixed(2)
          //         )
          //       : storeCurrencys +
          //       " " +
          //       numberWithCommas(
          //         (
          //           extractNumber(addedDiamondDatas.final_total_display) +
          //           extractNumber(
          //             props.isOffers && props.selectedOffer.length > 0
          //               ? props.selectedOffer?.[0]?.final_total_display
          //               : storeSpecDatas.final_total_display ??
          //               addedRingDatas.final_total_display
          //           )
          //         ).toFixed(2)
          //       )}
          //   </div>
          // ) : (
          //   ""
          // )
          storeCurrencys &&
          (addedDiamondDatas.final_total_display ||
            addedRingDatas.final_total_display) ? (
            <div className="fs-6 fw-600">
              {storeCurrencys} {" "} {numberWithCommas((extractNumber(props.calculatePrice(storeSpecDatas ?? addedRingDatas, props.selectedOffer, props.isEngraving, props.isEmbossing, props.embossingData, props.serviceData)) + extractNumber(addedDiamondDatas.final_total_display !== "" ? addedDiamondDatas.final_total_display : 0)).toFixed(2))}
            </div>
          ) : (
            ""
          )
        ) : storeCurrencys && props.salesTotalPrice ? (
          <div className="fs-6 fw-600">
            {storeCurrencys}{" "}
            {numberWithCommas(
              (
                extractNumber(
                  props.calculatePrice(storeSpecDatas, props.selectedOffer, props.isEngraving, props.isEmbossing, props.embossingData, props.serviceData)
                ) + extractNumber(storeSelectedDiamondPrices)
              ).toFixed(2)
            )}
          </div>
        ) : (
          ""
        ),
      },
    },
  ];

  //OnClick of Clear ring
  const handleClearRing = () => {
    if (pathname.includes("/start-with-a-setting")) {
      dispatch(isRegisterModal(false));
      dispatch(filteredData([]));
      dispatch(filterData([]));
      dispatch(isLoginModal(false));
      dispatch(isFilter(false));
      dispatch(storeItemObject({}));
      dispatch(storeFilteredDiamondObj({}));
      dispatch(storeActiveFilteredData({}));
      dispatch(storeFilteredData({}));
      dispatch(diamondPageChnages(false));
      dispatch(diamondNumber(""));
      dispatch(storeSelectedDiamondPrice(""));
      dispatch(jeweleryDIYimage(""));
      dispatch(diamondDIYimage(""));
      dispatch(finalCanBeSetData([]));
      dispatch(caratVlaues([]));
      // dispatch(activeDIYtabs("Jewellery"));
      dispatch(activeDIYtabs("Jewellery"));
      dispatch(storeSpecData({}));
      dispatch(storeProdData({}));
      dispatch(storeSelectedDiamondData([]));
      dispatch(jeweleryDIYName(""));
      dispatch(jeweleryDIYimage(""));
      dispatch(diamondDIYimage(""));
      dispatch(storeDiamondNumber(""));
      dispatch(addedRingData({}));
      dispatch(IsSelectedDiamond(false));
      dispatch(isRingSelected(false));
      dispatch(addedDiamondData({}));
      dispatch(storeDiamondArrayImage({}));
      dispatch(diamondImage(""));
      dispatch(diamondShape(""));
      dispatch(diamondSelectShape({}));
      dispatch(storeEmbossingData([]));
      dispatch(saveEmbossings(false));
      dispatch(previewImageDatas([]));
      dispatch(activeImageData([]));
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
      dispatch(engravingObj({}));
      dispatch(serviceAllData([]));
      // sessionStorage.removeItem("DIYVertical");
      sessionStorage.removeItem("itemToItemData");
      router.push("/make-your-customization/start-with-a-setting");
      // window.location.reload();
    } else {
      router.push("/make-your-customization/start-with-a-diamond");
      dispatch(diamondPageChnages(false));
      dispatch(storeFilteredData({}));
      dispatch(storeActiveFilteredData({}));
      dispatch(diamondNumber(""));
      dispatch(storeDiamondNumber(""));
      dispatch(addedRingData({}));
      dispatch(activeDIYtabs("Diamond"));
      dispatch(IsSelectedDiamond(false));
      dispatch(isRingSelected(false));
      dispatch(addedDiamondData({}));
      dispatch(finalCanBeSetData([]));
      dispatch(storeSpecData({}));
      dispatch(diamondImage(""));
      dispatch(diamondShape(""));
      dispatch(storeEmbossingData([]));
      dispatch(saveEmbossings(false));
      dispatch(previewImageDatas([]));
      dispatch(activeImageData([]));
      dispatch(engravingObj({}));
      if (props.setShowDiamondDetails) {
        props.setShowDiamondDetails(false);
      }
    }
  };

  return (
    <div className="container checkout-steps product-stepper mb-3">
      {steps.map((elm, i) => (
        <div
          key={i}
          onClick={() => {
            if (elm.id === "Clear") {
              handleClearRing();
            } else if (elm.id === "Jewellery") {
              if (pathname.includes("/start-with-a-diamond")) {
                if (addedRingDatas.variant_data?.length > 0) {
                  if (props.diamondStepTwo) {
                    props.diamondStepTwo();
                    dispatch(isRingSelected(false));
                    dispatch(activeDIYtabs("Jewellery"));
                    router.push(
                      `/make-your-customization/start-with-a-diamond/jewellery/${addedRingDatas?.variant_data[0]?.product_name
                        ?.replaceAll(" ", "-")
                        ?.toLowerCase()}-${addedRingDatas?.variant_data[0]?.variant_unique_id?.toLowerCase()}`
                    );
                  } else {
                    dispatch(isRingSelected(false));
                    dispatch(activeDIYtabs("Jewellery"));
                    router.push(
                      `/make-your-customization/start-with-a-diamond/jewellery/${addedRingDatas?.variant_data[0]?.product_name
                        ?.replaceAll(" ", "-")
                        ?.toLowerCase()}-${addedRingDatas?.variant_data[0]?.variant_unique_id?.toLowerCase()}`
                    );
                  }
                }
              } else if (props.handleFirstStep) {
                props.handleFirstStep();
                dispatch(activeDIYtabs(elm.id));
              }
            } else if (elm.id === "Diamond") {
              if (pathname.includes("/start-with-a-diamond")) {
                if (addedRingDatas.variant_data?.length) {
                  props.diamondStepFirst();
                } else {
                }
              } else {
                if (typeof props.handleBackToDiamond === "function") {
                  if (props.complete === true) {
                    props.handleBackToDiamond();
                    dispatch(activeDIYtabs("Diamond"));
                  }
                }
              }
            } else if (elm.id === "Complete") {
              if (pathname.includes("/start-with-a-diamond")) {
                if (typeof props.diamondComplete === "function") {
                  props.diamondComplete();
                  dispatch(activeDIYtabs("Complete"));
                } else if (addedRingDatas.variant_data?.length > 0) {
                  dispatch(activeDIYtabs("Complete"));
                  router.push(
                    `/make-your-customization/start-with-a-diamond/jewellery/${addedRingDatas?.variant_data[0]?.product_name
                      .replaceAll(" ", "-")
                      .toLowerCase()}-${addedRingDatas?.variant_data[0]?.variant_unique_id?.toLowerCase()}`
                  );
                }
              } else {
                if (typeof props.handleComplete === "function") {
                  if (props.complete === true) {
                    props.handleComplete();
                    dispatch(activeDIYtabs("Complete"));
                  }
                } else {
                }
              }
            }
          }}
          className={`checkout-steps__item cursor-pointer ${
            elm.id === "Clear" ? "clearRing" : ""
          } ${elm.id === "Complete" ? "completeStep" : ""} ${
            elm.id === activeDIYtabss ? "active" : ""
          }`}
        >
          {elm.id !== "Clear" && <div className="steps-img">{elm?.img}</div>}
          {elm.id !== "Clear" && (
            <span className="checkout-steps__item-number">{elm.number}</span>
          )}
          <div className="d-flex gap-2">
            <span className="checkout-steps__item-title">
              <span>{elm.title}</span>
              <em className="d-flex flex-column">
                {/* {Object.keys(elm.description).length > 0 ? (
                  <em>{elm.description.sku}</em>
                ) : (
                  ""
                )}
                {Object.keys(elm.description).length > 0 ? (
                  <em>{elm.description.price}</em>
                ) : (
                  ""
                )} */}
                {i === 1 ? (
                  <>
                    <span>{elm.description.sku}</span>
                    <span>{elm.description.price}</span>
                  </>
                ) : (
                  ""
                )}
                {i === 0 ? elm.description : ""}
                {i === 2 ? elm.description.certi : ""}
                {i === 3 ? elm.description.total : ""}
              </em>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
