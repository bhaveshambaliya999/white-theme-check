import { changeUrl, isEmpty } from "@/CommanFunctions/commanFunctions";
import { useContextElement } from "@/context/Context";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function RelatedSlider(props) {

  //State Declerations
  const { isCallRef, relatedProductData, paginationLeftRight,isEndReached, totalPagesRelated, count, setCount, setIsEndReached, setSwiperInstance, swiperInstance, hasMoreRelated } = props
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
const storeCurrencys =
  typeof window !== "undefined"
    ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
    : reduxStoreCurrency;


  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  //Swiper dependencies
  const swiperOptions = {
    autoplay: false,
    slidesPerView: 4,
    slidesPerGroup: 1,
    effect: "none",
    modules: [Navigation],
    // pagination: {
    //   el: "#related_products .products-pagination",
    //   type: "bullets",
    //   clickable: true,
    // },
    navigation: {
      nextEl: ".ssn11",
      prevEl: ".ssp11",
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 14,
        slidesPerGroup: 1,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
        slidesPerGroup: 1,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 30,
        slidesPerGroup: 1,
      },
    },
  };

  //Update state when slide change
  const handleSlideChange = useCallback((swiper) => {
    const { activeIndex, slides, params } = swiper;
    const totalSlides = slides.length;
    const visibleCount = params.slidesPerView;
    const isAtEnd = activeIndex >= totalSlides - visibleCount - 1;
    setIsEndReached(isAtEnd);
  }, [relatedProductData, hasMoreRelated, paginationLeftRight]);

  return (
    relatedProductData && relatedProductData?.length > 0 && (<section className="products-carousel container">
      <h2 className="h3 text-uppercase mb-4 pb-xl-2 mb-xl-4">
        Related <strong>Products</strong>
      </h2>
      <div id="related_products" className="position-relative">
        <Swiper
          {...swiperOptions}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={handleSlideChange}
          className="swiper-container js-swiper-slider"
          onReachEnd={() => {
            if (hasMoreRelated) {
              paginationLeftRight("right");
            }
          }}
          data-settings=""
        >
          {relatedProductData?.map((elm, i) => {
             var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data?.filter((item)=>item.product_vertical_name.toLowerCase() === elm.vertical_code.toLowerCase())[0];
            return (
            <SwiperSlide key={i} className="swiper-slide product-card">
              <div className="pc__img-wrapper">
                <Link href={`/products/${changeUrl(megaMenu?.menu_name)}/${changeUrl(isEmpty(elm.product_name) + "-" + isEmpty(elm.variant_unique_id))}`} onClick={()=>{isCallRef.current = false}}>
                  <img
                    loading="lazy"
                    src={elm?.image_urls[0]}
                    width="330"
                    height="400"
                    alt="Cropped Faux leather Jacket"
                    className="pc__img"
                  />
                  {elm?.image_urls?.length > 1 &&
                    <img
                      loading="lazy"
                      src={elm?.image_urls[1]}
                      width="330"
                      height="400"
                      alt="Cropped Faux leather Jacket"
                      className="pc__img pc__img-second"
                    />}
                </Link>
                {/* <button
                  className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                  onClick={() => addProductToCart(elm, "Product")}
                  title={
                    isAddedToCartProducts(elm.item_id)
                      ? "Already Added"
                      : "Add to Cart"
                  }
                >
                  {isAddedToCartProducts(elm.item_id)
                    ? "Already Added"
                    : "Add To Cart"}
                </button> */}
              </div>

              <div className="pc__info position-relative">
                <p className="pc__category">{elm.jewellery_product_type_name}</p>
                <h2 className="pc__title mb-1">
                  <Link href={`/products/${changeUrl(megaMenu?.menu_name)}/${changeUrl(isEmpty(elm.product_name) + "-" + isEmpty(elm.variant_unique_id))}`}>{elm.product_name}</Link>
                </h2>
                {isEmpty(elm.final_total_display) !== "" && <div className="product-card__price d-flex">
                  <span className="price">{elm.coupon_code ? (
                    <>
                      {" "}
                      <span className="money price-old">
                        {storeCurrencys} {elm.origional_price}
                      </span>
                      <span className="money price-sale">
                        {storeCurrencys} {elm.final_total_display}
                      </span>
                    </>
                  ) : (
                    <span className="money">
                      {storeCurrencys} {elm.final_total_display}
                    </span>
                  )}</span>
                </div>}

                <button
                  className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${isAddedtoWishlist(elm.item_id) ? "active" : ""
                    }`}
                  title="Add To Wishlist"
                  aria-label="Add To Wishlist"
                  onClick={() => toggleWishlist(elm, "Product")}
                >
                  <svg
                    width="20"
                    height="20"
                    aria-hidden="true"
                    className="wishlist-icon"
                    fill="currentColor"
                  >
                    <use
                      xlinkHref={
                        isAddedtoWishlist(elm.item_id) ? "#icon_heart_fill" : "#icon_heart"
                      }
                    />
                  </svg>
                </button>
              </div>
            </SwiperSlide>
          )})}

          {/* <!-- /.swiper-wrapper --> */}
        </Swiper>
        {/* <!-- /.swiper-container js-swiper-slider --> */}

        <div onClick={() => paginationLeftRight("left")} className="cursor-pointer products-carousel__prev ssp11 position-absolute top-50 d-flex align-items-center justify-content-center">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#icon_prev_md" />
            </svg>
        </div>
        {/* <!-- /.products-carousel__prev --> */}
        <div onClick={() => hasMoreRelated && paginationLeftRight("right")} className="cursor-pointer products-carousel__next ssn11 position-absolute top-50 d-flex align-items-center justify-content-center">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_next_md" />
          </svg>
        </div>
        {/* <!-- /.products-carousel__next --> */}

        <div className="products-pagination mt-4 mb-4 d-flex align-items-center justify-content-center"></div>
        {/* <!-- /.products-pagination --> */}
      </div>
    </section>)
  );
}
