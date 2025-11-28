import { useContextElement } from "@/context/Context";
import { dashboardMenuItems } from "@/data/menu";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  caratVlaues,
  cartCount,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  dimaondColorType,
  DIYName,
  DiySteperData,
  engravingObj,
  favCount,
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
  previewImageDatas,
  saveEmbossings,
  serviceAllData,
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
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setCartProducts, setWishlistProducts, cartProducts } =
    useContextElement();

  return (
    <div className="col-lg-3 pe-lg-0">
      <ul className="account-nav">
        {dashboardMenuItems.map((elm, i) => (
          <li key={i}>
            <Link
              href={elm.title === "Logout" ? "/" : elm.href}
              className={`menu-link menu-link_us-s ${
                router.asPath?.includes(elm.href) ? "menu-link_active" : ""
              } `}
              onClick={async () => {
                if (elm.title === "Logout") {
                  await setCartProducts([]);
                  await setWishlistProducts([]);
                  dispatch(loginData({}));
                  dispatch(activeDIYtabs("Jewellery"));
                  dispatch(isRegisterModal(false));
                  dispatch(filteredData([]));
                  dispatch(filterData([]));
                  dispatch(isLoginModal(false));
                  dispatch(isFilter(false));
                  dispatch(storeItemObject({}));
                  dispatch(storeFilteredDiamondObj({}));
                  dispatch(storeActiveFilteredData({}));
                  dispatch(storeFilteredData({}));
                  dispatch(diamondPageChnages(false));
                  dispatch(diamondNumber(""));
                  dispatch(storeSelectedDiamondPrice(""));
                  dispatch(jeweleryDIYimage(""));
                  dispatch(diamondDIYimage(""));
                  dispatch(finalCanBeSetData([]));
                  dispatch(caratVlaues([]));
                  dispatch(storeSpecData({}));
                  dispatch(storeProdData({}));
                  dispatch(storeSelectedDiamondData([]));
                  dispatch(jeweleryDIYName(""));
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
                  dispatch(DiySteperData([]));
                  dispatch(ActiveStepsDiy(0));
                  dispatch(engravingObj({}));
                  dispatch(serviceAllData([]));
                  sessionStorage.removeItem("DIYVertical");
                  sessionStorage.removeItem("itemToItemData");
                  dispatch(DIYName(""));
                  dispatch(dimaondColorType("White"));
                  dispatch(cartCount("0"));
                  dispatch(favCount("0"));
                  sessionStorage.removeItem("loginData");
                  router.replace("/", undefined, { shallow: true });
                  // router.reload()
                }
                window.scroll(0, 0);
              }}
            >
              <i className={`pe-2 ${elm.icon}`}></i>{elm.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
