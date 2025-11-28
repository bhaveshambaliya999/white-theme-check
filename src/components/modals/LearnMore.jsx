import { useSelector } from "react-redux";

export default function LearnMore({setShowLearnMoreModal}) {
  const donationDataListss = useSelector((state) => state.donationDataLists);
  return (
    <div
      className="modal fade"
      id="learnGuide"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog size-guide">
        {donationDataListss?.length != 0 ? (
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {donationDataListss?.[0]?.project_name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowLearnMoreModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="text-center">
                  <img
                    src={donationDataListss?.[0]?.image}
                    // style={{ width: "750px" }}
                  />
                </div>
                <div className="mt-3">
                  <h5 className="mb-2">
                    About {donationDataListss?.[0]?.project_name}
                  </h5>
                  {donationDataListss?.[0]?.project_breif}
                </div>
                <div className="text-end mt-2">
                  <a
                    style={{ color: "blue", textDecoration: "underLine" }}
                    href={`${donationDataListss?.[0]?.project_url}`}
                    target="_blank"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* <!-- /.modal-dialog --> */}
    </div>
  );
}
