import { useContextElement } from "@/context/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import Loader from "@/CommanUIComp/Loader/Loader";
import {
  changeUrl,
  isEmpty,
  numberWithCommas,
} from "@/CommanFunctions/commanFunctions";
import {
  diamondNumber,
  diamondPageChnages,
  dimaondColorType,
} from "@/Redux/action";
import { useDispatch } from "react-redux";
import Image from "next/image";

export default function AccountWishlist() {
  const isCallRef = useRef(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { wishList, toggleWishlist, getWishListFavourit, wishlistProducts } =
    useContextElement();

  useEffect(() => {
    if (!isCallRef.current) {
      getWishListFavourit();
      isCallRef.current = true;
    }
  }, []);

  //Navigate url
  const navigateURL = (item) => {
    if (
      item?.data?.[0]?.vertical_code !== "DIAMO" &&
      item?.data?.[0]?.vertical_code !== "LGDIA" &&
      item?.data?.[0]?.vertical_code !== "GEDIA"
    ) {
      const verticalCode = item?.data?.[0]?.vertical_code;
      const title = changeUrl(
        item?.data?.[0]?.product_name + "-" + item.data[0].pv_unique_id
      );
      var megaMenu = JSON.parse(
        sessionStorage.getItem("megaMenus")
      ).navigation_data?.filter(
        (elm) => elm.product_vertical_name === verticalCode
      )[0];

      router.push(`/products/${changeUrl(megaMenu?.menu_name)}/${title}`);
    } else {
      dispatch(diamondPageChnages(true));
      dispatch(diamondNumber(item?.data?.[0]?.st_cert_no));
      dispatch(dimaondColorType(item?.data?.[0]?.st_color_type));
      if (item?.data?.[0]?.vertical_code == "DIAMO") {
        router.push(
          `/certificate-diamond?details=${item?.data?.[0]?.product_name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}-${item?.data?.[0]?.st_cert_no}`
        );
      }
      if (item?.data?.[0]?.vertical_code == "LGDIA") {
        router.push(
          `/lab-grown-certified-diamond?details=${item?.data?.[0]?.product_name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}-${item?.data?.[0]?.st_cert_no}`
        );
      }
      if (item?.data?.[0]?.vertical_code == "GEDIA") {
        router.push(
          `/lab-grown-gemstone?details=${item?.data?.[0]?.product_name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}-${item?.data?.[0]?.st_cert_no}`
        );
      }
    }
  };

  return (
    <div className="col-lg-12">
      <div className="my-account__wishlist">
        {wishlistProducts?.length > 0 ? (
          <div
            className="products-grid row row-cols-1 row-cols-lg-4"
            id="products-grid"
          >
            {" "}
            {wishlistProducts?.map((elm, i) => (
              <div className="product-card-wrapper" key={i}>
                {elm?.data?.length === 1 ? (
                  <div className="product-card mb-3 mb-md-4" onClick={() => navigateURL(elm)}>
                    <div className="pc__img-wrapper">
                      <Swiper
                        resizeObserver
                        className="swiper-container background-img js-swiper-slider"
                        slidesPerView={1}
                        modules={[Navigation]}
                        lazy={"true"}
                        navigation={{
                          prevEl: ".prev" + i,
                          nextEl: ".next" + i,
                        }}
                      >
                        {elm?.data?.map((elm2, i) => (
                          <SwiperSlide key={i} className="swiper-slide">
                            {/* <Link to={`/product1_simple/${elm.id}`}> */}
                            <Image
                              loading="lazy"
                              src={elm2.item_image}
                              width={330}
                              height={330}
                              alt={elm?.data?.[0]?.product_title}
                              className="pc__img"
                              // quality={100}
                            />
                            {/* </Link> */}
                          </SwiperSlide>
                        ))}

                        <span
                          className={`cursor-pointer pc__img-prev ${
                            "prev" + i
                          } `}
                        >
                          <svg
                            width="7"
                            height="11"
                            viewBox="0 0 7 11"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <use href="#icon_prev_sm" />
                          </svg>
                        </span>
                        <span
                          className={`cursor-pointer pc__img-next ${
                            "next" + i
                          } `}
                        >
                          <svg
                            width="7"
                            height="11"
                            viewBox="0 0 7 11"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <use href="#icon_next_sm" />
                          </svg>
                        </span>
                      </Swiper>
                      <button
                        className="btn-remove-from-wishlist"
                        onClick={() => toggleWishlist(elm?.data?.[0])}
                      >
                        <svg width="14" height="14" aria-hidden="true">
                            <use xlinkHref="#icon_close" />
                        </svg>
                      </button>
                    </div>

                    <div className="pc__info position-relative">
                      {/* <p className="pc__category">
                        {elm?.data?.[0]?.product_title}
                      </p> */}
                      <h2
                        className="pc__title cursor-pointer mb-1"
                      >
                        {elm?.data?.[0]?.product_name}
                      </h2>
                      <div className="product-card__price d-flex align-items-center">
                         <span className="money price pe-2 fs-18">
                          {elm?.data?.[0]?.currency}{" "}
                          {Number(
                            elm?.data?.[0]?.store_tax_included_in_price
                          ) === 1
                            ? numberWithCommas(
                                (
                                  Number(elm?.total_tax_amt) +
                                  Number(elm?.item_price)
                                ).toFixed(2)
                              )
                            : elm?.item_price_display}
                        </span>
                        {isEmpty(elm?.data?.[0]?.offer_code) !== "" ? (
                          <span className="money price price-old">
                            {elm?.data?.[0]?.currency}{" "}
                            {Number(
                              elm?.data?.[0]?.store_tax_included_in_price
                            ) === 1
                              ? numberWithCommas(
                                  (
                                    Number(elm?.total_tax_amt) +
                                    Number(elm?.data[0]?.origional_price)
                                  ).toFixed(2)
                                )
                              : Number(elm?.data[0]?.origional_price).toFixed(
                                  2
                                )}
                          </span>
                        ) : (
                          ""
                        )}
                       
                      </div>

                      <button
                        className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist active"
                        title="Remove From Wishlist"
                        onClick={() => toggleWishlist(elm?.data?.[0])}
                        aria-label="Remove From Wishlist"
                      >
                        <svg width="20" height="20" aria-hidden="true" className="wishlist-icon"  >
                            <use xlinkHref="#icon_heart_fill"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="fs-18">No products added to wishlist yet</div>
        )}
        {/* <!-- /.products-grid row --> */}
      </div>
    </div>
  );
}
