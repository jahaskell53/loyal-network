from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("https://fantom-testnet.rpc.thirdweb.com")
contract = sdk.get_contract("")
data = contract.call("getPendingOrders")
print(data)