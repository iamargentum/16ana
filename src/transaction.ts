import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const CONNECTION_URL = 'https://api.devnet.solana.com';  // for testing on devnet
// const CONNECTION_URL = 'http://127.0.0.1:8899'; // for testing on localnet

// create connection
const connection = new Connection(CONNECTION_URL);

export async function transact(payer_secret: Array<number>, payee_address: string, num_sols: number) {

    // create payer's keypair
    const payer_key_pair = Keypair.fromSecretKey(Uint8Array.from(payer_secret));
    console.log("Payer's public key is - ", payer_key_pair.publicKey.toBase58());
    
    // create transaction
    const transaction = new Transaction()
        .add(
            SystemProgram.transfer({
                fromPubkey: payer_key_pair.publicKey,
                toPubkey: new PublicKey(payee_address),
                lamports: LAMPORTS_PER_SOL * num_sols
            })
        );
    
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = payer_key_pair.publicKey;
    transaction.partialSign(payer_key_pair);

    // send
    const serialized_transaction = transaction.serialize();
    const signature = await connection.sendRawTransaction(serialized_transaction);
    console.log("Transfer successful\nTransfer signature - ", signature);   
}

export async function request_airdrop(pub_key: string, num_sols: number) {
    const transaction_id = await connection.requestAirdrop(new PublicKey(pub_key), LAMPORTS_PER_SOL * num_sols);
    console.log("Request successful\nTransaction id - ", transaction_id);
    
}