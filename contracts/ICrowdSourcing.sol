//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


interface ICrowdSourcing {
  function initialize(string memory _purpose, uint256 _targetamount, address _deployer) external;
  function donaToCause() external;
  function getDonorsList() external;
    
} 