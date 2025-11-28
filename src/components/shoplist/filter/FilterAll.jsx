import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterData, filteredData, isFilter } from "@/Redux/action";
import { closeModalShopFilter } from "@/utlis/aside";
import { usePathname, useParams } from "next/navigation";



export default function FilterAll() {
  //State Declerations
  const filterDatas = useSelector((state) => state.filterData);
  const filteredDatas = useSelector((state) => state.filteredData);
  const isFilters = useSelector((state) => state.isFilter);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const params = useParams();
  const [filterKey, setFilterKey] = useState(false);
  const [filtereSettingData, setFiltereSettingData] = useState(
    filterDatas
  );

  const [price, setPrice] = useState([20, 70987]);
  const [activeSizes, setActiveSizes] = useState([]);
  const toggleSize = (size) => {
    if (activeSizes.includes(size)) {
      setActiveSizes((pre) => [...pre.filter((elm) => elm != size)]);
    } else {
      setActiveSizes((pre) => [...pre, size]);
    }
  };
  const [activeBrands, setActiveBrands] = useState([]);

  //Type based update filter data
  useEffect(() => {
    setFiltereSettingData(filterDatas);
    if (pathname.includes("/type/")) {
      dispatch(isFilter(true));
    } else {
      dispatch(isFilter(false));
    }
  }, [filterDatas, params.title]);

  //Apply filter function
  const appliedFilter = useCallback(
  (header, val) => {
    const isSelected = filteredDatas.some(
      (filter) =>
        filter.key === header.fielter_key &&
        filter.value.includes(val.data_key)
    );

    let updatedFilters;

    if (filteredDatas.some((f) => f.key === header.fielter_key)) {
      updatedFilters = filteredDatas.map((filter) =>
        filter.key === header.fielter_key
          ? {
              ...filter,
              value: isSelected
                ? filter.value.filter((key) => key !== val.data_key)
                : [...filter.value, val.data_key],
            }
          : filter
      );
    } else {
      updatedFilters = [
        ...filteredDatas,
        { key: header.fielter_key, value: [val.data_key] },
      ];
    }

    dispatch(filteredData(updatedFilters));
    closeModalShopFilter();
  },
  [filteredDatas] 
);

  // const appliedFilter = (header, val, index, checked, i) => {
  //   window.scrollTo(0, 0);
  //   const data = filterDatas;
  //   dispatch(filteredData([]));
  //   const arr = [];
  //   const updatedFilterSettingData = data.map((h) => {
  //     if (h.fielter_key === header.fielter_key) {
  //       return {
  //         ...h,
  //         selected_values: true
  //           ? [...h.selected_values, h.value[i]["data_key"]]
  //           : h.selected_values.filter((key) => key !== h.value[i]["data_key"]),
  //       };
  //     }
  //     return h;
  //   });
  //   setFiltereSettingData(updatedFilterSettingData);
  //   let arr1 = [];
  //   for (let i = 0; i < Number(8); i++) {
  //     arr1.push(i);
  //   }
  //   updatedFilterSettingData.map((h) => {
  //     arr.push({ key: h.fielter_key, value: h.selected_values });
  //   });
  //   dispatch(filteredData(arr));
  //   closeModalShopFilter();
  // };

  // const toggleBrands = (brand) => {
  //   if (activeBrands.includes(brand)) {
  //     setActiveBrands((pre) => [...pre.filter((elm) => elm != brand)]);
  //   } else {
  //     setActiveBrands((pre) => [...pre, brand]);
  //   }
  // };

  // Handle On change function for filter
  const handleOnChange = (e, filterItem, index) => {
    setFiltereSettingData(filterDatas);

    setFiltereSettingData((prevResults) =>
      prevResults.map((item, i) =>
        i === index
          ? {
            ...item,
            value: filterDatas[index].value.filter((val) =>
              val.data_value
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
            ),
          }
          : item
      )
    );
  };

  // const handleOnChange = (value) => {
  //   setPrice(value);
  // };
  return (
    <>
      {/* <div className="accordion" id="categories-list">
        {filterDatas.map((e, index) => {
          return (
            <div className="accordion-item mb-4" key={index}>
              <h5 className="accordion-header" id="accordion-heading-11">
                <button
                  className="accordion-button p-0 border-0 fs-5 text-uppercase"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#accordion-filter-${index}`}
                  aria-expanded="true"
                  aria-controls="accordion-filter-1"
                >
                  {e.fielter_title}
                  <svg className="accordion-button__icon" viewBox="0 0 14 14">
                    <g aria-hidden="true" stroke="none" fillRule="evenodd">
                      <path
                        className="svg-path-vertical"
                        d="M14,6 L14,8 L0,8 L0,6 L14,6"
                      />
                      <path
                        className="svg-path-horizontal"
                        d="M14,6 L14,8 L0,8 L0,6 L14,6"
                      />
                    </g>
                  </svg>
                </button>
              </h5>
              <div
                id={`accordion-filter-${index}`}
                className="accordion-collapse collapse show border-0"
                aria-labelledby="accordion-heading-11"
                data-bs-parent="#categories-list"
              >
                <div className="accordion-body px-0 pb-0">
                  <ul className="list list-inline row row-cols-2 mb-0">
                    {e.value.map((val, i) => {
                      const isSelected = filteredDatas.some(
                        (filter) =>
                          filter.key === e.fielter_key &&
                          filter.value.includes(val.data_key)
                      );

                      return (
                        <li
                          key={i}
                          className="list-item"
                          onClick={() => {
                            appliedFilter(e, val, index, !isSelected, i);
                          }}
                        >
                          <a
                            href="#"
                            className={`menu-link py-1 ${
                              isSelected ? "menu-active" : ""
                            }`}
                          >
                            {val.data_value}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
      {/* /.accordion-item */}
      {/* <div className="accordion" id="color-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="accordion-heading-1">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-2"
              aria-expanded="true"
              aria-controls="accordion-filter-2"
            >
              Color
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path
                    className="svg-path-vertical"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                  <path
                    className="svg-path-horizontal"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-2"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-1"
            data-bs-parent="#color-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap">
                {colors.map((swatch, index) => (
                  <a
                    onClick={() => setActiveColor(swatch)}
                    key={index}
                    className={`swatch-color js-filter ${
                      activeColor == swatch ? "swatch_active" : ""
                    }`}
                    style={{ color: swatch.color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* /.accordion */}
      {filtereSettingData &&
        filtereSettingData?.map((e, index) => {
          if (e.fielter_key === "master_weight_version") {
            return (
              <div className="accordion filters-accordion" id="size-filters" key={index}>
                <div className="accordion-item mb-4">
                  <div className="accordion-header h5" id="accordion-heading-size">
                    <button
                      className="accordion-button p-0 border-0 fs-5 text-capitalize"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordion-filter-size"
                      aria-expanded="true"
                      aria-controls="accordion-filter-size"
                    >
                      {e.fielter_title}
                      <svg
                        className="accordion-button__icon"
                        viewBox="0 0 14 14"
                      >
                        <g aria-hidden="true" stroke="none" fillRule="evenodd">
                          <path
                            className="svg-path-vertical"
                            d="M14,6 L14,8 L0,8 L0,6 L14,6"
                          />
                          <path
                            className="svg-path-horizontal"
                            d="M14,6 L14,8 L0,8 L0,6 L14,6"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div
                    id="accordion-filter-size"
                    className="accordion-collapse collapse show border-0"
                    aria-labelledby="accordion-heading-size"
                    data-bs-parent="#size-filters"
                  >
                    <div className="accordion-body px-0 pb-0">
                      <div className="d-flex flex-wrap">
                        {e.value.map((val, i) => {
                          const isSelected = filteredDatas.some(
                            (filter) =>
                              filter.key === e.fielter_key &&
                              filter.value.includes(val.data_key)
                          );

                          return (
                            <div key={i} onClick={(event) => {
                                appliedFilter(
                                  e,
                                  val,
                                  index,
                                  event.target.checked,
                                  i
                                );
                              }}
                              className={`btn-side-normal mb-2 me-2 cursor-pointer ${isSelected ? "filter-active" : ""
                                } `}
                            >
                              {val.data_value
                                .split(" ")
                                ?.join(" ")
                                ?.toLowerCase()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      {/* /.accordion */}
      {filtereSettingData &&
        filtereSettingData.map((item, index) => {
          if (item.fielter_key === "master_weight_version") {
            return;
          }
          return (
            <div className="accordion filters-accordion" id="brand-filters" key={index}>
              <div className="accordion-item mb-4">
                <div className="accordion-header h5" id="accordion-heading-brand">
                  <button
                    className="accordion-button p-0 border-0 fs-5 text-capitalize"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#accordion-filter-brand-${index}`}
                    aria-expanded="true"
                    aria-controls="accordion-filter-brand"
                  >
                    {item.fielter_title}
                    <svg className="accordion-button__icon" viewBox="0 0 14 14">
                      <g aria-hidden="true" stroke="none" fillRule="evenodd">
                        <path
                          className="svg-path-vertical"
                          d="M14,6 L14,8 L0,8 L0,6 L14,6"
                        />
                        <path
                          className="svg-path-horizontal"
                          d="M14,6 L14,8 L0,8 L0,6 L14,6"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
                <div
                  id={`accordion-filter-brand-${index}`}
                  className="accordion-collapse collapse show border-0"
                  aria-labelledby="accordion-heading-brand"
                  data-bs-parent="#brand-filters"
                >
                  <div className="search-field multi-select accordion-body px-0 pb-0">
                    <div className="search-field__input-wrapper mb-3">
                      <input
                        type="text"
                        name="search_text"
                        className="search-field__input form-control form-control-sm border-light border-2"
                        placeholder="SEARCH"
                        onChange={(e) => handleOnChange(e, item, index)}
                      />
                    </div>
                    <ul className="multi-select__list list-unstyled filter-list">
                      {item.value.map((val, i) => {
                        const isSelected = filteredDatas.some(
                          (filter) =>
                            filter.key === item.fielter_key &&
                            filter.value.includes(val.data_key)
                        );

                        return (
                          // <li key={i} onClick={(event) => {
                          //     appliedFilter( item, val, index, event.target.checked, i ); }}
                          //   className={`search-suggestion__item multi-select__item text-primary js-search-select js-multi-select ${isSelected ? "mult-select__item_selected" : ""
                          //     }`} >
                          //   <span className="me-auto text-capitalize">
                          //     {val.data_value
                          //       .split(" ")
                          //       ?.join(" ")
                          //       ?.toLowerCase()}
                          //   </span>
                          // </li>
                          <li key={i}  >
                            <label className={`search-suggestion__item multi-select__item text-primary js-search-select js-multi-select ${isSelected ? "mult-select__item_selected" : ""  }`}>
                              <input
                                type="checkbox"
                                className="me-2"
                                checked={isSelected}
                                onChange={(e) =>
                                  appliedFilter(item, val, index, e.target.checked, i)
                                }
                              />
                              <span className="me-auto text-capitalize">
                                {val.data_value.split(" ")?.join(" ")?.toLowerCase()}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {/* /.accordion */}
      {/* <div className="accordion" id="price-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header mb-2" id="accordion-heading-price">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-price"
              aria-expanded="true"
              aria-controls="accordion-filter-price"
            >
              Price
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path
                    className="svg-path-vertical"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                  <path
                    className="svg-path-horizontal"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-price"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-price"
            data-bs-parent="#price-filters"
          >
            <Slider
              range
              formatLabel={() => ``}
              max={100000}
              min={0}
              defaultValue={price}
              onChange={(value) => handleOnChange(value)}
              id="slider"
            />
            <div className="price-range__info d-flex align-items-center mt-2">
              <div className="me-auto">
                <span className="text-secondary">Min Price: </span>
                <span className="price-range__min">${price[0]}</span>
              </div>
              <div>
                <span className="text-secondary">Max Price: </span>
                <span className="price-range__max">${price[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* /.accordion */}
      {/* <div className="filter-active-tags pt-2">
        {filterFacts.map((filter) => (
          <button
            onClick={() =>
              setFilterFacts((pre) => [
                ...pre.filter((elm) => elm.label != filter.label),
              ])
            }
            key={filter.id}
            className="filter-tag d-inline-flex align-items-center mb-3 me-3 text-uppercase js-filter"
          >
            <i className="btn-close-xs d-inline-block" />
            <span className="ms-2">{filter.label}</span>
          </button>
        ))}
        <div></div>
      </div> */}
    </>
  );
}
