import express from 'express';

import TestController from '../controllers/TestController';

const router = express.Router();
const testController = new TestController();

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get('/', (req, res) => testController.testMethod(req, res));

export default router;
