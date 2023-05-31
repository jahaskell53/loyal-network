import { ConnectWallet, useAddress, useContract } from "@thirdweb-dev/react";
import { ChangeEvent, PropsWithChildren, useState } from "react";
import "./styles/Home.css";
import { parseBytes32String } from "ethers/lib/utils";

export default function User(props: PropsWithChildren<any>) {
	// make sure cant create multiple tokens
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [supply, setSupply] = useState("0");
	const [decimals, setDecimals] = useState("0");
	const [order, setOrder] = useState("");
	const [price, setPrice] = useState("0");
	const address = useAddress();
	const contractAddress = props.address;
	const { contract } = useContract(contractAddress);
	let total = 0;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log("submit");
		const newData = await contract!.call(
			"order",
			name,
			parseInt(amount),
			parseInt(price)
		);
	}

	const objects = [{name: "Burger", price: 10}, {name: "Drink", price: 20}, {name: "Fries", price: 15}]
	const [index, setIndex] = useState("0");


	// async function addToCart(e: React.FormEvent<HTMLFormElement>) {
	// 	e.preventDefault();
	// 	const itemName = (document.querySelector("#itemName") as HTMLInputElement)?.value;
	// 	const itemAmount = (document.querySelector("#itemAmount") as HTMLInputElement)?.value;
	// 	const itemPrice = (document.querySelector("#itemPrice") as HTMLInputElement)?.value;
	  
	// 	const tableBody = document.querySelector("#myTable tbody");
	// 	let existingRow: HTMLTableRowElement | null = null;
	  
	// 	if (tableBody) {
	// 	  const rows = tableBody.querySelectorAll("tr");
	// 	  for (let i = 0; i < rows.length; i++) {
	// 		const cells = rows[i].querySelectorAll("td");
	// 		if (cells[0].textContent === itemName) {
	// 		  existingRow = rows[i] as HTMLTableRowElement;
	// 		  break;
	// 		}
	// 	  }
	// 	}
	  
	// 	if (existingRow) {
	// 	  const amountCell = existingRow.cells[1];
	// 	  amountCell.textContent = (Number(amountCell.textContent) + Number(itemAmount)).toString();
	// 	} else {
	// 	  const newRow = document.createElement("tr");
	// 	  const nameCell = document.createElement("td");
	// 	  const amountCell = document.createElement("td");
	// 	  const costCell = document.createElement("td");
	  
	// 	  nameCell.textContent = itemName;
	// 	  amountCell.textContent = itemAmount;
	// 	  costCell.textContent = itemPrice;
	  
	// 	  newRow.appendChild(nameCell);
	// 	  newRow.appendChild(amountCell);
	// 	  newRow.appendChild(costCell);
	  
	// 	  tableBody?.appendChild(newRow);
	// 	}
	//   }
	  

	function onSelectChange(e: ChangeEvent<HTMLSelectElement>) {
		e.preventDefault();
		console.log(e.target)
		setIndex((e.target as HTMLSelectElement).value);
	}
	
	async function addToCart(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const tableBody = document.querySelector("#myTable tbody");
		const newRow = document.createElement("tr");
		const nameCell = document.createElement("td");
		const amountCell = document.createElement("td");
		const costCell = document.createElement("td");

		nameCell.textContent = name;
		amountCell.textContent = amount;
		costCell.textContent = price;
		total += parseInt(price);

		if (tableBody) {
			const rows = tableBody.querySelectorAll('tr') as NodeListOf<HTMLTableRowElement>;
			rows.forEach(row => {
			  const cells = row.querySelectorAll('td');
			  cells.forEach(cell => {
				if (cell.textContent === name) {
				  const amountCell = row.querySelector('[data-name="amount"]') as HTMLTableCellElement;
				  if (amountCell?.textContent) {
					const currentAmount = parseInt(amountCell.textContent, 10);
					amountCell.textContent = (currentAmount + parseInt(amount, 10)).toString();
				  }
				  return;
				}
			  });
			});
		  }
		  
		
		newRow.appendChild(nameCell);
		newRow.appendChild(amountCell);
		newRow.appendChild(costCell);
		tableBody?.appendChild(newRow);
		
		//console.log(newData);
		// const data = await contract!.call("order", price);
		// console.log(data);
	}



	// const {
	//   function: createTokenFunction,
	//   isLoading: loading,
	//   error: error,
	// } = useContractWrite(contract, "createToken");

	return (
		 <div className="container">
      {address && <>
			<h1 className = "userTag">User</h1>
			<main className="main">
				<div id = "top-div">
					{/* <ConnectWallet /> */}
				 <form onSubmit={(e) => addToCart(e)} id="form">
						{/* <input
							id="name"
							type={"dropdown"}
							placeholder={"Item Name"}
							value={name}
							onChange={(event) => setName(event.target.value)}
						/> */}

<select name="names" id="name" onChange={(e) => onSelectChange(e)}>
	{objects.map(((val, index) => {
		return (<option value={index}>{val.name}</option>)
	}))}
  {/* <option value="volvo">Burger</option>
  <option value="saab">Drink</option>
  <option value="mercedes">Fries</option>
  <option value="audi">Audi</option> */}
</select>
						<input
							id="amount"
							type={"text"}
							placeholder={"Amount"}
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>

						<div id="price-div">Price: {objects[parseInt(index)].price}</div>

						<button type={"submit"}>Add to Cart</button>
					</form>
				</div>
				<div id = "middle-div">
					<table id="myTable">
						<thead>
							<tr>
								<th className = "TableElem">Item Name</th>
								<th className = "TableElem">#</th>
								<th className = "TableElem">Cost</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
				<div id = "Payment">
					
					<div className="btn-mini">
					<p className="total" id = "total"> Total: ${total}</p>
						<button type={"submit"} >Pay in Points</button>
						<button type={"submit"} >Pay in Fiat</button>
					</div>
				</div>
			</main> </>}
		</div>
	);
}
