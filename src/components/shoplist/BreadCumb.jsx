import { changeUrl, isEmpty } from "@/CommanFunctions/commanFunctions";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  DIYName,
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
  naviGationMenuData,
  previewImageDatas,
  saveEmbossings,
  storeActiveFilteredData,
  storeDiamondArrayImage,
  storeDiamondNumber,
  storeEmbossingData,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function BreadCumb({
  showDiamondDetails,
  diamondDataList,
  handleReset,
  uniqueId,
  type,
}) {
  //State declerations
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const diamondSelectShapes = useSelector((state) => state.diamondSelectShape);
  const activeDIYtabss = useSelector((state) => state.activeDIYtabs);
  // always call hooks
  const reduxLoginData = useSelector((state) => state.loginData);
  const reduxNavigationMenu = useSelector((state) => state.naviGationMenuData);

  // then safely read sessionStorage (browser only)
  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData") || "null") ||
        reduxLoginData ||
        {}
      : reduxLoginData || {};

  const navigationMenuDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("megaMenus") || "null")
          ?.navigation_data ||
        reduxNavigationMenu ||
        []
      : reduxNavigationMenu || [];

  const DIYNames = useSelector((state) => state.DIYName);

  const dispatch = useDispatch();
  const [selectedProductName, setSelectedProductName] = useState("");
  const [showMenuName, setShowMenuName] = useState("Products");
  const isDiy = pathname?.includes("/make-your-customization");
  //Update menu name from Params
  useEffect(() => {
    if (params.slug?.[1]?.includes("pv") || params.slug?.[1]) {
      var splitvalue = params.slug?.[1].split("-");
      var productName = splitvalue.slice(0, splitvalue.length - 1).join(" ");
      setSelectedProductName(productName.toLowerCase());
    }

    if (!pathname?.includes("diamond") && !pathname?.includes("gemstone")) {
      navigationMenuDatas.forEach((element) => {
        if (changeUrl(element.menu_name) === changeUrl(params.slug?.[0])) {
          setShowMenuName(element.menu_name.toLowerCase());
        }
      });
    }
    if(pathname.includes("viewjourney")){
      setShowMenuName("Journey Catalogue")
    }
    if(pathname.includes("campaign")){
      setShowMenuName("Campaign Detail")
    }
  }, [router.asPath, params, pathname, navigationMenuDatas]);

  //Onclick function for Make Your Customization
  const handleSetDiy = () => {
    dispatch(ActiveStepsDiy(0));
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
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
    dispatch(diamondSelectShape({}));
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(engravingObj({}));
    dispatch(DiySteperData([]));
    dispatch(DIYName(""));
    sessionStorage.removeItem("itemToItemData");
    sessionStorage.removeItem("DIYVertical");
    router.push("/make-your-customization");
    // dispatch(DIYName(""));
  };
  //Onclick function for DIY start with setting
  const handleStartWithSetting = () => {
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYimage(""));
    // sessionStorage.removeItem("DIYVertical");
    sessionStorage.removeItem("itemToItemData");
    router.push("/make-your-customization/start-with-a-setting");
  };
  //Onclick function for DIY start with diamond
  const handleStartWithDiamond = () => {
    router.push("/make-your-customization/start-with-a-diamond");
    dispatch(diamondPageChnages(false));
    dispatch(storeFilteredData({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(diamondNumber(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(activeDIYtabs("Diamond"));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(finalCanBeSetData([]));
    dispatch(storeSpecData({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
  };
  //Onclick function for DIY Item to Item
  const handleStartWithItems = () => {
    // sessionStorage.removeItem("DIYVertical");
    router.push("/make-your-customization/start-with-a-item");
    dispatch(storeEmbossingData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(DiySteperData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(engravingObj({}));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYimage(""));
  };

  //Onclick function for Home page navigation
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
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(engravingObj({}));
    sessionStorage.removeItem("DIYVertical");
    sessionStorage.removeItem("itemToItemData");
    dispatch(DIYName(""));
  };
  return (
    <>
      <Link
        href="/"
        className="menu-link menu-link_us-s text-capitalize fw-medium fs-13px"
        onClick={() => homePageNavigation()}
      >
        Home
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
        /
      </span>
      {(pathname?.includes(`${params.slug?.[2]}`) ||
        pathname?.includes(`${params.slug?.[1]}`)) &&
      !pathname?.includes("/start-with-a-setting") &&
      !pathname?.includes("/start-with-a-diamond") &&
      !pathname?.includes("/start-with-a-item") &&
      !isDiy ? (
        <Link
          href={pathname.includes("campaign") ? `/` : `/products/${params.slug?.[0]}`}
          onClick={() => {
            dispatch(isFilter(true));
            dispatch(filterData([]));
            dispatch(filteredData([]));
            dispatch(storeItemObject({}));
          }}
          className="menu-link menu-link_us-s text-capitalize fw-medium fs-13px"
        >
          {showMenuName}
        </Link>
      ) : !pathname?.includes("/start-with-a-setting") &&
        !pathname?.includes("/start-with-a-item") &&
        !isDiy &&
        (pathname?.includes("diamond") ||
          (pathname?.includes("gemstone") &&
            pathname.split("/")?.length === 2)) &&
        !pathname?.includes("/start-with-a-diamond") ? (
        showDiamondDetails === false ? (
          <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
            {pathname?.replace("/", "")}
          </div>
        ) : (
          <div
            className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
            onClick={() => {
              handleReset();
              if (pathname?.includes("diamond")) {
                dispatch(diamondPageChnages(false));
                dispatch(diamondNumber(""));
                router.push(window.location.pathname);
              }
            }}
          >
            {pathname?.replace("/", "")}
          </div>
        )
      ) : pathname?.includes("dashboard") ? (
        <Link
          href={`${
            Object.keys(loginDatas).length > 0 ? "/account_dashboard" : "/"
          }`}
        >
          <span className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer">
            Dashboard
          </span>
        </Link>
      ) : isDiy ? (
        !pathname?.includes("start-with-a-setting") &&
        !pathname?.includes("start-with-a-item") &&
        !pathname?.includes("start-with-a-diamond") ? (
          <div className="text-muted menu-link  text-capitalize fw-medium fs-13px">
            Make Your Customization
          </div>
        ) : isDiy &&
          (pathname?.includes("start-with-a-item") ||
            pathname?.includes("start-with-a-setting") ||
            pathname?.includes("start-with-a-diamond")) || !params.slug?.[1] ? (
          <div
            className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
            onClick={handleSetDiy}
          >
            Make Your Customization
          </div>
        ) : (
          <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
            Make Your Customization
          </div>
        )
      ) : pathname?.includes("gemstone") && pathname.split("/").length > 2 ? (
        <div className="menu-link menu-link_us-s text-capitalize fw-medium fs-13px">
          {pathname.split("/")[1]}
        </div>
      ) : pathname?.includes("offer") ? (
        <Link
          href={`/products/${params.slug?.[0]}`}
          onClick={() => {
            dispatch(isFilter(true));
            dispatch(filterData([]));
            dispatch(filteredData([]));
            dispatch(storeItemObject({}));
          }}
          className="menu-link menu-link_us-s text-capitalize fw-medium fs-13px"
        >
          {showMenuName}
        </Link>
      ) : (
        <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
          {showMenuName}
        </div>
      )}
      {pathname?.includes("start-with-a-setting") ? (
        activeDIYtabss === "Jewellery" && !params.slug?.[1] ? (
          <>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
              {DIYNames}
            </div>
          </>
        ) : (
          <>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div
              className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
              onClick={handleStartWithSetting}
            >
              {DIYNames}
            </div>
          </>
        )
      ) : pathname?.includes("start-with-a-diamond") ? (
        activeDIYtabss === "Diamond" && !params.slug?.[1] ? (
          <>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div
              className={`${
                params.slug?.[1] !== "" ? "text-muted" : ""
              } menu-link menu-link_us-s text-capitalize fw-medium`}
            >
              {DIYNames}
            </div>
          </>
        ) : (
          <>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div
              className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
              onClick={handleStartWithDiamond}
            >
              {DIYNames}
            </div>
          </>
        )
      ) : pathname?.includes("start-with-a-item") ? (
        !params.slug?.[1] ? (
          <>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div
              className={`${
                params.slug?.[1] !== "" ? "text-muted" : ""
              } menu-link menu-link_us-s text-capitalize fw-medium`}
            >
              {DIYNames}
            </div>
          </>
        ) : (
          <>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div
              className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
              onClick={handleStartWithItems}
            >
              {DIYNames}
            </div>
          </>
        )
      ) : (
        ""
      )}
      {pathname?.includes("diamond") && showDiamondDetails === true ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
          <div className="text-muted menu-link  text-capitalize fw-medium fs-13px">
            {diamondDataList?.product_name}
          </div>
          {/* </Link> */}
        </>
      ) : pathname?.includes(`${params.slug?.[2]}`) ? (
        pathname?.includes(`${params.slug?.[1]}`) &&
        params.slug?.[1]?.includes("pv") ? (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <Link
              href={
                typeof window !== "undefined"
                  ? pathname?.includes("offer")
                    ? `/products/${params.slug?.[1]}/${params.slug?.[2]}`
                    : pathname?.includes("collection")
                    ? `/products/${params.slug?.[1]}/${params.slug?.[2]}`
                    : `/products/${params.slug?.[1]}/${params.slug?.[2]}`
                  : `/products/${params.slug?.[1]}/${params.slug?.[2]}`
              }
              onClick={() => {
                dispatch(isFilter(true));
                dispatch(filterData([]));
                dispatch(filteredData([]));
                dispatch(storeItemObject({}));
              }}
            >
              <span className="menu-link menu-link_us-s text-capitalize fw-medium fs-13px">
                {params.slug?.[2].toString()}
              </span>
            </Link>
            {params.slug?.[1]?.includes("pv") && (
              <>
                <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
                  /
                </span>
                <div className="text-muted menu-link  text-capitalize fw-medium fs-13px">
                  {selectedProductName}
                </div>
              </>
            )}
          </>
        ) : pathname.includes("campaign") ? (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
            <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
              {params.slug?.[3]?.toString().replaceAll("-"," ")}
            </div>
          </>
        ) : (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
            <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
              {params.slug?.[2]?.toString()}
            </div>
            {/* </Link> */}
          </>
        )
      ) : pathname?.includes(`${params.slug?.[1]}`) ? (
        pathname?.includes("/start-with-a-diamond") &&
        pathname?.includes("/start-with-a-item") ? (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
            <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
              {selectedProductName}
            </div>
            {/* </Link> */}
          </>
        ) : (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
            <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
              {selectedProductName}
            </div>
            {/* </Link> */}
          </>
        )
      ) : pathname.includes("viewjourney") || pathname.includes("campaign") ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
          <div className="text-muted menu-link  text-capitalize fw-medium fs-13px">
            {showMenuName}
          </div>
          {/* </Link> */}
        </>
      ) : pathname?.includes("gemstone") && pathname.split("/").length > 2 ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
          <div className="text-muted menu-link  text-capitalize fw-medium fs-13px">
            {!diamondSelectShapes.shapeName
              ? pathname.split("/")[pathname.split("/").length - 1]
              : diamondSelectShapes.shapeName}
          </div>
          {/* </Link> */}
        </>
      ) : pathname?.includes("offer") && params.type !== undefined ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.slug?.[0]}/type/${params.slug?.[2]}`}> */}
          <div className="text-muted menu-link text-capitalize fw-medium fs-13px">
            {params.type}
          </div>
          {/* </Link> */}
        </>
      ) : (
        ""
      )}
    </>
  );
}
