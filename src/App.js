import React, { useState, useEffect } from "react";
import "./App.css";

const Web3 = require("web3");
const Contract_ABI = require("./ethereum/ABI.json");
const Contract_ByteCode = require("./ethereum/ByteCode.json");

function App() {
  const [account, setAccount] = useState("");
  const [CheckList, setCheckList] = useState([]);
  const [InputValue, setInputValue] = useState("");
  const [tokenAddress, setTokenAddress] = useState(
    "0x991CafF95C842Aed04fdB95DA1dBBb6a2AfC7877"
  );

  // Connect to Sepolia
  const web3 = new Web3(window.ethereum);

  // Keep metask account connect
  // web3.eth.requestAccounts()
  //   .then((result) => {
  //     setAccount(result[0])
  //     setInputValue(result[0])
  //   })
  //   .catch(() => {
  //     console.log("error")
  //   })

  // Connect to smart contract
  const contract = new web3.eth.Contract(Contract_ABI, tokenAddress);

  const ConnetMetmask = async () => {
    const userAddress = (await web3.eth.requestAccounts())[0];
    setAccount(userAddress);
    setInputValue(userAddress);
    document.getElementById("MetaMaskAccount").value = account;
  };

  // Transact Functions

  const DeployContract = async () => {
    let TokenName = document.getElementById("TOKENNAME").value;
    let TokenSymbol = document.getElementById("TOKENSYMBOL").value;
    let TokenAmount = document.getElementById("TOKENAMOUNT").value;
    let DueDateAmount = document.getElementById("DUEDATEAMOUNT").value;
    let DueDate = document.getElementById("DUEDATE").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      new web3.eth.Contract(Contract_ABI)
        .deploy({
          data: Contract_ByteCode.object,
          arguments: [
            TokenName,
            TokenSymbol,
            TokenAmount,
            DueDateAmount,
            DueDate,
          ],
        })
        .send({
          from: account,
        });
    }
  };

  const EnableBlockAllTrans = async () => {
    let trueradio = document.getElementById("trueRadio").checked;
    let falseradio = document.getElementById("falseRadio").checked;
    let blockBoolean = "";

    if (account === "") {
      alert("First connect to metamask");
      return;
    } else {
      let ContractOwner = await contract.methods.contract_owner().call();
      if (account !== ContractOwner) {
        alert("Only owner can call this funciton");
        return;
      }

      if (trueradio) {
        blockBoolean = true;
      }
      if (falseradio) {
        blockBoolean = false;
      }
      if (blockBoolean === "") {
        alert("You need to choose true or fasle");
        return;
      }

      await contract.methods.EnableBlockTransactions(blockBoolean).send({
        from: account,
      });
    }
  };

  const AddToBlackList = async () => {
    let balckAddress = document.getElementById("BlackListInput").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      let ContractOwner = await contract.methods.contract_owner().call();
      if (account !== ContractOwner) {
        alert("Only owner can call this funciton");
        return;
      }

      await contract.methods.addBlackList(balckAddress).send({
        from: account,
      });
    }
  };

  const RemoveFromBlackList = async () => {
    let balckAddress = document.getElementById(
      "RemoveFromBlackListInput"
    ).value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      let ContractOwner = await contract.methods.contract_owner().call();
      if (account !== ContractOwner) {
        alert("Only owner can call this funciton");
        return;
      }

      await contract.methods.removeFromBlacklist(balckAddress).send({
        from: account,
      });
    }
  };

  const MintDaily = async () => {
    let TokenNumber = document.getElementById("MintDailyInput").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      await contract.methods.MintToken(`${TokenNumber}`).send({
        from: account,
      });
    }
  };

  const Approve = async () => {
    let spender = document.getElementById("ApproveSpender").value;
    let amount = document.getElementById("ApproveAmount").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      let decimal = await contract.methods.decimals().call();
      amount = parseInt(amount);
      amount = amount * 10 ** decimal;
      await contract.methods.approve(spender, `${amount}`).send({
        from: account,
      });
    }
  };

  const DecreaseAllowance = async () => {
    let spender = document.getElementById("DecreaseAllowanceSpender").value;
    let amount = document.getElementById("DecreaseAllowanceAmount").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      let decimal = await contract.methods.decimals().call();
      amount = amount * 10 ** decimal;
      await contract.methods.decreaseAllowance(spender, `${amount}`).send({
        from: account,
      });
    }
  };

  const IncreaseAllowance = async () => {
    let spender = document.getElementById("IncreaseAllowanceSpender").value;
    let amount = document.getElementById("IncreaseAllowanceAmount").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      let decimal = await contract.methods.decimals().call();
      amount = amount * 10 ** decimal;
      await contract.methods.increaseAllowance(spender, `${amount}`).send({
        from: account,
      });
    }
  };

  const Transfer = async () => {
    let receiver = document.getElementById("TransferReceiverAddress").value;
    let amount = document.getElementById("TransferAmount").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      let decimal = await contract.methods.decimals().call();
      amount = amount * 10 ** decimal;
      await contract.methods.transfer(receiver, `${amount}`).send({
        from: account,
        // gasLimit: 3000000
      });
    }
  };

  const TransferFrom = async () => {
    let from = document.getElementById("TransferFromAddress").value;
    let to = document.getElementById("TransferToAddress").value;
    let amount = document.getElementById("TransferFromAmount").value;

    if (account === "") {
      alert("First connect to metamask");
    } else {
      let decimal = await contract.methods.decimals().call();
      amount = amount * 10 ** decimal;
      await contract.methods.transferFrom(from, to, `${amount}`).send({
        from: account,
        // gasLimit: 3000000
      });
    }
  };

  // Call Functions

  const ChangeToken = () => {
    const result = document.getElementById("ChangeTokenAddress").value;
    setTokenAddress(result);
  };

  const BlockAllTransValue = async () => {
    let BooleanValue = await contract.methods.BlockAllTransactions().call();
    document.getElementById("BlockAllTransValue").value = BooleanValue;
  };

  const ShowTokenNmae = async () => {
    let name = await contract.methods.name().call();
    document.getElementById("NameInput").value = name;
  };

  const ShowTokenSymbol = async () => {
    let name = await contract.methods.symbol().call();
    document.getElementById("TokenSymbol").value = name;
  };

  const ShowBlackList = async () => {
    let BlackList = await contract.methods.ShowBlackList().call();
    var ul = document.getElementById("BlackList");
    for (let i = 0; i < BlackList.length; i++) {
      if (CheckList.includes(BlackList[i]) !== true) {
        setCheckList((current) => [...current, BlackList[i]]);

        var li = document.createElement("li");
        li.appendChild(document.createTextNode(BlackList[i]));
        ul.appendChild(li);
      }
    }
  };

  const BalanceOf = async () => {
    let address = document.getElementById("BalanceOf").value;
    let decimal = await contract.methods.decimals().call();
    let balance = await contract.methods.balanceOf(address).call();
    document.getElementById("ShowBalance").value = balance / 10 ** decimal;
  };

  const Allowance = async () => {
    let owner = document.getElementById("allowanceOwner").value;
    let spender = document.getElementById("allowanceSpender").value;
    let allowance = await contract.methods.allowance(owner, spender).call();
    let decimal = await contract.methods.decimals().call();
    allowance = allowance / 10 ** decimal;
    document.getElementById("ShowAllowance").value = allowance;
  };

  const CheckBlackAddress = async () => {
    let address = document.getElementById("checkBlackAddress").value;
    let result = await contract.methods.blackaddresss(address).call();
    document.getElementById("ResultCheckBlackAddress").value = result;
  };

  const ContractOwner = async () => {
    let result = await contract.methods.contract_owner().call();
    document.getElementById("ContractOwner").value = result;
  };

  const Desimals = async () => {
    let result = await contract.methods.decimals().call();
    document.getElementById("Decimal").value = result;
  };

  const DueDate = async () => {
    let result = await contract.methods.due_date().call();
    document.getElementById("DueDate").value = result;
  };

  const DueDateAmount = async () => {
    let result = await contract.methods.due_date_amount().call();
    document.getElementById("DueDateAmount").value = result;
  };

  const TotalSupply = async () => {
    let result = await contract.methods.totalSupply().call();
    let decimal = await contract.methods.decimals().call();
    document.getElementById("TotalSupply").value = result / 10 ** decimal;
  };

  return (
    <>
      <div className="OneColumnContainer">
        <div className="item">
          <button onClick={ConnetMetmask} class="button MetaMaskBtn">
            {" "}
            Connect MetaMask{" "}
          </button>
          <input id="MetaMaskAccount" className="input" value={InputValue} />
        </div>
      </div>

      <div id="TitleDesktop" className="container">
        <div className="item">
          <h4>Tranact Functions</h4>
        </div>

        <div className="item">
          <h4>Call Functions</h4>
        </div>
      </div>

      <div className="container BottomMargin">
        <div className="item">
          <div id="TransactTitle">
            <h4>Tranact Functions</h4>
          </div>

          <div>
            <input
              id="TOKENNAME"
              className="input"
              placeholder="Enter Token Name"
            />
            <br />
            <input
              id="TOKENSYMBOL"
              className="input"
              placeholder="Enter Token Symbol"
            />
            <br />
            <input
              id="TOKENAMOUNT"
              className="input"
              placeholder="Enter Token Amount"
            />
            <br />
            <input
              id="DUEDATEAMOUNT"
              className="input"
              placeholder="Enter Token Due Date Amount"
            />
            <br />
            <input
              id="DUEDATE"
              className="input"
              placeholder="Enter Token Due Date"
            />
            <button onClick={DeployContract} className="button TransactButton">
              {" "}
              Deploy Contract{" "}
            </button>
          </div>

          <div>
            <input
              id="BlackListInput"
              className="input"
              placeholder="Enter Address to Block"
            />
            <br />
            <button onClick={AddToBlackList} className="button TransactButton">
              {" "}
              Add Black List{" "}
            </button>
          </div>

          <div>
            <input
              id="RemoveFromBlackListInput"
              className="input"
              placeholder="Enter Address to Block"
            />
            <br />
            <button
              onClick={RemoveFromBlackList}
              className="button TransactButton"
            >
              {" "}
              Remove From Black List{" "}
            </button>
          </div>

          <div>
            <input type="radio" id="trueRadio" name="checkRadio" value="true" />
            <i id="trueRadioText">True</i>
            <input
              type="radio"
              id="falseRadio"
              name="checkRadio"
              value="false"
            />
            <i id="falseRadioText">Fasle</i>
            <br />
            <button
              onClick={EnableBlockAllTrans}
              className="button TransactButton"
            >
              {" "}
              Block All Transactions{" "}
            </button>
            <br />
          </div>

          <div>
            <input
              id="MintDailyInput"
              className="input"
              placeholder="Enter Token number"
            />
            <br />
            <button onClick={MintDaily} className="button TransactButton">
              {" "}
              Mint Daily{" "}
            </button>
          </div>

          <div>
            <input
              id="ApproveSpender"
              className="input"
              placeholder="Spender"
            />
            <br />
            <input id="ApproveAmount" className="input" placeholder="Amount" />
            <br />
            <button onClick={Approve} className="button TransactButton">
              {" "}
              Approve{" "}
            </button>
          </div>

          <div>
            <input
              id="DecreaseAllowanceSpender"
              className="input"
              placeholder="Spender"
            />
            <br />
            <input
              id="DecreaseAllowanceAmount"
              className="input"
              placeholder="Amount"
            />
            <br />
            <button
              onClick={DecreaseAllowance}
              className="button TransactButton"
            >
              {" "}
              Decrease Allowance{" "}
            </button>
          </div>

          <div>
            <input
              id="IncreaseAllowanceSpender"
              className="input"
              placeholder="Spender"
            />
            <br />
            <input
              id="IncreaseAllowanceAmount"
              className="input"
              placeholder="Amount"
            />
            <br />
            <button
              onClick={IncreaseAllowance}
              className="button TransactButton"
            >
              {" "}
              Increase Allowance{" "}
            </button>
          </div>

          <div>
            <input
              id="TransferReceiverAddress"
              className="input"
              placeholder="Receiver Address"
            />
            <br />
            <input id="TransferAmount" className="input" placeholder="Amount" />
            <br />
            <button onClick={Transfer} className="button TransactButton">
              {" "}
              Transfer{" "}
            </button>
          </div>

          <div>
            <input
              id="TransferFromAddress"
              className="input"
              placeholder="From"
            />
            <br />
            <input id="TransferToAddress" className="input" placeholder="To" />
            <br />
            <input
              id="TransferFromAmount"
              className="input"
              placeholder="Amount"
            />
            <br />
            <button onClick={TransferFrom} className="button TransactButton">
              {" "}
              Transfer From{" "}
            </button>
          </div>
        </div>

        <div className="item">
          <div id="CalltTitle">
            <h4>Call Functions</h4>
          </div>

          <div>
            <input
              id="ChangeTokenAddress"
              className="input"
              placeholder="new token address"
            />
            <br />
            <button onClick={ChangeToken} className="button">
              {" "}
              Change Token{" "}
            </button>
          </div>

          <div>
            <input
              id="checkBlackAddress"
              className="input"
              placeholder="address"
            />
            <br />
            <button onClick={CheckBlackAddress} className="button">
              {" "}
              Check Address Is Black{" "}
            </button>
            <input id="ResultCheckBlackAddress" className="HiddenInnput" />
          </div>

          <div>
            <input id="BalanceOf" className="input" placeholder="address" />
            <br />
            <button onClick={BalanceOf} className="button">
              {" "}
              Balance Of{" "}
            </button>
            <input id="ShowBalance" className="HiddenInnput" />
          </div>

          <div>
            <input
              id="allowanceOwner"
              className="input"
              placeholder="owner address"
            />
            <br />
            <input
              id="allowanceSpender"
              className="input"
              placeholder="spender address"
            />
            <br />
            <button onClick={Allowance} className="button">
              {" "}
              Allowance{" "}
            </button>
            <input id="ShowAllowance" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={ShowTokenNmae} className="button">
              {" "}
              Show Token name{" "}
            </button>
            <input id="NameInput" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={ShowTokenSymbol} className="button">
              {" "}
              Show Token Symbol{" "}
            </button>
            <input id="TokenSymbol" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={BlockAllTransValue} className="button">
              {" "}
              Block All Trans Value{" "}
            </button>
            <input id="BlockAllTransValue" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={ShowBlackList} className="button">
              {" "}
              Show Black List{" "}
            </button>
            <br />
            <ul id="BlackList"></ul>
          </div>

          <div>
            <button onClick={ContractOwner} className="button">
              {" "}
              Contract Owner{" "}
            </button>
            <input id="ContractOwner" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={Desimals} className="button">
              {" "}
              Decimals{" "}
            </button>
            <input id="Decimal" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={DueDate} className="button">
              {" "}
              Due Date{" "}
            </button>
            <input id="DueDate" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={DueDateAmount} className="button">
              {" "}
              Due Date Amount{" "}
            </button>
            <input id="DueDateAmount" className="HiddenInnput" />
          </div>

          <div>
            <button onClick={TotalSupply} className="button">
              {" "}
              Total Supply{" "}
            </button>
            <input id="TotalSupply" className="HiddenInnput" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
