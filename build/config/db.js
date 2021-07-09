"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
let DatabaseService = 
// Implements singleton pattern
class DatabaseService {
    constructor() {
        this._db = new client_1.PrismaClient();
        this._db = new client_1.PrismaClient();
    }
    Client() {
        return this._db;
    }
    async disconnect() {
        await this._db.$disconnect();
    }
};
DatabaseService = __decorate([
    inversify_1.injectable()
    // Implements singleton pattern
], DatabaseService);
exports.DatabaseService = DatabaseService;
