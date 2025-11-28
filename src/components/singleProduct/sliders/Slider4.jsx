import { useEffect, useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// import * as bootstrap from "bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import tippy from "tippy.js";
import Image from "next/image";

export default function Slider4({ diamondDataList, diamondArrayImage, stockId }) {
  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [photosArray, setPhotosArray] = useState([]);
  const [certiModal, setCertiModal] = useState(false);
  const [ModalImageCertURl, setModalImageCertURl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const modalElement = typeof document !== "undefined" && document.getElementById("certiModal");
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        keyboard: false,
      });
      certiModal ? modal.show() : modal.hide();
    }
  }, [certiModal]);

  const certificateModal = (value) => {
    setCertiModal(true);
    setModalImageCertURl(value);
  };

  const showCertificate = (src) => {
    window.open(src, '_blank', '');
  };

  useEffect(() => {
    if (diamondArrayImage && diamondArrayImage.length > 0) {
      const updatedPhotosArray = diamondArrayImage.map((item) => {
        switch (item.type) {
          case "video":
          case "image":
          case "v_image":
          case "cert":
            return item.src;
          default:
            return null;
        }
      });
      setPhotosArray(updatedPhotosArray);
    }
  }, [diamondArrayImage]);

  return (
    <>
      {/* <div
        className="product-single__media horizontal-thumbnail product-media-initialized"
        data-media-type="horizontal-thumbnail"
      >
        <div className="product-single__image">
          <Gallery>
            <Swiper
              modules={[Thumbs, Navigation]}
              slidesPerView={1}
              onSwiper={setThumbsSwiper}
              onSlideChange={(swiper) => {
                if (swiper.activeIndex !== currentIndex) {
                  setCurrentIndex(swiper.activeIndex);
                }
              }}
              lazy={"true"}
              navigation={{ prevEl: ".ssnbp1", nextEl: ".ssnbn1" }}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed
                    ? thumbsSwiper
                    : null,
              }}
              className="swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
              style={{ maxWidth: "100%", overflow: "hidden" }}
            // initialSlide={currentIndex}
            >
              {diamondArrayImage.map((elm, i) => {
                if (i === diamondArrayImage?.length - 1) {
                  return;
                }
                return (
                  <SwiperSlide
                    key={i}
                    className="swiper-slide product-single__image-item"
                  >
                    <Item
                      original={elm?.src}
                      thumbnail={elm?.src}
                      width="550"
                      height="550"
                      content={
                        elm?.type === "video" ? (
                          <iframe
                            loading="lazy"
                            src={elm?.src}
                            width="550"
                            height="550"
                            className="w-100"
                          />
                        ) : elm?.type === "image" || elm?.type === "v_image" ? (
                          <div className="dia-lw">
                            <img
                              loading="lazy"
                              className="dia-lw"
                              src={elm?.src}
                              width="550"
                              height="550"
                              alt="Product Image"
                            />
                            {elm?.type === "v_image" && diamondDataList && (
                              <>
                                <div className="dia-l diamond-width medium-title">
                                  {diamondDataList?.st_length}
                                </div>
                                <div className="dia-w diamond-height medium-title">
                                  {diamondDataList?.st_width}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <iframe
                            loading="lazy"
                            className="w-100"
                            src={elm?.src}
                            width="550"
                            height="550"
                          />
                        )
                      }
                    >
                      {({ ref, open }) => (
                        <>
                          <div className="dia-lw">
                            {diamondArrayImage[currentIndex]?.type ===
                              "video" ? (
                              <iframe
                                loading="lazy"
                                src={diamondArrayImage[currentIndex]?.src}
                                className="w-100"
                                width="550"
                                height="550"
                              />
                            ) : diamondArrayImage[currentIndex]?.type ===
                              "image" ||
                              diamondArrayImage[currentIndex]?.type ===
                              "v_image" ? (
                              <img
                                loading="lazy"
                                className="dia-lw"
                                src={diamondArrayImage[currentIndex]?.src}
                                width="550"
                                height="550"
                                alt="Product Image"
                              />
                            ) : (
                              <iframe
                                loading="lazy"
                                className="w-100"
                                src={diamondArrayImage[currentIndex]?.src}
                                width="550"
                                height="550"
                              />
                            )}
                            {diamondArrayImage[currentIndex]?.type ===
                              "v_image" &&
                              diamondDataList && (
                                <>
                                  <div className="dia-l diamond-width medium-title">
                                    {diamondDataList?.st_length}
                                  </div>
                                  <div className="dia-w diamond-height medium-title">
                                    {diamondDataList?.st_width}
                                  </div>
                                </>
                              )}
                          </div>
                          <a
                            ref={ref}
                            onClick={open}
                            // data-fancybox="gallery"
                            className="item-zoom"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            data-tippy-content="Zoom"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_zoom" />
                            </svg>
                          </a>
                        </>
                      )}
                    </Item>
                  </SwiperSlide>
                );
              })}
              <div
                className="cursor-pointer swiper-button swiper-button-prev ssnbp1"
              
              >
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_prev_sm" />
                </svg>
              </div>
              <div
                className="cursor-pointer swiper-button swiper-button-next ssnbn1"
              
              >
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_next_sm" />
                </svg>
              </div>

              
            </Swiper>
          </Gallery>
        </div>

        <div className="product-single__thumbnail">
          <Swiper
            className="swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events swiper-container-free-mode swiper-container-thumbs swiper-thumb-3"
            modules={[Thumbs, FreeMode]}
            onSwiper={setThumbsSwiper}
            freeMode
            lazy={"true"}
            slidesPerView={4}
          >
            {diamondArrayImage?.map((elm, i) => (
              <SwiperSlide
                key={i}
                className="swiper-slide product-single__image-item"
                style={{
                  cursor: "pointer",
                  opacity: i === currentIndex ? "1" : "0.5",
                }}
                onClick={() => {
                  if (elm?.type === "cert") {
                    if (elm?.st_certificate_file === "1") {
                      showCertificate(elm?.st_is_cert);
                    } else {
                      certificateModal(elm?.src);
                    }
                  } else {
                    setCurrentIndex(i);
                  }
                }}
              >
                {elm?.type === "video" ? (
                  <img
                    loading="lazy"
                    className=""
                    src={elm?.view}
                    width="104"
                    height="104"
                    alt="Product Image"
                  />
                ) : elm?.type === "image" || elm?.type === "v_image" ? (
                  <img
                    loading="lazy"
                    className=""
                    src={elm?.view}
                    width="104"
                    height="104"
                    alt="Product Image"
                  />
                ) : elm?.type === "cert" ? (
                  <img
                    loading="lazy"
                    className=""
                    src={elm?.view}
                    width="104"
                    height="104"
                    alt="Product Image"
                    data-toggle="modal"
                    data-target="#certiModal"
                  />
                ) : null}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div> */}
      <div className="product-diamond__thumbnail">
        {diamondArrayImage?.length > 0 &&
          diamondArrayImage.sort((a, b) => {
            if (a.type === "image" && b.type !== "image") return -1;
            if (b.type === "image" && a.type !== "image") return 1;

            if (a.type === "v_image" && b.type !== "v_image") return -1;
            if (b.type === "v_image" && a.type !== "v_image") return 1;

            if (a.type === "video" && b.type !== "video") return -1;
            if (b.type === "video" && a.type !== "video") return 1;

            return 0;
          })?.map((elm, i) => {
            if(elm.type==="cert") return
            return (
              <div key={i} className="product-diamond__image">
                {elm?.type === "image" || elm?.type === "v_image" ? (
                  <div className="dia-lw">
                    <Image
                      className="dia-lw"
                      // quality={100}
                      src={elm?.src}
                      alt="Product Image"
                      width={495}
                      height={495}
                      loading="lazy"
                    />
                    {elm?.type === "v_image" && diamondDataList && (
                      <>
                      <div className="dia-l diamond-width medium-title">
                        {diamondDataList?.st_length}
                      </div>
                      <div className="dia-w diamond-height medium-title">
                        {diamondDataList?.st_width}
                      </div>
                     </>
                    )}
                 </div>
                ) : elm?.type === "video" ? (
                  <div className="diamond-iframe">
                    <iframe
                      loading="lazy"
                      src={elm?.src}
                      className=""
                      allow="autoplay; encrypted-media"
                    />
                  </div>
                ) : ""
                }
              </div>
            )
          })}
      </div>

      {/* {certiModal && (
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
                <h5 className="modal-title">Certificate #{stockId}</h5>
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
      )} */}
    </>
  );
}
