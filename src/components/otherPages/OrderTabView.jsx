"use client";
import Link from "next/link";

export default function OrderTabView({
  allTabs,
  selectedTab,
  setSelectedTab,
  setOrderDataList,
  setTotalTabOrder,
  setCount,
  setOrderLength,
  setTotalpages,
  setSearchDetails,
  filterToggles,
  filterToggle,
  handleSelectTab,
  orderCount,
  cancelCount,
  isCallRef,
  setOnceUpdated
}) {
  return (
    <>
      <div className="title-content">
        <i className="ic_ordered fs-3 pe-3"></i>
        <h3 className="fw-bold mb-0">Orders</h3>
      </div>
      <div className="col-12 border p-3 mb-3" style={{backgroundColor: '#ffffff'}}>
        <ul className="account-nav d-flex justify-content-between flex-row gap-5 flex-wrap align-items-center py-0">
          {/* {allTabs.map((elm, i) => (
            <li key={i}>
              <Link
                className={`menu-link menu-link_us-s ${
                  elm == selectedTab ? "menu-link_active" : ""
                } `}
                onClick={() => {
                  setOrderDataList([]);
                  setSelectedTab(elm);
                  setTotalTabOrder(0);
                  setCount(1);
                  setOrderLength(0);
                  setTotalpages(1);
                }}
              >
                {elm}
              </Link>
            </li>
          ))} */}
          <div className="d-flex justify-content-start gap-4">
            <li>
              <div
                className={`menu-link menu-link_us-s ${selectedTab === "Ordered" ? "menu-link_active" : "" } cursor-pointer`}
                onClick={() => {
                  setOrderDataList([]);
                  setSelectedTab("Ordered");
                  isCallRef.current = false;
                  setOnceUpdated(false)
                  handleSelectTab()
                  setTotalTabOrder(0);
                  setCount(1);
                  setOrderLength(0);
                  setTotalpages(1);
                  setSearchDetails({
                    orderId: "",
                    consumerName: "",
                    mobileNo: "",
                    status: "",
                  });
                  filterToggles(false);
                }} >
                Order ({orderCount})
              </div>
            </li>
            <li>
              <div className={`menu-link menu-link_us-s ${selectedTab === "Cancelled" ? "menu-link_active" : "" } cursor-pointer`}
                onClick={() => {
                  setOrderDataList([]);
                  setSelectedTab("Cancelled");
                  isCallRef.current = false;
                  setOnceUpdated(false)
                  setTotalTabOrder(0);
                  handleSelectTab()
                  setCount(1);
                  setOrderLength(0);
                  setTotalpages(1);
                  setSearchDetails({
                    orderId: "",
                    consumerName: "",
                    mobileNo: "",
                    status: "",
                  });
                  filterToggles(false);
                  
                }}
              >
                Cancelled ({cancelCount})
              </div>
            </li>
          </div>

          <div className="cursor-pointer"
            onClick={() => {
              filterToggles(!filterToggle);
            }}
          >
            <svg width="20" height="20" aria-hidden="true">
              <use xlinkHref="#icon_sort_filter"></use>
            </svg>
          </div>
        </ul>
      </div>
    </>
  );
}
