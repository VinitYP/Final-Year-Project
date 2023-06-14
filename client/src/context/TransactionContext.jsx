import React, {useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI ,contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({children}) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [fromData, setFromData] = useState({ addressTo: '',amount: '',keyword: '',message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([])

    const handleChange = (e, name) => {
        setFromData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert("Please Install Metamask");
            const transactionContract =  getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            const structuredTransactions = availableTransactions.map((transaction) => ({
               addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
             }  ));
               console.log(availableTransactions);
           setTransactions(structuredTransactions);
           console.log(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
       
    try {
            if(!ethereum) return alert("Please Install Metamask");

            const accounts = await ethereum.request({ method: 'eth_accounts'});

            //console.log(accounts);
            if(accounts.length) {
                setCurrentAccount(accounts[0]);

            getAllTransactions();
            }else{
                console.log('No accounts found');
            }
        } catch (error) { 
            console.log(error);

            throw new Error("No ethereum account")
    }
}


    const checkIfTransactionsExist = async () => {
        try {
    
            const transactionContract =  getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        
        } catch (error) {
        //console.log(error);

       //throw new Error("No ethereum object");
        } 
    };
    
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please Install Metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum account")
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please Install Metamask");

            const { addressTo, amount, keyword, message } = fromData;
            const transactionContract =  getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            

            await ethereum.request({ 
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }]
            });

    const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
            setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);
    


    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, fromData, setFromData, handleChange, sendTransaction, transactions, isLoading}}>
        {children}
        </TransactionContext.Provider>
    );
}