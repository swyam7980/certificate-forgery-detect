"""Check Hardhat blockchain state"""
import requests
import json

def check_blockchain_state():
    rpc_url = "http://localhost:8545"
    
    print("=== Hardhat Blockchain State ===\n")
    
    # Get block number
    response = requests.post(rpc_url, json={
        "jsonrpc": "2.0",
        "method": "eth_blockNumber",
        "params": [],
        "id": 1
    })
    block_num = int(response.json()['result'], 16)
    print(f"Current Block: {block_num}")
    
    # Get accounts
    response = requests.post(rpc_url, json={
        "jsonrpc": "2.0",
        "method": "eth_accounts",
        "params": [],
        "id": 1
    })
    accounts = response.json()['result']
    print(f"\nAccounts: {len(accounts)}")
    print(f"First account: {accounts[0]}")
    
    # Check if contract exists at the address
    contract_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    response = requests.post(rpc_url, json={
        "jsonrpc": "2.0",
        "method": "eth_getCode",
        "params": [contract_address, "latest"],
        "id": 1
    })
    code = response.json()['result']
    print(f"\nContract at {contract_address}:")
    print(f"Code length: {len(code)} bytes")
    print(f"Has code: {code != '0x'}")
    
    # Get recent transactions
    for i in range(max(0, block_num - 3), block_num + 1):
        response = requests.post(rpc_url, json={
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": [hex(i), True],
            "id": 1
        })
        block = response.json().get('result')
        if block and block['transactions']:
            print(f"\nBlock {i} has {len(block['transactions'])} transaction(s)")
            for tx in block['transactions']:
                print(f"  TX: {tx['hash']}")
                print(f"  From: {tx['from']}")
                print(f"  To: {tx['to']}")
                if tx['to']:
                    # Get receipt
                    receipt_response = requests.post(rpc_url, json={
                        "jsonrpc": "2.0",
                        "method": "eth_getTransactionReceipt",
                        "params": [tx['hash']],
                        "id": 1
                    })
                    receipt = receipt_response.json().get('result')
                    if receipt:
                        print(f"  Status: {'Success' if receipt['status'] == '0x1' else 'Failed'}")
                        print(f"  Contract Created: {receipt.get('contractAddress', 'None')}")

if __name__ == "__main__":
    check_blockchain_state()
