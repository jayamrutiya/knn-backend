"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const BookController_1 = __importDefault(require("../controllers/BookController"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const bookService = container_1.iocContainer.get(types_1.TYPES.BookService);
const bookController = new BookController_1.default(loggerService, bookService);
router.post('/', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => bookController.createBook(req, res));
router.put('/:id', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => bookController.editBook(req, res));
router.delete('/:id', (req, res) => bookController.deleteBook(req, res));
router.put('/:id/status', (req, res) => bookController.bookStatus(req, res));
exports.default = router;
