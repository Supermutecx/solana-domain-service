"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNameRegistry = exports.transferNameOwnership = exports.updateNameRegistryData = exports.createNameRegistry = exports.HASH_PREFIX = exports.NAME_PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const instructions_1 = require("./instructions");
const state_1 = require("./state");
const utils_1 = require("./utils");
const utils_2 = require("./utils");
////////////////////////////////////////////////////////////
exports.NAME_PROGRAM_ID = new web3_js_1.PublicKey('namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX');
exports.HASH_PREFIX = 'SPL Name Service';
////////////////////////////////////////////////////////////
/**
 * Creates a name account with the given rent budget, allocated space, owner and class.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the new account
 * @param space The space in bytes allocated to the account
 * @param payerKey The allocation cost payer
 * @param nameOwner The pubkey to be set as owner of the new name account
 * @param lamports The budget to be set for the name account. If not specified, it'll be the minimum for rent exemption
 * @param nameClass The class of this new name
 * @param parentName The parent name of the new name. If specified its owner needs to sign
 * @returns
 */
async function createNameRegistry(connection, name, space, payerKey, nameOwner, lamports, nameClass, parentName) {
    const hashed_name = await utils_2.getHashedName(name);
    const nameAccountKey = await utils_2.getNameAccountKey(hashed_name, nameClass, parentName);
    const balance = lamports
        ? lamports
        : await connection.getMinimumBalanceForRentExemption(space);
    let nameParentOwner;
    if (parentName) {
        const parentAccount = await utils_2.getNameOwner(connection, parentName);
        nameParentOwner = parentAccount.owner;
    }
    const createNameInstr = instructions_1.createInstruction(exports.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, nameAccountKey, nameOwner, payerKey, hashed_name, new utils_1.Numberu64(balance), new utils_2.Numberu32(space), nameClass, parentName, nameParentOwner);
    return createNameInstr;
}
exports.createNameRegistry = createNameRegistry;
/**
 * Overwrite the data of the given name registry.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name registry to update
 * @param offset The offset to which the data should be written into the registry
 * @param input_data The data to be written
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 */
async function updateNameRegistryData(connection, name, offset, input_data, nameClass, nameParent) {
    const hashed_name = await utils_2.getHashedName(name);
    const nameAccountKey = await utils_2.getNameAccountKey(hashed_name, nameClass, nameParent);
    let signer;
    if (nameClass) {
        signer = nameClass;
    }
    else {
        signer = (await state_1.NameRegistryState.retrieve(connection, nameAccountKey))
            .owner;
    }
    const updateInstr = instructions_1.updateInstruction(exports.NAME_PROGRAM_ID, nameAccountKey, new utils_2.Numberu32(offset), input_data, signer);
    return updateInstr;
}
exports.updateNameRegistryData = updateNameRegistryData;
/**
 * Change the owner of a given name account.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name account
 * @param newOwner The new owner to be set
 * @param curentNameOwner the current name Owner
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 * @returns
 */
async function transferNameOwnership(connection, name, newOwner, nameClass, nameParent) {
    const hashed_name = await utils_2.getHashedName(name);
    const nameAccountKey = await utils_2.getNameAccountKey(hashed_name, nameClass, nameParent);
    let curentNameOwner;
    if (nameClass) {
        curentNameOwner = nameClass;
    }
    else {
        curentNameOwner = (await state_1.NameRegistryState.retrieve(connection, nameAccountKey)).owner;
    }
    const transferInstr = instructions_1.transferInstruction(exports.NAME_PROGRAM_ID, nameAccountKey, newOwner, curentNameOwner, nameClass);
    return transferInstr;
}
exports.transferNameOwnership = transferNameOwnership;
/**
 * Delete the name account and transfer the rent to the target.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name account
 * @param refundTargetKey The refund destination address
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 * @returns
 */
async function deleteNameRegistry(connection, name, refundTargetKey, nameClass, nameParent) {
    const hashed_name = await utils_2.getHashedName(name);
    const nameAccountKey = await utils_2.getNameAccountKey(hashed_name, nameClass, nameParent);
    let nameOwner;
    if (nameClass) {
        nameOwner = nameClass;
    }
    else {
        nameOwner = (await state_1.NameRegistryState.retrieve(connection, nameAccountKey))
            .owner;
    }
    const changeAuthoritiesInstr = instructions_1.deleteInstruction(exports.NAME_PROGRAM_ID, nameAccountKey, refundTargetKey, nameOwner);
    return changeAuthoritiesInstr;
}
exports.deleteNameRegistry = deleteNameRegistry;
//# sourceMappingURL=bindings.js.map