import React, { useEffect, useRef, useState } from "react";

export default function EmbossingPreview({ embossingPreviewModalBaseView, handleSetStateChange, setEmbossingPreviewModalBaseView, setSelectedIndex, selectedIndex, setActiveImg, activeImg }) {
    return (
        <div
            className="modal fade "
            id="embossingPreview"
            tabIndex="-1"
            aria-hidden="true"
            data-bs-backdrop="static"
        >
            <div className="modal-dialog size-guide">

                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Embossing Preview
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => { handleSetStateChange(false); setSelectedIndex(0) }}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid px-0">
                            <div className="row justify-content-center">
                                <div className="col-12">
                                    {/* Tab Navigation */}
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        {activeImg?.map((data, i) => (
                                            <li className="nav-item" role="presentation" key={i}>
                                                <a
                                                    className={`nav-link nav-link_underscore ${i === selectedIndex ? 'active' : ''}`}
                                                    id={`tab-${i}`}
                                                    data-bs-toggle="tab"
                                                    href={`#tab-content-${i}`}
                                                    role="tab"
                                                    aria-controls={`tab-content-${i}`}
                                                    aria-selected={i === selectedIndex}
                                                    onClick={() => setSelectedIndex(i)}
                                                >
                                                    {data.type}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Tab Content */}
                                    <div className="tab-content d-flex justify-content-center" id="myTabContent">
                                        {activeImg.map((data, i) => {
                                            let areas = data?.area;
                                            // if (typeof areas === 'string') {
                                            //     try {
                                            //         areas = JSON.parse(areas);
                                            //     } catch (e) {
                                            //         // console.error("Error parsing area:", e);
                                            //     }
                                            // }

                                            return (
                                                <div
                                                    key={i}
                                                    className={`tab-pane fade ${i === selectedIndex ? 'show active' : ''}`}
                                                    id={`tab-content-${i}`}
                                                    role="tabpanel"
                                                    aria-labelledby={`tab-${i}`}
                                                >
                                                    <div className="main-img">
                                                        <div className="singleProduct-view">
                                                            {/* Image for the selected tab */}
                                                            <img
                                                                src={data?.url}
                                                                className="img-fluid img-width d-block m-auto"
                                                                alt={`Image ${i}`}
                                                            />

                                                            {/* Display embossing image if activeImg has area */}
                                                            {areas?.width && areas?.height && (
                                                                <div
                                                                    className="embossing-img"
                                                                    id={`embossing-img-${i}`}
                                                                    style={{
                                                                        left: `${areas.left}%`,
                                                                        top: `${areas.top}%`,
                                                                        width: `${areas.width}%`,
                                                                        height: `${areas.height}%`,
                                                                    }}
                                                                >
                                                                    {data?.embImage && (
                                                                        <div
                                                                            className="resizable-img"
                                                                            id={`resizable-img-${i}`}
                                                                            style={{
                                                                                left: `${data.embImageArea.left}%`,
                                                                                top: `${data.embImageArea.top}%`,
                                                                                width: `${data.embImageArea.width}%`,
                                                                                height: `${data.embImageArea.height}%`,
                                                                            }}

                                                                        >
                                                                            <img
                                                                                src={data.embImage}
                                                                                className="img-fluid img-width d-block m-auto"
                                                                                alt={`Embossed Image ${i}`}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-bs-dismiss="modal" aria-label="Close"
                                onClick={() => { handleSetStateChange(false); setSelectedIndex(0) }} >Close
                        </button>
                    </div>
                </div>

            </div>
            {/* <!-- /.modal-dialog --> */}
        </div>
    );
}
