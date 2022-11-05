var mysql = require('mysql');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3')
const ABIFile = require("./ethereum/ABI.json")
require('dotenv').config()


const provider = new HDWalletProvider(process.env.ACCOUNT_KEY, process.env.PROVIDER_URL);

const web3 = new Web3(provider);


// Connect to Main Smart Contract
var contract = new web3.eth.Contract(ABIFile, "0xA434100151672C83E265af79Dae315Baffd0DD21");




exports.Mymethod = async () => {

    try {
        // Connnect to Contract
        var contract = new web3.eth.Contract(ABIFile, "0x524209929eD34eAFd856d29f5C2E3Bf2956c6061");

        // var Token = new web3.eth.Contract(ABIFileToken, "0x885660CfE3a0C56f5D4120290b65f97C4D3672BE");


        // Get an Ethereum account
        const accounts = await web3.eth.getAccounts();

        my_account = await web3.eth.accounts.privateKeyToAccount('687eb2d351b12d19ab1992206732c195f9ac0adcc7e3a50257c19843e19d92b1')

        // user = await contract.methods.Id_TO_Address_User(0).call();
        // console.log(user)
        // symbol = await contract.methods.Id_TO_Address_Symbol(0).call();
        // console.log(symbol)
        result = await contract.methods.ShowAllBalances(0, 5, 0, 5).call();

        console.log(result)


        return result;
        // console.log("-----------------------------")
        // console.log( my_account.sign("Hello World"))
        // console.log("----------------------------")
        // console.log(await web3.eth.personal.sign("0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2", "0xBadd8E834AAa056cE676Cd0965bf71F233d85c1D"))


    } catch (error) {
        console.log(error)
    }

};

exports.ShowAllBalances = async (req, res) => {

    showallbalancs = async (SymbolStartIndex, SymbolEndIndex, UserStartIndex, UserEndIndex) => {
        try {

            let symbols = []
            let users = []
            let amounts = []

            let balances = await contract.methods.ShowAllBalances(SymbolStartIndex, SymbolEndIndex, UserStartIndex, UserEndIndex).call();

            for (i = 0; i < balances.length; i++) {

                symbols.push(await contract.methods.Id_TO_Address_Symbol(balances[i][0]).call());
                users.push(await contract.methods.Id_TO_Address_User(balances[i][1]).call());
                amounts.push(balances[i][2]);

            }

            // console.log(amounts)

            for (i = 0; i < symbols.length; i++) {

                // amount = parseFloat(amounts[i]);
                currentTime = Date.now();
                var sql = `insert into readtable (user, symbol, amount, lastupdate) 
                values ("${users[i]}", "${symbols[i]}", ${amounts[i]}, ${currentTime})`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                });
            }

            // console.log(typeof(users[0]));

        } catch (error) {
            console.log(error)
        }
    }

};

exports.AllBalances2 = async (SymbolStartIndex, SymbolEndIndex, UserStartIndex, UserEndIndex) => {

    try {

        let symbols = []
        let users = []
        let amounts = []

        let balances = await contract.methods.ShowAllBalances(SymbolStartIndex, SymbolEndIndex, UserStartIndex, UserEndIndex).call();

        for (i = 0; i < balances.length; i++) {

            symbols.push(await contract.methods.Id_TO_Address_Symbol(balances[i][0]).call());
            users.push(await contract.methods.Id_TO_Address_User(balances[i][1]).call());
            amounts.push(balances[i][2]);

        }

        // console.log(amounts)

        for (i = 0; i < symbols.length; i++) {

            // amount = parseFloat(amounts[i]);
            currentTime = Date.now();
            var sql = `insert into writetable (user, symbol, amount, lastupdate, signature, status) 
            values ("${users[i]}", "${symbols[i]}", ${amounts[i]}, ${currentTime}, "${users[i]}", 'new')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }

        // console.log(typeof(users[0]));

    } catch (error) {
        console.log(error)
    }

};

exports.UpdateBalances = async (req, res) => {

    Updatebalances = async () => {
        try {

            const accounts = await web3.eth.getAccounts();

            result = await contract.methods.UpdateBalances([0], [0], ['10000000000000000000'], [6], ['0x425791f5175148ef4c3f1a915a513caf249c381649e0d3aa45d1e5b18cee7e9b28f8165535fe3a8a5f86ee71867b2b232eb80f17adbd84d299e77f084299759e1c'])
                .send({
                    from: accounts[0]
                })

        } catch (error) {
            console.log(error)
        }

    }

    res.send(await Updatebalances())
};