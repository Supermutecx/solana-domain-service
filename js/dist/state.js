"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameRegistryState = void 0;
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
class NameRegistryState {
    constructor(obj) {
        this.parentName = new web3_js_1.PublicKey(obj.parentName);
        this.owner = new web3_js_1.PublicKey(obj.owner);
        this.class = new web3_js_1.PublicKey(obj.class);
    }
    static async retrieve(connection, nameAccountKey) {
        var _a;
        let nameAccount = await connection.getAccountInfo(nameAccountKey, 'processed');
        if (!nameAccount) {
            throw new Error('Invalid name account provided');
        }
        let res = borsh_1.deserializeUnchecked(this.schema, NameRegistryState, nameAccount.data);
        res.data = (_a = nameAccount.data) === null || _a === void 0 ? void 0 : _a.slice(this.HEADER_LEN);
        return res;
    }
}
exports.NameRegistryState = NameRegistryState;
NameRegistryState.HEADER_LEN = 96;
NameRegistryState.schema = new Map([
    [
        NameRegistryState,
        {
            kind: 'struct',
            fields: [
                ['parentName', [32]],
                ['owner', [32]],
                ['class', [32]],
            ],
        },
    ],
]);
//# sourceMappingURL=state.js.map