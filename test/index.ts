import { JsonRpcProvider } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect,assert } from "chai";
import { ContractFactory,utils } from "ethers";
import { ethers } from "hardhat";
import { CrowdSourcing, CrowdSourcingFactory } from "../typechain-types"

const { expectRevert } = require("@openzeppelin/test-helpers");

const provider:JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  "http://localhost:8545"
);



let CrowdSourceMaster: ContractFactory;
let CrowdSourceFactory: ContractFactory;
let crowdSourceMaster: CrowdSourcing;
let crowdSourceFactory: CrowdSourcingFactory;

let account1: SignerWithAddress;
let account2: SignerWithAddress;
let account3: SignerWithAddress;
let account4: SignerWithAddress;
let accounts: SignerWithAddress[] = [];

let cloneAddress: string;


describe("Deploy Contract Factory", function () {

  this.beforeAll('Set up user accounts' , async () => {
     accounts = await ethers.getSigners();
     console.log(await provider.getNetwork())
     const [ _account1, _account2, _account3, _account4 ] = accounts;
     account1 = _account1;
     account2 = _account2;
     account3 = _account3;
     account4 = _account4;

     console.log(account1.address)
     console.log(account2.address)
     console.log(account3.address)
     console.log(account4.address)

  });

  it("Deploy contract master and factory",  async() => {
    CrowdSourceMaster = await ethers.getContractFactory("CrowdSourcing", account1);
    crowdSourceMaster = await CrowdSourceMaster.deploy() as CrowdSourcing;
    crowdSourceMaster = await crowdSourceMaster.deployed();
    expect(crowdSourceMaster.address).to.exist;

    CrowdSourceFactory = await ethers.getContractFactory("CrowdSourcingFactory", account1);
    crowdSourceFactory = await CrowdSourceFactory.deploy(crowdSourceMaster.address) as CrowdSourcingFactory;
    crowdSourceFactory = await crowdSourceFactory.deployed();
    expect(crowdSourceFactory.address).to.exist;
  })

  

  it("it should create a new crowd sourcing contract", async function () {
    await crowdSourceFactory.createCrowdSourceContract("Peter Obi funding", utils.parseEther("20"), account1.address);
    console.log("amount in the account :", await provider.getBalance(account1.address))
    console.log("address ", account1.address)
    cloneAddress = await crowdSourceFactory.getCrowdSource("Peter Obi funding", utils.parseEther("20"));
    expect(cloneAddress).to.be.a('string'); 
  });


});

describe("contract functions test" , function(){
  let contract: CrowdSourcing;
  this.beforeAll("set up a contract", async function (){
    contract = await ethers.getContractAt("CrowdSourcing", cloneAddress, account1) as CrowdSourcing;
  });

  it("it should make donation to a crowd sourcing event", async function () {
    const donation = utils.parseEther("2.0");
    let balBefore = await provider.getBalance(account1.address);
    const options = { value: donation }
    await contract.connect(account1).donateToCause(options);
    let balAfter = await provider.getBalance(account1.address);
    const diff = balBefore.sub(balAfter);
    assert.equal(diff.toString(), donation.toString(), "balance mismatch")
});

it("it should allow multiple donation to a crowd sourcing event", async function () {
  const donation = utils.parseEther("2.0");
  let balBeforeOne = await provider.getBalance(account1.address);
  let balBeforeTwo = await provider.getBalance(account2.address);
  const options = { value: donation }
  await contract.connect(account1).donateToCause(options);
  await contract.connect(account2).donateToCause(options);
  let balAfterOne = await provider.getBalance(account1.address);
  let balAfterTwo = await provider.getBalance(account2.address);
  const diffOne = balBeforeOne.sub(balAfterOne);
  const diffTwo = balBeforeTwo.sub(balAfterTwo);
  assert.equal(diffOne.toString(), donation.toString(), "balance mismatch");
  assert.equal(diffTwo.toString(), donation.toString(), "balance mismatch")
});

it ("it should be able to get donors list ", async function (){
   let donorsList = await contract.connect(account1).getDonorsList();
   console.log("donor list", donorsList);
   expect(donorsList).to.be.an('array').have.lengthOf(2);
});

it ("it should prevent anyboby except the owner for withdrawing ", async function (){
  await expectRevert(contract.connect(account2).withdrwaDonation(), "caller not deployer")
});

it("it should be able to withraw the funds", async function(){
    let totalDonation = await contract.amountDonated();
    let balBefore = await provider.getBalance(account1.address);
    await contract.connect(account1).withdrwaDonation();
    let balAfter = await provider.getBalance(account1.address);
    let addedTotal = balBefore.add(totalDonation);
    assert.equal(addedTotal.toString(), balAfter.toString(), "balance mistmatch")
});

it("it should prevent withdrawal after campaign has ended", async function(){
   console.log("get clone made :", await crowdSourceFactory.getNumberofCloneMade())
   await expectRevert( contract.connect(account1).withdrwaDonation(), "Campaign is not running");
});

it("it should show the total number of proxy contract created", async function(){
   assert.equal((await crowdSourceFactory.getNumberofCloneMade()).toString(), "1", "number of created contract don't match");
})


})
