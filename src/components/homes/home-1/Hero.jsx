import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import { useCallback, useEffect, useState } from "react";
import commanService from "@/CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";
import { sectionDetailsData } from "@/Redux/action";
import Loader from "@/CommanUIComp/Loader/Loader";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import Image from "next/image";
export default function Hero() {
  const dispatch = useDispatch();
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const socialUrlDatas = useSelector((state) => state.socialUrlData);
  const [sliderData, setSliderData] = useState([]);
  const [loader, setLoader] = useState(false);

  const handleGetSectionData = useCallback(() => {
    setLoader(true);
    const obj = {
      a: "getHomeSectionDetail",
      store_id: storeEntityIds.mini_program_id,
      type: "B2C",
    };
    commanService.postLaravelApi("/SectionDetail", obj).then((res) => {
      if (res.data.success === 1) {
        const data = res.data.data;
        setSliderData(data.slider_data);
        dispatch(sectionDetailsData(res?.data?.data));
        setLoader(false);
      }
    });
  }, [storeEntityIds]);

  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      // window.scrollTo(0, 0);
      handleGetSectionData();
    }
  }, [storeEntityIds]);

  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    slidesPerView: 1,
    modules: [Pagination, EffectFade],
    effect: "fade",
    loop: sliderData.length > 1,
    pagination: {
      el: ".slideshow-pagination",
      type: "bullets",
      clickable: true,
    },
    slidesPerGroup: 1,
  };
  return loader ? (
    <Loader />
  ) : (
    <>
      {sliderData.length > 0 && (
        <Swiper
          style={{ maxWidth: "100%", overflow: "hidden" }}
          lazy={"true"}
          className="swiper-container js-swiper-slider slideshow full-width_padding swiper-container-fade swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
          {...swiperOptions}
        >
          {" "}
          {sliderData.map((elm, i) => (
            <SwiperSlide
              key={i}
              className="swiper-slide full-width_border border-1"
              style={{ borderColor: "#f5e6e0" }}
            >
              <div className="overflow-hidden position-relative h-100">
                <div
                  className="slideshow-bg"
                  style={{ backgroundColor: "#f5e6e0" }}
                >
                  <Image
                    loading="lazy"
                    src={elm.slider}
                    width={1761}
                    height={778}
                    alt={elm.text}
                    className="slideshow-bg__img object-fit-cover"
                    layout="responsive"
                    fetchPriority="high"
                    // quality={100}
                  />
                </div>
                
                <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                 

                  {i === 0 ? (
                    <h1 className="text-uppercase h1 fw-bold mb-0 animate animate_fade animate_btt animate_delay-5">{elm.text}</h1>
                  ) : (
                    <h2 className="text-uppercase h1 fw-bold mb-0 animate animate_fade animate_btt animate_delay-5">{elm.text}</h2>
                  )}

                  {elm.description ? (
                    <h2 className="text-uppercase h1 fw-normal animate animate_fade animate_btt animate_delay-5">
                      {elm.description}
                    </h2>
                  ) : (
                    ""
                  )}
                  {/* {elm.text4 ? (
                <h6 className="text-uppercase mb-5 animate animate_fade animate_btt animate_delay-3">
                  {elm.text4}
                </h6>
              ) : (
                ""
              )} */}
                  <div className="d-flex flex-wrap">
                    {isEmpty(elm.button_link_1) != "" &&
                      isEmpty(elm.button_title_1) != "" ? (
                      <Link
                        className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        href={elm.button_link_1}
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
                        className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        href={elm.button_link_2}
                      >
                        {elm.button_title_2}
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                  {/* <Link
                href={elm.button_link_1}
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
              >
                {elm.button_title_1}
              </Link> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="container">
            <div className="slideshow-pagination d-flex align-items-center position-absolute bottom-0 mb-5"></div>
            {/* <!-- /.products-pagination --> */}
          </div>
          {/* <!-- /.container --> */}
          <div className="slideshow-social-follow d-none d-xxl-block position-absolute top-50 start-0 translate-middle-y text-center">
            <ul className="social-links list-unstyled mb-0 text-secondary">
              {socialUrlDatas?.map((s, i) => (
                <li key={i}>
                  <a
                    className="footer__social-link d-block"
                    target={"_blank"}
                    href={s.url}
                  >
                    <img
                      src={s.image}
                      alt=""
                      className="img-fluid"
                      style={{ width: "15px" }}
                    ></img>
                  </a>
                </li>
              ))}
            </ul>
            {/* <!-- /.social-links list-unstyled mb-0 text-secondary --> */}
            <span className="slideshow-social-follow__title d-block mt-5 text-uppercase fw-medium text-secondary">
              Follow Us
            </span>
          </div>
          {/* <!-- /.slideshow-social-follow --> */}
          <a
            href="#section-collections-grid_masonry"
            className="slideshow-scroll d-none d-xxl-block position-absolute end-0 bottom-0 text_dash text-uppercase fw-medium"
          >
            Scroll
          </a>
        </Swiper>
      )}
      {/* <div className="mb-3 mb-xl-5 pb-1 pb-xl-5"></div> */}
    </>
  );
}
