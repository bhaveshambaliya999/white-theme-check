"use client";
import { useEffect, useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Gallery, Item } from "react-photoswipe-gallery";
import tippy from "tippy.js";
import { useSelector } from "react-redux";
// import * as bootstrap from "bootstrap";
import { useRouter } from "next/router";
import { DiySteperData } from "@/Redux/action";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function ProductSlider1({ productData, isStone, type }) {
  const pathname = usePathname();
  //State Decleration
  const activeDIYtabss = useSelector((state) => state.activeDIYtabs);
  const DiySteperDatas = useSelector((state) => state.DiySteperData);
  const addedDiamondDatas = useSelector((state) => state.addedDiamondData);
  const storeDiamondArrayImages = useSelector(
    (state) => state.storeDiamondArrayImage
  );

  const [imagesWithType, setImagesWithType] = useState([]);
  const [imagesWithoutType, setImagesWithoutType] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [currentIndexWithType, setCurrentIndexWithType] = useState(0);
  const [currentIndexWithoutType, setCurrentIndexWithoutType] = useState(0);

  const [typeState, setTypeState] = useState(false);
  const [certiModal, setCertiModal] = useState(false);
  const [ModalImageCertURl, serModalImageCertURl] = useState("");

  //Modal handler
  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("certiModal");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          certiModal ? modal.show() : modal.hide();
        }
      }
    })();
  }, [certiModal]);

  //function for Image Urls
  const consolidateImageUrls = (data) => {
    const allImageUrls = [];

    data.forEach((item) => {
      if (item.image_urls && Array.isArray(item.image_urls)) {
        allImageUrls.push(...item.image_urls);
      }
    });

    return allImageUrls;
  };

  //Initial Store of Images
  useEffect(() => {
    tippy("[data-tippy-content]");

    const withType = [];
    const withoutType = [];

    if (productData) {
      const productImages =
        type === "review"
          ? consolidateImageUrls(DiySteperDatas)
          : productData.images || [];

      productImages.forEach((img) => {
        if (img.type) {
          withType.push({ src: img.src, type: img.type, view: img.view });
        } else {
          withoutType.push({ src: img });
        }
      });
    }

    if (storeDiamondArrayImages?.length > 0) {
      const storeImages = storeDiamondArrayImages || [];
      storeImages.forEach((img) => {
        if (img.type) {
          withType.push({ src: img.src, type: img.type, view: img.view });
        } else {
          withoutType.push({ src: img });
        }
      });
    }
    setImagesWithType(withType);
    setImagesWithoutType(withoutType);
    setCurrentIndexWithType(0);
    setCurrentIndexWithoutType(0);
  }, [productData, storeDiamondArrayImages]);

  //State Update based on Dependencies
  useEffect(() => {
    if (activeDIYtabss === "Jewellery") {
      setTypeState(false);
    }
  }, [isStone]);

  //Thumbnail click function
  const handleThumbnailClick = (index, isWithType) => {
    if (isWithType === true) {
      setCurrentIndexWithType(index);
      setTypeState(true);
    } else {
      setCurrentIndexWithoutType(index);
      setTypeState(false);
    }
  };

  //Open diamond certificate
  const showCertificate = (src) => {
    window.open(src, "_blank", "");
  };

  //State update for modal
  const certificateModal = (value) => {
    setCertiModal(true);
    serModalImageCertURl(value);
  };

  return (
    <>
      <div className="product-media-initialized position-sticky top-0">
        <div className="vertical-thumbnail product-single__media  position-relative">
          <div className="product-single__image position-relative">
            <Gallery>
              <Swiper
                modules={[Thumbs, Navigation, FreeMode]}
                onSwiper={setThumbsSwiper}
                lazy={"true"}
                onSlideChange={(swiper) => {
                  if (typeState) {
                    setCurrentIndexWithType(swiper.activeIndex);
                  } else {
                    setCurrentIndexWithoutType(swiper.activeIndex);
                  }
                }}
                slidesPerView={1}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                navigation={{ prevEl: ".ssnbp1", nextEl: ".ssnbn1" }}
                className="swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
                // initialSlide={
                //   typeState ? currentIndexWithType : currentIndexWithoutType
                // }
              >
                {typeState && imagesWithType[currentIndexWithType] ? (
                  <>
                    <SwiperSlide
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                      key={currentIndexWithType}
                      className="swiper-slide product-single__image-item"
                    >
                      <Item
                        original={imagesWithType[currentIndexWithType].src}
                        thumbnail={imagesWithType[currentIndexWithType].src}
                        width="550"
                        height="550"
                        content={
                          imagesWithType[currentIndexWithType]?.type ===
                          "video" ? (
                            <iframe
                              loading="lazy"
                              src={imagesWithType[currentIndexWithType]?.src}
                              width={550}
                              height={550}
                              className="w-100"
                            />
                          ) : imagesWithType[currentIndexWithType]?.type ===
                              "image" ||
                            imagesWithType[currentIndexWithType]?.type ===
                              "v_image" ? (
                            <div className="dia-lw">
                              <Image
                                layout="responsive"
                                loading="lazy"
                                className="dia-lw"
                                src={imagesWithType[currentIndexWithType]?.src}
                                width={550}
                                height={550}
                                alt="Product Image"
                                // quality={100}
                                // unoptimized={true}
                              />
                              {imagesWithType[currentIndexWithType]?.type ===
                                "v_image" &&
                                addedDiamondDatas && (
                                  <>
                                    <div className="dia-l diamond-width medium-title">
                                      {addedDiamondDatas?.st_length}
                                    </div>
                                    <div className="dia-w diamond-height medium-title">
                                      {addedDiamondDatas?.st_width}
                                    </div>
                                  </>
                                )}
                            </div>
                          ) : (
                            <iframe
                              loading="lazy"
                              className="w-100"
                              src={imagesWithType[currentIndexWithType]?.src}
                              width="550"
                              height="550"
                            />
                          )
                        }
                      >
                        {({ ref, open }) => (
                          <>
                            <div className="dia-lw">
                              {imagesWithType[currentIndexWithType]?.type ===
                              "video" ? (
                                <iframe
                                  loading="lazy"
                                  src={
                                    imagesWithType[currentIndexWithType]?.src
                                  }
                                  width="550"
                                  height="550"
                                  className="w-100"
                                />
                              ) : imagesWithType[currentIndexWithType]?.type ===
                                  "image" ||
                                imagesWithType[currentIndexWithType]?.type ===
                                  "v_image" ? (
                                <Image
                                  layout="responsive"
                                  // quality={100}
                                  loading="lazy"
                                  className="dia-lw"
                                  src={
                                    imagesWithType[currentIndexWithType]?.src
                                  }
                                  width={550}
                                  height={550}
                                  alt="Product Image"
                                />
                              ) : (
                                <iframe
                                  loading="lazy"
                                  className="w-100"
                                  src={
                                    imagesWithType[currentIndexWithType]?.src
                                  }
                                  width="550"
                                  height="550"
                                />
                              )}
                              {imagesWithType[currentIndexWithType]?.type ===
                                "v_image" &&
                                addedDiamondDatas && (
                                  <>
                                    <div className="dia-l diamond-width medium-title">
                                      {addedDiamondDatas?.st_length}
                                    </div>
                                    <div className="dia-w diamond-height medium-title">
                                      {addedDiamondDatas?.st_width}
                                    </div>
                                  </>
                                )}
                            </div>

                            {/* Zoom Icon */}
                            <div
                              ref={ref}
                              onClick={open}
                              data-fancybox="gallery"
                              className="item-zoom cursor-pointer"
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              data-tippy-content="Zoom"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <use xlinkHref="#icon_zoom" />
                              </svg>
                            </div>
                          </>
                        )}
                      </Item>
                      <div
                        className="cursor-pointer swiper-button swiper-button-prev ssnbp1"
                        onClick={() => {
                          setCurrentIndexWithType((prevIndex) =>
                            prevIndex === 0 ? 0 : prevIndex - 1
                          );
                        }}
                      >
                        <i className="ic_chavron_left"></i>
                      </div>
                      <div
                        className="cursor-pointer swiper-button swiper-button-next ssnbn1"
                        onClick={() => {
                          setCurrentIndexWithType((prevIndex) =>
                            prevIndex === imagesWithType.length - 2
                              ? prevIndex
                              : prevIndex + 1
                          );
                        }}
                      >
                        <i className="ic_chavron_right"></i>
                      </div>
                    </SwiperSlide>
                  </>
                ) : (
                  !typeState &&
                  imagesWithoutType.length > 0 &&
                  imagesWithoutType.map((elm, i) => (
                    <SwiperSlide
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                      key={i}
                      className="swiper-slide product-single__image-item"
                    >
                      <Item
                        original={elm.src}
                        thumbnail={elm.src}
                        width="550"
                        height="550"
                        content={
                          elm.src.includes("mp4") ? (
                            <video
                              loading="lazy"
                              width="550"
                              height="550"
                              src={elm.src}
                              className="w-100 h-100"
                              loop
                              autoPlay
                              muted
                              playsInline
                              webkit-playsinline="true"
                              preload="metadata"
                            />
                          ) : (
                            <Image
                              layout="responsive"
                              // quality={100}
                              loading="lazy"
                              className="h-auto w-100"
                              src={elm.src}
                              width={550}
                              height={550}
                              alt="Product Image"
                            />
                          )
                        }
                      >
                        {({ ref, open }) => (
                          <>
                            {imagesWithoutType?.[
                              currentIndexWithoutType
                            ]?.src?.includes("mp4") ? (
                              <video
                                loading="lazy"
                                width="550"
                                height="550"
                                muted
                                playsInline
                                webkit-playsinline="true"
                                preload="metadata"
                                src={
                                  imagesWithoutType?.[currentIndexWithoutType]
                                    ?.src
                                }
                                className="w-100 h-100"
                                loop
                                autoPlay
                              />
                            ) : (
                              <Image
                                layout="responsive"
                                loading="lazy"
                                // quality={100}
                                className="h-auto"
                                src={
                                  imagesWithoutType?.[currentIndexWithoutType]
                                    ?.src
                                }
                                width={550}
                                height={550}
                                alt="Product Image"
                              />
                            )}

                            <div
                              ref={ref}
                              onClick={open}
                              className="item-zoom cursor-pointer"
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              data-tippy-content="Zoom"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <use xlinkHref="#icon_zoom" />
                              </svg>
                            </div>
                          </>
                        )}
                      </Item>
                    </SwiperSlide>
                  ))
                )}
                <div
                  className="cursor-pointer swiper-button swiper-button-prev ssnbp1"
                  // onClick={() => {
                  //   setCurrentIndexWithoutType((prevIndex) =>
                  //     prevIndex === 0 ? 0 : prevIndex - 1
                  //   );
                  // }}
                >
                  {/* <i className="ic_chavron_left"></i> */}
                  <svg
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use xlinkHref="#icon_prev_sm" />
                  </svg>
                </div>
                <div
                  className="cursor-pointer swiper-button swiper-button-next ssnbn1"
                  // onClick={() => {
                  //   setCurrentIndexWithoutType((prevIndex) =>
                  //     prevIndex === imagesWithoutType.length - 1
                  //       ? prevIndex
                  //       : prevIndex + 1
                  //   );
                  // }}
                >
                  {/* <i className="ic_chavron_right"></i> */}
                  <svg
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use xlinkHref="#icon_next_sm" />
                  </svg>
                </div>
              </Swiper>
            </Gallery>
            {(pathname.includes("start-with-a-setting") ||
              pathname.includes("start-with-a-diamond")) &&
              activeDIYtabss === "Complete" && (
                <Swiper
                  className="swiper-container swiper-thumb-3 start-with-a-setting"
                  modules={[Thumbs, FreeMode]}
                  lazy={"true"}
                  onSwiper={setThumbsSwiper}
                  freeMode
                  slidesPerView={4}
                >
                  {imagesWithType?.map((elm, i) => {
                    const isCert = elm.type === "cert" ? true : false;
                    return (
                      <SwiperSlide
                        key={i}
                        className="swiper-slide product-single__image-item"
                        style={{
                          cursor: "pointer",
                          opacity: i === currentIndexWithType ? "1" : "0.5",
                        }}
                        onClick={() => {
                          if (elm?.type === "cert") {
                            if (elm?.st_certificate_file === "1") {
                              showCertificate(elm?.st_is_cert);
                            } else {
                              certificateModal(elm?.src);
                            }
                          } else {
                            handleThumbnailClick(i, true);
                          }
                        }}
                      >
                        {elm?.type === "video" ? (
                          <Image
                            layout="responsive"
                            loading="lazy"
                            // quality={100}
                            className=""
                            src={elm?.view}
                            width={104}
                            height={104}
                            alt="Product Image"
                          />
                        ) : elm?.type === "image" || elm?.type === "v_image" ? (
                          <Image
                            layout="responsive"
                            loading="lazy"
                            className=""
                            // quality={100}
                            src={elm?.view}
                            width={104}
                            height={104}
                            alt="Product Image"
                          />
                        ) : elm?.type === "cert" ? (
                          <Image
                            layout="responsive"
                            loading="lazy"
                            className=""
                            // quality={100}
                            src={elm?.view}
                            width={104}
                            height={104}
                            alt="Product Image"
                            onClick={() => certificateModal(elm?.src)}
                            data-toggle="modal"
                            data-target="#certiModal"
                          />
                        ) : null}
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
          </div>

          <div className="product-single__thumbnail">
            <Swiper
              modules={[Thumbs]}
              lazy={"true"}
              breakpoints={{
                0: {
                  direction: "horizontal",
                  slidesPerView: 5,
                },
                992: {
                  direction: "vertical",
                },
              }}
              className="swiper-container swiper-container-initialized swiper-container-pointer-events swiper-container-free-mode swiper-container-thumbs swiper-container-horizontal"
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              style={{ cursor: "pointer" }}
            >
              {imagesWithoutType.map((elm, i) => (
                <SwiperSlide
                  key={i}
                  className="swiper-slide product-single__image-item"
                  style={{
                    marginBottom: "10px",
                    opacity: i === currentIndexWithoutType ? "1" : "0.5",
                  }}
                  onClick={() => handleThumbnailClick(i, false)}
                >
                  {elm?.src?.includes("mp4") ? (
                    <div className="product_video">
                      <i className="ic_play"></i>
                      <video
                        loading="lazy"
                        className="w-100 h-100"
                        src={elm.src}
                        width={104}
                        height={104}
                        loop
                        autoPlay
                        muted
                        playsInline
                        webkit-playsinline="true"
                        preload="metadata"
                      />
                    </div>
                  ) : (
                    <Image
                      layout="responsive"
                      loading="lazy"
                      className=""
                      // quality={100}
                      src={elm.src}
                      width={104}
                      height={104}
                      alt="Product Image"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      {certiModal && (
        <div
          className="modal fade"
          id="certiModal"
          tabIndex="-1"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Certificate #{addedDiamondDatas?.st_stock_id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setCertiModal(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <iframe
                  aria-labelledby="test"
                  src={ModalImageCertURl}
                  width="100%"
                  height="500px"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
