import React, { useEffect, useState } from "react";
import commanService from "@/CommanService/commanService";
import { isVerifyModal, verificationStatusAction } from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";
import { RandomId } from "@/CommanFunctions/commanFunctions";

const VerifyCard = () => {
  const dispatch = useDispatch();
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  const isLogin = Object.keys(loginDatas).length > 0;

  const [verificationData, setVerificationData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const fetchTwoStepVerificationData = () => {
    const twoStepVerificationObj = {
      SITDeveloper: "1",
      a: "GetTwoStepVerificationData",
      entity_id: storeEntityIds.entity_id,
      miniprogram_id: storeEntityIds.mini_program_id,
      secret_key: storeEntityIds.secret_key,
      tenant_id: storeEntityIds.tenant_id,
      member_id: isLogin ? loginDatas.member_id : RandomId,
    };
    commanService
      .postApi("/TwoFactorAuthntication", twoStepVerificationObj)
      .then((response) => {
        if (response.data.success === 1) {
          setVerificationData(response.data.data);
        } else {
          dispatch(verificationStatusAction(response.data.success));
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    fetchTwoStepVerificationData();
  }, []);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleDelete = () => {
    const updateTwoStepVerificationObj = {
      SITDeveloper: "1",
      a: "UpdateTwoStepVerification",
      entity_id: storeEntityIds.entity_id,
      tenant_id: storeEntityIds.tenant_id,
      unique_id: verificationData.unique_id,
      create_by: isLogin ? loginDatas.member_id : RandomId,
    };
    commanService
      .postApi("/TwoFactorAuthntication", updateTwoStepVerificationObj)
      .then((response) => {
        if (response.data.success === 1) {
          dispatch(verificationStatusAction(0));
          dispatch(isVerifyModal(false));
        }
        // window.location.reload();
      })
      .catch(() => { });
  };

  function formatDate(dateString) {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Create an Intl.DateTimeFormat object to format the date
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Format the date and return the result
    return formatter.format(date);
  }

  return (
    <div>
      <div className="bg-white p-20px">
        <label className="mb-2 fw-semi-bold fs-2">2-Step Verification</label>
      </div>
      <main className='p-3 bg-light bg-opacity-10'>
        {isEdit ?
          <React.Fragment>
            <p className="fs-5">How do you want to recieve Verification codes ?</p>
            <div className='d-flex justify-content-between align-items-center'>
              <h5 className='fs-5'> {verificationData ? verificationData.authnticator_name : ""}</h5>
              <div className='text-primary cursor-pointer text-decoration-underline' onClick={handleDelete}>Delete</div>
            </div>
            <p className='my-2'>
              <button className='border-0 bg-secondary text-white px-3 py-2' onClick={() => setIsEdit(false)}>Previous</button>
            </p>
          </React.Fragment>
          :
          <React.Fragment>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='fs-5'>Verification</div>
              <div className='text-primary cursor-pointer text-decoration-underline' onClick={handleEdit}>Edit</div>
            </div>
            <p className='fw-400 fs-16 my-2'>Backup : <small>{verificationData ? verificationData.authnticator_name : ""}</small></p>
            <div className='py-2 fs-5'>
              <span className=''>When</span>{/* btn-primary */}
              <p>Every login</p>
            </div>
            <div className="fs-5">
              <span>Added</span>
              <p> <small>{verificationData.create_at ? formatDate(verificationData.create_at) : ""} </small></p>
            </div>
          </React.Fragment>
        }
      </main>
    </div>
  );
};

export default VerifyCard;
