const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
  let certificateRegistry;
  let owner;
  let issuer;
  let addr1;

  beforeEach(async function () {
    [owner, issuer, addr1] = await ethers.getSigners();
    
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    certificateRegistry = await CertificateRegistry.deploy();
    await certificateRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await certificateRegistry.owner()).to.equal(owner.address);
    });

    it("Should authorize owner as issuer by default", async function () {
      expect(await certificateRegistry.authorizedIssuers(owner.address)).to.be.true;
    });
  });

  describe("Issuer Management", function () {
    it("Should authorize a new issuer", async function () {
      await certificateRegistry.authorizeIssuer(issuer.address);
      expect(await certificateRegistry.authorizedIssuers(issuer.address)).to.be.true;
    });

    it("Should emit IssuerAuthorized event", async function () {
      await expect(certificateRegistry.authorizeIssuer(issuer.address))
        .to.emit(certificateRegistry, "IssuerAuthorized")
        .withArgs(issuer.address);
    });

    it("Should not allow non-owner to authorize issuer", async function () {
      await expect(
        certificateRegistry.connect(addr1).authorizeIssuer(issuer.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should revoke an issuer", async function () {
      await certificateRegistry.authorizeIssuer(issuer.address);
      await certificateRegistry.revokeIssuer(issuer.address);
      expect(await certificateRegistry.authorizedIssuers(issuer.address)).to.be.false;
    });
  });

  describe("Certificate Issuance", function () {
    let certificateHash;
    const studentId = "STU12345";
    const ipfsHash = "QmTest123";

    beforeEach(async function () {
      certificateHash = ethers.keccak256(ethers.toUtf8Bytes("Test Certificate"));
    });

    it("Should issue a certificate", async function () {
      await certificateRegistry.issueCertificate(certificateHash, studentId, ipfsHash);
      
      const cert = await certificateRegistry.verifyCertificate(certificateHash);
      expect(cert.exists).to.be.true;
      expect(cert.issuer).to.equal(owner.address);
      expect(cert.studentId).to.equal(studentId);
      expect(cert.ipfsHash).to.equal(ipfsHash);
      expect(cert.isRevoked).to.be.false;
    });

    it("Should emit CertificateIssued event", async function () {
      await expect(certificateRegistry.issueCertificate(certificateHash, studentId, ipfsHash))
        .to.emit(certificateRegistry, "CertificateIssued")
        .withArgs(certificateHash, owner.address, studentId, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1), ipfsHash);
    });

    it("Should not allow unauthorized issuer to issue certificate", async function () {
      await expect(
        certificateRegistry.connect(addr1).issueCertificate(certificateHash, studentId, ipfsHash)
      ).to.be.revertedWith("Not an authorized issuer");
    });

    it("Should not allow duplicate certificates", async function () {
      await certificateRegistry.issueCertificate(certificateHash, studentId, ipfsHash);
      await expect(
        certificateRegistry.issueCertificate(certificateHash, studentId, ipfsHash)
      ).to.be.revertedWith("Certificate already exists");
    });
  });

  describe("Certificate Verification", function () {
    let certificateHash;
    const studentId = "STU12345";
    const ipfsHash = "QmTest123";

    beforeEach(async function () {
      certificateHash = ethers.keccak256(ethers.toUtf8Bytes("Test Certificate"));
      await certificateRegistry.issueCertificate(certificateHash, studentId, ipfsHash);
    });

    it("Should verify an existing certificate", async function () {
      const cert = await certificateRegistry.verifyCertificate(certificateHash);
      expect(cert.exists).to.be.true;
      expect(cert.studentId).to.equal(studentId);
    });

    it("Should return false for non-existent certificate", async function () {
      const nonExistentHash = ethers.keccak256(ethers.toUtf8Bytes("Non-existent"));
      const cert = await certificateRegistry.verifyCertificate(nonExistentHash);
      expect(cert.exists).to.be.false;
    });

    it("Should check if certificate is valid", async function () {
      expect(await certificateRegistry.isCertificateValid(certificateHash)).to.be.true;
    });
  });

  describe("Certificate Revocation", function () {
    let certificateHash;
    const studentId = "STU12345";
    const ipfsHash = "QmTest123";

    beforeEach(async function () {
      certificateHash = ethers.keccak256(ethers.toUtf8Bytes("Test Certificate"));
      await certificateRegistry.issueCertificate(certificateHash, studentId, ipfsHash);
    });

    it("Should revoke a certificate", async function () {
      await certificateRegistry.revokeCertificate(certificateHash);
      const cert = await certificateRegistry.verifyCertificate(certificateHash);
      expect(cert.isRevoked).to.be.true;
    });

    it("Should emit CertificateRevoked event", async function () {
      await expect(certificateRegistry.revokeCertificate(certificateHash))
        .to.emit(certificateRegistry, "CertificateRevoked")
        .withArgs(certificateHash, owner.address);
    });

    it("Should not allow non-issuer to revoke", async function () {
      await expect(
        certificateRegistry.connect(addr1).revokeCertificate(certificateHash)
      ).to.be.revertedWith("Only issuer or owner can revoke");
    });

    it("Should mark revoked certificate as invalid", async function () {
      await certificateRegistry.revokeCertificate(certificateHash);
      expect(await certificateRegistry.isCertificateValid(certificateHash)).to.be.false;
    });
  });
});
