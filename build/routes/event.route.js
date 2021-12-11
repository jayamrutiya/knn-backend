"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const EventController_1 = __importDefault(require("../controllers/EventController"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const eventService = container_1.iocContainer.get(types_1.TYPES.EventService);
const eventController = new EventController_1.default(loggerService, eventService);
router.post('/', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => eventController.createEvent(req, res));
router.put('/:id', multer_1.uploadBookTitleImage.single('titleImage'), (req, res) => eventController.updateEvent(req, res));
router.get('/:id', (req, res) => eventController.getEvent(req, res));
router.get('/', (req, res) => eventController.getAllEvent(req, res));
router.post('/registration', (req, res) => eventController.eventRegistration(req, res));
router.post('/verify/payment', (req, res) => eventController.veifyUserEventPayment(req, res));
router.post('/benefits', (req, res) => eventController.cretateNewEventBenefits(req, res));
router.post('/speaker', multer_1.uploadBookTitleImage.single('profilePicture'), (req, res) => eventController.cretateNewEventSpeakers(req, res));
router.post('/requirements', (req, res) => eventController.createNewEventReq(req, res));
router.post('/learning', (req, res) => eventController.createNewEventLearning(req, res));
router.delete('/blsr/:id', (req, res) => eventController.deleteBLRS(req, res));
router.delete('/:eventId', (req, res) => eventController.deleteEvent(req, res));
router.put('/status/:eventId', (req, res) => eventController.eventStatusChanged(req, res));
exports.default = router;
