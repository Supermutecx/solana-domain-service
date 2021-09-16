/// <reference types="node" />
import { AccountInfo, Connection, Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { NameRegistryState } from './state';
export declare class Numberu32 extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): Buffer;
    /**
     * Construct a Numberu64 from Buffer representation
     */
    static fromBuffer(buffer: any): BN;
}
export declare class Numberu64 extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): Buffer;
    /**
     * Construct a Numberu64 from Buffer representation
     */
    static fromBuffer(buffer: any): BN;
}
export declare const signAndSendTransactionInstructions: (connection: Connection, signers: Array<Keypair>, feePayer: Keypair, txInstructions: Array<TransactionInstruction>) => Promise<string>;
export declare function getHashedName(name: string): Promise<Buffer>;
export declare function getNameAccountKey(hashed_name: Buffer, nameClass?: PublicKey, nameParent?: PublicKey): Promise<PublicKey>;
export declare function getNameOwner(connection: Connection, nameAccountKey: PublicKey): Promise<NameRegistryState>;
export declare function getFilteredProgramAccounts(connection: Connection, programId: PublicKey, filters: any): Promise<{
    publicKey: PublicKey;
    accountInfo: AccountInfo<Buffer>;
}[]>;
