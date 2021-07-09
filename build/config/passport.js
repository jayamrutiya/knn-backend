"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const env_1 = __importDefault(require("./env"));
const container_1 = require("./container");
const types_1 = require("./types");
const Forbidden_1 = require("../errors/Forbidden");
const databaseService = container_1.iocContainer.get(types_1.TYPES.DatabaseService);
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env_1.default.ACCESS_TOKEN_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(options, async (payload, done) => {
    // Get database client
    const client = databaseService.Client();
    // Gets the user
    const user = await client.user.findFirst({
        where: {
            id: BigInt(payload.id),
        },
    });
    // If the user is not present
    if (!user) {
        throw new Forbidden_1.Forbidden('Invalid user token.');
    }
    return done(null, user);
}));
exports.default = passport_1.default;
