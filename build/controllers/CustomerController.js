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
const BaseController_1 = __importDefault(require("./BaseController"));
const inversify_1 = require("inversify");
const BadRequest_1 = require("../errors/BadRequest");
let CustomerController = class CustomerController extends BaseController_1.default {
    constructor(loggerService, customerService) {
        super();
        this._loggerService = loggerService;
        this._customerService = customerService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async createCustomer(req, res) {
        try {
            // ToDo: validate input
            // ToDo: add profile photo
            // Get Parameters
            //   const {
            //     contactPersonName,
            //     companyName,
            //     gstinNo,
            //     address,
            //     pincode,
            //     area,
            //     city,
            //     state,
            //     mobileNo,
            //     password,
            //     businessCardPhototUri,
            //     typeOfBusiness,
            //   } = req.body;
            //   // Get the database client
            //   const client = this._databaseService.Client();
            //   const customer = await client.customer.create({
            //     data: {
            //       contactPersonName,
            //       companyName,
            //       gstinNo,
            //       address,
            //       pincode,
            //       area,
            //       city,
            //       state,
            //       mobileNo,
            //       password,
            //       businessCardPhototUri,
            //       typeOfBusiness,
            //     },
            //   });
        }
        catch (error) {
            if (error instanceof BadRequest_1.BadRequest) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }
};
CustomerController = __decorate([
    inversify_1.injectable()
], CustomerController);
exports.default = CustomerController;
