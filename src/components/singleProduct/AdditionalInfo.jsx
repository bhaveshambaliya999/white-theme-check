import { isEmpty } from "@/CommanFunctions/commanFunctions";


export default function AdditionalInfo({
  tabDataone,
  keyTabView,
  columnsForSpecification,
  secondDiamondSummary,
  diamondSummary,
  selectedTab,
  bomDataList,
  labourDataList,
  canBeSetWithDataList,
  columName,
  diamondSummaryname,
  secondDiamondSummaryname,
  storyDataList,
  isShow
}) {

  return (
    <>
      {keyTabView === "Specification" ? (
          <div className="row">
          {tabDataone === true && columnsForSpecification.length > 0 ? (
            <div className="col-lg-4 col-md-6 specification-addtional">
              <div className="information-title">Information</div>
              {columnsForSpecification.map((col, i) => {
                return (
                  <div className="specification-details-list" key={i}> 
                    <label className="specification-title text-nowrap">{col.title}</label>
                    <span className="specification-text"> {col.value}</span>
                  </div>
                );
              })}
            </div>
          ) : null}
          {tabDataone === true && diamondSummary.length > 0 ? (
            <div className="col-lg-4 col-md-6 specification-addtional">
              {isEmpty(diamondSummaryname) !== "" && (
                <div className="information-title">{diamondSummaryname}</div>
              )}
              {diamondSummary[0].map((col, j) => {
                return (
                  <div className="specification-details-list" key={j}> 
                    <label className="specification-title text-nowrap">{col.title}</label>
                    <span className="specification-text"> {col.value}</span>
                  </div>
                );
              })}
            </div>
          ) : null}
          {tabDataone === true && secondDiamondSummary.length > 0 ? (
            secondDiamondSummary.map((col, i) => (
              <div className="col-lg-4 col-md-6 specification-addtional" key={`secondSummary-${i}`}>
                <div className="information-title">
                  {secondDiamondSummaryname[i]}
                </div>
                {col.map((col1, index) => (
                  <div className="specification-details-list" key={col1.id || `${i}-${index}`}>
                    <label className="specification-title text-nowrap">{col1.title} </label>
                    <span className="specification-text"> {col1.value}</span>
                  </div>
                ))}
              </div>
            ))
          ) : null}
        </div>

      ) : keyTabView === "BOM & Route Details" ? (
        <div className="d-flex flex-wrap">
          {tabDataone === true && bomDataList.length > 0 ? (
            <div className="product-single__addtional-info product-single__details-list__content">
              {bomDataList.map((col, i) => {
                return (
                  <div className="item" key={col.id || `${i}-bom`}> {/* Unique key for each item */}
                    <label className="h6">{col.title} : </label>
                    <span> {col.value}</span>
                  </div>
                );
              })}
            </div>
          ) : null}

          {tabDataone === true && labourDataList.length > 0 ? (
            <div className="product-single__addtional-info product-single__details-list__content">
              {labourDataList.map((col, i) => {
                return (
                  <div className="item" key={col.id || `${i}-labour`}> {/* Unique key for each item */}
                    <label className="h6">{col.title} </label>
                    <span> {col.value}</span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : keyTabView === "Can Be Set With" ? (
        <div className="row mb-5">
          <div className="col-lg-12 size-guide__detail">
            {canBeSetWithDataList?.length > 0 ? (
              <div className="overflow-auto">
                <table className="certificat-table">
                  <thead>
                    <tr>
                      <th>Product Vertical</th>
                      <th className="text-center">No Of Stone</th>
                      <th className="text-center">Shape</th>
                      <th className="text-center">Size</th>
                      {/* <th className="text-center">{columName}</th> */}
                      <th className="text-center">Position</th>
                      <th className="text-center">Stone Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {canBeSetWithDataList.map((c, i) => (
                      <tr key={c.id || `${i}-canBeSet`}>
                        <td>{c?.vertical_name}</td>
                        <td className="text-center">{c?.no_of_stone}</td>
                        <td className="text-center">{c?.shape_name}</td>
                        <td className="text-center">{c?.size}</td>
                        {/* <td className="text-center">
                          {columName === "MM" ? (
                            <span>{c?.mm}</span>
                          ) : (
                            <span>
                              {c?.length} x {c?.width}{" "}
                              {c?.depth !== "" && <span>x {c?.depth}</span>}
                            </span>
                          )}
                        </td> */}
                        <td className="text-center">{c?.diy_position}</td>
                        <td className="text-center">{isEmpty(c?.stone_type) !== "" ? c?.stone_type : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
