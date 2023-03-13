import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import snapshot from '@snapshot-labs/snapshot.js';
import { Web3Provider } from '@ethersproject/providers';
import React,{useState, useEffect} from 'react';
import  Stack  from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

interface Window{
  ethereum : any
}

declare const window: Window

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const [docURL, setDocURL] =useState<string>("")
  useEffect(()=>{
    console.log(title);
    console.log(body);
    console.log(docURL);
  },[title,body,docURL],)

  //test用のsnapshotだったらhttps://testnet.snapshot.org
  //本番用のsnapshotだったらhttps://snapshot.org
  const hub = 'https://testnet.snapshot.org'; 
  const client = new snapshot.Client712(hub);

  // snapshotにvoteする関数
  const voteSubmit = async() => {

    const web3 = new Web3Provider(window.ethereum);
    const [account] = await web3.listAccounts();
    let date = new Date();
      const start = Math.floor(date.getTime() / 1000);
      // 2分で投票終了
      const end = start + 120;
      const footText = "\n## 投票内容\nこの提案に賛成 or 反対の意志の表明をお願いいたします。\n\n## 注意点\nこの提案に投票できる方は、ガバナンストークンの保有者であり、かつこの提案が公開される以前に保有している方となります。";
      const url = "\n## 提案のドキュメント\n" + docURL;
      const latestBlock = await web3.getBlockNumber();

      const receipt = await client.proposal(web3, account, {
        space: '',
        type: 'single-choice',
        title: title,
        body: (body + url + footText),
        choices: ['賛成', '反対'],
        start: start,
        end: end,
        snapshot: latestBlock,
        plugins: JSON.stringify({}),
        app: 'snapshot_test',
        discussion: ''
      });
      console.log({receipt});
  }
  return (
    <>
      <Head>
        <title>DAOに提案する</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Typography>
          DAOに投票案を投げる
        </Typography>
        <Stack spacing={3}>
          <TextField
            size="small"
            label="タイトル"
            onChange={(e)=> setTitle(e.target.value)}
          />
          <TextField
             size="small"
             label="内容"
             multiline
             onChange={(e)=> setBody(e.target.value)}
          />
          <TextField
             size="small"
             label="提案ドキュメントに関するURL"
             onChange={(e)=> setDocURL(e.target.value)}
          />
          <Button
            onClick={voteSubmit}
          >
            提案を作成する
          </Button>
        </Stack>
      </main>
    </>
  )
}
