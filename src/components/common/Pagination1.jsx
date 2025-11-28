export default function Pagination1(props) {
  return (
    <div
      className="progress progress_uomo mb-3 ms-auto me-auto"
      style={{ width: "300px" }}
    >
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${props.valuenow}%` }}
        aria-valuenow={`${Math.round(props.valuenow?.toFixed(2))}%`}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  );
}
