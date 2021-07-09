"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBookTitleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const BadRequest_1 = require("../errors/BadRequest");
const fileFilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/jpeg') {
        return cb(null, true);
    }
    return cb(new BadRequest_1.BadRequest('File type not valid'), false);
};
exports.uploadBookTitleImage = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/public/images/');
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.png');
        },
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: 1048576 * 5,
    },
});
