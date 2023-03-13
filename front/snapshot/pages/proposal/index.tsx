import snapshot from '@snapshot-labs/snapshot.js';
import { Web3Provider } from '@ethersproject/providers';
import React,{useState, useEffect} from 'react';

interface Window{
  ethereum : any
}

declare const window: Window

type SampleFormInput = {
  title : string
  body : string
  docURL : string
}

const hub = 'https://hub.snapshot.org'; 
const client = new snapshot.Client712(hub);

export default function Vote() {
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const [docURL, setDocURL] =useState<string>("")
  useEffect(()=>{
    console.log(title);
  },[title])

  // snapshotにvoteする関数
  const voteSubmit = async() => {
    const web3 = new Web3Provider(window.ethereum);
    const [account] = await web3.listAccounts();
    let date = new Date();
      const start = Math.floor(date.getTime() / 1000);
      const end = start + 120;
      const footText = "";
      const url = "" + docURL;
      const latestBlock = await web3.getBlockNumber();

      const receipt = await client.proposal(web3, account, {
        space: 'aram-test.eth',
        type: 'single-choice',
        title: title,
        body: (body + url + footText),
        choices: ['賛成', '反対'],
        start: start,
        end: end,
        snapshot: latestBlock,
        plugins: JSON.stringify({}),
        app: 'beautiful-village-Dao',
        discussion: 'snapshot_test'
      });
      console.log({receipt});
  }
  return (
    <div>
      <div>タイトル</div>
      <input
        onChange={(e)=> setTitle(e.target.value)}
      />
       <button>aa</button>
    </div>
  )

}