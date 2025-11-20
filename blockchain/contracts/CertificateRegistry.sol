// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateRegistry
 * @dev Smart contract for storing and verifying certificate hashes on blockchain
 */
contract CertificateRegistry {
    
    struct Certificate {
        bytes32 certificateHash;
        address issuer;
        string studentId;
        uint256 issueDate;
        string ipfsHash;
        bool isRevoked;
        bool exists;
    }
    
    // Mapping from certificate hash to Certificate
    mapping(bytes32 => Certificate) public certificates;
    
    // Mapping to track authorized issuers (institutions)
    mapping(address => bool) public authorizedIssuers;
    
    // Contract owner
    address public owner;
    
    // Events
    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed issuer,
        string studentId,
        uint256 issueDate,
        string ipfsHash
    );
    
    event CertificateRevoked(
        bytes32 indexed certificateHash,
        address indexed issuer
    );
    
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }
    
    /**
     * @dev Constructor - sets the contract deployer as owner
     */
    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true; // Owner is automatically authorized
    }
    
    /**
     * @dev Authorize an address to issue certificates
     * @param issuer Address to authorize
     */
    function authorizeIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!authorizedIssuers[issuer], "Issuer already authorized");
        
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }
    
    /**
     * @dev Revoke an issuer's authorization
     * @param issuer Address to revoke
     */
    function revokeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Issuer not authorized");
        require(issuer != owner, "Cannot revoke owner");
        
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }
    
    /**
     * @dev Issue a new certificate
     * @param certificateHash Hash of the certificate PDF
     * @param studentId Student identifier
     * @param ipfsHash IPFS hash where the certificate is stored
     */
    function issueCertificate(
        bytes32 certificateHash,
        string memory studentId,
        string memory ipfsHash
    ) external onlyAuthorizedIssuer {
        require(certificateHash != bytes32(0), "Invalid certificate hash");
        require(bytes(studentId).length > 0, "Student ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(!certificates[certificateHash].exists, "Certificate already exists");
        
        certificates[certificateHash] = Certificate({
            certificateHash: certificateHash,
            issuer: msg.sender,
            studentId: studentId,
            issueDate: block.timestamp,
            ipfsHash: ipfsHash,
            isRevoked: false,
            exists: true
        });
        
        emit CertificateIssued(
            certificateHash,
            msg.sender,
            studentId,
            block.timestamp,
            ipfsHash
        );
    }
    
    /**
     * @dev Verify if a certificate exists and get its details
     * @param certificateHash Hash to verify
     * @return exists Whether the certificate exists
     * @return issuer Address of the issuer
     * @return studentId Student identifier
     * @return issueDate Timestamp when issued
     * @return ipfsHash IPFS hash of the certificate
     * @return isRevoked Whether the certificate has been revoked
     */
    function verifyCertificate(bytes32 certificateHash)
        external
        view
        returns (
            bool exists,
            address issuer,
            string memory studentId,
            uint256 issueDate,
            string memory ipfsHash,
            bool isRevoked
        )
    {
        Certificate memory cert = certificates[certificateHash];
        return (
            cert.exists,
            cert.issuer,
            cert.studentId,
            cert.issueDate,
            cert.ipfsHash,
            cert.isRevoked
        );
    }
    
    /**
     * @dev Revoke a certificate
     * @param certificateHash Hash of the certificate to revoke
     */
    function revokeCertificate(bytes32 certificateHash) external {
        require(certificates[certificateHash].exists, "Certificate does not exist");
        require(
            certificates[certificateHash].issuer == msg.sender || msg.sender == owner,
            "Only issuer or owner can revoke"
        );
        require(!certificates[certificateHash].isRevoked, "Certificate already revoked");
        
        certificates[certificateHash].isRevoked = true;
        emit CertificateRevoked(certificateHash, msg.sender);
    }
    
    /**
     * @dev Check if a certificate is valid (exists and not revoked)
     * @param certificateHash Hash to check
     * @return isValid Whether the certificate is valid
     */
    function isCertificateValid(bytes32 certificateHash) external view returns (bool) {
        Certificate memory cert = certificates[certificateHash];
        return cert.exists && !cert.isRevoked;
    }
    
    /**
     * @dev Transfer contract ownership
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
        authorizedIssuers[newOwner] = true;
    }
}
