// pages/index.js
import DashboardSidebar from "@/components/otherPages/DashboardSidebar";
import { Auth } from "@/components/authentication/auth";
import OrderDetail from "@/components/otherPages/OrderDetail";

export async function getServerSideProps(context) {
  const { params, req } = context;

  const orderId = params.orderId
  return {
    props: {
      orderId
    },
  };
}

function DashboardProfile({ orderId }) {

  return (
    <>
      <main className="page-wrapper">
        <div className="mb-4 pb-0 pb-md-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Orders</h2>
          <div className="row">
            <DashboardSidebar />
            <OrderDetail orderIds={orderId} />
          </div>
        </section>
      </main>
      <div className="section-gap"></div>
    </>
  )
}
export default Auth(DashboardProfile)