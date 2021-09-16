"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReverseTwitterRegistry = exports.ReverseTwitterRegistryState = exports.getTwitterRegistryData = exports.getTwitterHandleandRegistryKeyViaFilters = exports.getHandleAndRegistryKey = exports.getTwitterRegistry = exports.getTwitterRegistryKey = exports.deleteTwitterRegistry = exports.changeVerifiedPubkey = exports.changeTwitterRegistryData = exports.createVerifiedTwitterRegistry = exports.TWITTER_ROOT_PARENT_REGISTRY_KEY = exports.TWITTER_VERIFICATION_AUTHORITY = void 0;
const web3_js_1 = require("@solana/web3.js");
const bindings_1 = require("./bindings");
const instructions_1 = require("./instructions");
const state_1 = require("./state");
const utils_1 = require("./utils");
const borsh_1 = require("borsh");
////////////////////////////////////////////////////
// Global Variables
exports.TWITTER_VERIFICATION_AUTHORITY = new web3_js_1.PublicKey('FvPH7PrVrLGKPfqaf3xJodFTjZriqrAXXLTVWEorTFBi');
// The address of the name registry that will be a parent to all twitter handle registries,
// it should be owned by the TWITTER_VERIFICATION_AUTHORITY and it's name is irrelevant
exports.TWITTER_ROOT_PARENT_REGISTRY_KEY = new web3_js_1.PublicKey('4YcexoW3r78zz16J2aqmukBLRwGq6rAvWzJpkYAXqebv');
////////////////////////////////////////////////////
// Bindings
// Signed by the authority, the payer and the verified pubkey
async function createVerifiedTwitterRegistry(connection, twitterHandle, verifiedPubkey, space, // The space that the user will have to write data into the verified registry
payerKey) {
    // Create user facing registry
    const hashedTwitterHandle = await utils_1.getHashedName(twitterHandle);
    const twitterHandleRegistryKey = await utils_1.getNameAccountKey(hashedTwitterHandle, undefined, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    let instructions = [
        instructions_1.createInstruction(bindings_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, twitterHandleRegistryKey, verifiedPubkey, payerKey, hashedTwitterHandle, new utils_1.Numberu64(await connection.getMinimumBalanceForRentExemption(space)), new utils_1.Numberu32(space), undefined, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY, exports.TWITTER_VERIFICATION_AUTHORITY // Twitter authority acts as owner of the parent for all user-facing registries
        ),
    ];
    instructions = instructions.concat(await createReverseTwitterRegistry(connection, twitterHandle, twitterHandleRegistryKey, verifiedPubkey, payerKey));
    return instructions;
}
exports.createVerifiedTwitterRegistry = createVerifiedTwitterRegistry;
// Overwrite the data that is written in the user facing registry
// Signed by the verified pubkey
async function changeTwitterRegistryData(twitterHandle, verifiedPubkey, offset, // The offset at which to write the input data into the NameRegistryData
input_data) {
    const hashedTwitterHandle = await utils_1.getHashedName(twitterHandle);
    const twitterHandleRegistryKey = await utils_1.getNameAccountKey(hashedTwitterHandle, undefined, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    const instructions = [
        instructions_1.updateInstruction(bindings_1.NAME_PROGRAM_ID, twitterHandleRegistryKey, new utils_1.Numberu32(offset), input_data, verifiedPubkey),
    ];
    return instructions;
}
exports.changeTwitterRegistryData = changeTwitterRegistryData;
// Change the verified pubkey for a given twitter handle
// Signed by the Authority, the verified pubkey and the payer
async function changeVerifiedPubkey(connection, twitterHandle, currentVerifiedPubkey, newVerifiedPubkey, payerKey) {
    const hashedTwitterHandle = await utils_1.getHashedName(twitterHandle);
    const twitterHandleRegistryKey = await utils_1.getNameAccountKey(hashedTwitterHandle, undefined, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    // Transfer the user-facing registry ownership
    let instructions = [
        instructions_1.transferInstruction(bindings_1.NAME_PROGRAM_ID, twitterHandleRegistryKey, newVerifiedPubkey, currentVerifiedPubkey, undefined),
    ];
    // Delete the current reverse registry
    const currentHashedVerifiedPubkey = await utils_1.getHashedName(currentVerifiedPubkey.toString());
    const currentReverseRegistryKey = await utils_1.getNameAccountKey(currentHashedVerifiedPubkey, exports.TWITTER_VERIFICATION_AUTHORITY, undefined);
    instructions.push(await bindings_1.deleteNameRegistry(connection, currentVerifiedPubkey.toString(), payerKey, exports.TWITTER_VERIFICATION_AUTHORITY, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY));
    // Create the new reverse registry
    instructions = instructions.concat(await createReverseTwitterRegistry(connection, twitterHandle, twitterHandleRegistryKey, newVerifiedPubkey, payerKey));
    return instructions;
}
exports.changeVerifiedPubkey = changeVerifiedPubkey;
// Delete the verified registry for a given twitter handle
// Signed by the verified pubkey
async function deleteTwitterRegistry(twitterHandle, verifiedPubkey) {
    const hashedTwitterHandle = await utils_1.getHashedName(twitterHandle);
    const twitterHandleRegistryKey = await utils_1.getNameAccountKey(hashedTwitterHandle, undefined, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    const hashedVerifiedPubkey = await utils_1.getHashedName(verifiedPubkey.toString());
    const reverseRegistryKey = await utils_1.getNameAccountKey(hashedVerifiedPubkey, exports.TWITTER_VERIFICATION_AUTHORITY, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    const instructions = [
        // Delete the user facing registry
        instructions_1.deleteInstruction(bindings_1.NAME_PROGRAM_ID, twitterHandleRegistryKey, verifiedPubkey, verifiedPubkey),
        // Delete the reverse registry
        instructions_1.deleteInstruction(bindings_1.NAME_PROGRAM_ID, reverseRegistryKey, verifiedPubkey, verifiedPubkey),
    ];
    return instructions;
}
exports.deleteTwitterRegistry = deleteTwitterRegistry;
//////////////////////////////////////////
// Getter Functions
// Returns the key of the user-facing registry
async function getTwitterRegistryKey(twitter_handle) {
    const hashedTwitterHandle = await utils_1.getHashedName(twitter_handle);
    return await utils_1.getNameAccountKey(hashedTwitterHandle, undefined, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
}
exports.getTwitterRegistryKey = getTwitterRegistryKey;
async function getTwitterRegistry(connection, twitter_handle) {
    const hashedTwitterHandle = await utils_1.getHashedName(twitter_handle);
    const twitterHandleRegistryKey = await utils_1.getNameAccountKey(hashedTwitterHandle, undefined, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    const registry = state_1.NameRegistryState.retrieve(connection, twitterHandleRegistryKey);
    return registry;
}
exports.getTwitterRegistry = getTwitterRegistry;
async function getHandleAndRegistryKey(connection, verifiedPubkey) {
    const hashedVerifiedPubkey = await utils_1.getHashedName(verifiedPubkey.toString());
    const reverseRegistryKey = await utils_1.getNameAccountKey(hashedVerifiedPubkey, exports.TWITTER_VERIFICATION_AUTHORITY, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    let reverseRegistryState = await ReverseTwitterRegistryState.retrieve(connection, reverseRegistryKey);
    return [
        reverseRegistryState.twitterHandle,
        new web3_js_1.PublicKey(reverseRegistryState.twitterRegistryKey),
    ];
}
exports.getHandleAndRegistryKey = getHandleAndRegistryKey;
// Uses the RPC node filtering feature, execution speed may vary
async function getTwitterHandleandRegistryKeyViaFilters(connection, verifiedPubkey) {
    const filters = [
        {
            memcmp: {
                offset: 0,
                bytes: exports.TWITTER_ROOT_PARENT_REGISTRY_KEY.toBase58(),
            },
        },
        {
            memcmp: {
                offset: 32,
                bytes: verifiedPubkey.toBase58(),
            },
        },
        {
            memcmp: {
                offset: 64,
                bytes: exports.TWITTER_VERIFICATION_AUTHORITY.toBase58(),
            },
        },
    ];
    const filteredAccounts = await utils_1.getFilteredProgramAccounts(connection, bindings_1.NAME_PROGRAM_ID, filters);
    for (const f of filteredAccounts) {
        if (f.accountInfo.data.length > state_1.NameRegistryState.HEADER_LEN + 32) {
            let data = f.accountInfo.data.slice(state_1.NameRegistryState.HEADER_LEN);
            let state = borsh_1.deserialize(ReverseTwitterRegistryState.schema, ReverseTwitterRegistryState, data);
            return [state.twitterHandle, new web3_js_1.PublicKey(state.twitterRegistryKey)];
        }
    }
    throw new Error('Registry not found.');
}
exports.getTwitterHandleandRegistryKeyViaFilters = getTwitterHandleandRegistryKeyViaFilters;
// Uses the RPC node filtering feature, execution speed may vary
// Does not give you the handle, but is an alternative to getHandlesAndKeysFromVerifiedPubkey + getTwitterRegistry to get the data
async function getTwitterRegistryData(connection, verifiedPubkey) {
    const filters = [
        {
            memcmp: {
                offset: 0,
                bytes: exports.TWITTER_ROOT_PARENT_REGISTRY_KEY.toBytes(),
            },
        },
        {
            memcmp: {
                offset: 32,
                bytes: verifiedPubkey.toBytes(),
            },
        },
        {
            memcmp: {
                offset: 64,
                bytes: new web3_js_1.PublicKey(Buffer.alloc(32, 0)).toBase58(),
            },
        },
    ];
    const filteredAccounts = await utils_1.getFilteredProgramAccounts(connection, bindings_1.NAME_PROGRAM_ID, filters);
    if (filteredAccounts.length > 1) {
        throw new Error('Found more than one registry.');
    }
    return filteredAccounts[0].accountInfo.data.slice(state_1.NameRegistryState.HEADER_LEN);
}
exports.getTwitterRegistryData = getTwitterRegistryData;
//////////////////////////////////////////////
// Utils
class ReverseTwitterRegistryState {
    constructor(obj) {
        this.twitterRegistryKey = obj.twitterRegistryKey;
        this.twitterHandle = obj.twitterHandle;
    }
    static async retrieve(connection, reverseTwitterAccountKey) {
        let reverseTwitterAccount = await connection.getAccountInfo(reverseTwitterAccountKey, 'processed');
        if (!reverseTwitterAccount) {
            throw new Error('Invalid reverse Twitter account provided');
        }
        let res = borsh_1.deserializeUnchecked(this.schema, ReverseTwitterRegistryState, reverseTwitterAccount.data.slice(state_1.NameRegistryState.HEADER_LEN));
        return res;
    }
}
exports.ReverseTwitterRegistryState = ReverseTwitterRegistryState;
ReverseTwitterRegistryState.schema = new Map([
    [
        ReverseTwitterRegistryState,
        {
            kind: 'struct',
            fields: [
                ['twitterRegistryKey', [32]],
                ['twitterHandle', 'string'],
            ],
        },
    ],
]);
async function createReverseTwitterRegistry(connection, twitterHandle, twitterRegistryKey, verifiedPubkey, payerKey) {
    // Create the reverse lookup registry
    const hashedVerifiedPubkey = await utils_1.getHashedName(verifiedPubkey.toString());
    const reverseRegistryKey = await utils_1.getNameAccountKey(hashedVerifiedPubkey, exports.TWITTER_VERIFICATION_AUTHORITY, exports.TWITTER_ROOT_PARENT_REGISTRY_KEY);
    let reverseTwitterRegistryStateBuff = borsh_1.serialize(ReverseTwitterRegistryState.schema, new ReverseTwitterRegistryState({
        twitterRegistryKey: twitterRegistryKey.toBytes(),
        twitterHandle,
    }));
    return [
        instructions_1.createInstruction(bindings_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, reverseRegistryKey, verifiedPubkey, payerKey, hashedVerifiedPubkey, new utils_1.Numberu64(await connection.getMinimumBalanceForRentExemption(reverseTwitterRegistryStateBuff.length)), new utils_1.Numberu32(reverseTwitterRegistryStateBuff.length), exports.TWITTER_VERIFICATION_AUTHORITY, // Twitter authority acts as class for all reverse-lookup registries
        exports.TWITTER_ROOT_PARENT_REGISTRY_KEY, // Reverse registries are also children of the root
        exports.TWITTER_VERIFICATION_AUTHORITY),
        instructions_1.updateInstruction(bindings_1.NAME_PROGRAM_ID, reverseRegistryKey, new utils_1.Numberu32(0), Buffer.from(reverseTwitterRegistryStateBuff), exports.TWITTER_VERIFICATION_AUTHORITY),
    ];
}
exports.createReverseTwitterRegistry = createReverseTwitterRegistry;
//# sourceMappingURL=twitter.js.map