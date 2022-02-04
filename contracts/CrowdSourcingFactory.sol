// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//import "@openzeppelin/upgrades/contracts/ownership/Ownable.sol";


import "./ICrowdSourcing.sol";


import "hardhat/console.sol";

contract CrowdSourcingFactory is Ownable {
    address public implementation;
    address[] public allCrowdSource;
    mapping(bytes32 => address ) private idToAddress;
    using Clones for address;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function createCrowdSourceContract(string memory _purpose, uint256 _targetamount, address _deployer) 
    external payable returns (address crowdContract){
        bytes32 id = _getOptionId(_purpose, _targetamount);
        require(idToAddress[id] == address(0), "Crowd sourcing type exist");
        bytes32 salt = keccak256(abi.encodePacked(_purpose, _targetamount));
        crowdContract = Clones.cloneDeterministic(implementation, salt);
        ICrowdSourcing(crowdContract).initialize(_purpose, _targetamount, _deployer);
        allCrowdSource.push(crowdContract);
        idToAddress[id] = crowdContract;
    }

    function getCrowdSource(string memory _purpose, uint256 _amount ) public view returns (address){
        bytes32 id = _getOptionId(_purpose, _amount);
        return idToAddress[id];
    }

    function _getOptionId(string memory _purpose, uint256 amount) internal pure returns (bytes32){
        return keccak256(
            abi.encodePacked(_purpose, amount)
        );
    }

    function getNumberofCloneMade() public view returns (uint256) {
        return allCrowdSource.length;
    }

}