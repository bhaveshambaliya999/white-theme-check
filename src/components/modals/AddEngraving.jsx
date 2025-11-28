"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Loader from "@/CommanUIComp/Loader/Loader";
import { closeEngraving } from "@/utlis/closeEngraving";
import { extractNumber } from "@/CommanFunctions/commanFunctions";

export default function AddEngraving(props) {
  const {
    itemData,
    isItalicFont,
    engravingText,
    handleUpdateEngravingData,
    handleChangeText,
    setIsItalicFont,
    handleClose,
    engIndex,
    itemAllData
  } = props;
  const textPathRef = useRef(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    closeEngraving();
  }, [pathname]);

  return (
    <>
      <div
        className="aside aside_right overflow-hidden cart-drawer"
        id="engravingDrawer"
      >
        <div className="aside-header d-flex align-items-center">
          <h3 className="text-uppercase fs-6 mb-0">ADD ENGRAVING</h3>
          <button
            onClick={closeEngraving}
            className="btn-close-lg js-close-aside btn-close-aside ms-auto"
            aria-label={"Close Engraving"}
          ></button>
        </div>
        {loading && <Loader />}
        <div className="aside-content engravin-popup-body">
          <section id="EngravinCartPopup">
            <div className="EngravingCart p-3">
              <div className="EngravingPopupInput">
                <div className="EngravingPopupTitle mb-2">
                  Enter Engraving{" "}
                  {itemData?.new_price ? (
                    <span className="fw-semibold">
                      {"(" +
                        extractNumber(itemData?.new_price.toString()).toFixed(2) +
                        " " +
                        itemData.new_currency +
                        ")"}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <input
                    placeholder="Enter Engraving"
                    className="w-100 line-normal form-control text-description"
                    type="text"
                    name="engravingText"
                    maxLength={
                      typeof itemData === "object"
                        ? itemData?.max_character
                          ? parseInt(itemData?.max_character)
                          : 8
                        : 8
                    }
                    autoComplete="off"
                    onChange={handleChangeText}
                    value={engravingText}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <div className="fs-12px">
                    <small className="pe-2">
                      Min :{" "}
                      {Object.keys(itemData)?.length
                        ? typeof itemData === "object"
                          ? itemData?.min_character
                          : ""
                        : ""}
                    </small>
                    <small>
                      Max :
                      {Object.keys(itemData)?.length
                        ? typeof itemData === "object"
                          ? itemData?.max_character
                          : ""
                        : ""}
                    </small>
                  </div>
                  {Object.keys(itemData)?.length &&
                  typeof itemData === "object" ? (
                    <div className="fs-12px">
                      {`${
                        itemData?.max_character
                          ? "Characters Left : " +
                            (parseInt(itemData?.max_character) -
                              engravingText?.length)
                          : ""
                      }`}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="ChooseFontFamily pt-2">
                <div className="EngravingPopupTitle my-2">
                  Choose Font Family
                </div>
                <div className="py-1">
                  <i
                    style={{ fontStyle: "normal" }}
                    className={`me-1 cursor-pointer p-1 border border-black fw-normal fs-6 ${
                      isItalicFont ? "border-1" : "border-1 borderdark "
                    }`}
                    onClick={() => setIsItalicFont(false)}
                  >
                    Aa
                  </i>

                  <i
                    className={`ms-1 cursor-pointer p-1 border border-black fs-6 ${
                      isItalicFont ? "border-1 borderdark p-1" : "border-1"
                    }`}
                    onClick={() => setIsItalicFont(true)}
                  >
                    Aa
                  </i>
                </div>
              </div>
              <div className="drawer-engraving-container">
                <div className="EngravingPopupTitle my-2">Preview</div>
                {itemAllData?.vertical_code === "JEWEL" ? (
                  <div className="drawer-engraving-img">
                    <svg viewBox="0 0 248 120">
                      <path
                        id="SVGID_x5F_2_x5F_"
                        d="M0,80 Q124,32 248,80"
                        fill="transparent"
                      ></path>
                      <text textAnchor="middle">
                        <textPath href="#SVGID_x5F_2_x5F_" startOffset="50%">
                          <tspan
                            ref={textPathRef}
                            style={{
                              fontStyle: isItalicFont ? "italic" : "normal",
                              fontSize: `${itemData?.font_size}px`,
                              letterSpacing: "1px",
                              textShadow: "#979696 1px 1px",
                            }}
                            xlinkHref="#SVGID_x5F_2_x5F_"
                          >
                            {engravingText}
                          </tspan>
                        </textPath>
                      </text>
                    </svg>
                  </div>
                ) : (
                  <div
                    className={`engravingBox ${
                      itemAllData?.vertical_code === "FRAME"
                        ? "engraving-frame"
                        : "engraving-all"
                    }`}
                  >
                    <p
                      className="m-0"
                      style={{
                        fontStyle: isItalicFont ? "italic" : "normal",
                        fontSize: `${itemData?.font_size}px`,
                      }}
                    >
                      {engravingText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
          <div className="cart-drawer-actions position-absolute start-0 bottom-0 w-100">
            <hr className="cart-drawer-divider" />
            <div className="d-flex justify-content-center">
              <div className="d-flex gap-2 off_engraving_button">
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdateEngravingData(itemAllData,itemData,engIndex)}
                >
                  Save
                </button>
                <button className="btn btn-light" onClick={closeEngraving}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="engravingDrawerOverlay"
        onClick={closeEngraving}
        className="page-overlay"
      ></div>
    </>
  );
}
