"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const DiscussionController_1 = __importDefault(require("../controllers/DiscussionController"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const discussionService = container_1.iocContainer.get(types_1.TYPES.DiscussionService);
const discussionController = new DiscussionController_1.default(loggerService, discussionService);
router.post('/', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => discussionController.createDiscussion(req, res));
router.put('/:id', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => discussionController.updateDiscussion(req, res));
router.get('/:id', (req, res) => discussionController.getDiscussion(req, res));
router.get('/', (req, res) => discussionController.getAllDiscussion(req, res));
router.post('/answer', (req, res) => discussionController.createAnswer(req, res));
exports.default = router;
