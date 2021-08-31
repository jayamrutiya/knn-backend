import express from 'express';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IDiscussionService } from '../interfaces/IDiscussionService';
import DiscussionController from '../controllers/DiscussionController';
import { uploadBookTitleImage } from '../config/multer';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const discussionService = Container.get<IDiscussionService>(
  TYPES.DiscussionService,
);
const discussionController = new DiscussionController(
  loggerService,
  discussionService,
);

router.post('/', uploadBookTitleImage.single('titleImage'), (req, res) =>
  discussionController.createDiscussion(req, res),
);

router.put('/:id', uploadBookTitleImage.single('titleImage'), (req, res) =>
  discussionController.updateDiscussion(req, res),
);

router.get('/:id', (req, res) => discussionController.getDiscussion(req, res));

router.get('/', (req, res) => discussionController.getAllDiscussion(req, res));

export default router;
