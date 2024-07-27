import { Keypair } from "@solana/web3.js";

export function generate(showSecret: boolean) {
    const keypair = Keypair.generate();
    console.log("new keypair generated");
    console.log("public key - ", keypair.publicKey.toBase58());
    if(showSecret) {
        console.log("secret key - ", keypair.secretKey);
    }    
}

export function get_pub_key_from_secret(secret: Array<number>) {
    let secret_ = Uint8Array.from(secret);    
    const pair = Keypair.fromSecretKey(secret_);
    console.log("publick key - ", pair.publicKey.toBase58());
}