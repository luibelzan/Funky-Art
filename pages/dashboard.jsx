import React from "react";
import styles from '../styles/Home.module.css';
import { useAccount, useDisconnect, useConnect } from "wagmi";
import Moralis from 'moralis';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from "react";

const web3 = new Web3(Web3.givenProvider);

export default function Dashboard(){
    const { isConnected } = useAccount();
    const router = useRouter();
    const { disconnectAsync } = useDisconnect();
    const { account } = useConnect();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if(!isConnected) router.push('/')
    }, [isConnected]);

    const onSubmit = async (e) =>  {
        e.preventDefault();
        try {
            await Moralis.start({
                apiKey: 'pcnrcgbuUHRH7zLWNBK8eagrGbyuTBzyXwPmfvRxrgFGEJYYVgrvbaTIKiq5pc75',
                serverUrl: 'http://localhost:3000',
                appId: 'pcnrcgbuUHRH7zLWNBK8eagrGbyuTBzyXwPmfvRxrgFGEJYYVgrvbaTIKiq5pc75'
              });
              console.log("AQUIIIIIIIIIIIIIIII")
            //save image to IPFS
            const file1 = new Moralis.File(name, file);
            await file1.saveIPFS(); 
            const file1url = file1.ipfs;
            console.log('AQUIIIIIIIIIIIIIII1')

            //generate metadata and save to ipfs
            const metadata = {
                name, description, image: file1url
            }
            console.log("AQUIIIIIIIIIII2")
            const file2 = new Moralis.File(`${name}metadata.json`, {
                base64: Buffer.from(JSON.stringify(metadata)).toString('base64')
            });
            await file2.saveIPFS();
            const metadataurl = file2.ipfs();
            //interact with smart contracts
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const response = await contract.methods.mint(metadataurl).send({ from: account.get('ethAddress')});
            //const tokenId = response.events.Transfer.returnValues.tokenId;
            alert(
                'NFT successfully minted. Contract address - ${contractAddress} and Token Id - ${tokenId}'
            );
        } catch(err) {
           console.error(err);
           alert('Something went wrong'); 
        }
    }
    return <div className={styles.main}>
        <form onSubmit={onSubmit}>
            <div>
                <input type="text" className={styles.form} placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
            </div>

            <div>
                <input type="text" className={styles.form} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
            </div>

            <div>
                <input type="file" className={styles.form} placeholder="File" onChange={e => setFile(e.target.files[0])}/>
            </div>
            <button type="submit" className="styles.login">Mint now</button>
            <button onClick={disconnectAsync} className={styles.login}>Log out</button>
        </form>
    </div>
}