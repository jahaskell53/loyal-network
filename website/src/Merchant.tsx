import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import { PropsWithChildren, useEffect, useState } from "react";
import "./styles/Home.css";

export default function Merchant(props: PropsWithChildren<any>) {
  // make sure cant create multiple tokens
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("0");
  const [decimals, setDecimals] = useState("0");
  const [order, setOrder] = useState("");
  const [price, setPrice] = useState("0");
  const [found, setFound] = useState(false);
  const address = useAddress();
  // TODO: create a global variable
  const contractAddress = props.address;
  const { contract } = useContract(contractAddress);
  // const loyalAddress = props.loyalAddress;
  // console.log("loyal address", loyalAddress);
  // const object = useContract(loyalAddress);
  // const loyaltyContract = object.contract;
  // console.log("loyalty contract", loyaltyContract);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("submit");
    // const oldData = await loyaltyContract!.call("approve", contractAddress, 0.1**18);
    const data = await contract!.call(
      "deployLoyaltyProgram",
      name,
      symbol,
      parseInt(decimals),
      parseInt(supply),
      10000
    );

		console.log(data.receipt.events[2].address);
		// create a new contract object with the address of the deployed contract
		// setFound(true);
		// const deployedContract = useContract(data.receipt.events[2].address);

		// const { data: tokenAddress, isLoading: tokenAddressLoading } = contract.call(contract, "getTokenAddress");
	}

	const {
		data: readData,
		isLoading,
		error,
	} = useContractRead(contract, "getPendingOrders");

	const {
		data: acceptedData,
		isLoading: acceptedLoading,
		error: acceptedError,
	} = useContractRead(contract, "getAcceptedOrders");

	if (error) {
		console.error("failed to read contract", error);
	}

	if (acceptedError) {
		console.error("failed to read contract", acceptedError);
	}

	const [pendingOrders, setPendingOrders] = useState<any>([]);
	const [approvedOrders, setAcceptedOrders] = useState<any>([]);

	// const myAddress = useAddress();

	async function getOrders() {
		// let data = await contract?.call("getPendingOrders");
		// data = data[0];
		// console.log(data);
		// const object = [
		//   {
		//     amount: parseInt(data[0]["_hex"], 16),
		//     orderNumber: parseInt(data[2]["_hex"], 16),
		//     item: data[5],
		//     price: parseInt(data[1]["_hex"], 16),
		//     timestamp: parseInt(data[2]["_hex"], 16),
		//   },
		// ];
		// console.log(object);
		const pendingOrders = readData.map((order: any) => {
			return {
				amount: parseInt(order[0]["_hex"], 16),
				orderNumber: parseInt(order[2]["_hex"], 16),
				item: order[5],
				price: parseInt(order[1]["_hex"], 16),
				timestamp: parseInt(order[4]["_hex"], 16),
			};
		});
		console.log(pendingOrders);
		if (acceptedData) {
			const acceptedOrders = acceptedData.map((order: any) => {
				return {
					amount: parseInt(order[0]["_hex"], 16),
					orderNumber: parseInt(order[2]["_hex"], 16),
					item: order[5],
					price: parseInt(order[1]["_hex"], 16),
					timestamp: parseInt(order[4]["_hex"], 16),
				};
			});
			console.log(acceptedOrders);
			setAcceptedOrders(acceptedOrders);
		}
		setPendingOrders(pendingOrders);
	}

	async function acceptOrder(order: any) {
		console.log("submit");
		document
			.getElementById(`button-${order.orderNumber}`)!
			.setAttribute("disabled", "true");
		document.getElementById(`button-${order.orderNumber}`)!.innerText =
			"Loading Popup...";

		const metaData = {
			description:
				"Friendly OpenSea Creature that enjoys long swims in the ocean.",
			external_url: "https://mcdonalds.com",
			attributes: [
				{
					trait_type: "Order Number",
					value: order.orderNumber,
				},
				{
					trait_type: "Item",
					value: order.item,
				},
				{
					trait_type: "Price",
					value: order.price,
				},
				{
					trait_type: "Timestamp",
					value: order.timestamp,
				},
				{
					trait_type: "Amount",
					value: order.amount,
				},
			],
			image:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/640px-Hamburger_%28black_bg%29.jpg",
			name: `${order.item} Receipt`,
		};
		const storage = new ThirdwebStorage();
		const uri = await storage.upload(metaData);
		// This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
		console.log(uri);
		document.getElementById(`button-${order.orderNumber}`)!.innerText =
			"Pending...";

		// const owner = await NFTContract!.call("approve", address, 1);
		// console.log(owner);
		// const data = await NFTContract!.call("mint", address, uri);
		// console.log(data);
		console.log("order", order);
		console.log(order.orderNumber, uri);
		try {
			const data = await contract?.call("acceptOrder", order.orderNumber, uri);
			console.log(data);
			document.getElementById(`button-${order.orderNumber}`)!.innerText =
				"Approved";
		} catch (e) {
			console.error(e);
		}
	}

	// useEffect(() => {
	//   if (!acceptedLoading && !isLoading) {
	//     getOrders();
	//   }
	// }, [acceptedLoading, isLoading]);

	// const {
	//   function: createTokenFunction,
	//   isLoading: loading,
	//   error: error,
	// } = useContractWrite(contract, "createToken");

	// create a hook for holding the pending orders

	return (
		<div className="container">
			<h1 className="userTag">Merchant</h1>
			{/* Pending Orders */}
			{!isLoading && !acceptedLoading && pendingOrders.length != 0 ? (
				<div id="table" className="table">
					<table style={{ color: "white" }}>
						<thead>
							<tr>
								<th>Item</th>
								<th>Price</th>
								<th>Amount</th>
								<th>Order Number</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{pendingOrders &&
								pendingOrders.map((order: any) => {
									return (
										<tr key={order.orderNumber}>
											<td>{order.item}</td>
											<td>{order.price}</td>
											<td>{order.amount}</td>
											<td>{order.orderNumber}</td>
											<td>
												<button
													id={`button-${order.orderNumber}`}
													onClick={() => acceptOrder(order)}
												>
													Approve
												</button>
											</td>
										</tr>
									);
								})}
							{approvedOrders &&
								approvedOrders.map((order: any) => {
									return (
										<tr key={order.orderNumber}>
											<td>{order.item}</td>
											<td>{order.price}</td>
											<td>{order.amount}</td>
											<td>{order.orderNumber}</td>
											<td>
												<button
													id={`button-${order.orderNumber}`}
													onClick={() => acceptOrder(order)}
													disabled
												>
													Approved
												</button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			) : (
				<div>Loading...</div>
			)}
			<main className="main">
				<div>
					{/* <button onClick={getOrders}>Get Orders</button> */}
					{/* <ConnectWallet /> */}
					<form onSubmit={(e) => handleSubmit(e)}>
						<input
							id="name"
							type={"text"}
							placeholder={"Token Name"}
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
						<input
							id="symbol"
							type={"text"}
							placeholder={"Token Symbol"}
							value={symbol}
							onChange={(e) => setSymbol(e.target.value)}
						/>
						{/* <input
                id="supply"
                type={"number"}
                placeholder={"Token Supply"}
                value={supply}
                onChange={e => setSupply((e.target.value))}
              /> */}
						{/* <input
                id="decimals"
                type={"number"}
                placeholder={"Token Decimals"}
                value={decimals}
                onChange={e => setDecimals((e.target.value))}
              /> */}
						<button type={"submit"}>Create Loyalty Program</button>
					</form>
				</div>
			</main>
		</div>
	);
}
