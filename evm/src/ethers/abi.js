// https://eips.ethereum.org/EIPS/eip-721
const erc721 = [
    'function balanceOf(address _owner) external view returns (uint256)',
    'function ownerOf(uint256 _tokenId) external view returns (address)',
    'function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable',
    'function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable',
    'function transferFrom(address _from, address _to, uint256 _tokenId) external payable',
    'function approve(address _approved, uint256 _tokenId) external payable',
    'function setApprovalForAll(address _operator, bool _approved) external',
    'function getApproved(uint256 _tokenId) external view returns (address)',
    'function isApprovedForAll(address _owner, address _operator) external view returns (bool)',
];

const erc721Metadata = [
    'function name() external view returns (string _name)',
    'function symbol() external view returns (string _symbol)',
    'function tokenURI(uint256 _tokenId) external view returns (string)',
];

export { erc721, erc721Metadata };
