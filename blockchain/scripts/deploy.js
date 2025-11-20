const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateRegistry contract...");

  // Get the contract factory
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  
  // Deploy the contract
  const certificateRegistry = await CertificateRegistry.deploy();
  
  // Wait for deployment to complete
  await certificateRegistry.waitForDeployment();
  
  const address = await certificateRegistry.getAddress();

  console.log(`CertificateRegistry deployed to: ${address}`);
  console.log(`Deployer (owner): ${(await hre.ethers.getSigners())[0].address}`);
  
  // Save the contract address and ABI
  const fs = require("fs");
  const contractInfo = {
    address: address,
    deployer: (await hre.ethers.getSigners())[0].address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployment-info.json",
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
  
  // Update backend .env file
  const path = require("path");
  const backendEnvPath = path.join(__dirname, "../../backend/.env");
  const frontendEnvPath = path.join(__dirname, "../../frontend/.env");
  
  try {
    // Update backend .env
    if (fs.existsSync(backendEnvPath)) {
      let backendEnv = fs.readFileSync(backendEnvPath, "utf8");
      backendEnv = backendEnv.replace(
        /CONTRACT_ADDRESS=0x[a-fA-F0-9]{40}/,
        `CONTRACT_ADDRESS=${address}`
      );
      fs.writeFileSync(backendEnvPath, backendEnv);
      console.log("Updated backend/.env with new contract address");
    }
    
    // Update frontend .env
    if (fs.existsSync(frontendEnvPath)) {
      let frontendEnv = fs.readFileSync(frontendEnvPath, "utf8");
      frontendEnv = frontendEnv.replace(
        /VITE_CONTRACT_ADDRESS=0x[a-fA-F0-9]{40}/,
        `VITE_CONTRACT_ADDRESS=${address}`
      );
      fs.writeFileSync(frontendEnvPath, frontendEnv);
      console.log("Updated frontend/.env with new contract address");
    }
  } catch (error) {
    console.log("Note: Could not update .env files automatically");
    console.log("Please update manually with:");
    console.log(`CONTRACT_ADDRESS=${address}`);
  }
  
  console.log("\nContract ABI saved to: ./artifacts/contracts/CertificateRegistry.sol/CertificateRegistry.json");
  console.log(`\nContract deployed at: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
