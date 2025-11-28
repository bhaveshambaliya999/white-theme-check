import { changeUrl } from "../../../CommanFunctions/commanFunctions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

export default function Blogs({ useSliderState }) {
  const [sectionDetailsDatas] = useSliderState([]);

  if (!sectionDetailsDatas?.blog_list?.length) return null;

  // Swiper configuration
  const swiperOptions = {
    autoplay: {
      delay: 50000000,
    },
    modules: [Autoplay],
    effect: "none",
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 30,
      },
    },
  };

  return (
    <>
    <div className="section-gap"></div>
    <section className="blog-carousel container">
      <h2 className="section-title text-uppercase fs-36 text-center mb-3 pb-2 pb-xl-3">
        Latest <span className="fw-semi-bold">Blogs</span>
      </h2>

      <div className="position-relative">
        <Swiper
          className="swiper-container js-swiper-slider"
          {...swiperOptions}
        >
          {sectionDetailsDatas.blog_list.map((elm, index) => (
            <SwiperSlide
              key={index}
              className="swiper-slide blog-grid__item mb-0"
            >
              <Link
                href={`/blog-details/${changeUrl(elm?.title)}`}
                state={{
                  params: {
                    unique_id: elm.unique_id,
                    category_id: elm.category_id,
                  },
                }}
                aria-label={elm?.title || `Blog Link ${index + 1}`}
              >
                <div className="blog-grid__item-image">
                  <picture>
                    <Image
                      src={elm.featured_image}
                      alt={elm?.title}
                      loading="lazy"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="blog-grid__item-image__img"
                    />
                  </picture>
                </div>
                <div className="blog-grid__item-detail">
                  <div className="blog-grid__item-meta">
                    <span className="blog-grid__item-meta__author">
                      {elm.category_name}
                    </span>
                    <span className="blog-grid__item-meta__date">
                      {elm.date}
                    </span>
                  </div>
                  <div className="blog-grid__item-title mb-0 blog-title">
                    {elm.title}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
    </>
  );
}
