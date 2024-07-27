# 16ana

This is my submission for Assignment 1 in the Solana Summer Fellowship. This is a CLI application that lets you -
1. Create a key pair
2. Retrieve a public key from a private key
3. Transfer sols from one account to another
4. Request an Airdrop

# Setup

This project is created using Bun, but you can use Node+npm or Deno to run this project.

## Install dependencies

```sh
bun install
```

## Run

Before running the `16ana` CLI app, you need to register it. Run the following commands to register the CLI application.
    
```sh
bun link
bun link 16ana
```

To make sure the application was registered successfully, run
    
```sh
16ana --version
```

The output should look something like this -
    
```sh
1.0.0
```

Now, let's look into all the commands that this application offers us.

### Creating a keypair

You can use the following command to create a keypair -
    
```sh
16ana keypair
```
This command will print the public key of the created keypair.
If you wish to get the private key printed on the terminal, use the `-s` or `--show-secret` flag.
    
```sh
16ana keypair --show-secret
```

### Getting public key from private key

We can get the public key from a private key that we already have using the `--from-secret` option on `keypair` command -
    
```sh
16ana keypair --from-secret="<private-key>"
```

Example:
    
```sh
16ana keypair --from-secret="[ 1, 70, 69, 248, 202, 4, 159, 251, 181, 40, 86, 45, 109, 94, 65, 139, 65, 9, 36, 45, 29, 91, 19, 90, 107, 189, 40, 247, 4, 178, 226, 62, 253, 111, 98, 230, 123, 175, 14, 241, 154, 146, 187, 1, 25, 5, 91, 161, 53, 111, 18, 187, 107, 112, 218, 50, 192, 222, 37, 218, 18, 11, 176, 255 ]"
```

#### Note

Make sure to wrap your private key in double or single quotes.

### Creating an airdrop

Use the `request-airdrop` command along with options `--wallet-address` and `--sols` to specify receiver's address and number of sols respectively.
    
```sh
16ana request-airdrop --wallet-address=<receiver-wallet-address> --sols=<number-of-sols>
```
This command creates an airdrop and returns a transaction ID, which can be queried later for transaction status.

### Creating a transfer

A transfer can be created using the `transfer` command with options `--payer-secret`, `--to` and `--sols` to specify sender's secret key, receiver's public key (address) and the number of sols to be transfered.
    
```sh
16ana transfer --payer-secret="<payer-secret-key>" --to=<receiver-public-key> --sols=<number-of-sols-to-be-transfered>
```

# Miscellaneous stuff
- The `devnet` seems to have quite aggressive rate limiting, so in case your limit is expired, uncomment line #4 in `transactions.ts` and comment out line #3 in the same file to make the app point to `localnet`, in case you have a running localnet.
- Feel free to raise issues for bugs and contribute to making this project better. There are no contribution guidelines as such. Just raise a PR and I'll review it.

# Why the name "16ana"?
16 in Hindi is Solah. So 16ana becomes "Solah"-ana. I know this is not much, but this is as creative as I can get. Haha.

# Credits
- I don't really know `bun` and `typescript`, but thanks to [this](https://balamurugan16.hashnode.dev/blazingly-fast-cli-with-bun) blog for a great intro to `bun` and building CLI apps with it.
- Thanks to Kunal for session 1 where he introduced us to transactions on Solana!