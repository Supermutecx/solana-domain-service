/// <reference types="node" />
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Numberu32, Numberu64 } from './utils';
export declare function createInstruction(nameProgramId: PublicKey, systemProgramId: PublicKey, nameKey: PublicKey, nameOwnerKey: PublicKey, payerKey: PublicKey, hashed_name: Buffer, lamports: Numberu64, space: Numberu32, nameClassKey?: PublicKey, nameParent?: PublicKey, nameParentOwner?: PublicKey): TransactionInstruction;
export declare function updateInstruction(nameProgramId: PublicKey, nameAccountKey: PublicKey, offset: Numberu32, input_data: Buffer, nameUpdateSigner: PublicKey): TransactionInstruction;
export declare function transferInstruction(nameProgramId: PublicKey, nameAccountKey: PublicKey, newOwnerKey: PublicKey, currentNameOwnerKey: PublicKey, nameClassKey?: PublicKey): TransactionInstruction;
export declare function deleteInstruction(nameProgramId: PublicKey, nameAccountKey: PublicKey, refundTargetKey: PublicKey, nameOwnerKey: PublicKey): TransactionInstruction;
