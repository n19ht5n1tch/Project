let web3;
let contract;

async function loadWeb3() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return true;
      } catch (error) {
        console.error('User denied account access:', error);
        return false;
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask.');
      return false;
    }
  }
  

async function loadContract() {
  contract = new web3.eth.Contract(abi, contractAddress);
}

async function addCandidate() {
  try {
    const candidateName = document.getElementById('candidateName').value.trim();
    if (!candidateName) {
      alert('Please enter a candidate name.');
      return;
    }

    const accounts = await web3.eth.getAccounts();
    await contract.methods.addCandidate(candidateName).send({ from: accounts[0] });
    alert('Candidate added successfully!');
    displayCandidates(); // Update candidates list after adding a candidate
  } catch (error) {
    console.error('Error while adding candidate:', error);
    alert('Failed to add candidate. Please try again.');
  }
}

async function displayCandidates() {
  const candidatesList = document.getElementById('candidatesList');
  candidatesList.innerHTML = '';

  const candidatesCount = await contract.methods.candidatesCount().call();
  for (let i = 1; i <= candidatesCount; i++) {
    const candidate = await contract.methods.candidates(i).call();
    const li = document.createElement('li');
    li.textContent = `ID: ${candidate.id} | Name: ${candidate.name} | Votes: ${candidate.voteCount}`;
    candidatesList.appendChild(li);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const web3Loaded = await loadWeb3();
  if (web3Loaded) {
    await loadContract();
    displayCandidates(); // Display candidates list on page load
  }
});
