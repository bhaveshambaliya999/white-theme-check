import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { isEmpty } from "../../../CommanFunctions/commanFunctions";
import commanService from "../../../CommanService/commanService";
import Loader from "../../../CommanUIComp/Loader/Loader";
import Image from "next/image";
import { sectionDetailsData } from "@/Redux/action";

export default function Hero({ storeData, useSliderState, useJourneyList }) {
  const isCallRef = useRef(false);
  const isJourneyFetched = useRef(false);
  const dispatch = useDispatch();
  const storeEntityIds =
    useSelector((state) => state.storeEntityId) || storeData;

  const [sliderData, setSliderData] = useSliderState([]);
  const [journeyList, setJourneyList] = useJourneyList([]);
  const [loader, setLoader] = useState(false);

  // Fetch home section details
  const handleGetSectionData = useCallback(() => {
    setLoader(true);
    const obj = {
      a: "getHomeSectionDetail",
      store_id: storeEntityIds.mini_program_id,
      origin: storeEntityIds.origin,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      SITDeveloper: "1",
      type: "B2C",
    };

    commanService.postApi("/StoreCart", obj).then((res) => {
      if (res.data.success === 1) {
        const data = res.data.data;
        setSliderData(data);
        dispatch(sectionDetailsData(data));
        setLoader(false);
      } else {
        setLoader(false);
      }
    });
  }, [storeEntityIds]);

  const getJourneyDetails = useCallback(() => {
    const obj = {
      a: "GetJourney",
      store_id: storeEntityIds.mini_program_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      origin: storeEntityIds.origin,
      SITDeveloper: "1",
      store_type: "B2C",
      unique_id: "",
    };
    setLoader(true);
    commanService.postApi("/StoreCart", obj).then((res) => {
      setJourneyList(res.data.data);
      setLoader(false);
    });
  }, [storeEntityIds]);

  // Call API on mount
  useEffect(() => {
    if (
      !isCallRef.current &&
      storeEntityIds &&
      Object.keys(storeEntityIds).length > 0 &&
      !sliderData?.slider_data?.length
    ) {
      // window.scrollTo(0, 0);
      handleGetSectionData();
      isCallRef.current = true;
    }
  }, [storeEntityIds, handleGetSectionData]);

  const handleScrollToFetchJourney = useCallback(() => {
    if (isJourneyFetched.current) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    const scrolledRatio = (scrollTop + windowHeight) / fullHeight;

    if (scrolledRatio >= 0.7) {
      if (!journeyList?.length) {
        getJourneyDetails();
        isJourneyFetched.current = true; // set flag only after calling API
      } else {
        isJourneyFetched.current = true;
      }
    }
  }, [getJourneyDetails, journeyList]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollToFetchJourney);

    return () => {
      window.removeEventListener("scroll", handleScrollToFetchJourney);
    };
  }, [handleScrollToFetchJourney]);

  if (!sliderData?.slider_data?.length) return loader && <Loader />;

  // Swiper configuration
  const swiperOptions = {
    autoplay: { delay: 7000 },
    modules: [Autoplay, EffectFade, Pagination],
    slidesPerView: 1,
    effect: "fade",
    loop: sliderData.slider_data.length > 1,
    pagination: {
      el: ".slideshow-pagination",
      type: "bullets",
      clickable: true,
    },
  };
  return (
    <>
      {loader && <Loader />}
      {sliderData && sliderData?.slider_data?.length > 0 && (
        <Swiper
          {...swiperOptions}
          className="swiper-container js-swiper-slider slideshow slideshow-md swiper-container-fade swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
        >
          {sliderData?.slider_data.map((elm, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <div className="overflow-hidden position-relative h-100">
                <Link
                  className="slideshow-bg"
                  href={
                    isEmpty(elm.button_link_1)
                      ? elm.button_link_1
                      : isEmpty(elm.button_link_2)
                      ? elm.button_link_2
                      : ""
                  }
                  aria-label={elm?.text || `Banner slide ${i + 1}`}
                >
                  <picture>
                    <Image
                      src={elm.slider}
                      alt={elm.text}
                      layout="fill"
                      priority={i === 0}
                      loading={"eager"}
                      decoding="async"
                      placeholder="blur"
                      blurDataURL="/placeholder.jpg"
                      objectFit="cover"
                      className="slideshow-bg__img"
                      fetchPriority={"high"}
                      // quality={100}
                      // unoptimized={true}
                    />
                  </picture>
                </Link>
                <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                  <h3 className="text_dash text-uppercase fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                    {elm.text}
                  </h3>
                  <h2 className="text-uppercase h1 fw-normal  animate animate_fade animate_btt animate_delay-5">
                    {elm.text}
                  </h2>
                  {elm.description ? (
                    <p className="animate animate_fade mb-4 animate_btt animate_delay-6">
                      {elm.description.split(" ").slice(0, 7).join(" ")}
                      <br />
                      {elm.description.split(" ").slice(7).join(" ")}
                    </p>
                  ) : (
                    ""
                  )}
                  <div className="d-flex flex-wrap">
                    {isEmpty(elm.button_link_1) != "" &&
                    isEmpty(elm.button_title_1) != "" ? (
                      <Link
                        className="btn-link btn-link_sm default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        href={elm.button_link_1}
                        aria-label={elm?.text || `Button Link ${index + 1}`}
                      >
                        {elm.button_title_1}
                      </Link>
                    ) : (
                      ""
                    )}
                    {isEmpty(elm.button_link_1) != "" &&
                    isEmpty(elm.button_link_2) != "" ? (
                      <span className="px-sm-4 text-secondary">OR</span>
                    ) : (
                      ""
                    )}
                    {isEmpty(elm.button_link_2) != "" &&
                    isEmpty(elm.button_title_2) != "" ? (
                      <Link
                        className="btn-link btn-link_sm default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        href={elm.button_link_2}
                        aria-label={elm?.text || `Button Link 2 ${index + 1}`}
                      >
                        {elm.button_title_2}
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* <!-- /.slideshow-wrapper js-swiper-slider --> */}

          <div className="slideshow-pagination position-left-center"></div>
          {/* <!-- /.products-pagination --> */}
        </Swiper>
      )}
    </>
  );
}
