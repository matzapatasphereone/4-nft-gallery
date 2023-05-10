import { useState } from "react";

import { NFTCard } from "@/components/NftCard";
const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
    const requestOptions = { method: "GET" };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts.slice(0, 10));
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      const requestOptions = {
        method: "GET",
      };
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts.slice(0, 10));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-3 py-8">
      <div className="flex w-full flex-col items-center justify-center gap-y-2">
        <input
          disabled={fetchForCollection}
          type="text"
          placeholder="Add your wallet address"
          onChange={(e) => setWalletAddress(e.target.value)}
        ></input>
        <input
          disabled={!fetchForCollection}
          onChange={(e) => setCollectionAddress(e.target.value)}
          type="text"
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type="checkbox"
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className="mt-3 w-1/5 rounded-sm bg-blue-400 px-4 py-2 text-white disabled:bg-slate-500"
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }}
        >
          Let's go!
        </button>
      </div>
      <div className="mt-4 flex w-5/6 flex-wrap justify-center gap-x-2 gap-y-12">
        {NFTs.length &&
          NFTs.map((nft, i) => {
            return <NFTCard key={i} nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
