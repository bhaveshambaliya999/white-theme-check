import commanService from "@/CommanService/commanService";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Verification from "./Verification";
import VerifyCard from "./VerifyCard";
import { RandomId } from "@/CommanFunctions/commanFunctions";

const AccountVerification = () => {
  const isCallRef = useRef(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const loginDatas = typeof window !== "undefined" && JSON.parse(sessionStorage.getItem("loginData")) || useSelector((state) => state.loginData);
  const verificationStatusActions = useSelector(
    (state) => state.verificationStatusAction
  );

  const isLogin = Object.keys(loginDatas).length > 0;

  const [loading, setLoading] = useState(false);

  // Verification
  const [verificationStep, setVerificationStep] = useState(1);
  const [QRCodeImage, setQRCodeImage] = useState("");

  const fetchQrCode = () => {
    setLoading(true);
    const QRCodeObj = {
      SITDeveloper: "1",
      a: "QrCodeGenerate",
      entity_id: storeEntityIds.entity_id,
      miniprogram_id: storeEntityIds.mini_program_id,
      secret_key: storeEntityIds.secret_key,
      tenant_id: storeEntityIds.tenant_id,
      member_id: isLogin ? loginDatas.member_id : RandomId,
    };
    commanService
      .postApi("/TwoFactorAuthntication", QRCodeObj)
      .then((response) => {
        if (response.data.success === 1) {
          setQRCodeImage(response.data.data);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isCallRef.current) {
      fetchQrCode();
      isCallRef.current = true;
    }
  }, []);

  return (
    <div className="col-lg-9">
      <div className="page-content">
        <div className="title-content">
          <i className="ic_verification fs-3 pe-3"></i>
          <h3 className="fw-bold mb-0">2-Step Verification</h3>
        </div>
        {verificationStatusActions ? (
          <VerifyCard />
        ) : verificationStep === 1 ? (
          <div className="row justify-content-between">
            <div className="col-sm-8 fs-6">
              {/* <label className="mb-2 fw-semi-bold fs-2">
                2-Step Verification
              </label> */}
              <div className="mt-2">
                <span className="fw-semi-bold">On Your Phone</span>
                <div className="text-secondary">
                  <ul className="list-unstyled">
                    <li>
                      1. Install an <b>Authenticator App</b> from your phone's
                      store such as the <b>Google Authenticator App</b>.
                    </li>
                    <li>
                      2. Open the <b>Authenticator App</b>.
                    </li>
                    <li>
                      3. Tap the <b>Add</b> icon or the <b>Begin Setup</b>{" "}
                      button.
                    </li>
                    <li>
                      4. Choose <b>Scan a Barcode</b>, and scan using your
                      phone:
                    </li>
                  </ul>
                  <button
                    className="btn btn-primary"
                    onClick={() => setVerificationStep(2)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-4 mt-4 mt-sm-0">
              <img src={QRCodeImage} width={200} height={200} alt="QRCode" />
            </div>
          </div>
        ) : (
          <Verification setVerificationStep={setVerificationStep} />
        )}
      </div>
    </div>
  );
};

export default AccountVerification;
