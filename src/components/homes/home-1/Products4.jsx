/* eslint-disable react/no-unescaped-entities */
import { changeUrl, isEmpty } from "../../../CommanFunctions/commanFunctions";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "../../../Redux/action";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Products4({ useSliderState }) {
  const [sectionDetailsDatas] = useSliderState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  if (!sectionDetailsDatas?.section_data?.length) return null;

  const megaMenus =
    JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data || [];

  const isOffer = Array.isArray(sectionDetailsDatas?.section_data)
    ? sectionDetailsDatas.section_data.flatMap((item) =>
        Array.isArray(item.sub_data)
          ? item.sub_data.filter((subItem) => subItem.section_type === "OFFER")
          : []
      )
    : [];

  if (!isOffer.length) return null;

  const handleShopClick = (c, megaMenu) => {
    dispatch(isFilter(false));
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
        ? `/products/${changeUrl(c.display_name)}/offer/${changeUrl(
            isEmpty(c.offer_detail?.code)
          )}`
        : `/products/${changeUrl(c.display_name)}/type/${c.product_title
            .split(" ")
            .join("-")
            .toLowerCase()}`
    );
  };

  return (
    <section className="grid-banner container">
      <div className="row">
        {sectionDetailsDatas.section_data.length > 0 &&
          sectionDetailsDatas.section_data.map((d, index) => {
            if (d.is_group !== 1) return null;

            return d.sub_data?.map((c, i) => {
              const megaMenu = megaMenus.find(
                (m) => m.product_vertical_name === c.vertical_code
              );

              if (c?.section_type !== "OFFER") return null;

              const colClass =
                d.sub_data.length > 3
                  ? "col-md-3"
                  : d.sub_data.length > 2
                  ? "col-md-4"
                  : d.sub_data.length > 1
                  ? "col-md-6"
                  : "col-md-12";

              return (
                <div className={colClass} key={i}>
                  <div className="grid-banner__item grid-banner__item_rect position-relative mb-3 mb-md-0">
                    <div
                      className="background-img"
                      style={{ backgroundImage: `url(${c.banner_image})` }}
                    ></div>
                    <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                      <p className="text-uppercase fw-medium mb-2">
                        {c.offer_detail?.name}
                      </p>
                      <h3 className="mb-2">{c.display_name}</h3>
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
                        aria-label="Shop Now"
                        className="btn-link default-underline text-uppercase fw-medium cursor-pointer"
                        onClick={()=>handleShopClick(c, megaMenu)}
                      >
                        Shop Now
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })}
      </div>
    </section>
  );
}
