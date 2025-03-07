import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function AuthPage({ onAuthenticated }) {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if MetaMask is installed when the component mounts
  useEffect(() => {
    if (window.ethereum) {
      setIsMetaMaskInstalled(true);
    } else {
      alert("Please install MetaMask to use this DApp");
    }
  }, []);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    try {
      setLoading(true);
      // Requesting account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      onAuthenticated(address); // Pass authenticated address to parent component
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to connect to wallet. Please try again.");
    }
  };

  // Render button or connected account
  return (
    <div className="auth-page">
      <h1>Welcome to the Crowdfunding DApp</h1>

      {!account ? (
        <div>
          {isMetaMaskInstalled ? (
            <div>
              <button onClick={connectWallet} disabled={loading}>
                {loading ? "Connecting..." : "Connect MetaMask"}
              </button>
              <p>Connect your wallet to start contributing to the campaign.</p>
            </div>
          ) : (
            <p>Please install MetaMask to continue.</p>
          )}
        </div>
      ) : (
        <div>
          <h2>Connected</h2>
          <p>Your connected wallet address is:</p>
          <p>{account}</p>
          <button onClick={() => setAccount(null)}>Disconnect</button>
        </div>
      )}
    </div>
  );
}

export default AuthPage;
