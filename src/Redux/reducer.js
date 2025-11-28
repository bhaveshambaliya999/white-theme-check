const initialState = {
  storeEntityId: {},
  naviGationMenuData: [],
  storeHeaderLogo: [],
  loginData: {},
  isRegisterModal: false,
  isLoginModal: false,
  sectionDetailsData: {},
  mostSearchProductData: [],
  storeCurrencyData: [],
  storeCurrency: "",
  filteredData: [],
  filterData: [],
  isFilter: false,
  favCount: 0,
  allFilteredData: [],
  storeItemObject: {},
  cartCount: 0,
  DefaultBillingAddress: [],
  donationDataLists: [],
  displayPricesTotal: 0,
  foundationArrayData: [],
  discountCouponData: {},
  couponCodeApplied: false,
  engravingObj: {},
  stepperCompletedPage: 1,
  storeHeaderFavLogo: [],
  storeFilteredValues: {},
  storeActiveFilteredData: {},
  sectionDataListsProduct: [],
  socialUrlData:[],
  storeFilteredDiamondObj:{},
  diamondPageChnages:false,
  diamondNumber:"",
  storeDiamondNumber:"",
  diamondSelectShape:{},
  finalCanBeSetData:[],
  storeSelectedDiamondData:{},
  stepperDIY:1,
  activeDIYtabs: [],
  storeSpecData:[],
  storeProdData:{},
  jeweleryDIYName: "",
  jeweleryDIYimage: "",
  diamondDIYName: "",
  diamondDIYimage: "",
  storeSelectedDiamondPrice:0,
  addedRingData:[],
  isRingSelected:false,
  addedDiamondData:[],
  diamondImage:"",
  diamondShape:"",
  IsSelectedDiamond:false,
  verificationStatusAction:0,
  isVerifyModal:false,
  verifyMemberId:"",
  storeDiamondArrayImage:[],
  appliedCoupon:"",
  discountedPrice:0,
  getAllJourneyData:[],
  storeEmbossingData:[],
  saveEmbossings:false,
  previewImageDatas:[],
  activeImageData:[],
  DiySteperData:[],
  ActiveStepsDiy:0,
  DIYName:"",
  serviceAllData:[],
  otherServiceData:[],
  dimaondColorType:"White",
  thresholdValue:null,
  caratVlaues:[],
  overflowItemsData:[],
  showMoreValue:false,
  activeIdMenu:"",
  footerAllContentData:[],
  footerAllContactData:[],
  footerLogoData:[],
  activChildMenu:'',
  activeIdMenuMobile: '',
  footerServiceAllData:[],
  footerNavData:[],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "storeEntityId": {
      state.storeEntityId = action.storeEntityId;
      return {
        ...state,
        storeEntityId: state.storeEntityId,
      };
    }
    case "naviGationMenuData": {
      return {
        ...state,
        naviGationMenuData: action.naviGationMenuData,
      };
    }
    case "storeHeaderLogo": {
      return {
        ...state,
        storeHeaderLogo: action.storeHeaderLogo,
      };
    }
    case "loginData": {
      return {
        ...state,
        loginData: action.loginData,
      };
    }
    case "isRegisterModal": {
      return {
        ...state,
        isRegisterModal: action.isRegisterModal,
      };
    }
    case "isLoginModal": {
      return {
        ...state,
        isLoginModal: action.isLoginModal,
      };
    }
    case "sectionDetailsData": {
      return {
        ...state,
        sectionDetailsData: action.sectionDetailsData,
      };
    }
    case "mostSearchProductData": {
      return {
        ...state,
        mostSearchProductData: action.mostSearchProductData,
      };
    }
    case "storeCurrencyData": {
      return {
        ...state,
        storeCurrencyData: action.storeCurrencyData,
      };
    }
    case "storeCurrency": {
      return {
        ...state,
        storeCurrency: action.storeCurrency,
      };
    }
    case "filteredData": {
      return {
        ...state,
        filteredData: action.filteredData,
      };
    }
    case "filterData": {
      return {
        ...state,
        filterData: action.filterData,
      };
    }
    case "isFilter": {
      return {
        ...state,
        isFilter: action.isFilter,
      };
    }
    case "favCount": {
      return {
        ...state,
        favCount: action.favCount,
      };
    }
    case "allFilteredData": {
      return {
        ...state,
        allFilteredData: action.allFilteredData,
      };
    }
    case "storeItemObject": {
      return {
        ...state,
        storeItemObject: action.storeItemObject,
      };
    }
    case "cartCount": {
      return {
        ...state,
        cartCount: action.cartCount,
      };
    }
    case "DefaultBillingAddress": {
      return {
        ...state,
        DefaultBillingAddress: action.DefaultBillingAddress,
      };
    }
    case "donationDataLists": {
      return {
        ...state,
        donationDataLists: action.donationDataLists,
      };
    }
    case "displayPricesTotal": {
      return {
        ...state,
        displayPricesTotal: action.displayPricesTotal,
      };
    }
    case "foundationArrayData": {
      return {
        ...state,
        foundationArrayData: action.foundationArrayData,
      };
    }
    case "discountCouponData": {
      return {
        ...state,
        discountCouponData: action.discountCouponData,
      };
    }
    case "couponCodeApplied": {
      return {
        ...state,
        couponCodeApplied: action.couponCodeApplied,
      };
    }
    case "engravingObj": {
      return {
        ...state,
        engravingObj: action.engravingObj,
      };
    }
    case "stepperCompletedPage": {
      return {
        ...state,
        stepperCompletedPage: action.stepperCompletedPage,
      };
    }
    case "storeHeaderFavLogo": {
      return {
        ...state,
        storeHeaderFavLogo: action.storeHeaderFavLogo,
      };
    }
    case "storeFilteredValues": {
      return {
        ...state,
        storeFilteredValues: action.storeFilteredValues,
      };
    }
    case "storeActiveFilteredData": {
      return {
        ...state,
        storeActiveFilteredData: action.storeActiveFilteredData,
      };
    }
    case "sectionDataListsProduct": {
      return {
        ...state,
        sectionDataListsProduct: action.sectionDataListsProduct,
      };
    }
    case "socialUrlData": {
      return {
        ...state,
        socialUrlData: action.socialUrlData,
      };
    }
    case "storeFilteredDiamondObj": {
      return {
        ...state,
        storeFilteredDiamondObj: action.storeFilteredDiamondObj,
      };
    }
    case "diamondPageChnages": {
      return {
        ...state,
        diamondPageChnages: action.diamondPageChnages,
      };
    }
    case "diamondNumber": {
      return {
        ...state,
        diamondNumber: action.diamondNumber,
      };
    }
    case "storeDiamondNumber": {
      return {
        ...state,
        storeDiamondNumber: action.storeDiamondNumber,
      };
    }
    case "diamondSelectShape": {
      return {
        ...state,
        diamondSelectShape: action.diamondSelectShape,
      };
    }
    case "finalCanBeSetData": {
      return {
        ...state,
        finalCanBeSetData: action.finalCanBeSetData,
      };
    }
    case "storeSelectedDiamondData": {
      return {
        ...state,
        storeSelectedDiamondData: action.storeSelectedDiamondData,
      };
    }
    case "stepperDIY": {
      return {
        ...state,
        stepperDIY: action.stepperDIY,
      };
    }
    case "activeDIYtabs": {
      return {
        ...state,
        activeDIYtabs: action.activeDIYtabs,
      };
    }
    case "storeSpecData": {
      return {
        ...state,
        storeSpecData: action.storeSpecData,
      };
    }
    case "storeProdData": {
      return {
        ...state,
        storeProdData: action.storeProdData,
      };
    }
    case "jeweleryDIYName": {
      return {
        ...state,
        jeweleryDIYName: action.jeweleryDIYName,
      };
    }
    case "jeweleryDIYimage": {
      return {
        ...state,
        jeweleryDIYimage: action.jeweleryDIYimage,
      };
    }
    case "diamondDIYName": {
      return {
        ...state,
        diamondDIYName: action.diamondDIYName,
      };
    }
    case "diamondDIYimage": {
      return {
        ...state,
        diamondDIYimage: action.diamondDIYimage,
      };
    }
    case "storeSelectedDiamondPrice": {
      return {
        ...state,
        storeSelectedDiamondPrice: action.storeSelectedDiamondPrice,
      };
    }
    case "addedRingData": {
      return {
        ...state,
        addedRingData: action.addedRingData,
      };
    }
    case "isRingSelected": {
      return {
        ...state,
        isRingSelected: action.isRingSelected,
      };
    }
    case "addedDiamondData": {
      return {
        ...state,
        addedDiamondData: action.addedDiamondData,
      };
    }
    case "diamondShape": {
      return {
        ...state,
        diamondShape: action.diamondShape,
      };
    }
    case "diamondImage": {
      return {
        ...state,
        diamondImage: action.diamondImage,
      };
    }
    case "IsSelectedDiamond": {
      return {
        ...state,
        IsSelectedDiamond: action.IsSelectedDiamond,
      };
    }
    case "verificationStatusAction": {
      return {
        ...state,
        verificationStatusAction: action.verificationStatusAction,
      };
    }
    case "isVerifyModal": {
      return {
        ...state,
        isVerifyModal: action.isVerifyModal,
      };
    }
    case "verifyMemberId": {
      return {
        ...state,
        verifyMemberId: action.verifyMemberId,
      };
    }
    case "storeDiamondArrayImage": {
      return {
        ...state,
        storeDiamondArrayImage: action.storeDiamondArrayImage,
      };
    }
    case "appliedCoupon": {
      return {
        ...state,
        appliedCoupon: action.appliedCoupon,
      };
    }
    case "discountedPrice": {
      return {
        ...state,
        discountedPrice: action.discountedPrice,
      };
    }
    case "getAllJourneyData": {
      return {
        ...state,
        getAllJourneyData: action.getAllJourneyData,
      };
    }
    case "storeEmbossingData": {
      return {
        ...state,
        storeEmbossingData: action.storeEmbossingData,
      };
    }
    case "saveEmbossings": {
      return {
        ...state,
        saveEmbossings: action.saveEmbossings,
      };
    }
    case "previewImageDatas": {
      return {
        ...state,
        previewImageDatas: action.previewImageDatas,
      };
    }
    case "activeImageData": {
      return {
        ...state,
        activeImageData: action.activeImageData,
      };
    }
    case "DiySteperData": {
      return {
        ...state,
        DiySteperData: action.DiySteperData,
      };
    }
    case "ActiveStepsDiy": {
      return {
        ...state,
        ActiveStepsDiy: action.ActiveStepsDiy,
      };
    }
    case "DIYName": {
      return {
        ...state,
        DIYName: action.DIYName,
      };
    }
    case "serviceAllData": {
      return {
        ...state,
        serviceAllData: action.serviceAllData,
      };
    }
    case "otherServiceData": {
      return {
        ...state,
        otherServiceData: action.otherServiceData,
      };
    }
    case "dimaondColorType": {
      return {
        ...state,
        dimaondColorType: action.dimaondColorType,
      };
    }
    case "thresholdValue": {
      return {
        ...state,
        thresholdValue: action.thresholdValue,
      };
    }
    case "caratVlaues": {
      return {
        ...state,
        caratVlaues: action.caratVlaues,
      };
    }
    case "overflowItemsData": {
      return {
        ...state,
        overflowItemsData: action.overflowItemsData,
      };
    }
    case "showMoreValue": {
      return {
        ...state,
        showMoreValue: action.showMoreValue,
      };
    }
    case "activeIdMenu": {
      return {
        ...state,
        activeIdMenu: action.activeIdMenu,
      };
    }
    case "footerAllContentData": {
      return {
        ...state,
        footerAllContentData: action.footerAllContentData,
      };
    }
    case "footerAllContactData": {
      return {
        ...state,
        footerAllContactData: action.footerAllContactData,
      };
    }
    case "footerLogoData": {
      return {
        ...state,
        footerLogoData: action.footerLogoData,
      };
    }
    case "activChildMenu": {
      return {
        ...state,
        activChildMenu: action.activChildMenu,
      };
    }
    case "activeIdMenuMobile": {
      return {
        ...state,
        activeIdMenuMobile: action.activeIdMenuMobile,
      };
    }
    case "footerServiceAllData": {
      return {
        ...state,
        footerServiceAllData: action.footerServiceAllData,
      };
    }
    case "footerNavData": {
      return {
        ...state,
        footerNavData: action.footerNavData,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};

export default Reducer;
