import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import OrderDetail from "./OrderDetail";
import { changeUrl, extractNumber, isEmpty, jewelVertical, numberWithCommas, RandomId, safeParse } from "@/CommanFunctions/commanFunctions";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Pagination2 from "../common/Pagination2";
import OrderTabView from "./OrderTabView";
import Select from "react-select";
import { activeDIYtabs, addedDiamondData, addedRingData, diamondNumber, finalCanBeSetData, isRingSelected, IsSelectedDiamond, storeActiveFilteredData, storeDiamondNumber, storeFilteredData, storeProdData, storeSelectedDiamondData, storeSelectedDiamondPrice, storeSpecData } from "@/Redux/action";
import Link from "next/link";
import Image from "next/image";
import NotFoundImg from "@/assets/images/RecordNotfound.png";

export default function AccountOrders() {
  const isCallRef = useRef(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const loginDatas = JSON.parse(sessionStorage.getItem("loginData")) || useSelector((state) => state.loginData);
  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const router = useRouter();
  const params = useParams(); 

  const [loading, setLoading] = useState(false);
  const [orderDataList, setOrderDataList] = useState([]);
  const [pendingDataList, setPendingDataList] = useState([]);

  const [showOrderDetail, setShowOrderDetail] = useState(params?.orderId !== undefined || false);
  const [orderDetail, setOrderDetail] = useState([]);
  const [orderDetailDataList, setOrderDetailDataList] = useState([]);
  const [onceUpdated, setOnceUpdated] = useState(false);
  const [orderHistoryDataList, setOrderHistoryDataList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Ordered");
  const [allTabs, setAllTabs] = useState([]);
  const [orderLength, setOrderLength] = useState(selectedTab === "Cancelled" ? pendingDataList?.length : orderDataList.length);

  //filter
  const [orderCount, setOrderCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  //EMbossing
    const [ebossingPreviewModalBaseView, setEmbossingPreviewModalBaseView] =
      useState(false);
    const [activeImg, setActiveImg] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
  
  // order Data
  const [totalOrderRecord, setTotalOrderRecord] = useState("0");
  const [pageValue, setPageValue] = useState(1);
  const [totalOrderRow, setOrderTotalRow] = useState(0);
  const [totalTabOrder, setTotalTabOrder] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [totalPages, setTotalpages] = useState(1);
  const [count, setCount] = useState(1);
  const [pageNo, setPageNo] = useState(1)
  const [filterToggle, setFilterToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("Order_");
  let [searchDetails, setSearchDetails] = useState({
    orderId: "",
    consumerName: "",
    mobileNo: "",
    status: "",
  });
  const [cancelOrderList, setCancelOrderList] = useState([
    {
      status_code: "0",
      status_desc: "Pending",
    },
    {
      status_code: "2",
      status_desc: "Cancelled",
    },
    {
      status_code: "3",
      status_desc: "Failed",
    },
  ]);
  const [applyFilter, setApplyFilter] = useState(false);

  const handleSelectTab = () => {
    setTotalTabOrder(0)
    setOrderLength(0)
    setOrderTotalRow(0)
    setTotalpages(1)
    setPendingDataList([]);
    setOrderDataList([])

  }
  const getOrderAllDataList = useCallback(
    (pageNumber, searchDetails) => {

      setPageNo(pageNumber)
      // let status = "";
      // if (isEmpty(searchDetails?.status) == "Ordered" || isEmpty(searchDetails?.status) == "Pending") {
      //   status = "PEND,CONF,WRP,COM,CUS_SHIP_REC,CUS_TO_BU,COM_SHIP";
      // } else if (isEmpty(searchDetails?.status) == "Shipped") {
      //   status = "SHIP";
      // } else if (isEmpty(searchDetails?.status) == "Out for delivery") {
      //   status = "STR_TO_END_CUS";
      // } else if (isEmpty(searchDetails?.status) == "Delivered") {
      //   status = "CLOSE";
      // }else{
      //   status=""
      // }

      if (selectedTab !== "Cancelled") {
        // const status = orderHistoryDataList.filter((item) => {
        //   if (item.status_desc === selectedTab) return item.status_code;
        // });
        // console.log(status);

        const getOrderDetail = {
          a: "BTOCDisplaySalesOrder",
          counsumer_id: isLogin
            ? loginDatas.member_id
            : RandomId,
          store_id: storeEntityIds.mini_program_id,
          tenant_id: storeEntityIds.tenant_id,
          entity_id: storeEntityIds.entity_id,
          per_page: "25",
          number: pageNumber ?? "1",
          document_status: isEmpty(searchDetails?.status),
          SITDeveloper: "1",
          main_so_order_id: isEmpty(searchDetails?.orderId),
          consumer_name: isEmpty(searchDetails?.consumerName),
          mobile_no: isEmpty(searchDetails?.mobileNo),
        };
        setLoading(true);
        if (isLogin) {
          commanService.postApi("/SalesOrder", getOrderDetail).then((res) => {
            if (res.data.success == 1) {
              if (Object.keys(res["data"]["data"]).length > 0) {
                setOrderCount(res.data.data.order);
                setCancelCount(res.data.data.pending_order ?? failCount);
                var order = isEmpty(res["data"]["data"].resData) !== "" ? res["data"]["data"].resData : [];
                if (order === undefined || order === "") {
                  order = [];
                  setLoading(false)
                }

                for (let c = 0; c < order.length; c++) {
                  var data = order[c]["data"];
                  for (let d = 0; d < data.length; d++) {
                    data.map((e2) => {
                      let newArr1 = []
                      let newArr2 = []
                      if (isEmpty(e2.length) >= 2) {
                        e2.map((e1) => {
                          if (e1.vertical_code !== 'DIAMO' && e1.vertical_code !== 'LGDIA' && e1.vertical_code !== 'LDIAM' && e1.vertical_code !== 'GEMST') {
                            newArr1.push(e1.stone_position)
                            newArr2.push({
                              product_name: e1.product_name,
                              currency: order[c].currency,
                              type: e1.stone_position,
                              product_sku: e1.vertical_code == 'JEWEL' ? e1.product_sku : e1.variant_number,
                              product_variant: e1.variant_number,
                              price: 0,
                              count: 0,
                              product_detail: e1.variant_number,
                              vertical_code: isEmpty(e1.vertical_code),
                              str_document_status: e1.str_document_status,
                              quantity: e1.quantity,
                              short_summary: e1,
                              item_price: e1.line_price,
                              item_image: e1.photo,
                              eng_font: e1.eng_font,
                              eng_font_size: e1.engraving_font_size,
                              eng_max_character: e1.engraving_max_character,
                              eng_min_character: e1.engraving_min_character,
                              eng_price: e1.eng_price,
                              eng_text: e1.engraving_text,
                              engraving_currency: e1.engraving_currency,
                              is_engraving: e1.is_engraving,
                              is_embossing: e1.is_embossing,
                              embossing_image: e1.embossing_image,
                              service_json: e1.service_json,
                              pv_unique_id: e1.pv_unique_id,
                              cert_no: e1.cert_no,
                              st_color_type: e1.st_color_type,
                              cert_lab: e1.cert_lab,
                            })
                          } else {
                            var data = {
                              product_name: e1.product_name,
                              currency: order[c].currency,
                              type: e1.stone_position,
                              product_sku: e1.vertical_code == 'JEWEL' ? e1.product_sku : e1.variant_number,
                              product_variant: e1.variant_number,
                              price: 0,
                              count: 0,
                              product_detail: e1.variant_number,
                              vertical_code: isEmpty(e1.vertical_code),
                              str_document_status: e1.str_document_status,
                              quantity: e1.quantity,
                              item_price: e1.line_price,
                              item_image: e1.photo,
                              eng_font: e1.eng_font,
                              eng_font_size: e1.engraving_font_size,
                              eng_max_character: e1.engraving_max_character,
                              eng_min_character: e1.engraving_min_character,
                              eng_price: e1.eng_price,
                              eng_text: e1.engraving_text,
                              engraving_currency: e1.engraving_currency,
                              is_engraving: e1.is_engraving,
                              is_embossing: e1.is_embossing,
                              embossing_image: e1.embossing_image,
                              service_json: e1.service_json,
                              pv_unique_id: e1.pv_unique_id,
                              cert_no: e1.cert_no,
                              st_color_type: e1.st_color_type,
                              cert_lab: e1.cert_lab,
                            }
                            newArr2.push(data)
                          }
                          return e1
                        })
                        e2.types = newArr2
                      }
                      return e2
                    })
                    data.map((e2) => {
                      if (isEmpty(e2.length) >= 2) {
                        let countType = {}
                        e2.map((o) => {
                          e2.types.map((tp, i) => {
                            tp.price = tp.item_price
                            if (tp.type == '') {
                              var b = e2.types[0];
                              e2.types[0] = tp;
                              e2.types[i] = b;
                            }
                            if (tp.type == 'CENTER') {
                              var b = e2.types[1];
                              e2.types[1] = tp;
                              e2.types[i] = b;
                            }
                            return tp
                          })
                          return o
                        })
                      }
                      return e2
                    })

                  }
                }

                setOrderDataList(order);
                setOrderLength(
                  res?.data?.data?.pg_value?.toString().split(" - ")[1]
                );
                // dispatch(orderAction(order))
                setOrderTotalRow(res.data.data.total_rows)
                setTotalTabOrder(res.data.data.order);
                setPageValue(res.data.data.pg_value)
                setTotalpages(res.data.data.total_pages);
                setOnceUpdated(true);
                setLoading(false);
              } else {
                setLoading(false);
                setOrderDataList([]);
              }
            }
          });
        } else {
          setLoading(false);
        }
      } else {
        const OrderControl = {
          a: "getFailedOrder",
          store_id: storeEntityIds.mini_program_id,
          customer_id: isLogin
            ? loginDatas.member_id
            : RandomId,
          per_page: "25",
          number: pageNumber ?? "1",
          status: isEmpty(searchDetails?.status),
        };
        setLoading(true);
        if (isLogin) {
          commanService
            .postLaravelApi("/OrderController", OrderControl)
            .then((res) => {
              if (res.data.success == 1) {
                setFailCount(res.data.data.number);
                const data1 = [...res.data.data.result]
                let sum = 0
                data1.map((value) => {
                  let newArr1 = []
                  let newArr2 = []
                  value.order_lines.map((pen1) => {
                    if (pen1.length >= 2) {
                      pen1.map((pen) => {
                        pen.photo = (isEmpty(pen.photo) !== "" || null) ? pen.photo : "https://via.placeholder.com/500X500"
                        if (pen.vertical_code != 'DIAMO' && pen.vertical_code !== "LGDIA" && pen.vertical_code !== "LDIAM" && pen.vertical_code !== "GEMST") {
                          newArr1.push(pen.stone_position)
                          newArr2.push({
                            product_name: pen.product_name, currency: value.payment_currency, type: pen.stone_position, product_sku: pen.product_sku, cert_no: pen.cert_no,
                            product_variant: pen.variant_number, price_display: pen.price_display, price: 0, count: 0, vertical_code: pen.vertical_code, quantity: pen.quantity,
                            short_summary: pen.short_summary, item_image: pen.photo, pv_unique_id: pen.pv_unique_id, cert_lab: pen.cert_lab, st_color_type: pen.st_color_type
                          })
                        } else {
                          newArr2.push({
                            product_name: pen.product_name, currency: value.payment_currency, type: pen.stone_position, product_sku: pen.product_sku, cert_no: pen.cert_no, cert_lab: pen.cert_lab, pv_unique_id: pen.pv_unique_id, st_color_type: pen.st_color_type,
                            product_variant: pen.variant_number, price_display: pen.price_display, price: 0, count: 0, vertical_code: pen.vertical_code, quantity: pen.quantity, item_image: pen.photo
                          })
                        }
                        return pen
                      })
                    } else {
                      pen1.map((pen) => (
                        pen.photo = isEmpty(pen.photo) !== "" ? pen.photo : "https://via.placeholder.com/500X500"
                      ))
                    }
                    return pen1
                  })
                  value.types = newArr2
                  sum += value.net_amount
                  return value
                })
                data1.map((value) => {
                  value.order_lines.map((penmain) => {
                    if (penmain.length >= 2) {
                      let countType = {}
                      value.types.map((tp) => {
                        let count = 0
                        value.order_lines.map((pen1) => {
                          pen1.map((pen) => {
                            tp.price = Number(pen.price_display)
                            return pen;
                          })
                          return pen1;
                        })
                        return tp;
                      })
                    }
                    return penmain
                  })
                  return value
                })
                setPendingDataList(data1);
                setTotalOrderRecord(res.data.data.total)
                setPageValue(res.data.data.pg_value)
                setPerPage(res?.data?.data?.per_page);
                setOrderLength(
                  res?.data?.data?.pg_value?.toString().split(" - ")[1]
                );
                setOrderTotalRow(res.data.data.number);
                setTotalTabOrder(res.data.data.total);
                setTotalpages(res.data.data.total_pages);
                setOnceUpdated(true);
                setLoading(false);
              }
            });
        } else {
          setLoading(false);
        }
      }
    },
    [storeEntityIds, selectedTab]
  );

  if (isEmpty(orderDataList) != '') {
    for (let c = 0; c < orderDataList.length; c++) {
      var status = orderDataList[c]['data'][0]['str_document_status'];
      if (isEmpty(status) == '') {
        status = (orderDataList[c]['data'][0][0]['str_document_status'])
      }
      orderDataList[c]['status'] = status;
    }
  }

  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0 && !isCallRef.current) {
      if (!onceUpdated && !showOrderDetail) {
        orderHistoryData();
        // getOrderAllDataList();
        if (selectedTab) {
          getOrderAllDataList();
        }
        isCallRef.current = true
      }
    }
  }, [selectedTab]);

  const orderHistoryData = () => {
    const orderLoacte = {
      a: "GetSalesOrderHistory",
      so_order_id: "",
      unique_id: "",
      order_id: "",
      store_id: storeEntityIds.mini_program_id,
      customer_id: storeEntityIds.customer_id,
      business_unit_id: null,
      counsumer_id: isLogin ? loginDatas.member_id : RandomId,
      reference_order_id: "",
      per_page: 0,
      number: 0,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      SITDeveloper: "1",
      origin: storeEntityIds.cmp_origin,
    };
    setLoading(true);
    commanService
      .postApi("/SalesOrder", orderLoacte)
      .then((res) => {
        if (res.data.success == 1) {
          const sdata = res.data.data;
          var data = [];
          for (let i = 0; i < sdata.length; i++) {
            data.push(sdata[i].status_desc);
          }
          setAllTabs(data);
          // setSelectedTab(data[0])
          setOrderHistoryDataList(sdata);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
        setOnceUpdated(true);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleViewOrderDetails = (order) => {
    // setShowOrderDetail(true);
    // setOrderDetail(order);
    if (selectedTab !== "Cancelled") {
      router.push(`/account_orders/${order?.main_so_order_id}`);
    }
  };

  const filterToggles = (value) => {
    // if (value) {
    setFilterToggle(value);
    // } else {
    //   var toggle = filterToggle;
    //   toggle = !toggle;
    //   setFilterToggle(toggle);
    // }
  };

  const searchResetData = (value) => {
    setSearchDetails(value);
    setPerPage(25);
    setCount(1);
    if (selectedTab == "Ordered") {
      getOrderAllDataList(1, value);
    } else {
      getOrderAllDataList(1);
    }
  };

  const searchOrderData = () => {
    if (
      isEmpty(searchDetails?.orderId) !== "" ||
      isEmpty(searchDetails?.consumerName) !== "" ||
      isEmpty(searchDetails?.mobileNo) !== "" ||
      isEmpty(searchDetails?.status) !== ""
    ) {
      setApplyFilter(true);
      getOrderAllDataList(1, searchDetails);
    } else if (applyFilter == true) {
      setApplyFilter(false);
      getOrderAllDataList(1, searchDetails);
    }
  };

  const resetOrderData = () => {
    if (applyFilter == true) {
      var data = {
        orderId: "",
        consumerName: "",
        mobileNo: "",
        status: "",
      };
      setSearchDetails(data);
      setApplyFilter(false);
      searchResetData(data);
    }
  };

  const navigateFromOrder = (value, e) => {
    var url = '';
    if (e?.data?.[0]?.product_diy === "DIY" && value?.vertical_code == "JEWEL") {
      dispatch(storeSelectedDiamondData([]))
      dispatch(addedDiamondData({}))
      dispatch(storeSelectedDiamondPrice(""))
      dispatch(finalCanBeSetData([]));
      dispatch(storeFilteredData({}));
      dispatch(storeActiveFilteredData({}));
      dispatch(diamondNumber(""));
      dispatch(storeDiamondNumber(""));
      dispatch(addedRingData({}));
      dispatch(IsSelectedDiamond(false));
      dispatch(storeProdData({}));
      dispatch(storeSpecData({}));
      dispatch(isRingSelected(false));
      dispatch(activeDIYtabs("Jewellery"));
      url = `/make-your-customization/start-with-a-setting/${changeUrl(value.product_name + '-' + value.pv_unique_id)}`
      window.open(url, '_blank', '');
    } else if (
      value?.product_diy === "DIY" &&
      value.vertical_code !== "JEWEL"
    ) {

      const verticalCode = value?.vertical_code;
      const title = changeUrl(
        value?.product_name + "-" + value.pv_unique_id
      );
      var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus")).navigation_data?.filter((elm) => elm.product_vertical_name === verticalCode)[0]
      url = `/products/${changeUrl(megaMenu?.menu_name)}/${title}`;
      window.open(url, '_blank', '');
    } else {
      if (value.vertical_code != 'DIAMO' && value.vertical_code != 'LGDIA' && value.vertical_code != 'GEDIA') {
        var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus")).navigation_data?.filter((elm) => elm.product_vertical_name === value.vertical_code)[0]
        url = `/products/${changeUrl(megaMenu?.menu_name)}/${changeUrl(value.product_name + '-' + value.pv_unique_id)}`;
      }
      setTimeout(() => {
        if (value.vertical_code != 'DIAMO' && value.vertical_code != 'LGDIA' && value.vertical_code != 'GEDIA') {
          window.open(url, '_blank', '');
        }
      });
    }
  }

  return (
    <div className="col-lg-9">
      {loading && <Loader />}
      <div className="page-content my-account__orders-list">
        {/* {showOrderDetail === true ? (
          <OrderDetail
            setShowOrderDetail={setShowOrderDetail}
            orderDetail={orderDetail}
            orderDataList={orderDataList}
            getOrderAllDataList={getOrderAllDataList}
            searchDetails={searchDetails}
            pageNo={pageNo}
            isCallRef={isCallRef}
          />
        ) : ( */}
          <>
            
            <OrderTabView
              setCount={setCount}
              allTabs={allTabs}
              orderCount={orderCount}
              cancelCount={cancelCount}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              setOrderDataList={setOrderDataList}
              setTotalTabOrder={setTotalTabOrder}
              setOrderLength={setOrderLength}
              setTotalpages={setTotalpages}
              setSearchDetails={setSearchDetails}
              filterToggles={filterToggles}
              filterToggle={filterToggle}
              handleSelectTab={handleSelectTab}
              isCallRef={isCallRef}
              setOnceUpdated={setOnceUpdated}
            />

            {filterToggle === true && (
              <div className="mb-3">
                <div className="orderSearch">
                  <div className="form-floating">
                    <input
                      placeholder="Enter Order ID"
                      autoComplete="off"
                      name="order_id"
                      className={`form-control form-control_gray`}
                      value={searchDetails?.orderId}
                      onChange={(e) => {
                        setSearchDetails({
                          ...searchDetails,
                          orderId: e.target.value,
                        });
                      }}
                    />
                    <label>Order ID</label>
                  </div>
                  <div className="form-floating">
                    <input
                      placeholder="Enter Consumer Name"
                      autoComplete="off"
                      name="consumer_name"
                      className={`form-control form-control_gray`}
                      value={searchDetails?.consumerName}
                      onChange={(e) => {
                        setSearchDetails({
                          ...searchDetails,
                          consumerName: e.target.value,
                        });
                      }}
                    />
                    <label>Consumer Name</label>
                  </div>
                  <div className="form-floating">
                    <input
                      placeholder="Enter Mobile No."
                      autoComplete="off"
                      name="mobile_no"
                      className={`form-control form-control_gray`}
                      value={searchDetails?.mobileNo}
                      onChange={(e) => {
                        setSearchDetails({
                          ...searchDetails,
                          mobileNo: e.target.value,
                        });
                      }}
                    />
                    <label>Mobile No.</label>
                  </div>
                  <div className="form-floating">
                    {/* <label>Status</label> */}
                    {selectedTab == "Ordered" ? (
                      <Select
                        options={orderHistoryDataList.map((item) => ({
                          label: item.status_desc,
                          value: item.status_code,
                        }))}
                        placeholder="Select Status"
                        value={
                          searchDetails?.status
                            ? {
                              label: orderHistoryDataList.find(
                                (item) =>
                                  item.status_code === searchDetails.status
                              )?.status_desc,
                              value: searchDetails.status,
                            }
                            : null
                        }
                        onChange={(selectedOption) => {
                          setSearchDetails({
                            ...searchDetails,
                            status: selectedOption?.value,
                          });
                        }}
                        isSearchable={true}
                        isMulti={false}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        className="custom-react-select-container"
                        classNamePrefix="custom-react-select"
                      />
                    ) : (
                      // <select
                      //   placeholder="Select Status"
                      //   autoComplete="off"
                      //   name="status"
                      //   className={`form-control form-control_gray`}
                      //   value={searchDetails?.status}
                      //   onChange={(e) => {
                      //     setSearchDetails({
                      //       ...searchDetails,
                      //       status: e.target.value,
                      //     });
                      //   }}
                      // >
                      //   <option>Select Status</option>
                      //   <option value="Ordered">Ordered</option>
                      //   <option value="Shipped">Shipped</option>
                      //   <option value="Out For Delivery">Out For Delivery</option>
                      //   <option value="Pickup From Store">
                      //     Pickup From Store
                      //   </option>
                      //   <option value="Delivered">Delivered</option>
                      // </select>
                      <Select
                        options={cancelOrderList?.map((item) => ({
                          label: item.status_desc,
                          value: item.status_code,
                        }))}
                        placeholder="Select Status"
                        value={
                          searchDetails?.status
                            ? {
                              label: cancelOrderList.find(
                                (item) =>
                                  item.status_code === searchDetails.status
                              )?.status_desc,
                              value: searchDetails.status,
                            }
                            : null
                        }
                        onChange={(selectedOption) => {
                          setSearchDetails({
                            ...searchDetails,
                            status: selectedOption?.value,
                          });
                        }}
                        isSearchable={true}
                        isMulti={false}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        className="custom-react-select-container"
                        classNamePrefix="custom-react-select"
                      />
                    )}
                  </div>
                </div>
                <div className="form-floating">
                  <div className="button-details">
                    <button
                      onClick={() => searchOrderData()}
                      className="btn btn-primary"
                    >
                      Search
                    </button>
                    <button
                      className="btn btn-light ms-3"
                      onClick={() => {
                        resetOrderData();
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap">
              <p className="mb-0">
                Showing{" "}
                {totalTabOrder >= orderLength
                  ? orderLength
                  : totalOrderRow === totalPages
                    ? totalTabOrder
                    : selectedTab === "Cancelled" ? pendingDataList?.length : orderDataList.length}{" "}
                of {totalTabOrder} results
              </p>
              <Pagination2
                totalPages={totalPages}
                selectedTab={selectedTab}
                setCount={setCount}
                getOrderDataList={getOrderAllDataList}
                orderDataList={selectedTab === "Cancelled" ? pendingDataList : orderDataList}
                totalTabOrder={totalTabOrder}
                count={count}
              />
            </div>
            <div className="table-orderDetail overflow-auto">
              {selectedTab === "Cancelled" ?
                pendingDataList.length > 0 && pendingDataList.map((ordered, i) => {
                  let newDate = new Date(ordered.order_date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                  return (
                    <React.Fragment key={i}>
                      <div className="MyOrder_info" key={i}>
                        <div className='order-list-row'>
                          <div className='order-list-left'>
                            <div className='ordered_info_id'>
                              <div className='ordered_info_div '><b>Order # </b>{ordered.order_id} </div> <span className='px-2'>|</span>
                              <div className='ordered_info_div'><b>Ordered on</b> : {newDate}</div> <span className='px-2'>|</span>
                              <div className='ordered_info_div'><b>Order Status </b> : {ordered.status}</div>
                            </div>
                          </div>
                          <div className='order-list-right text-end'>
                            {ordered.status == 'Pending' && isEmpty(ordered.payment_url) != '' &&
                              <span className="text-decoration-underline cursor-pointer" onClick={() => (window.open(ordered.payment_url, '_blank', ''))}>Continue To Payment</span>
                            }
                          </div>
                          <div className="order-list-body">
                            <div className="cancelled-order">
                              {ordered?.order_lines?.length > 0 && ordered?.order_lines.map((singleOrder, i1) => {
                                if (singleOrder.length == 1) {
                                  return (
                                    singleOrder.length > 0 && singleOrder.map((penOrder, ix) => {
                                      return (
                                        <div className="order-list-product" key={ix}>
                                          <div className="d-sm-flex">
                                            <div className='print-diy-img'>
                                              <img src={(penOrder.photo == null || "") ? "https://via.placeholder.com/500X500" : penOrder.photo} className='img-fluid w-100' />
                                              {penOrder.length > 1 && (penOrder.photo !== null || '') ?
                                                <div className='print-image position-absolute bottom-0 end-0'>
                                                  <img src={penOrder.photo} className="img-fluid" />
                                                </div> : ""
                                              }
                                            </div>

                                            <div className='single-product-desc'>
                                              <h4 className='order-title' onClick={() => navigateFromOrder(penOrder, singleOrder)}>{penOrder.product_name}</h4>
                                              <React.Fragment>
                                                {jewelVertical(penOrder.vertical_code) === true ?
                                                  <>
                                                    <div className='product_sku mb-1'><span className="sku-title">SKU:</span> <span>{penOrder.product_sku}</span></div>
                                                    <div className='prodect_info-inner mb-1'>
                                                      {isEmpty(penOrder.metal_type) != '' ?
                                                        <div className='detailsName'><h4>Metal Type</h4> <span className="text-muted">{penOrder.metal_type}</span> </div>
                                                        : ''}
                                                      {isEmpty(penOrder.short_summary.gold_wt) != '' && extractNumber(penOrder.short_summary.gold_wt) > 0 ?
                                                        <div className='detailsName'><h4>Gold Weight</h4> <span className="text-muted">{extractNumber(penOrder.short_summary.gold_wt)} {penOrder.short_summary.gold_wt_unit}</span> </div>
                                                        : ''}
                                                      {isEmpty(penOrder.short_summary.dia_wt) != '' && extractNumber(penOrder.short_summary.dia_wt) > 0 ?
                                                        <div className='detailsName'><h4>Diamond Weight</h4> <span className="text-muted">{extractNumber(penOrder.short_summary.dia_wt)} {penOrder.short_summary.dia_first_unit}</span> </div>
                                                        : ''}
                                                      {isEmpty(penOrder.short_summary.col_wt) != '' && extractNumber(penOrder.short_summary.col_wt) > 0 ?
                                                        <div className='detailsName'><h4>Gemstone Weight</h4> <span className="text-muted">{extractNumber(penOrder.short_summary.col_wt)} {penOrder.short_summary.col_first_unit}</span> </div>
                                                        : ''}
                                                      {isEmpty(penOrder.short_summary.offer_code) != '' ?
                                                        <div className='detailsName'><h4>Offer</h4> <span className="text-muted">{penOrder.short_summary.offer_code}</span> </div>
                                                        : ''}
                                                    </div>
                                                  </>
                                                  :
                                                  <div className='product_sku mb-1'><span className="sku-title">Certificate No:</span> <span>{penOrder.cert_lab} {penOrder.cert_no}</span></div>
                                                }
                                              </React.Fragment>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })
                                  )
                                } else {
                                  if (singleOrder.length >= 2) {
                                    let jewelImage = ""
                                    let Diamond = ""
                                    let name = ""
                                    let short_summary = ""
                                    let status = ordered.status
                                    ordered.order_lines.map((t1, i2) => {
                                      t1.map((t2, i3) => {
                                        if (jewelVertical(t2.vertical_code) === true) {
                                          if (isEmpty(t2.photo) !== "") {
                                            jewelImage = isEmpty(t2.photo)
                                          } else {
                                            jewelImage = isEmpty(t2.photo)
                                          }
                                          short_summary = t2.short_summary;
                                          name = t2.product_name
                                        } else if (t2.vertical_code === "DIAMO" || t2.vertical_code == 'LGDIA' || t2.vertical_code == 'GEDIA') {
                                          Diamond = isEmpty(t2.photo)
                                        }
                                        return t2
                                      })
                                      return t1
                                    })
                                    let total_price = 0
                                    ordered.types.map((a) => {
                                      total_price += isEmpty(Number(a.price))
                                      return a
                                    })
                                    if (jewelImage === "") {
                                      jewelImage = "https://via.placeholder.com/500X500"
                                    }
                                    if (Diamond === "") {
                                      Diamond = "https://via.placeholder.com/500X500"
                                    }
                                    return (
                                      <div className='order-list-product' key={i1}>
                                        {ordered.types.length > 0 && ordered.types.map((order1, i4) => {
                                          return (<div className='d-sm-flex' key={i4}>

                                            <div className='print-diy-img'>
                                              <div className="">
                                                <img src={order1.item_image} className='img-fluid' />
                                              </div>
                                            </div>

                                            <div className="single-product-desc">
                                              {order1.type !== "" ? <div className="product-desc-title mb-1">{order1.type}</div> : ""}

                                              <h4 className='order-title' onClick={() => navigateFromOrder(order1, ordered)}>{order1.product_name}</h4>

                                              {order1.vertical_code === "LDIAM" || order1.vertical_code === "GEMST" ? "" : jewelVertical(order1.vertical_code) === true ?
                                                <React.Fragment>
                                                  <div className='prodect-sku mb-1'><span className="sku-title">SKU:</span> <span>{order1.product_sku}</span></div>

                                                  <div className='prodect_info-inner mb-1'>
                                                    {isEmpty(short_summary.metal_type) != '' ?
                                                      <div className='detailsName '><h4>Metal Type</h4> <span className="text-muted">{short_summary.metal_type}</span> </div>
                                                      : ''}
                                                    {isEmpty(short_summary.gold_wt) != '' && extractNumber(short_summary.gold_wt) > 0 ?
                                                      <div className='detailsName '><h4>Gold Weight</h4> <span className="text-muted">{extractNumber(short_summary.gold_wt)} {short_summary.gold_wt_unit}</span> </div>
                                                      : ''}
                                                    {isEmpty(short_summary.dia_wt) != '' && extractNumber(short_summary.dia_wt) > 0 ?
                                                      <div className='detailsName '><h4>Diamond Weight</h4> <span className="text-muted">{extractNumber(short_summary.dia_wt)} {short_summary.dia_first_unit}</span> </div>
                                                      : ''}
                                                    {isEmpty(short_summary.col_wt) != '' && extractNumber(short_summary.col_wt) > 0 ?
                                                      <div className='detailsName '><h4>Gemstone Weight</h4> <span className="text-muted">{extractNumber(short_summary.col_wt)} {short_summary.col_first_unit}</span> </div>
                                                      : ''}
                                                    {isEmpty(short_summary.offer_code) != '' ?
                                                      <div className='detailsName '><h4>Offer</h4> <span className="text-muted">{short_summary.offer_code}</span> </div>
                                                      : ''}
                                                  </div>
                                                </React.Fragment> :

                                                <div className='product_sku mb-1'><span className="sku-title">Certificate No:</span> <span>{order1.cert_lab} {order1.cert_no}</span></div>
                                              }
                                              {order1.vertical_code === "LDIAM" ? <div className="mb-2"> No of Stone: {order1.count}</div> : ""}

                                              <div className="fs-15px fw-500">
                                                {order1.currency}&nbsp;{order1.price_display}
                                              </div>
                                            </div>
                                          </div>)
                                        })
                                        }
                                      </div>
                                    )
                                  }
                                }
                              })
                              }
                            </div>
                            <div className="d-flex flex-column justify-content-end">
                              <h2 className='total-prize'>{ordered.payment_currency} &nbsp;{numberWithCommas(extractNumber(ordered.net_amount).toFixed(2))}</h2>

                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                }) :

                orderDataList.length > 0 && orderDataList.map((ordered, io) => {
                  let date = ""
                  let store_type = '';
                  let store_name = '';
                  let consumer_name = '';
                  if (isEmpty(ordered['data'][0]['so_sales_date']) !== "") {
                    date = ordered['data'][0]['so_sales_date'];
                    store_type = ordered['data'][0]['store_type'];
                    store_name = ordered['data'][0]['store_id'] + ' - ' + ordered['data'][0]['store_name'];
                    consumer_name = ordered['data'][0]['consumer_name'];
                  } else {
                    date = ordered['data'][0][0]['so_sales_date']
                    store_type = ordered['data'][0][0]['store_type'];
                    store_name = ordered['data'][0][0]['store_id'] + ' - ' + ordered['data'][0][0]['store_name'];
                    consumer_name = ordered['data'][0][0]['consumer_name'];
                  }
                  let newDate = new Date(date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                  return (
                    <div className="MyOrder_info" key={io}>
                      <div className='order-list-row'>
                        <div className='order-list-left'>
                          <div className='ordered_info_id '>
                            <div className='ordered_info_div'><b>Order # </b>{ordered.main_so_order_id} </div> <span className='px-2'>|</span>
                            <div className='ordered_info_div'><b>Ordered on</b> : {newDate}</div> <span className='px-2'>|</span>
                            <div className='ordered_info_div'><b>Order Status </b> : {ordered.status}</div>
                          </div>
                          {store_type === "B2C" ?
                            <div className='ordered_info_id'>
                              <div className='ordered_info_div'><b>Store Name </b> : {store_name}</div>
                            </div>
                            :
                            <div className='ordered_info_id '>
                              <div className='ordered_info_div'><b>Store Type </b> : {store_type}</div><span className='px-2'>|</span>
                              <div className='ordered_info_div'><b>Store Name </b> : {store_name}</div>
                              {
                                isEmpty(consumer_name) != '' ?
                                  <>
                                    <span className='px-2'>|</span>
                                    <div className='ordered_info_div'><b>Consumer Name </b> : {consumer_name}</div>
                                  </>
                                  : ''
                              }
                            </div>
                          }
                        </div>
                        <div className='order-list-right text-end'>
                          <span className="OrderDetail" onClick={(e) => { e.preventDefault(); handleViewOrderDetails(ordered) }}>Order Detail</span>
                        </div>
                        <div className="order-list-body">
                          <div className="order-single-product">
                            {ordered?.data.length > 0 && ordered?.data?.map((singleOrder, i22) => {
                              if (singleOrder.length == undefined) {
                                return (
                                  <React.Fragment key={i22}>
                                    <div className="order-list-product">
                                      <div className="d-sm-flex ">
                                        <div className='print-diy-img'>
                                          <img src={(singleOrder.photo == null || "") ? "https://via.placeholder.com/500X500" : singleOrder.photo} className='img-fluid w-100' />
                                          {
                                            singleOrder.length > 1 && (singleOrder.photo !== null || '') ?
                                              <div className='print-image position-absolute bottom-0 end-0'>
                                                <img src={singleOrder.photo} className="img-fluid" />
                                              </div> : ""
                                          }
                                        </div>

                                        <div className='single-product-desc'>
                                          <h4 className='order-title' onClick={() => navigateFromOrder(singleOrder, ordered)}>{singleOrder.product_name}</h4>
                                          <div className='product-desc'>
                                            <React.Fragment>
                                              {singleOrder.vertical_code === "LDIAM" || singleOrder.vertical_code === "GEMST" ? "" : jewelVertical(singleOrder.vertical_code) === true ?
                                                <>

                                                  <div className='prodect-sku mb-1'><span className="sku-title">SKU:</span> <span>{singleOrder.product_sku}</span></div>

                                                  <div className='prodect_info-inner mb-1'>
                                                    {isEmpty(singleOrder.metal_type) === "" ? "" : <div className='detailsName'><h4>Metal Type</h4> <span className="text-muted">{singleOrder.metal_type}</span> </div>}
                                                    {singleOrder.gold_wt != '' && extractNumber(singleOrder.gold_wt) > 0 ?
                                                      <div className='detailsName'><h4>Gold Weight</h4> <span className="text-muted">{extractNumber(singleOrder.gold_wt)} {singleOrder.gold_wt_unit}</span> </div>
                                                      : ''}
                                                    {singleOrder.dia_wt != '' && extractNumber(singleOrder.dia_wt) > 0 ?
                                                      <div className='detailsName'><h4>Diamond Weight</h4> <span className="text-muted">{extractNumber(singleOrder.dia_wt)} {singleOrder.dia_first_unit}</span> </div>
                                                      : ''}
                                                    {singleOrder.col_wt != '' && extractNumber(singleOrder.col_wt) > 0 ?
                                                      <div className='detailsName'><h4>Gemstone Weight</h4> <span className="text-muted">{extractNumber(singleOrder.col_wt)} {singleOrder.col_first_unit}</span> </div>
                                                      : ''}
                                                    {isEmpty(singleOrder.offer_code) != '' ?
                                                      <div className='detailsName'><h4>Offer</h4> <span className="text-muted">{singleOrder.offer_code}</span> </div>
                                                      : ''}
                                                  </div>
                                                </>
                                                : <div className='prodect-sku mb-1'><span className="sku-title">Certificate</span>:  {singleOrder.cert_lab} {singleOrder.variant_number}</div>}
                                            </React.Fragment>
                                            {
                                              safeParse(singleOrder?.service_json) !== null && safeParse(singleOrder?.service_json)?.length > 0 ?
                                                <div className="d-flex gap-2 align-items-center order-service">
                                                  {safeParse(singleOrder?.service_json)?.map((service, i) => {
                                                    return (
                                                      <React.Fragment key={i}>
                                                        {service.service_code === 'ENGRAVING' && service.service_type === "Special" && isEmpty(service?.text) !== "" &&
                                                          isEmpty(service?.text) !== null ? (
                                                          <div className="order-engraving">
                                                            <Link href="#" style={{ cursor: 'text' }}>Engraving : <span className="fw-normal">{service?.text}</span></Link>
                                                          </div>
                                                        ) : ""}
                                                        {service.service_code === 'EMBOSSING' && service.service_type === "Special" && service.image !== "" ?
                                                          <div className="order-engraving">
                                                            <Link href="#" style={{ cursor: 'text' }}>Embossing : {service.image?.map((item, k) => {
                                                              if (k > 0) {
                                                                return
                                                              }
                                                              return (
                                                                <span className="ms-1 text-underline image_previews" key={k}>
                                                                  <img className="" src={item?.embImage} />
                                                                </span>
                                                              )
                                                            })}</Link>
                                                          </div> : ""}
                                                        {service.service_type === "Normal" && service.is_selected === '1' && (
                                                          <div className="form-check mb-0" key={service.service_code}>
                                                            <input
                                                              className="form-check-input form-check-input_fill"
                                                              type="checkbox"
                                                              checked={service.is_selected === '1'}
                                                              aria-label="service" 
                                                              readOnly
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor={`service_${service.service_code}`}>
                                                              {service.service_name}
                                                            </label>
                                                            {service.price ? (
                                                              <span className="fw-semibold">
                                                                {"(" +
                                                                  extractNumber(service.price).toFixed(2) +
                                                                  " " +
                                                                  service.currency +
                                                                  ")"}
                                                              </span>
                                                            ) : (
                                                              ""
                                                            )}
                                                          </div>
                                                        )}
                                                      </React.Fragment>)
                                                  })}
                                                </div>
                                                : null}
                                          </div>
                                          {/* <div className="Quantity_pz">
                                                                                                            <div className="Quantity_text">
                                                                                                                <p className='mb-0 fs-14px'><span>Quantity</span> : {singleOrder.quantity}</p>
                                                                                                            </div>
                                                                                                            <p className='mt-2 profile-title'>
                                                                                                                {
                                                                                                                    ordered?.base_currency !== ordered.currency ?
                                                                                                                        <p className="fs-15px text-end">{ordered?.base_currency} {numberWithCommas((ordered?.entity_net_amount).toFixed(2))}</p> : ""
                                                                                                                }
                                                                                                                <span className="fs-18px fw-600">
                                                                                                                    {ordered.currency}&nbsp;{(singleOrder.display_net_amount)} {singleOrder?.offer_code !== "" && <span className="offer-price" style={{ fontSize: "15px" }} >{ordered.currency} {(numberWithCommas((Number(singleOrder?.line_price) * (singleOrder?.quantity)).toFixed(2)))}</span>}
                                                                                                                </span>
                                                                                                            </p>
                                                                                                        </div> */}
                                        </div>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )
                              } else {
                                if (singleOrder.length >= 2) {
                                  let jewelImage = ""
                                  let Diamond = ""
                                  let name = ""
                                  let status = ""
                                  singleOrder.map((t2, i2) => {
                                    if (jewelVertical(t2.vertical_code) === true) {
                                      if (isEmpty(t2.photo) !== "") {
                                        jewelImage = isEmpty(t2.photo)
                                      } else {
                                        jewelImage = isEmpty(t2.photo)
                                      }
                                      name = t2.product_name
                                      status = t2.str_document_status
                                    } else if (t2.vertical_code === "DIAMO" || t2.vertical_code === "LGDIA" || t2.vertical_code === "GEDIA") {
                                      Diamond = t2.photo
                                    }
                                    return t2
                                  })
                                  let total_price = 0;

                                  if (singleOrder.types) {
                                    (singleOrder.types || []).map((a) => {
                                      if (typeof (a) === "object") {
                                        total_price += isEmpty(Number(a.price))
                                        return a
                                      }
                                    })
                                  }

                                  if (jewelImage === "") {
                                    jewelImage = "https://via.placeholder.com/500X500"
                                  }
                                  if (Diamond === "") {
                                    Diamond = "https://via.placeholder.com/500X500"
                                  }
                                  return (
                                    <div className='order-list-product' key={i22}>
                                      {singleOrder.types && (singleOrder.types || []).length > 0 && (singleOrder.types || []).map((order1, i4) => {
                                        return (
                                          <div className='d-sm-flex' key={i4}>
                                            <div className='print-diy-img'>
                                              <div className="" >
                                                <img src={order1.item_image} className='img-fluid' />
                                              </div>
                                            </div>

                                            <div className='single-product-desc'>
                                              {order1.type !== "" ? <div className="product-desc-title mb-1">{order1.type}</div> : ""}
                                              <h4 className='order-title' onClick={() => navigateFromOrder(order1, ordered)}>{order1.product_name}</h4>
                                              {order1.vertical_code === "LDIAM" || order1.vertical_code === "GEMST" ? "" : jewelVertical(order1.vertical_code) === true ?
                                                <React.Fragment>
                                                  <div className='product_sku mb-1'><span className="sku-title">SKU: </span> <span> {order1.product_sku}</span></div>

                                                  <div className='prodect_info-inner mb-1'>
                                                    {isEmpty(order1.short_summary.metal_type) != '' ?
                                                      <div className='detailsName'><h4>Metal Type</h4> <span className="text-muted">{order1.short_summary.metal_type}</span> </div>
                                                      : ''}
                                                    {isEmpty(order1.short_summary.gold_wt) != '' && extractNumber(order1.short_summary.gold_wt) > 0 ?
                                                      <div className='detailsName'><h4>Gold Weight</h4> <span className="text-muted">{extractNumber(order1.short_summary.gold_wt)} {order1.short_summary.gold_wt_unit}</span> </div>
                                                      : ''}
                                                    {isEmpty(order1.short_summary.dia_wt) != '' && extractNumber(order1.short_summary.dia_wt) > 0 ?
                                                      <div className='detailsName'><h4>Diamond Weight</h4> <span className="text-muted">{extractNumber(order1.short_summary.dia_wt)} {order1.short_summary.dia_first_unit}</span> </div>
                                                      : ''}
                                                    {isEmpty(order1.short_summary.col_wt) != '' && extractNumber(order1.short_summary.col_wt) > 0 ?
                                                      <div className='detailsName'><h4>Gemstone Weight</h4> <span className="text-muted">{extractNumber(order1.short_summary.col_wt)} {order1.short_summary.col_first_unit}</span> </div>
                                                      : ''}
                                                    {isEmpty(order1.short_summary.offer_code) != '' ?
                                                      <div className='detailsName'><h4>Offer</h4> <span className="text-muted">{order1.short_summary.offer_code}</span> </div>
                                                      : ''}
                                                  </div>
                                                  {safeParse(order1?.service_json) !== null && safeParse(order1?.service_json)?.length > 0 ?
                                                    <div className='d-flex gap-2 align-items-center order-service'>
                                                      {safeParse(order1?.service_json)?.map((service, i) => {
                                                        return (
                                                          <React.Fragment key={i}>
                                                            {service.service_code === 'ENGRAVING' && service.service_type === "Special" && isEmpty(service?.text) !== "" &&
                                                              isEmpty(service?.text) !== null ? (
                                                              <div className="order-engraving">
                                                                <Link href="#" style={{ cursor: 'text' }}>Engraving : <span className="fw-normal">{service?.text}</span></Link>
                                                              </div>
                                                            ) : ""}
                                                            {service.service_code === 'EMBOSSING' && service.service_type === "Special" && service.image !== "" ?
                                                              <div className="order-engraving">
                                                                <Link href="#" style={{ cursor: 'text' }}>Embossing : {service.image?.map((item, k) => {
                                                                  if (k > 0) {
                                                                    return
                                                                  }
                                                                  return (
                                                                    <span className="ms-1 text-underline image_previews" key={k} onClick={() => { setEmbossingPreviewModalBaseView(true); setActiveImg(service.image.filter((elm) => elm.embImage !== "")) }}>
                                                                      <img className="" src={item?.embImage} />
                                                                    </span>
                                                                  )
                                                                })}</Link>
                                                              </div> : ""}
                                                            {service.service_type === "Normal" && service.is_selected === '1' && (
                                                              <div className="form-check mb-0" key={service.service_code}>
                                                                <input
                                                                  className="form-check-input form-check-input_fill"
                                                                  type="checkbox"
                                                                  checked={service.is_selected === '1'}
                                                                  aria-label="service" 
                                                                  readOnly
                                                                />
                                                                <label
                                                                  className="form-check-label"
                                                                  htmlFor={`service_${service.service_code}`}
                                                                >
                                                                  {service.service_name}
                                                                </label>
                                                                {service.price ? (
                                                                  <span className="fw-semibold">
                                                                    {"(" +
                                                                      extractNumber(service.price).toFixed(2) +
                                                                      " " +
                                                                      service.currency +
                                                                      ")"}
                                                                  </span>
                                                                ) : (
                                                                  ""
                                                                )}
                                                              </div>
                                                            )}
                                                          </React.Fragment>)
                                                      })}
                                                    </div>
                                                    : null}
                                                </React.Fragment>
                                                : <div className='prodect-sku mb-1'><span className="sku-title">Certificate: </span><span>{order1.cert_lab} {order1.product_sku}</span></div>}

                                              <p className='fs-15px fw-500'>{order1.currency}&nbsp;{numberWithCommas(order1.price)}</p>
                                              {order1.vertical_code === "LDIAM" || order1.vertical_code === "GEMST" ? <p className='pe-4 fs-14px'> No of Stone: {order1.count}</p> : ""}
                                            </div>
                                          </div>
                                        )
                                      })
                                      }

                                      {/* <div className='Quantity_pz'>
                                                                                                    <div className="Quantity_text text-end">
                                                                                                        <p className='mb-0 fs-14px'><span>Quantity</span> : {singleOrder[0].quantity}</p>
                                                                                                    </div>
                                                                                                    <div className='OrderStatus_right'>
                                                                                                        <h2 className='fs-18px fw-600 profile-title'>{ordered.currency} &nbsp;{numberWithCommas((total_price).toFixed(2))}</h2>
                                                                                                    </div>
                                                                                                </div> */}
                                    </div>
                                  )
                                }
                              }
                            })}
                          </div>
                          <div className='Quantity_pz'>
                            <div className='OrderStatus_right'>
                              {
                                ordered?.base_currency !== ordered.currency ?
                                <p className="fs-15px text-end">{ordered?.base_currency} {numberWithCommas(extractNumber(ordered?.entity_net_amount.toString()).toFixed(2))}</p> : ""
                              }
                              <h2 className='total-prize'>{ordered.currency} &nbsp;{numberWithCommas(extractNumber(ordered.total_amount.toString()).toFixed(2))}</h2>
                              {
                                ordered?.Round_off_flag === '1' || ordered?.Round_off_flag === true ?
                                  <div className="d-flex mt-1 text-muted">
                                    <span className="fs-12">Round Off&nbsp;</span>
                                    <span className="fs-12">{" "}{ordered?.base_currency} {numberWithCommas(extractNumber(ordered?.Round_off.toString()).toFixed(2))}</span> 
                                  </div>
                                  : ""
                              }
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )
                }

                )}
                {!loading && (selectedTab === "Cancelled" && pendingDataList?.length === 0 || selectedTab === "Ordered" && orderDataList?.length === 0) ? (
                  <div className="d-flex justify-content-center w-100 not-found">
                    <Image
                      src={NotFoundImg}
                      loading="lazy"
                      width={500}
                      height={500}
                      alt="Record Not found"
                    />
                  </div>
                ) : ""}
            </div>
          </>
        {/* )} */}
      </div>
    </div>
  );
}
