import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useContextElement } from "../../../context/Context";
const filterCategories = ["Featured", "Best Seller", "Sales"];

import { useCallback, useEffect, useState } from "react";
import commanService from "../../../CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  filterData,
  filteredData,
  isFilter,
  mostSearchProductData,
  sectionDataListsProduct,
  storeItemObject,
} from "../../../Redux/action";
import Loader from "../../../CommanUIComp/Loader/Loader";
import {
  changeUrl,
  extractNumber,
  isEmpty,
  numberWithCommas,
  RandomId,
} from "../../../CommanFunctions/commanFunctions";
import Image from "next/image";

export default function Products2({
  storeData,
  useSliderState,
  useSectionDataList,
}) {
  // State Declerations
  // const isCallRef = useRef(false)
  const storeEntityIds = storeData;
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;

  const [sectionDetailsDatas, setSectionDetailsDatas] = useSliderState([]);

  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [mostSearchProductList, setMostSearchProductList] = useState([]);
  const [sectionDataLists, setSectionDataLists] = useSectionDataList([]);
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const [currency, setCurrency] = useState(storeCurrencys);
  // eslint-disable-next-line no-unused-vars

  //On change currency update
  useEffect(() => {
    if (storeCurrencys) {
      setCurrency(storeCurrencys);
      // window.scrollTo(0, 0);
    }
  }, [storeCurrencys]);

  //Get product data according to segment, dimension and item group
  const productData = useCallback(
    (sectionDataList, type, mainData, index) => {
      setLoader(true);
      const objProduct = {
        a: "getStoreItems",
        SITDeveloper: "1",
        miniprogram_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        per_page: "15",
        number: "1",
        // filters: `[{"key":"mi_jewellery_product_type","value": ["${type}"] }]`,
        filters: "[]",
        from_price: "",
        to_price: "",
        extra_currency: storeCurrencys,
        secret_key: storeEntityIds.secret_key,
        product_diy: "PRODUCT",
        store_type: "B2C",
        vertical_code: sectionDataList?.vertical_code,
        user_id:
          loginDatas && Object.keys(loginDatas)?.length > 0
            ? loginDatas.member_id
            : RandomId,
        // view_price: "NO",
      };
      // if (isEmpty(sectionDataList.finish_type) != "") {
      //   objProduct.filters = `[{"key":"mi_jewellery_product_type","value": ["${type}"] },{"key":"master_jewelry_type","value": ["${sectionDataList.finish_type}"] }]`;
      // }
      if (isEmpty(sectionDataList?.dimension) !== "") {
        objProduct.dimension = sectionDataList?.dimension;
      }
      if (isEmpty(sectionDataList?.segment) !== "[]") {
        objProduct.segments = sectionDataList?.segment;
      }
      if (isEmpty(sectionDataList?.item_group) !== "") {
        objProduct.item_group = sectionDataList?.item_group;
      }
      commanService
        .postApi("/EmbeddedPageMaster", objProduct)
        .then((res1) => {
          if (res1.data.success === 1) {
            const datas = res1?.data?.data?.resData;
            if (datas.length > 0) {
              var ProductList = [];
              for (let d = 0; d < datas?.length; d++) {
                // if (
                //   isEmpty(datas[d].jewellery_product_type)
                // ) {
                //   ProductList.push(datas[d]);
                // }
                // if (isEmpty(sectionDataList.finish_type) != "") {
                ProductList.push(datas[d]);
                // }
              }
              sectionDataList.ProductList = ProductList;
              mainData[index] = sectionDataList;
              setSectionDataLists([...mainData]);
              dispatch(sectionDataListsProduct([...mainData]));
              setLoader(false);
            } else {
              sectionDataList.ProductList = [];
              mainData[index] = sectionDataList;
              setSectionDataLists([...mainData]);
              dispatch(sectionDataListsProduct([...mainData]));
              setLoader(false);
            }
          } else {
            setLoader(false);
          }
        })
        .catch(() => {
          setLoader(false);
        });
    },
    [isLogin, sectionDetailsDatas, currency]
  );

  //Filter product data according to Products section type
  const getProductData = useCallback(() => {
    if (sectionDetailsDatas.section_data?.length > 0) {
      for (let c = 0; c < sectionDetailsDatas.section_data?.length; c++) {
        if (sectionDetailsDatas.section_data[c]?.section_type === "PRODUCTS") {
          if (
            isEmpty(sectionDetailsDatas.section_data[c]?.vertical_code) !== ""
          ) {
            productData(
              sectionDetailsDatas.section_data[c],
              sectionDetailsDatas.section_data[c].product_type,
              sectionDetailsDatas.section_data,
              c
            );
          }
        }
      }
    }
  }, [sectionDetailsDatas, currency]);

  //API call for Get Product Data
  useEffect(() => {
    if (
      storeEntityIds &&
      Object.keys(storeEntityIds)?.length > 0 &&
      sectionDataLists?.length === 0
    ) {
      const timer = setTimeout(() => {
        getProductData();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      // setLoader(false);
    }
  }, [storeEntityIds, sectionDetailsDatas, currency]);

  //Most Searchable Products
  const mostSearchableDataApi = useCallback(
    (sectionDataList, mainData, index) => {
      if (Object.keys(storeEntityIds).length > 0) {
        setLoader(true);
        const obj = {
          a: "GetMostSearchProduct",
          store_id: storeEntityIds.mini_program_id,
          tenant_id: storeEntityIds.tenant_id,
          entity_id: storeEntityIds.entity_id,
          origin: storeEntityIds.cmp_origin,
          consumer_id: "",
          search_type: "",
          number: "0",
          per_page: "0",
        };
        commanService.postLaravelApi("/MostSearchProduct", obj).then((res) => {
          setMostSearchProductList(res.data.data);
          dispatch(mostSearchProductData(res.data.data));
          setLoader(false);
        });
      }
    },
    [storeEntityIds]
  );

  //Click event for View more products
  const handleViewMore = (data) => {
    var megaMenu = JSON.parse(
      sessionStorage.getItem("megaMenus")
    )?.navigation_data?.filter(
      (item) => item.product_vertical_name === data?.vertical_code
    )[0];
    sessionStorage.setItem(
      "productFilterState",
      JSON.stringify({
        getAllFilteredHome: true,
        dimension: data?.dimension,
        item_group: data?.item_group,
        segments: data?.segment,
        vertical_code:data.vertical_code
      })
    );

    router.push(`/products/${changeUrl(data.display_name?.toLowerCase())}`);
  };

  //Add to cart
  const handleAddProductToCart = (data) => {
    let updatedImageDataList = [];

    data?.image_types.forEach((type, index) => {
      if (type !== "Video" && type !== "360 View") {
        let parsedEmbossingArea = data.image_area?.[index];
        if (typeof parsedEmbossingArea === "string") {
          try {
            parsedEmbossingArea = JSON.parse(parsedEmbossingArea);
          } catch (e) {
            // console.error("Error parsing embossingArea:", e);
          }
        }
        updatedImageDataList.push({
          type: type,
          url: data?.image_urls[index] || "",
          area: parsedEmbossingArea,
          price: data?.service_data?.filter(
            (item) =>
              item.service_code === "EMBOSSING" &&
              item.service_type === "Special"
          )?.[0]?.service_rate,
          currency: data?.service_data?.filter(
            (item) =>
              item.service_code === "EMBOSSING" &&
              item.service_type === "Special"
          )?.[0]?.msrv_currency,
          embImage: "",
          embImageArea: {
            left: 20,
            top: 20,
            width: 50,
            height: 50,
          },
          widthInInches: null,
          heightInInches: null,
          binaryFile: null,
        });
      }
    });

    // setActiveImg(updatedImageDataList.filter(item => item.area !== ""));
    const initServiceData = data.service_data.map((item) => ({
      ...item,
      is_selected: false,
    }));
    const services = [];
    initServiceData.forEach((element) => {
      const serviceItem = {
        text: "",
        type: "",
        image: "",
        is_selected: element.is_selected,
        currency: element?.msrv_currency,
        price: element?.service_rate,
        font_size: element?.font_size,
        min_character: element?.min_character,
        max_character: element?.max_character,
        unique_id: element?.service_unique_id,
        service_code: element?.service_code,
        service_name: element?.service_name,
        service_type: element?.service_type,
      };

      if (
        element?.service_code == "ENGRAVING" &&
        element.service_type === "Special"
      ) {
        serviceItem.type = "";
        serviceItem.text = "";
        serviceItem.is_selected = "0";
      }

      if (
        element?.service_code == "EMBOSSING" &&
        element.service_type === "Special"
      ) {
        serviceItem.image = updatedImageDataList.filter(
          (item) => item.area !== ""
        );
        serviceItem.is_selected =
          updatedImageDataList
            .filter((item) => item.area !== "")
            .some((img) => img?.embImage !== "") == true
            ? "1"
            : "0";
      }

      data.service_data
        .filter((item) => item.service_type === "Normal")
        .forEach((ele) => {
          if (ele.service_unique_id == element?.service_unique_id) {
            serviceItem.is_selected = "0";
          }
        });
      services.push(serviceItem);
    });
    const datas = {
      campaign_id: "",
      unique_id: data.unique_id,
      price_type: data.price_type,
      currency_symbol: data.currency_symbol,
      item_id: data?.item_id,
      variant_unique_id: data?.variant_unique_id,
      vertical_code: data.vertical_code,
      item_group: data.item_group,
      qty: 1,
      product_diy: "PRODUCT",
      jewellery_product_type_name: data?.jewellery_product_type_name,
      product_name: data?.product_name,
      product_sku: data?.product_sku,
      product_variant: data?.product_variant,
      jewellery_product_type: data?.jewellery_product_type,
      short_summary: data?.short_summary,
      origional_price: data.final_total,
      master_primary_metal_type: data?.master_primary_metal_type,
      service_json: services,
      coupon_code: data?.coupon_code,
    };

    addProductToCart(datas);
  };

  return (
    sectionDataLists?.filter(
      (prod) =>
        prod.section_type === "PRODUCTS" && isEmpty(prod.vertical_code) !== ""
    )?.length > 0 &&
    sectionDataLists
      ?.filter(
        (prod) =>
          prod.section_type === "PRODUCTS" && isEmpty(prod.vertical_code) !== ""
      )
      ?.map((elm, i) => {
        if (elm.ProductList?.length === 0) return;
        const words = elm.display_name?.trim().split(" ") || [];
        const lastWord = words.pop();
        const firstWords = words.join(" ");
        return (
          <section className="products-carousel container" key={i}>
            {loader && <Loader />}
            <h2 className="section-title text-uppercase fs-36 text-center mb-3 pb-2 pb-xl-3">
              {/* {elm?.display_name} */}
              {firstWords} <span className="fw-semi-bold">{lastWord}</span>
            </h2>

            <div className="tab-content pt-2" id="collections-tab-content">
              <div
                className="tab-pane fade show active"
                id="collections-tab-1"
                role="tabpanel"
                aria-labelledby="collections-tab-1-trigger"
              >
                <div className="row">
                  {elm?.ProductList?.slice(0, 8)?.map((item, i) => {
                    var megaMenu = JSON.parse(
                      sessionStorage.getItem("megaMenus")
                    )?.navigation_data?.filter(
                      (elm) =>
                        elm?.product_vertical_name === item?.vertical_code
                    )[0];
                    return (
                      <div
                        key={i}
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                      >
                        <div className="product-card mb-3 mb-md-4">
                          <div className="pc__img-wrapper">
                            <Swiper
                              modules={[Navigation]}
                              navigation={{
                                prevEl: `${`.pc__img-prev-${i}`} `,
                                nextEl: `${`.pc__img-next-${i}`} `,
                              }}
                              className="swiper-container background-img js-swiper-slider"
                            >
                              <SwiperSlide className="swiper-slide">
                                <Link
                                  href={`products/${changeUrl(
                                    megaMenu?.menu_name?.toLowerCase()
                                  )}/${changeUrl(
                                    `${
                                      item.product_name +
                                      "-" +
                                      item.pv_unique_id
                                    }`
                                  )}`}
                                  aria-label={
                                    item?.product_name ||
                                    `Home Product ${i + 1}`
                                  }
                                >
                                  <picture>
                                    <Image
                                      effect="blur"
                                      fetchPriority="high"
                                      loading="lazy"
                                      src={item?.image_urls?.[0]}
                                      width="330"
                                      height="400"
                                      alt={
                                        item?.product_name ||
                                        `Home Product ${i + 1}`
                                      }
                                      className="pc__img"
                                    />
                                  </picture>

                                  {item?.image_urls?.length > 1 ? (
                                    <picture>
                                      <Image
                                        effect="blur"
                                        fetchPriority="high"
                                        loading="lazy"
                                        src={item.image_urls?.[1]}
                                        width="330"
                                        height="400"
                                        className="pc__img pc__img-second"
                                        alt={
                                          item?.product_name ||
                                          `Home Product ${i + 1}`
                                        }
                                      />
                                    </picture>
                                  ) : (
                                    ""
                                  )}
                                </Link>
                              </SwiperSlide>

                              <span
                                className={`cursor-pointer pc__img-prev ${`pc__img-prev-${i}`} `}
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
                                className={`cursor-pointer pc__img-next ${`pc__img-next-${i}`} `}
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

                            {/* <button
                              className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                              aria-label="Add to Cart"
                              onClick={() => {
                                handleAddProductToCart(item);
                              }}
                              title={
                                isAddedToCartProducts(item.item_id)
                                  ? "Already Added"
                                  : "Add to Cart"
                              }
                            >
                              {isAddedToCartProducts(item.item_id)
                                ? "Already Added"
                                : "Add To Cart"}
                            </button> */}
                          </div>

                          <div className="pc__info position-relative">
                            <Link
                              href={`products/${changeUrl(
                                megaMenu?.menu_name
                              )}/${changeUrl(
                                `${item.product_name + "-" + item.pv_unique_id}`
                              )}`}
                              aria-label={
                                item?.product_name || `Home Product ${i + 1}`
                              }
                            >
                              {/* <p className="pc__category">
                                {item.jewellery_product_type_name}
                              </p> */}
                              <h2 className="pc__title">
                                {/* <Link href={`products/${changeUrl(
                                    megaMenu?.menu_name?.toLowerCase()
                                  )}/${changeUrl(
                                    `${
                                      item.product_name +
                                      "-" +
                                      item.pv_unique_id
                                    }`
                                  )}`}> */}
                                    {item.product_name}
                                {/* </Link> */}
                              </h2>
                              <div className="product-card__price d-flex mt-2">
                                <span className="money price pe-2">
                                  {item.final_total_display
                                    ? `${item?.currency_symbol} ${item.final_total_display}`
                                    : ""}
                                </span>
                                {item.coupon_code ? (
                                  <span className="money price price-old">
                                    {item.origional_price
                                      ? `${item?.currency_symbol} ${numberWithCommas(extractNumber(item.origional_price.toString()).toFixed(2))}`
                                      : ""}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Link>
                            <button
                              className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                                isAddedtoWishlist(item.item_id) ? "active" : ""
                              }`}
                              title="Add To Wishlist"
                              onClick={() => toggleWishlist(item)}
                              aria-label="Add To Wishlist"
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
                                    isAddedtoWishlist(item.item_id)
                                      ? "#icon_heart_fill"
                                      : "#icon_heart"
                                  }
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* <!-- /.row --> */}
                {elm?.ProductList && elm?.ProductList?.length > 0 && (
                  <div className="text-center mt-2">
                    <div
                      className="btn-link btn-link_lg default-underline text-uppercase fw-medium cursor-pointer"
                      // href={`/products/${elm.vertical_code}`}
                      onClick={() => {
                        dispatch(isFilter(true));
                        dispatch(filterData([]));
                        dispatch(filteredData([]));
                        dispatch(storeItemObject({}));
                        handleViewMore(elm);
                      }}
                    >
                      View More
                    </div>
                  </div>
                )}
              </div>

              {/* <!-- /.tab-pane fade show--> */}
            </div>
            {/* <!-- /.tab-content pt-2 --> */}
          </section>
        );
      })
  );
}
