import { ConnectWallet, useAddress, useUser } from "@thirdweb-dev/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Choose from "./Choose";
import Merchant from "./Merchant";
import User from "./User";
import { useEffect } from "react";

// We will import AuthContext.Provider which will provide us with the value object,
const factoryAddress = "0xb25FC97112e755Dfe4fE59a80478Ab671197a404";
const loyalAddress = "0x0eBAA2BACE85a6f8F490fb9E0b82BbB19784486d";
function App() {
const { user, isLoggedIn } = useUser();
const address = useAddress();

  // useEffect(() => {
  //   console.log(isLoggedIn)
  // }, [isLoggedIn])
	return (
		<>
			<div id="App">
				<Router>
					{<ConnectWallet />}
					<Routes>
					 <Route path="/" element={<Choose />} />
						<Route
							path="/user"
							element={
								<User address={factoryAddress} loyalAddress={loyalAddress} />
							}
						/>
						<Route
							path="/merchant"
							element={
								<Merchant
									address={factoryAddress}
									loyalAddress={loyalAddress}
								/>
							}
						/>
					</Routes>
				</Router>
			</div>
		</>
	);
}

export default App;
