

import React, { useState } from "react";
import AuthPage from "./AuthPage"; // Import the AuthPage component

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  // Function to handle authentication
  const handleAuthentication = (address) => {
    setAuthenticated(true);
    setUserAddress(address);
  };

  return (
    <div className="App">
      {!authenticated ? (
        <AuthPage onAuthenticated={handleAuthentication} />
      ) : (
        <div>
          <h1>Welcome to the Crowdfunding DApp</h1>
          <p>Your wallet is connected with address: {userAddress}</p>
          {/* The rest of your DApp features go here */}
        </div>
      )}
    </div>
  );
}

export default App;

