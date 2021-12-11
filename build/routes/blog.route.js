"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const BlogController_1 = __importDefault(require("../controllers/BlogController"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const blogService = container_1.iocContainer.get(types_1.TYPES.BlogService);
const blogController = new BlogController_1.default(loggerService, blogService);
router.get('/writer', (req, res) => blogController.getBlogWriter(req, res));
router.post('/', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => blogController.createBlog(req, res));
router.put('/:id', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => blogController.updateBlog(req, res));
router.get('/:id', (req, res) => blogController.getBlog(req, res));
router.get('/', (req, res) => blogController.getAllBlog(req, res));
router.post('/writer', multer_1.uploadBookTitleImage.single('profilePicture'), (req, res) => blogController.createBlogWriter(req, res));
router.delete('/:blogId', (req, res) => blogController.deleteBlog(req, res));
router.delete('/writer/:bwId', (req, res) => blogController.deleteBlogwriter(req, res));
exports.default = router;
