import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { extractNumber, numberWithCommas } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import { Tooltip } from "react-tooltip";

const Embossing = ({
    embossingModelView, embossingModelViewJson,
    handleSetStateChangeModal,
    datas,
    itemIds,
    setLoading,
    setGetEmbossingData,
    setItemsId,
    setEmbJson, handleUpdateEmbossing, engIndex, itemAllData
}) => {
    const imgContainer = useRef();
    const imgContainers = useRef();
    const storeEntityIds = useSelector((state) => state.storeEntityId)

    const [embossingModalView, setEmbossingModalView] = useState(false)
    const [imageForPreview, setImageForPreview] = useState(false)
    const [previewImageData, setPreviewImageData] = useState([])

    const [embossingPreview, setEmbossingPreview] = useState(false)
    const [SaveEmbossing, setSaveEmbossing] = useState(false)

    const [callingFrom, setCallingFrom] = useState('');
    const [embPostionEle, setEmbPostionEle] = useState('');
    const [imageDataList, setImageDataList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [activeImg, setActiveImg] = useState([]);
    const [itemId, setItemId] = useState("")
    const [embImgPostion, setEmbImgPostion] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const [boxes, setBoxes] = useState({});

    const [startX, setStartX] = useState({ left: 0, top: 0 });
    const [startY, setStartY] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (imgContainer.current) {
            addBox(true);
        }
    }, [callingFrom, imageDataList, selectedIndex]);

    useEffect(() => {
        if (embossingModelView || embossingModelViewJson) {
            const dataEmboss = datas;
            setImageDataList(dataEmboss);
            setActiveImg(dataEmboss);
            setItemId(itemIds);
            setSelectedIndex(0)
            // Cleanup listeners on component unmount or when modalView is closed
            return () => {
                document.removeEventListener('mousemove', imgOnMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        }
    }, [embossingModelView, embossingModelViewJson]);

    const addBox = (isTrue) => {
        const container = imgContainer.current;
        if (isTrue) {
            if (embPostionEle['image_area']) {
                const percentageValues = JSON.parse(embPostionEle['image_area']);
                setBoxes({
                    left: (percentageValues.left / 100) * container.width,
                    top: (percentageValues.top / 100) * container.height,
                    width: (percentageValues.width / 100) * container.width,
                    height: (percentageValues.height / 100) * container.height
                });
                setEmbImgPostion(percentageValues);
            }
        } else {
            setBoxes({
                left: container.width * 0.1,
                top: container.height * 0.1,
                width: container.width * 0.2,
                height: container.height * 0.2,
            });
            setEmbImgPostion({
                left: (0.1 * 100).toFixed(2),
                top: (0.1 * 100).toFixed(2),
                width: (0.2 * 100).toFixed(2),
                height: (0.2 * 100).toFixed(2)
            });
        }
    };


    const changeImage = (data, i) => {
        // setActiveImg(data);
        setSelectedIndex(i);
    };

    const changeEmboFile = (event) => {
        const extension = event.target.files[0]?.name.split(".").pop().toLowerCase();

        if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'webp') {
            activeImg.binaryFile = event.target.files[0];
            event.target.value = ''; // Clear input value
            addEmbImage();
        } else {
            toast.error("Only JPG,JPEG,PNG AND WEBP Files Are Allowed.");
        }
    };

    const addEmbImage = async () => {
        const obj = {
            a: 'UploadEmbossingImages',
            SITDeveloper: 1,
            item_id: itemId,
            create_by: storeEntityIds.mini_program_id,
            entity_id: storeEntityIds.entity_id,
            tenant_id: storeEntityIds.tenant_id,
        }

        const imageFormData = new FormData();
        if (activeImg.binaryFile) {
            imageFormData.append('image', activeImg.binaryFile, activeImg.binaryFile.name);
        }
        imageFormData.append('json', JSON.stringify(obj));

        if (activeImg.binaryFile) {
            setLoading(true);
            commanService.postApi('/MasterTableSecond', imageFormData).then((response) => {
                if (response.data.success === 1) {
                    setActiveImg((prevState) => prevState.map((item, i) => {
                        if (i === selectedIndex) {
                            return {
                                ...item,
                                embImage: response.data.data,
                                binaryFile: null,
                                embImageArea: {
                                    left: 20,
                                    top: 20,
                                    width: 50,
                                    height: 50,
                                },
                            };
                        }
                        return item;
                    }));

                    setImageForPreview(true)
                    // updateInchDimensions();
                } else {
                    setActiveImg((prevState) => prevState.map((item, i) => {
                        if (i === selectedIndex) {
                            return {
                                ...item,
                                embImage: '',
                                binaryFile: null,
                                embImageArea: {
                                    left: 20,
                                    top: 20,
                                    width: 50,
                                    height: 50,
                                },
                            };
                        }
                        return item;
                    }));
                }
                setLoading(false);
            })

        }
    };

    const imgStartDrag = (event, data, index) => {
        event.preventDefault();

        if (!data?.embImageArea) return;

        const embossingArea = document.querySelector(`#embossing-img-${index}`).getBoundingClientRect();
        const resizableImg = event.target.closest(`#resizable-img-${index}`).getBoundingClientRect();

        let offsetX = event.clientX - resizableImg.left;
        let offsetY = event.clientY - resizableImg.top;

        const onMouseMove = (moveEvent) => {
            let newLeft = moveEvent.clientX - offsetX - embossingArea.left;
            let newTop = moveEvent.clientY - offsetY - embossingArea.top;

            newLeft = Math.max(0, Math.min(embossingArea.width - resizableImg.width, newLeft));
            newTop = Math.max(0, Math.min(embossingArea.height - resizableImg.height, newTop));

            setActiveImg((prevState) => prevState.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        embImageArea: {
                            ...item.embImageArea,
                            left: (newLeft / embossingArea.width) * 100,
                            top: (newTop / embossingArea.height) * 100,
                        },
                    };
                }
                return item;
            }));

        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // Handle Resizing
    const imgResizeStart = (event, data, index) => {
        event.preventDefault();
        event.stopPropagation();

        const embossingArea = document.querySelector(`#embossing-img-${index}`).getBoundingClientRect();

        setIsResizing(true);
        setStartX({ left: event.clientX, top: event.clientY });
        setStartY({
            width: data.embImageArea.width,
            height: data.embImageArea.height,
        });

        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX.left;
            const deltaY = moveEvent.clientY - startX.top;

            let newWidth = startY.width + (deltaX / embossingArea.width) * 100;
            let newHeight = startY.height + (deltaY / embossingArea.height) * 100;

            newWidth = Math.max(5, Math.min(100 - data.embImageArea.left, newWidth));
            newHeight = Math.max(5, Math.min(100 - data.embImageArea.top, newHeight));

            setActiveImg((prevState) => prevState.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        embImageArea: {
                            ...item.embImageArea,
                            width: newWidth,
                            height: newHeight,
                        },
                    };
                }
                return item;
            }));

        };

        const onMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const imgOnMouseMove = (event) => {
        if (!isDragging && !isResizing) return;

        const parentRect = document.querySelector(`#embossing-img`).getBoundingClientRect();
        let updatedImageArea = { ...activeImg?.[selectedIndex]?.embImageArea };

        if (isResizing) {
            const deltaX = event.clientX - startX.left;
            const deltaY = event.clientY - startX.top;

            let newWidth = startY.width + (deltaX / parentRect.width) * 100;
            let newHeight = startY.height + (deltaY / parentRect.height) * 100;

            newWidth = Math.max(5, Math.min(100 - updatedImageArea.left, newWidth));
            newHeight = Math.max(5, Math.min(100 - updatedImageArea.top, newHeight));

            updatedImageArea.width = newWidth;
            updatedImageArea.height = newHeight;
        }

        setActiveImg((prevState) => prevState.map((item, i) => {
            if (i === selectedIndex) {
                return {
                    ...item,
                    embImageArea: updatedImageArea,
                };
            }
            return item;
        }));

    };

    const onMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        document.removeEventListener("mousemove", imgOnMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    // Centering Functions
    const centerImage = (type) => {
        setActiveImg((prevState) => prevState.map((item, i) => {
            if (i === selectedIndex) {
                const imgElement = item.embImageArea;
                const parentElement = document.querySelector(".embossing-img");

                if (!imgElement || !parentElement) return item;

                let updatedArea = { ...imgElement };

                // Horizontal update
                if (type === "horizontal") {
                    const parentWidth = parentElement.clientWidth;
                    const imgWidth = (parentWidth * imgElement.width) / 100;
                    updatedArea.left = ((parentWidth - imgWidth) / 2 / parentWidth) * 100;
                }

                // Vertical update
                if (type === "vertical") {
                    const parentHeight = parentElement.clientHeight;
                    const imgHeight = (parentHeight * imgElement.height) / 100;
                    updatedArea.top = ((parentHeight - imgHeight) / 2 / parentHeight) * 100;
                }

                // Return updated item
                return {
                    ...item,
                    embImageArea: updatedArea,
                };
            }

            // Return other items unchanged
            return item;
        }));

    };

    const centerBoth = () => {
        centerImage("horizontal");
        centerImage("vertical");
    };

    const setSaveEmbossDetail = () => {
        if (imageForPreview && activeImg?.some((item) => item.embImage !== "") == true) {
            const savedData = activeImg?.filter((item) => item.embImage !== '');
            setPreviewImageData(savedData);
            setEmbossingPreview(true)
        } else {
            setImageForPreview(false)
        }
        setGetEmbossingData(activeImg)
        handleUpdateEmbossing(itemAllData, activeImg, engIndex)
        setSaveEmbossing(true);
        setEmbossingModalView(false);
        handleSetStateChangeModal(false)
    }
    const setSaveEmbossDetailReset = () => {
        const activeImgObj = activeImg.map((item) => ({
            ...item,
            embImage: '',
            binaryFile: null,
            embImageArea: {
                left: 20,
                top: 20,
                width: 50,
                height: 50,
            },
        }));
        setGetEmbossingData(activeImgObj);
        handleUpdateEmbossing(itemAllData, activeImgObj, engIndex);
        setSaveEmbossing(true);
        setEmbossingModalView(false);
        handleSetStateChangeModal(false);
    };



    return (
        <div
            className="modal fade EmbossingModal"
            id="addEmbossing"
            tabIndex="-1"
            aria-hidden="true"
            data-bs-backdrop="static"
        >
            <div className="modal-dialog size-guide">

                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Set Embossing Position {`(${activeImg[selectedIndex]?.new_currency} ${numberWithCommas(extractNumber(activeImg[selectedIndex]?.new_price).toFixed(2))})`}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => { handleSetStateChangeModal(false) }}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid px-0">
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <div className="dragarea mt-1">
                                        <div className="text-center">
                                            <a onClick={() => imgContainer.current.click()}>
                                                {'Click To Browse'}
                                                <br />
                                                <span className="text-grey font-15px">({'Single Image'})</span>
                                                <input
                                                    type="file"
                                                    ref={imgContainer}
                                                    style={{ display: 'none' }}
                                                    onChange={(event) => changeEmboFile(event)}
                                                    accept=".png, .jpg, .jpeg, .webp, .PNG, .JPG, .JPEG, .WEBP"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    {activeImg?.[selectedIndex]?.embImage && activeImg?.[selectedIndex]?.area && (
                                        <div>
                                            <div className="text-main mt-3">
                                                <span>Alignment</span>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                <button className="btn btn-dark" onClick={() => centerImage('horizontal')} data-tooltip-id="tooltip-top" data-tooltip-content="Horizontal Center">
                                                    <svg width="30" height="30" aria-hidden="true">
                                                        <use xlinkHref="#horizontal_center"></use>
                                                    </svg>
                                                    {/* <span>Horizontal center</span> */}
                                                </button>
                                            
                                                <button className="btn btn-dark" onClick={() => centerImage('vertical')} data-tooltip-id="tooltip-top" data-tooltip-content="Vertical Center">
                                                    <svg width="30" height="30" aria-hidden="true">
                                                        <use xlinkHref="#vertical_center"></use>
                                                    </svg>
                                                    {/* <span>Vertical center</span> */}
                                                </button>
                                            
                                                <button className="btn btn-dark" onClick={centerBoth} data-tooltip-id="tooltip-top" data-tooltip-content="Both Center">
                                                    <svg width="30" height="30" aria-hidden="true">
                                                        <use xlinkHref="#both_center"></use>
                                                    </svg>
                                                    {/* Both Center */}
                                                </button>
                                                <Tooltip id="tooltip-top" place="top" effect="solid" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12">
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
                                                    onClick={() => changeImage(data, i)} // Change active tab
                                                >
                                                    {data.type}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Tab Content */}
                                    <div className="tab-content" id="myTabContent">
                                        {activeImg.map((data, i) => {
                                            // Check if data.area is a stringified JSON and parse it if necessary
                                            let areas = data?.area;
                                            if (typeof areas === 'string') {
                                                try {
                                                    areas = JSON.parse(areas); // Try to parse it if it's a string
                                                } catch (e) {
                                                    // console.error("Error parsing area:", e);
                                                }
                                            }

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
                                                                            onMouseDown={(event) => imgStartDrag(event, data, i)} // Implement your drag logic here
                                                                        >
                                                                            <img
                                                                                src={data.embImage}
                                                                                className="img-fluid img-width d-block m-auto"
                                                                                alt={`Embossed Image ${i}`}
                                                                                ref={imgContainers}
                                                                            />
                                                                            <div className="resize-btn" onMouseDown={(event) => imgResizeStart(event, data, i)}>
                                                                                ↘
                                                                            </div>
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
                        <button type="button" className="btn btn-dark"
                            data-bs-dismiss={`${activeImg?.filter((item) => item.embImage !== '')[0]?.embImage !== "" ? "modal" : ""}`}
                            aria-label="Close" onClick={() => setSaveEmbossDetail()}>Save
                        </button>
                        <button type="button" className="btn btn-light"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setSaveEmbossDetailReset()}
                        >Reset</button>

                        <button
                            type="button"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => { handleSetStateChangeModal(false); setSelectedIndex(0) }}
                        >Close</button>

                    </div>
                </div>

            </div>
            {/* <!-- /.modal-dialog --> */}
        </div>
    );
};

export default Embossing