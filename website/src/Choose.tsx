import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Merchant from "./Merchant";
import User from "./User";
import { useAddress, useUser } from "@thirdweb-dev/react";

// We will import AuthContext.Provider which will provide us with the value object,

function Choose() {
  const address = useAddress();
  return (
    <>
    {address && <div className="btn" id="Choose">
        <button onClick={() => window.location.href = "/user"}>User</button>
        <button onClick={() => window.location.href = "/merchant"}>Merchant</button>
      </div>
}
    </>
  );
}

export default Choose;
