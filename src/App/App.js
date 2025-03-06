import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

// Replace this with the actual ABI and contract address after deployment
const contractABI = [/* your contract ABI here */];
const contractAddress = "YOUR_CONTRACT_ADDRESS";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [goal, setGoal] = useState(0);
  const [fundsRaised, setFundsRaised] = useState(0);
  const [contribution, setContribution] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [userContribution, setUserContribution] = useState(0);

  useEffect(() => {
    // Setup provider and contract on load
    const setupBlockchain = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      setProvider(provider);
      setContract(contract);

      // Get campaign details
      const [goal, deadline, fundsRaised, userContribution] = await contract.getCampaignDetails();
      setGoal(ethers.utils.formatEther(goal));
      setFundsRaised(ethers.utils.formatEther(fundsRaised));
      setDeadline(deadline);
      const userAddress = await signer.getAddress();
      setAccount(userAddress);
      const userContributionValue = await contract.contributions(userAddress);
      setUserContribution(ethers.utils.formatEther(userContributionValue));
    };

    if (window.ethereum) {
      setupBlockchain();
    } else {
      alert("Please install MetaMask");
    }
  }, []);

  const contribute = async () => {
    if (!contribution || contribution <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      const tx = await contract.contribute({
        value: ethers.utils.parseEther(contribution.toString()),
      });
      await tx.wait();
      alert("Contribution successful!");
      window.location.reload(); // Refresh page to update the state
    } catch (err) {
      console.error(err);
      alert("Error contributing");
    }
  };

  const withdrawFunds = async () => {
    try {
      const tx = await contract.withdrawFunds();
      await tx.wait();
      alert("Funds withdrawn successfully!");
    } catch (err) {
      console.error(err);
      alert("Error withdrawing funds");
    }
  };

  return (
    <div className="App">
      <h1>Crowdfunding DApp</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Goal: {goal} ETH</p>
          <p>Funds Raised: {fundsRaised} ETH</p>
          <p>Deadline: {new Date(deadline * 1000).toLocaleString()}</p>
          <p>Your Contribution: {userContribution} ETH</p>

          <h2>Make a Contribution</h2>
          <input
            type="number"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            placeholder="Amount in ETH"
          />
          <button onClick={contribute}>Contribute</button>

          {fundsRaised >= goal && <button onClick={withdrawFunds}>Withdraw Funds</button>}
        </div>
      ) : (
        <div>
          <button onClick={async () => await window.ethereum.request({ method: "eth_requestAccounts" })}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
