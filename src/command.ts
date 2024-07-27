import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generate, get_pub_key_from_secret } from './keypair';
import { request_airdrop, transact } from './transaction';

const get_secret_key_from_string = (secret_key_string: string) => {
    return secret_key_string
        .replace("[", "") // remove the starting "[" from the array string
        .replace("]", "") // remove ending "]" from the array string
        .split(",") // split the elements separated by ","
        .map(s => parseInt(s)); // convert elements to integer
}

yargs(hideBin(process.argv))
    // request airdrop command
    .command(
        'request-airdrop',
        'Requests an airdrop for given wallet address',
        (yargs) => yargs
        .option('wallet-address', {
            alias: 'w',
            type: 'string',
            description: `Requester's wallet address`
        })
        .option('sols', {
            alias: 's',
            type: 'number',
            description: 'Number of sols to be transfered'
        })
        .demandOption(['wallet-address'], 'Please provide wallet address/public key of the requester')
        .demandOption(['sols'], 'Specify amount to be transfered'),
        (argv) => {
            request_airdrop(argv['wallet-address'], argv.sols);
        }
    )
    // transfer command
    .command(
        'transfer',
        'Creates a transfer between provided wallet addresses',
        (yargs) => yargs
        .option('payer-secret', {
            alias: 'f',
            type: 'string',
            description: `Payer's secret key`
        })
        .option('to', {
            alias: 't',
            type: 'string',
            description: `Payee's wallet address`
        })
        .option('sols', {
            alias: 's',
            type: 'number',
            description: 'Number of sols to be transfered'
        })
        .demandOption(['payer-secret'], 'Please provide private key of the payer')
        .demandOption(['to'], 'Please provide wallet address/public key of the payee')
        .demandOption(['sols'], 'Specify amount to be transfered'),
        (argv) => {
            const payer_secret_key = get_secret_key_from_string(argv['payer-secret']);

            // do not allow any array other than a number array
            if(payer_secret_key.some(n => isNaN(n))) throw new Error("Secret key is invalid");

            transact(payer_secret_key, argv.to, argv.sols);
        }
    )
    // keypair commands
    .command(
        'keypair',
        'Creates a new keypair or helps getting a public key from secret key',
        (yargs) => yargs
        .option('from-secret', {
            type: 'string',
            description: 'Gets a public key from provided secret. Secret should be a Uint8Array. Not to be used with -s/--show-secret'
        })
        .option('show-secret', {
            alias: 's',
            type: 'boolean',
            description: 'Displays the private key after generating the keypair'
        })
        .conflicts('from-secret', 'show-secret'),
        (argv) => {
            if(!argv['from-secret']) return generate(!!argv['show-secret']);

            // parse a secret key out of the given string
            const secret_key = get_secret_key_from_string(argv['from-secret']);            

            // do not allow any array other than a number array
            if(secret_key.some(n => isNaN(n))) throw new Error("Secret key is invalid");

            return get_pub_key_from_secret(secret_key);
        }
    )
    .parse();