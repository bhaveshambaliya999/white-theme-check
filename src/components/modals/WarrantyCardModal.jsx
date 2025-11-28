import { useSelector } from "react-redux";

export default function WarrantyCardModal(props) {
  const { handlePassState, serialNumber, orderData, handlePassFunction } =
    props;
  const selector = useSelector((state) => state);
  return (
    <div
      className="modal fade"
      id="warrantyCard"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog size-guide">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{serialNumber}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => handlePassState(false)}
            ></button>
          </div>
          <div className="modal-body">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Create Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orderData?.length > 0 ? (
                  orderData.map((item, i) => {
                    const formattedDate =
                      new Date(item.create_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      }) +
                      " " +
                      new Date(item.create_at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      });

                    return (
                      <tr key={i}>
                        <td>{item.order_id}</td>
                        <td>{formattedDate}</td>
                        <td
                          className="cursor-pointer edit_btn"
                          onClick={() => handlePassFunction(item)}
                        >
                          <Link href={"#"}>Add</Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <p className="text-center">No Recored Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <!-- /.modal-dialog --> */}
    </div>
  );
}
