1. Add Network to Keplr
```
await window['keplr'].experimentalSuggestChain({
	features: ['no-legacy-stdTx'],
	chainId: "aura-testnet",
	chainName: "aura testnet",
	rpc: "http://18.138.28.51:26657",
	rest: "http://18.138.28.51:1317",
	bip44: {
		coinType: 118,
	},
	bech32Config: {
		bech32PrefixAccAddr: "aura",
		bech32PrefixAccPub: "aura" + "pub",
		bech32PrefixValAddr: "aura" + "valoper",
		bech32PrefixValPub: "aura" + "valoperpub",
		bech32PrefixConsAddr: "aura" + "valcons",
		bech32PrefixConsPub: "aura" + "valconspub",
	},
	currencies: [
		{
			coinDenom: "AURA",
			coinMinimalDenom: "uaura",
			coinDecimals: 6,
			// coinGeckoId: "aura",
		},
	],
	feeCurrencies: [
		{
			coinDenom: "AURA",
			coinMinimalDenom: "uaura",
			coinDecimals: 6,
			// coinGeckoId: "uaura",
		},
	],
	stakeCurrency: {
		coinDenom: "AURA",
		coinMinimalDenom: "uaura",
		coinDecimals: 6,
		// coinGeckoId: "uaura",
	},
	coinType: 118,
	gasPriceStep: {
		low: 1,
		average: 2.5,
		high: 4
	},
	walletUrlForStaking: "https://aura.network"
});
```
2. Detech Keplr
```
	if (!window.keplr) {
        alert("Please install keplr extension");
    } else {
        const chainId = "aura-testnet";

        // Enabling before using the Keplr is recommended.
        // This method will ask the user whether to allow access if they haven't visited this website.
        // Also, it will request that the user unlock the wallet if the wallet is locked.
        await window.keplr.enable(chainId);
    
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
    
        // You can get the address/public keys by `getAccounts` method.
        // It can return the array of address/public key.
        // But, currently, Keplr extension manages only one address/public key pair.
        // XXX: This line is needed to set the sender address for SigningCosmosClient.
        const accounts = await offlineSigner.getAccounts();
		console.log(accounts)
    }
```
2. Unlock Keplr
```
	window.keplr.enable(chainId);
```
3. Get current address / Public key
```
	await offlineSigner.getAccounts();
	//or
	await offlineSigner.getAccounts(chainid);
```
4. Sign transaction
- Require: @cosmjs/stargate
```
	npm install @cosmjs/stargate
```

- Use SigningStargateClient
```
	const chainId = "aura-testnet";
	await window.keplr.enable(chainId);
	const offlineSigner = window.getOfflineSigner(chainId);

	const client = await SigningStargateClient.connectWithSigner(tendermintUrl, offlineSigner);
	const tx = {
        chainId: "aura-testnet",
        // accountNumber: "0",
        // sequence: "0",
        // fee: {
        //     amount: [{
        //         amount: "0",
        //         denom: "uatom",
        //     }],
        //     gas: "200000",
        // },
        msgs: [
            {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: sender.address,
                    to_address: "auraxxxxxxxxxxxxxxxxxxx",
                    amount: [{
                        amount: "1",
                        denom: "uaura",
                    }],
                },
            },
        ],
        memo: "",
    };
	// sign transaction
    const signedTx = await client.sign(tx);
    console.log(signedTx);
    // broadcast transaction
    const res = await client.broadcast(signedTx);
    console.log(res);
```

Reference: https://docs.keplr.app/api/