import Link from "next/link";
import { useEffect, useState } from "react";
import {
  diamondNumber,
  diamondPageChnages,
  filterData,
  filteredData,
  isFilter,
  storeActiveFilteredData,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeItemObject,
} from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";
import { changeUrl } from "@/CommanFunctions/commanFunctions";

export default function MobileFooter1() {
  //states and variable declarations
  const [showFooter, setShowFooter] = useState(false);
  const reduxStoreNav = useSelector((state) => state.naviGationMenuData);
  const naviGationMenuDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("navMenuData")) || reduxStoreNav
      : reduxStoreNav;
  const favCounts = useSelector((state) => state.favCount);
  const dispatch = useDispatch();

  useEffect(() => {
    setShowFooter(true);
  }, []);

  const handleOnClick = () => {
    dispatch(isFilter(true));
    dispatch(filterData([]));
    dispatch(filteredData([]));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
  };
  const navigateMenu =
    naviGationMenuDatas?.filter((item) => item.product_vertical_name !== "")[0]
      ?.menu_name || "";
  return (
    <footer
      className={`footer-mobile container w-100 px-5 d-md-none bg-body ${
        showFooter ? "position-fixed footer-mobile_initialized" : ""
      }`}
    >
      <div className="row text-center">
        <div className="col-4">
          <Link
            href="/"
            className="footer-mobile__link d-flex flex-column align-items-center"
            onClick={() => handleOnClick()}
          >
           <svg
              className="d-block"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#icon_home" />
            </svg>
            <span>Home</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}

        <div className="col-4">
          <Link
            href={`/products/${changeUrl(navigateMenu)}`}
            className="footer-mobile__link d-flex flex-column align-items-center"
            onClick={() => handleOnClick()}
          >
             <svg
              className="d-block"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#icon_hanger" />
            </svg>
            <span>Shop</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}

        <div className="col-4">
          <Link
            href="/account_wishlist"
            className="footer-mobile__link d-flex flex-column align-items-center"
            onClick={() => handleOnClick()}
          >
            <div className="position-relative">
              <svg
                className="d-block"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_heart" />
              </svg>
              <span className="wishlist-amount d-block position-absolute js-wishlist-count">
                {favCounts ?? 0}
              </span>
            </div>
            <span>Wishlist</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}
      </div>
      {/* <!-- /.row --> */}
    </footer>
  );
}
