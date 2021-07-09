import * as express from 'express';
import BaseController from './BaseController';

export default class TestController extends BaseController {
    testMethod(req: express.Request, res: express.Response) {
        this.sendJSONResponse(
            res,
            null,
            {
                length: 1,
            },
            {
                name: 'Test',
            },
        );
    }
}
