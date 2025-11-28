import { isEmpty } from "@/CommanFunctions/commanFunctions";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import tippy from "tippy.js";

export default function Size({
  specificationData,
  metalType,
  productData,
  filterProduct,
  appliedFilter,
}) {
  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  const FilterSection = useCallback(({ keyType, e, arr, appliedFilter }) => {
    //state declerations
    const swiperRef = useRef(null);
    const [selectedHover, setSelectedHover] = useState(
      arr.find((item) => item.key === e.selectedvalue)?.value || ""
    );
    const [hoverIcon, setHoverIcon] = useState(selectedHover);
    const [lastIndex, setLastIndex] = useState(
      arr.findIndex((item) => item.key === e.selectedvalue) || 0
    );

    //Update state when hover
    useEffect(() => {
    const newIcon = arr.find((item) => item.key === e.selectedvalue)?.value || "";
    if (newIcon !== selectedHover) {
      setSelectedHover(newIcon);
    }
  }, []);


    //Slider click function
    const handleSlideClick = (event, e1) => {
      if (e?.selectedvalue !== e1?.key) {
        appliedFilter(e, e1);
        setSelectedHover(e1?.value);
        setLastIndex(e1?.value);
      }
      setHoverIcon(e1?.value);
    };

    const initialSlideIndex = arr.findIndex(
      (item) => item.key === e.selectedvalue
    );
    const startingSlide =
      initialSlideIndex !== -1 ? initialSlideIndex : lastIndex;

    // const slidesPerView = arr.length < 7 ? 4 : 7;

    // const shouldLoop = arr.length >= 7;

    return keyType === "master_primary_metal_type" ||
      keyType === "weight_version" || keyType === "master_gh_shape" || keyType === "master_stone_shape" ? (
      <div
        className={`d-flex flex-column w-100 ${keyType}`}
        key={`filter-item-${keyType}`}
      >
        <h6 className="d-flex align-items-center gap-2">
          {e?.title}{" "}
          <span
            className={`text-muted ${keyType === "weight_version"
              ? "text-uppercase"
              : "text-capitalize"
              } fs-14px ${selectedHover ? "d-block" : "d-none"}`}
          >
            {hoverIcon}
          </span>
        </h6>
        <Swiper
          ref={swiperRef}
          // loop={arr?.length > 6 && arr?.length % 6 === 0}
          // slidesPerView={arr?.length <= 2 ? arr?.length : 2}
          // slidesPerGroup={arr?.length <= 2 ? arr?.length : 2}
          spaceBetween={8}
          slideToClickedSlide={true}
          pagination={{ type: "fraction" }}
          className="mySwiper swiperSliderMain w-100"
          navigation={true}
          modules={[Navigation]}
          lazy={"true"}
          initialSlide={startingSlide}
          breakpoints={{
            0: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            576: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
            768: {
              slidesPerView: 7,
              slidesPerGroup: 7,
            },
            
            1024: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
            1500: {
              slidesPerView: 6,
              slidesPerGroup: 6,
            },
          }}
        >
          {arr?.length > 0 &&
            e?.is_visible !== 0 &&
            arr.map((e1, index) => {
              if (isEmpty(e1?.is_available) === 0) return null;
              const currentHoverIcon =
                e?.selectedvalue === e1?.key ? e1?.value : selectedHover;
              return (
                <SwiperSlide
                  key={index}
                  className={`swiper-slide ${e?.selectedvalue === e1?.key
                    ? "swatch_active"
                    : "cursor-pointer"
                    }`}
                  onClick={(event) => handleSlideClick(event, e1)}
                >
                  {keyType === "master_primary_metal_type" ? (
                    <div className="item-text">
                      <img
                        loading="lazy"
                        src={e1.icon}
                        alt={e1.value}
                        width={44}
                        height={44}
                        className="swiperImage"
                        onMouseOver={() =>
                          hoverIcon !== e1?.value && setHoverIcon(e1?.value)
                        }
                        onMouseOut={() =>
                          hoverIcon !== currentHoverIcon &&
                          setHoverIcon(currentHoverIcon)
                        }
                      />
                    </div>
                  ) : (
                    <div
                      className="item-text"
                      onMouseOver={() =>
                        hoverIcon !== e1?.value && setHoverIcon(e1?.value)
                      }
                      onMouseOut={() =>
                        hoverIcon !== currentHoverIcon &&
                        setHoverIcon(currentHoverIcon)
                      }
                    >
                      <div className={`d-flex flex-column`}>
                        {e1?.icon !== "" && <i className={`${e1.icon}`}></i>}
                        <span>{e1?.value?.toLowerCase()}</span>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    ) : (
      <div
        className={`d-flex flex-column ${keyType}`}
        key={`filter-item-${keyType}`}
      >
        <h6 className="h6">{e?.title}</h6>
        <div className="d-flex flex-wrap gap-2">
          {arr?.length > 0 &&
            e?.is_visible !== 0 &&
            arr?.map((e1, index) => {
              if (isEmpty(e1?.is_available) === 0) return null;
              return (
                <label
                  key={`swatch-${e1?.key}-${index}`}
                  className={`swatch flex-column ${e?.selectedvalue === e1?.key
                    ? "swatch_active hover"
                    : "cursor-pointer"
                    } ${e1?.icon ? "master_stone_shape" : ""} ${isEmpty(e1?.is_available) === 0 ? "filter-disable" : ""
                    }`}
                  onClick={() =>
                    e?.selectedvalue !== e1?.key ? appliedFilter(e, e1) : null
                  }
                  style={{ backgroundColor: e1?.color }}
                >
                  {e.key !== "master_gh_shape" &&
                    e.key !== "master_stone_shape" ? (
                    e1.icon ? (
                      <img
                        alt={e1?.value}
                        className="img-fluid head-prong"
                        src={e1.icon}
                      />
                    ) : null
                  ) : (
                    <i className={`${e1.icon} fs-30`}></i>
                  )}
                  <div>{e1?.value}</div>
                </label>
              );
            })}
        </div>
      </div>
    );
  }, []);

  return (
    <>
      {filterProduct?.length > 0 &&
        filterProduct?.map((e, i) => {
          const arr = [];

          if (e?.dropdown) {
            e.dropdown.forEach((val) => {
              const obj = {
                key: val.key,
                value: val.value,
                color: val.color_code,
                title: e.title,
                icon: val.icon,
                is_available: val.is_available,
              };
              arr.push(obj);
            });
          }
          return (
            e?.is_visible !== 0 && (
              <div className="w-100" key={`filter-item-${i}`}>
                {e?.key === "master_primary_metal_type" && (
                  <FilterSection
                    keyType={e?.key}
                    e={e}
                    arr={arr}
                    appliedFilter={appliedFilter}
                  />
                )}
                {e?.key === "weight_version" && (
                  <FilterSection
                    keyType={e?.key}
                    e={e}
                    arr={arr}
                    appliedFilter={appliedFilter}
                  />
                )}
                {e?.key === "master_gh_shape" && (
                  <FilterSection
                    keyType={e?.key}
                    e={e}
                    arr={arr}
                    appliedFilter={appliedFilter}
                  />
                )}
                {e?.key === "master_stone_shape" && (
                  <FilterSection
                    keyType={e?.key}
                    e={e}
                    arr={arr}
                    appliedFilter={appliedFilter}
                  />
                )}
                {!["master_primary_metal_type", "weight_version", "master_gh_shape", "master_stone_shape"].includes(
                  e?.key
                ) && (
                    <FilterSection
                      keyType={e?.key}
                      e={e}
                      arr={arr}
                      appliedFilter={appliedFilter}
                    />
                  )}
              </div>
            )
          );
        })}
    </>
  );
}
