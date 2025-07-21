import "tailwindcss";
import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0xE72e7b4F1c1eb93c7989989dF9D7f5d067F76716";

function App() {
  const [text, setText] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };
  const handleGet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const currentMessage = await contract.getMessage();
        setCurrentMessage(currentMessage);

      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  }

  return (
    <main style={{ padding: "2rem" }} className="flex flex-col gap-4">
      <div>
        <h1>Set Message on Smart Contract</h1>
        <input
          type="text"
          placeholder="Set message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSet}>Set Message</button>
      </div>

      <div className="flex flex-row mt-4 gap-3">
        <button onClick={handleGet}>Get Message</button>
        <div className="p-2 bg-[#f7ad4e] rounded-lg min-w-40">
          <h1 className="text-3xl font-bold text-center">
            {currentMessage}
          </h1>
        </div>
      </div>
    </main>
  );
}

export default App;
