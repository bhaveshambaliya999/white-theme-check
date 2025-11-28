import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "../../../Redux/action";
import { changeUrl, isEmpty } from "../../../CommanFunctions/commanFunctions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Lookbook({ useSliderState }) {
  const [sectionDetailsDatas] = useSliderState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  if (!sectionDetailsDatas?.section_data?.length) return null;

  const megaMenus =
    JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data || [];

  return (
    <>
      {sectionDetailsDatas.section_data.map((c, index) => {
        if (c.is_group !== 0 || c.section_type !== "COLLECTION") return null;

        const megaMenu = megaMenus.find(
          (item) => item.product_vertical_name === c?.vertical_code
        );

        const productLink =
          isEmpty(c?.product_title) !== ""
            ? `/products/${changeUrl(c.display_name)}`
            // ? `/products/${changeUrl(c.display_name)}/collection/${changeUrl(
            //     c?.product_title
            //   )}`
            : `/products/${changeUrl(c.collection_name)}`;

        return (
          <section className="lookbook-products position-relative" key={index}>
            <div
              // href={productLink}
              aria-label={
                c?.display_name?.toUpperCase() ||
                `Lookbook Product ${index + 1}`
              }
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
                    vertical_code: c?.vertical_code,
                  })
                );
                router.push(productLink);
              }}
              className="cursor-pointer"
            >
              <picture>
                <Image
                  className="lookbook-img"
                  src={c.banner_image}
                  width={1903}
                  height={709}
                  alt={
                    c.display_name?.toUpperCase() ||
                    `Lookbook Product ${index + 1}`
                  }
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="section-title text-center">
              <h2>{c.display_name?.toUpperCase()}</h2>
              {c.description && (
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: c.description }}
                />
              )}
              <div
                // href={productLink}
                className="btn btn-outline-primary text-uppercase fw-medium mt-3 cursor-pointer"
                aria-label="Shop Now"
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
                      vertical_code: c?.vertical_code,
                    })
                  );
                  router.push(productLink);
                }}
              >
                Shop Now
              </div>
            </div>
          </section>
        );
      })}
      <div className="section-gap"></div>
    </>
  );
}
