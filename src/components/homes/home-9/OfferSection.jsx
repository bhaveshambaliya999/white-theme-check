import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "../../../Redux/action";
import React from "react";
import { changeUrl, isEmpty } from "../../../CommanFunctions/commanFunctions";
import Image from "next/image";

export default function OfferSection({ useSliderState }) {
  //State Declaration
  const dispatch = useDispatch();
  const router = useRouter();
  // get section wise data from Redux
  const [sectionDetailsDatas, setSectionDetailsDatas] = useSliderState([]);

  return (
    <>
      {sectionDetailsDatas &&
        Object.keys(sectionDetailsDatas)?.length > 0 &&
        sectionDetailsDatas.section_data.length > 0 &&
        sectionDetailsDatas.section_data.map((c, index) => {
          var megaMenu = JSON.parse(
            sessionStorage.getItem("megaMenus")
          )?.navigation_data?.filter(
            (item) => item.product_vertical_name === c?.vertical_code
          )[0];
          if (c.is_group === 1) {
            return;
          }
          return (
            <React.Fragment key={index}>
              {c.is_group !== 1 ? (
                <>
                  {/* Deal Timer Section */}
                  {c?.section_type === "OFFER" && (
                    <>
                      <div className="section-gap"></div>
                      <section className="offerContent-left position-relative">
                        <div
                          // href={
                          //   isEmpty(c?.product_type) !== ""
                          //     ? `/products/${changeUrl(
                          //         megaMenu?.menu_name
                          //       )}/offer/${changeUrl(c?.product_type)}`
                          //     : `/products/${c.vertical_code}`
                          // }
                          onClick={() => {
                            sessionStorage.setItem(
                              "productFilterState",
                              JSON.stringify({
                                getAllFilteredHome: true,
                                dimension: c?.dimension,
                                item_group: c?.item_group,
                                segments: c?.segment,
                                vertical_code: c?.vertical_code
                              })
                            );

                            router.push(
                              c.section_type === "OFFER"
                                ? `/products/${changeUrl(
                                    c.display_name
                                  )}/offer/${changeUrl(
                                    isEmpty(c.offer_detail?.code)
                                  )}`
                                : `/products/${changeUrl(
                                    c.display_name
                                  )}/type/${c.product_title
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`
                            );
                          }}
                          aria-label={
                            c?.display_name.toUpperCase() ||
                            `Lookbook Product ${index + 1}`
                          }
                        >
                          <div className="background-img" style={{backgroundImage: `url(${c.banner_image})`, }}></div>
                        </div>
                        <div className="offer-content position-absolute">
                          <h2 className="section-title">
                            {c.display_name.toUpperCase()}
                          </h2>
                          <div className="fs-6 offer-content-text" dangerouslySetInnerHTML={{ __html: c.description }}></div>
                          {/* <span className="h2 fw-normal">Discount 50%</span><br /> */}
                          <div
                            // href={
                            //   c.section_type === "OFFER"
                            //     ? `/products/${changeUrl(
                            //         megaMenu?.menu_name
                            //       )}/offer/${changeUrl(
                            //         isEmpty(c.offer_detail?.code)
                            //       )}`
                            //     : `/products/${changeUrl(
                            //         megaMenu?.menu_name
                            //       )}/type/${c.product_title
                            //         .split(" ")
                            //         .join("-")
                            //         .toLowerCase()}`
                            // }
                            className="btn-link default-underline text-uppercase fw-medium mt-4 cursor-pointer"
                            aria-label={"Shop Now"}
                            onClick={() => {
                              dispatch(isFilter(true));
                              dispatch(filterData([]));
                              dispatch(filteredData([]));
                              dispatch(storeItemObject({}));
                              sessionStorage.setItem(
                                "productFilterState",
                                JSON.stringify({
                                  getAllFilteredHome: true,
                                  dimension: c?.dimension,
                                  item_group: c?.item_group,
                                  segments: c?.segment,
                                  vertical_code: c?.vertical_code
                                })
                              );
                              router.push(
                              c.section_type === "OFFER"
                                ? `/products/${changeUrl(
                                    c.display_name
                                  )}/offer/${changeUrl(
                                    isEmpty(c.offer_detail?.code)
                                  )}`
                                : `/products/${changeUrl(
                                    c.display_name
                                  )}/type/${c.product_title
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`
                            );
                            }}
                          >
                            Shop Now
                          </div>
                        </div>
                      </section>
                    </>
                  )}
                </>
              ) : (
                ""
              )}
            </React.Fragment>
          );
        })}
    </>
  );
}
