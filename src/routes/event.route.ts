import express from 'express';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IEventService } from '../interfaces/IEventService';
import EventController from '../controllers/EventController';
import { uploadBookTitleImage } from '../config/multer';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const eventService = Container.get<IEventService>(TYPES.EventService);
const eventController = new EventController(loggerService, eventService);

router.post('/', uploadBookTitleImage.single('titleImage'), (req, res) =>
  eventController.createEvent(req, res),
);

router.put('/:id', uploadBookTitleImage.single('titleImage'), (req, res) =>
  eventController.updateEvent(req, res),
);

router.get('/:id', (req, res) => eventController.getEvent(req, res));

router.get('/', (req, res) => eventController.getAllEvent(req, res));

export default router;
