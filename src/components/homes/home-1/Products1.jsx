import { changeUrl, isEmpty } from "../../../CommanFunctions/commanFunctions";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "../../../Redux/action";
import { useDispatch } from "react-redux";
import Link from "next/link";
export default function Products1({ useSliderState }) {
  //State declarations
  const [sectionDetailsDatas, setSectionDetailsDatas] = useSliderState([]);
  const dispatch = useDispatch();

  //Filter to get data of collection
  const isGroup = Array.isArray(sectionDetailsDatas?.section_data)
    ? sectionDetailsDatas.section_data.filter(
        (item) =>
          item.is_group === 1 &&
          item.sub_data.some((d) => d.section_type === "COLLECTION")
      )
    : [];

  return (
    isGroup?.length > 0 && (
      <>
        <section className="collections-grid collections-grid_masonry gutters-20">
          {isGroup &&
            isGroup?.map((item, i) => {
              if (item?.is_group !== 1) return null;
              const subData = item?.sub_data || [];
              var megaMenu = JSON.parse(
                sessionStorage.getItem("megaMenus")
              )?.navigation_data?.filter(
                (elm) => elm.product_vertical_name === subData[0]?.vertical_code
              )[0];
              return (
                <div className="h-md-100 full-width_padding-20" key={i}>
                  {/* {item.position <= 3 && ( */}
                  <div className="row h-md-100">
                    {subData.length > 0 && (
                      <div
                        className={`${
                          subData.length > 1 ? "col-lg-5" : "col-md-12"
                        } h-md-100`}
                      >
                        <div className="collection-grid__item position-relative h-md-100">
                          <Link
                            className="background-img"
                            style={{
                              backgroundImage: `url(${subData[0].banner_image})`,
                            }}
                            href={
                              isEmpty(subData[0]?.product_title) !== ""
                                ? `/products/${changeUrl(
                                    megaMenu?.menu_name
                                  )}/type/${subData[0]?.product_title
                                    ?.split(" ")
                                    ?.join("-")
                                    ?.toLowerCase()}`
                                : `/products/${changeUrl(megaMenu?.menu_name)}`
                            }
                            aria-label={
                              subData[0].display_name ||
                              `Collection banner ${i + 1}`
                            }
                          ></Link>
                          <div className="content_abs content_top content_left content_top-md content_left-md pt-2 px-2">
                            <h3 className="text-uppercase">
                              {subData[0].display_name}
                            </h3>
                            <Link
                              href={
                                isEmpty(subData[0]?.product_title) !== ""
                                  ? `/products/${changeUrl(
                                      subData[0]?.display_name
                                    )}/type/${subData[0]?.product_title
                                      ?.split(" ")
                                      ?.join("-")
                                      ?.toLowerCase()}`
                                  : `/products/${changeUrl(
                                      subData[0]?.display_name
                                    )}`
                              }
                              className="btn-link default-underline text-uppercase fw-medium"
                              onClick={() => {
                                dispatch(isFilter(true));
                                dispatch(filterData([]));
                                dispatch(filteredData([]));
                                dispatch(storeItemObject({}));
                                sessionStorage.setItem(
                                  "productFilterState",
                                  JSON.stringify({
                                    getAllFilteredHome: true,
                                    dimension: subData[0]?.dimension,
                                    item_group: subData[0]?.item_group,
                                    segments: subData[0]?.segment,
                                    vertical_code: subData[0]?.vertical_code,
                                  })
                                );
                              }}
                              aria-label={
                                subData[0].display_name ||
                                `Collection Shop Now ${i + 1}`
                              }
                            >
                              Shop Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-lg-7 d-flex flex-column gap-20">
                      {subData
                        ?.slice(1)
                        ?.reduce((result, sub, index, arr) => {
                          if (index % 2 === 0) {
                            const nextItem = arr[index + 1] ?? null;
                            result.push([sub, nextItem]);
                          }
                          return result;
                        }, [])
                        .map(([first, second], index) => {
                          var megaMenuFirst = JSON.parse(
                            sessionStorage.getItem("megaMenus")
                          )?.navigation_data?.filter(
                            (elm) =>
                              elm.product_vertical_name === first?.vertical_code
                          )[0];
                          var megaMenuSecond = JSON.parse(
                            sessionStorage.getItem("megaMenus")
                          )?.navigation_data?.filter(
                            (elm) =>
                              elm.product_vertical_name ===
                              second?.vertical_code
                          )[0];
                          return (
                            <div
                              className="position-relative flex-grow-1"
                              key={index}
                            >
                              <div className="row h-md-100">
                                <div
                                  className={`${
                                    second === null ? "col-md-12" : "col-md-6"
                                  } h-md-100`}
                                >
                                  <div className="collection-grid__item h-md-100 position-relative">
                                    <Link
                                      className="background-img"
                                      style={{
                                        backgroundImage: `url(${first.banner_image})`,
                                      }}
                                      aria-label={
                                        first?.display_name ||
                                        `Collection banner ${index + 1}`
                                      }
                                      href={
                                        isEmpty(first?.product_title) !== ""
                                          ? `/products/${changeUrl(
                                              first?.display_name
                                            )}/type/${first?.product_title
                                              ?.split(" ")
                                              ?.join("-")
                                              ?.toLowerCase()}`
                                          : `/products/${changeUrl(
                                              first?.display_name
                                            )}`
                                      }
                                    ></Link>
                                    <div className="content_abs content_top content_left content_top-md content_left-md pt-2 px-2">
                                      <h3 className="text-uppercase">
                                        {first?.display_name}
                                      </h3>
                                      <Link
                                        href={
                                          isEmpty(first?.product_title) !== ""
                                            ? `/products/${changeUrl(
                                                first?.display_name
                                              )}/type/${first?.product_title
                                                ?.split(" ")
                                                ?.join("-")
                                                ?.toLowerCase()}`
                                            : `/products/${changeUrl(
                                                first?.display_name
                                              )}`
                                        }
                                        className="btn-link default-underline text-uppercase fw-medium"
                                        onClick={() => {
                                          dispatch(isFilter(true));
                                          dispatch(filterData([]));
                                          dispatch(filteredData([]));
                                          dispatch(storeItemObject({}));
                                          sessionStorage.setItem(
                                            "productFilterState",
                                            JSON.stringify({
                                              getAllFilteredHome: true,
                                              dimension: first?.dimension,
                                              item_group: first?.item_group,
                                              segments: first?.segment,
                                              vertical_code:
                                                first?.vertical_code,
                                            })
                                          );
                                        }}
                                        aria-label={
                                          first?.display_name ||
                                          `Collection Shop Now ${index + 1}`
                                        }
                                      >
                                        Shop Now
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                                {second && (
                                  <div
                                    className="col-md-6 h-md-100 position-relative flex-grow-1"
                                    key={second.id || `second-${index}`}
                                  >
                                    <div className="collection-grid__item h-md-100 position-relative">
                                      <Link
                                        className="background-img"
                                        style={{
                                          backgroundImage: `url(${second.banner_image})`,
                                        }}
                                        href={
                                          isEmpty(second?.product_title) !== ""
                                            ? `/products/${changeUrl(
                                                second?.display_name
                                              )}/type/${second?.product_title
                                                ?.split(" ")
                                                ?.join("-")
                                                ?.toLowerCase()}`
                                            : `/products/${changeUrl(
                                                second?.display_name
                                              )}`
                                        }
                                        aria-label={
                                          second?.display_name ||
                                          `Collection banner ${index + 1}`
                                        }
                                      ></Link>
                                      <div className="content_abs content_top content_left content_top-md content_left-md pt-2 px-2">
                                        <h3 className="text-uppercase">
                                          {second?.display_name}
                                        </h3>
                                        <Link
                                          href={
                                            isEmpty(second?.product_title) !==
                                            ""
                                              ? `/products/${changeUrl(
                                                  second?.display_name
                                                )}/type/${second?.product_title
                                                  ?.split(" ")
                                                  ?.join("-")
                                                  ?.toLowerCase()}`
                                              : `/products/${changeUrl(
                                                  second?.display_name
                                                )}`
                                          }
                                          className="btn-link default-underline text-uppercase fw-medium"
                                          onClick={() => {
                                            dispatch(isFilter(true));
                                            dispatch(filterData([]));
                                            dispatch(filteredData([]));
                                            dispatch(storeItemObject({}));
                                            sessionStorage.setItem(
                                              "productFilterState",
                                              JSON.stringify({
                                                getAllFilteredHome: true,
                                                dimension: second?.dimension,
                                                item_group: second?.item_group,
                                                segments: second?.segment,
                                                vertical_code:
                                                  second?.vertical_code,
                                              })
                                            );
                                          }}
                                          aria-label={
                                            second?.display_name ||
                                            `Collection Shop Now ${index + 1}`
                                          }
                                        >
                                          Shop Now
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  {/* )} */}
                </div>
              );
            })}
        </section>
        <div className="section-gap"></div>
      </>
    )
  );
}
