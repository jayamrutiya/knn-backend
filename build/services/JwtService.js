"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const inversify_1 = require("inversify");
const json_bigint_1 = __importDefault(require("json-bigint"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let JwtService = class JwtService {
    generateToken(data, secret, expiresIn) {
        const { id, ...withoutId } = data;
        return jsonwebtoken_1.default.sign({
            id: json_bigint_1.default.stringify(id),
            ...withoutId,
        }, secret, {
            expiresIn,
        });
    }
    verifyToken(token, secret) {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        payload.id = BigInt(payload.id);
        return payload;
    }
};
JwtService = __decorate([
    inversify_1.injectable()
], JwtService);
exports.JwtService = JwtService;
