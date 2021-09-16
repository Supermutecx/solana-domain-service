"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInstruction = exports.transferInstruction = exports.updateInstruction = exports.createInstruction = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
function createInstruction(nameProgramId, systemProgramId, nameKey, nameOwnerKey, payerKey, hashed_name, lamports, space, nameClassKey, nameParent, nameParentOwner) {
    const buffers = [
        Buffer.from(Int8Array.from([0])),
        new utils_1.Numberu32(hashed_name.length).toBuffer(),
        hashed_name,
        lamports.toBuffer(),
        space.toBuffer(),
    ];
    const data = Buffer.concat(buffers);
    const keys = [
        {
            pubkey: systemProgramId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: payerKey,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: nameKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: nameOwnerKey,
            isSigner: false,
            isWritable: false,
        },
    ];
    if (nameClassKey) {
        keys.push({
            pubkey: nameClassKey,
            isSigner: true,
            isWritable: false,
        });
    }
    else {
        keys.push({
            pubkey: new web3_js_1.PublicKey(Buffer.alloc(32)),
            isSigner: false,
            isWritable: false,
        });
    }
    if (nameParent) {
        keys.push({
            pubkey: nameParent,
            isSigner: false,
            isWritable: false,
        });
    }
    else {
        keys.push({
            pubkey: new web3_js_1.PublicKey(Buffer.alloc(32)),
            isSigner: false,
            isWritable: false,
        });
    }
    if (nameParentOwner) {
        keys.push({
            pubkey: nameParentOwner,
            isSigner: true,
            isWritable: false,
        });
    }
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.createInstruction = createInstruction;
function updateInstruction(nameProgramId, nameAccountKey, offset, input_data, nameUpdateSigner) {
    const buffers = [
        Buffer.from(Int8Array.from([1])),
        offset.toBuffer(),
        new utils_1.Numberu32(input_data.length).toBuffer(),
        input_data,
    ];
    const data = Buffer.concat(buffers);
    const keys = [
        {
            pubkey: nameAccountKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: nameUpdateSigner,
            isSigner: true,
            isWritable: false,
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.updateInstruction = updateInstruction;
function transferInstruction(nameProgramId, nameAccountKey, newOwnerKey, currentNameOwnerKey, nameClassKey) {
    const buffers = [Buffer.from(Int8Array.from([2])), newOwnerKey.toBuffer()];
    const data = Buffer.concat(buffers);
    const keys = [
        {
            pubkey: nameAccountKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: currentNameOwnerKey,
            isSigner: true,
            isWritable: false,
        },
    ];
    if (nameClassKey) {
        keys.push({
            pubkey: nameClassKey,
            isSigner: true,
            isWritable: false,
        });
    }
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.transferInstruction = transferInstruction;
function deleteInstruction(nameProgramId, nameAccountKey, refundTargetKey, nameOwnerKey) {
    const buffers = [Buffer.from(Int8Array.from([3]))];
    const data = Buffer.concat(buffers);
    const keys = [
        {
            pubkey: nameAccountKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: nameOwnerKey,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: refundTargetKey,
            isSigner: false,
            isWritable: true,
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.deleteInstruction = deleteInstruction;
//# sourceMappingURL=instructions.js.map