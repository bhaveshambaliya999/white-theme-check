import { useEffect, useState } from "react";
import CartLength from "./components/CartLength";
import { openCart } from "@/utlis/openCart";
import MobileNav from "./components/MobileNav";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondShape,
  DiySteperData,
  engravingObj,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  isLoginModal,
  isRegisterModal,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  loginData,
  naviGationMenuData,
  previewImageDatas,
  saveEmbossings,
  storeActiveFilteredData,
  storeCurrency,
  storeCurrencyData,
  storeDiamondNumber,
  storeEmbossingData,
  storeEntityId,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeHeaderFavLogo,
  storeHeaderLogo,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
import commanService, { domain } from "@/CommanService/commanService";
import { openModalUserlogin } from "@/utlis/aside";
import { useContextElement } from "@/context/Context";
import {
  isEmpty,
  RandomId,
  safeParse,
} from "@/CommanFunctions/commanFunctions";
import Image from "next/image";
import { useRouter } from "next/router";

export default function MobileHeader({ storeData }) {
  const storeEntityIds =
    storeData || useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const storeHeaderLog = useSelector((state) => state.storeHeaderLogo);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;

  const reduxStoreCurrencyData = useSelector(
    (state) => state.storeCurrencyData
  );
  const storeCurrencyDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("storeCurrencyData")) ||
        reduxStoreCurrencyData
      : reduxStoreCurrencyData;
  const reduxStoreNav = useSelector((state) => state.naviGationMenuData);
  const naviGationMenuDatas =
    typeof window !== "undefined"
      ? safeParse(sessionStorage.getItem("navMenuData")) || reduxStoreNav
      : reduxStoreNav;

  const socialUrlDatas = useSelector((state) => state?.socialUrlData) || [];

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { getCartItems, getWishListFavourit } = useContextElement();
  const [show, setShow] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");

  const homePageNavigation = () => {
    dispatch(isRegisterModal(false));
    dispatch(isLoginModal(false));
    dispatch(filteredData([]));
    dispatch(filterData([]));
    dispatch(isFilter(false));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(finalCanBeSetData([]));
    dispatch(diamondDIYimage(""));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    const lastScrollY = { current: window.scrollY };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const updateCartCurrency = (e) => {
    const obj = {
      a: "updateCartCurrency",
      store_id: storeEntityIds.mini_program_id,
      SITDeveloper: "1",
      origin: storeEntityIds.origin,
      member_id:
        Object.keys(loginDatas).length > 0 ? loginDatas.member_id : RandomId,
      new_currency: e,
    };
    commanService
      .postApi("/StoreCart ", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (pathname.includes("/start-with-a-")) {
            dispatch(storeEmbossingData([]));
            dispatch(saveEmbossings(false));
            dispatch(previewImageDatas([]));
            dispatch(activeImageData([]));
            dispatch(engravingObj({}));
            dispatch(DiySteperData([]));
            dispatch(ActiveStepsDiy(0));
            sessionStorage.removeItem("DIYVertical");
            router.push("/make-your-customization");
          }
        }
      })
      .catch(() => {});
  };

  const changeCurrency = (e) => {
    const data = storeCurrencyDatas.filter(
      (s) => s.mp_store_price === e.target.value
    );
    if (data?.[0]?.mp_b2c_url && data?.[0].is_store !== 1) {
      window.open(data[0]?.mp_b2c_url, "_blank", "");
    } else {
      updateCartCurrency(data?.[0].mp_store_price);
      dispatch(storeCurrency(data?.[0]?.mp_store_price));
      sessionStorage.setItem("storeCurrency", data?.[0]?.mp_store_price);
      router.push(pathname.includes("_checkout") ? "/shop_cart" : pathname);
      window.scroll(0, 0);
    }
  };

  return (
    <div
      className={`header-mobile header_sticky ${
        scrollDirection == "up" ? "header_sticky-active" : "position-absolute"
      } `}
    >
      <div className="container d-flex align-items-center h-100">
        <a
          className="mobile-nav-activator d-block position-relative"
          href="#"
          aria-label="mobile toggle"
          onClick={() => {
            setShow(true);
          }}
        >
          <svg
            className="nav-icon"
            width="25"
            height="18"
            viewBox="0 0 25 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use xlinkHref="#icon_nav" />
          </svg>
          <span className="btn-close-lg position-absolute top-0 start-0 w-100"></span>
        </a>

        <div className="logo">
          {storeHeaderLog && storeHeaderLog.length > 0
            ? storeHeaderLog.map((h, index) => (
                <Link
                  href="/"
                  key={index}
                  onClick={() => homePageNavigation()}
                  refresh="true"
                  className="logo_mobile_link"
                  aria-label={`HomePage Logo`}
                >
                  <Image
                    src={h.image}
                    alt="B2C Logo"
                    loading="lazy"
                    width={118}
                    height={48}
                    className="img-fluid logo__image logo_mobile_image d-block"
                  />
                </Link>
              ))
            : ""}
        </div>

        <div
          onClick={() => openCart()}
          className="header-tools__item header-tools__cart js-open-aside"
        >
          <svg
            className="d-block"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use xlinkHref="#icon_cart" />
          </svg>
          <span className="cart-amount d-block position-absolute js-cart-items-count">
            <CartLength />
          </span>
        </div>
      </div>
      {/* <!-- /.container --> */}

      <nav className="header-mobile__navigation navigation d-flex flex-column w-100 position-absolute top-100 bg-body overflow-auto">
        <div className="container">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="search-field position-relative mt-4 mb-3"
          ></form>
          {/* <!-- /.header-search --> */}
        </div>
        {/* <!-- /.container --> */}

        <div className="container">
          <div className="overflow-hidden">
            <ul className="navigation__list list-unstyled position-relative">
              {naviGationMenuDatas?.length > 0 && (
                <MobileNav
                  naviGationMenuDatas={naviGationMenuDatas}
                  setShow={setShow}
                  show={show}
                />
              )}
            </ul>
            {/* <!-- /.navigation__list --> */}
          </div>
          {/* <!-- /.overflow-hidden --> */}
        </div>
        {/* <!-- /.container --> */}

        <div className="border-top mt-auto pb-2">
          {!isLogin ? (
            <div
              className="customer-links container mt-4 mb-2 pb-1"
              onClick={openModalUserlogin}
            >
              <svg
                className="d-inline-block align-middle"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_user" />
              </svg>
              <span className="d-inline-block ms-2 text-uppercase align-middle fw-medium">
                My Account
              </span>
            </div>
          ) : (
            <Link href="/account_dashboard" aria-label={`Account Dashboard`}>
              <div className="customer-links container mt-4 mb-2 pb-1">
                <svg
                  className="d-inline-block align-middle"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_user" />
                </svg>
                <span className="d-inline-block ms-2 text-uppercase align-middle fw-medium">
                  My Account
                </span>
              </div>
            </Link>
          )}
          {/* <div className="container d-flex align-items-center">
            <label className="me-2 text-secondary">Language</label>
            <select
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Default select example"
              name="store-language"
            >
              {languageOptions.map((option, index) => (
                <option
                  key={index}
                  className="footer-select__option"
                  value={option.value}
                >
                  {option.text}
                </option>
              ))}
            </select>
          </div> */}

          <div className="container d-flex align-items-center">
            <label className="me-2 text-secondary">Currency</label>
            {Object.keys(storeEntityIds).length > 0
              ? storeCurrencyDatas?.length > 0 && (
                  <select
                    className="form-select form-select-sm bg-transparent border-0"
                    aria-label="Default select example"
                    name="store-language"
                    value={storeCurrencys}
                    onChange={(e) => changeCurrency(e)}
                  >
                    {storeCurrencyDatas &&
                      storeCurrencyDatas?.map((e, i) => {
                        return (
                          <option
                            className="footer-select__option"
                            key={i}
                            value={e.mp_store_price}
                          >
                            {e.mp_store_price}
                          </option>
                        );
                      })}
                  </select>
                )
              : ""}
          </div>
          <ul className="container social-links list-unstyled d-flex flex-wrap mb-0">
            {socialUrlDatas &&
              socialUrlDatas?.length > 0 &&
              socialUrlDatas?.map((s, i) => (
                <li key={i}>
                  <Link
                    className="footer__social-link d-block"
                    target={"_blank"}
                    href={s.url}
                    aria-label={`Footer Social`}
                  >
                    <Image
                      src={s.image}
                      alt="Footer Social"
                      className="img-fluid"
                      width={15}
                      height={15}
                    ></Image>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>
      {/* <!-- /.navigation --> */}
    </div>
  );
}
