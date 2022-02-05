//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";


contract CrowdSourcing is Ownable, Initializable {
    
    string public purpose;
    uint256 public targetAmount;
    uint256 public amountDonated;
    mapping(address => uint256) public donors;
    address[] public donorsAddress;
    address public deployer;
    bool public campaignRunning;
    

 
    //Events
    event DonationMade(address indexed donorAddress, uint256 amount, string indexed crowdsource );
    event DonationWithdrawn(address indexed receipient, uint256 amount, string indexed crowdsource);

    struct DonorsAmount {
        address donorsAddress;
        uint256 amount;
    }

    
    function initialize(string memory _purpose, uint256 _targetamount, address _deployer) public initializer {
        purpose = _purpose;
        targetAmount = _targetamount;
        campaignRunning = true;
        deployer = _deployer;
        
        //Ownable.initialize(msg.sender);
    }

    function donateToCause() public payable isCampaignOn   {
      require(msg.value > 0, "donation of 0 ether made");
      require(msg.sender != address(this), "contract cannot make donation");
      //add the amount to the amountDonated
      amountDonated += (msg.value);
      //check if we have a donation made before
      bool exists = donors[msg.sender] != 0;
       //include addres and amount in the mapping donors
      donors[msg.sender] += msg.value;
      if ( !exists ){
          //push address to the donors addresss
          donorsAddress.push(msg.sender);
      }

      //emit a Donation Made event
      emit DonationMade(msg.sender, msg.value, purpose);
    }

    function withdrwaDonation() public payable isCampaignOn isDeployer {
        require(amountDonated > 0, "Nothing to withdraw");
        campaignRunning = false;
        payable(address(msg.sender)).transfer(amountDonated);
        emit DonationWithdrawn(msg.sender, amountDonated, purpose);
    }

    function getDonorsList() public view returns (DonorsAmount[] memory){
        uint256 totalDonors = donorsAddress.length;
        DonorsAmount[] memory donorsArray = new DonorsAmount[](totalDonors);
        for (uint256 i=0; i < totalDonors; i++){
            address currentAddress = donorsAddress[i];
            uint256 amount = donors[currentAddress];
            donorsArray[i] = DonorsAmount(
                currentAddress,
                amount
            );
        }
        return donorsArray;
    }


    modifier isCampaignOn {
        require(campaignRunning == true, "Campaign is not running");
        _;
    }

    modifier isDeployer{
        require(deployer == msg.sender, "caller not deployer");
        _;
    }
}