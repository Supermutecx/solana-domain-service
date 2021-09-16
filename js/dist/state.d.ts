/// <reference types="node" />
import { Connection, PublicKey } from '@solana/web3.js';
import { Schema } from 'borsh';
export declare class NameRegistryState {
    static HEADER_LEN: number;
    parentName: PublicKey;
    owner: PublicKey;
    class: PublicKey;
    data: Buffer | undefined;
    static schema: Schema;
    constructor(obj: {
        parentName: Uint8Array;
        owner: Uint8Array;
        class: Uint8Array;
    });
    static retrieve(connection: Connection, nameAccountKey: PublicKey): Promise<NameRegistryState>;
}
