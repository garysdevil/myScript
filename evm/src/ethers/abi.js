// https://eips.ethereum.org/EIPS/eip-721
// https://ethereum.org/en/developers/docs/standards/tokens/erc-721/

const erc20 = [
    'function name() public view returns (string)',
    'function symbol() public view returns (string)',
    'function decimals() public view returns (uint8)',
    'function totalSupply() public view returns (uint256)',
    'function balanceOf(address _owner) public view returns (uint256 balance)',
    'function transfer(address _to, uint256 _value) public returns (bool success)',
    'function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)',
    'function approve(address _spender, uint256 _value) public returns (bool success)',
    'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
    'event Transfer(address indexed _from, address indexed _to, uint256 _value)',
    'event Approval(address indexed _owner, address indexed _spender, uint256 _value)',
];
// 'function mint(address receiver, uint256 amount)'

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
    // event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    // event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    // event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
];

const erc721Metadata = [
    'function name() external view returns (string _name)',
    'function symbol() external view returns (string _symbol)',
    'function tokenURI(uint256 _tokenId) external view returns (string)',
];

// eslint-disable-next-line prefer-spread
erc721.push.apply(erc721, erc721Metadata);

export { erc20, erc721 };
