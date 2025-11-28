import { useCallback, useEffect, useRef, useState } from "react";
import BreadCumb from "./BreadCumb";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonModal from "@/CommanUIComp/Skeleton/SkeletonModal";
import commanService, { domain } from "@/CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  caratVlaues,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  DIYName,
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
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import Image from "next/image";
import NotFoundImg from "@/assets/images/RecordNotfound.png";

const itemPerRow = [2, 3, 4];

export default function DIYProduct() {
  //state declaration
  const isCallRef = useRef(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const [selectedColView, setSelectedColView] = useState(4);
  const [loading, setLoading] = useState(true);
  const [AllData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [storeItemsObj, setStoreItemsObj] = useState({});
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [storeSkeletonArr, setStoreSkeletonArr] = useState([]);

  //API call to get DIY setup data
  var diyAllData = [];
  const allProductData = useCallback((obj, key) => {
    commanService
      .postApi("/Diy", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const diyData = res.data.data;
          if (key === "1" && diyData) {
            if (diyData.length > 0) {
              var data = [];
              diyAllData = [];
              for (let c = 0; c < diyData.length; c++) {
                data.push(diyData[c]);
                diyAllData.push(diyData[c]);
              }
              setAllData(data);
            }
          } else if (key === "0" && diyData) {
            if (diyData.length > 0) {
              var data = [...diyAllData];
              for (let c = 0; c < diyData.length; c++) {
                data.push(diyData[c]);
              }
              diyAllData = data;
              setAllData(data);
            }
          }
          setLoading(false);
          setHasMore(false);
        } else {
          setAllData([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  //function for click to details of selected Items
  const handleClickNavigate = (item) => {
    dispatch(DIYName(item.name));
    dispatch(storeEmbossingData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(DiySteperData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(engravingObj({}));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(isRegisterModal(false));
    dispatch(filteredData([]));
    dispatch(filterData([]));
    dispatch(isLoginModal(false));
    dispatch(isFilter(false));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(caratVlaues([]));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
    dispatch(diamondSelectShape({}));
    dispatch(serviceAllData([]));
    const stepps = item;

    if (
      stepps?.details &&
      Array.isArray(stepps.details) &&
      stepps.router_link.includes("/start-with-a-item")
    ) {
      const updatedSteps = [
        {
          position: 0,
          display_name: stepps?.from_display_name,
          vertical: stepps?.vertical_code,
        },
        ...stepps.details.map((step, index) => ({
          ...step,
          position: index + 1,
        })),
        { position: stepps.details.length + 1, display_name: "Complete" },
      ];
      dispatch(DiySteperData(updatedSteps));
    } else {
      dispatch(DiySteperData([]));
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("DIYVertical", item.vertical_code);
    }
    if (item.router_link?.includes("/start-with-a-setting")) {
      dispatch(activeDIYtabs("Jewellery"));
    } else {
      dispatch(activeDIYtabs("Diamond"));
    }
    //  Use Next.js router.push instead of navigate
    router.push(`/make-your-customization${item.router_link}`);
  };

  //first call of API for DIY tab setup
  useEffect(() => {
    if (storeEntityIds) {
      let arr1 = [];
      for (let i = 0; i < Number(8); i++) {
        arr1.push(i);
      }
      setStoreSkeletonArr(arr1);
      const obj = {
        SITDeveloper: "1",
        a: "SetupDiyVertical",
        store_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        origin: domain,
        unique_id: "",
      };
      setStoreItemsObj(obj);
      allProductData(obj, "1");
      isCallRef.current = true;
    }
  }, []);

  // const handleChangeRow = (e) => {
  //     if (lastAbortController.current) {
  //         lastAbortController.current.abort();
  //     }
  //     const currentAbortController = new AbortController();
  //     lastAbortController.current = currentAbortController;
  //     const obj = {
  //         ...storeItemsObj,
  //         number: e.toString(),
  //     };
  //     if (clickPageScroll === false) {
  //         allProductData(obj, "0", currentAbortController.signal);
  //     }
  //     window.scrollTo({ top: window.scrollY, behavior: 'smooth' });
  // };

  // const handleShowMore = () => {
  //     const totalRows = AllData?.total_pages ? AllData?.total_pages : 1;
  //     if (itemsLength.length >= totalRows) {
  //         setHasMore(false);
  //         return;
  //     } else {
  //         setHasMore(true);
  //     }
  //     if (clickPageScroll === false) {
  //         setTimeout(() => {
  //             setItemLength(itemsLength.concat(Array.from({ length: 1 })));
  //             handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length);
  //         }, 500);
  //     }
  //     window.scrollTo({ top: window.scrollY, behavior: 'smooth' });
  // };

  var megaMenu = JSON.parse(
    sessionStorage.getItem("megaMenus")
  )?.navigation_data?.filter(
    (item) =>
      item.menu_name?.replaceAll(" ", "-")?.toLowerCase() ===
      "make-your-customization"
  )[0];

  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container">
        <div className="d-flex justify-content-between mb-4 pb-md-2">
          <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
            <BreadCumb /> ({AllData?.length})
          </div>
          {/* <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
            <div className="col-size align-items-center order-1 d-none d-lg-flex">
              <span className="text-uppercase fw-medium me-2">View</span>
              {itemPerRow.map((elm, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColView(elm)}
                  className={`btn-link fw-medium me-2 js-cols-size ${
                    selectedColView == elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div>
          </div> */}
        </div>
        <InfiniteScroll
          className={`products-grid row row-cols-1 row-cols-md-3 row-cols-lg-${selectedColView}`}
          id="products-grid"
          dataLength={AllData?.length}
          // next={handleShowMore}
          hasMore={hasMore}
          scrollThreshold={0.7}
          loader={
            loading === true && (
              <SkeletonModal
                page="product"
                storeSkeletonArr={storeSkeletonArr}
              />
            )
          }
        >
          {AllData?.length > 0
            ? AllData?.map((elm, i) => (
                <div key={i} className="product-card-wrapper">
                  <div className="product-card mb-3 mb-md-4">
                    <div className="pc__img-wrapper">
                      <Swiper
                        className="shop-list-swiper swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden background-img js-swiper-slider"
                        slidesPerView={1}
                        modules={[Navigation]}
                        lazy={"true"}
                        navigation={{
                          prevEl: ".prev" + i,
                          nextEl: ".next" + i,
                        }}
                      >
                        <SwiperSlide className="swiper-slide">
                          <div
                            onClick={() => handleClickNavigate(elm)}
                            className="cursor-pointer"
                          >
                            <Image
                              loading="lazy"
                              src={elm.photo}
                              width="330"
                              height="400"
                              alt={elm.name}
                              className="pc__img"
                            />
                          </div>
                        </SwiperSlide>
                        <span
                          className={`cursor-pointer pc__img-prev ${
                            "prev" + i
                          } `}
                        >
                          <i className="ic_chavron_left"></i>
                        </span>
                        <span
                          className={`cursor-pointer pc__img-next ${
                            "next" + i
                          } `}
                        >
                          <i className="ic_chavron_right"></i>
                        </span>
                      </Swiper>
                    </div>

                    <div
                      className="pc__info position-relative cursor-pointer"
                      onClick={() => handleClickNavigate(elm)}
                    >
                      {/* <p className="pc__category">
                                            {elm.from_display_name}
                                        </p> */}
                      <h2 className="pc__title mb-1">{elm.name}</h2>
                      {/* <button className={`pc__btn-wl bg-transparent border-0 p-0`}>
                                            {elm.button_name}
                                        </button> */}
                    </div>
                  </div>
                </div>
              ))
            : !loading &&
              AllData?.length === 0 && (
                <div className="d-flex justify-content-center w-100">
                  <Image
                    src={NotFoundImg}
                    loading="lazy"
                    width={500}
                    height={500}
                    alt="Record Not found"
                  />
                </div>
              )}
        </InfiniteScroll>
      </section>
    </main>
  );
}
