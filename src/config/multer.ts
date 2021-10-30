import * as express from 'express';
import multer from 'multer';
import { BadRequest } from '../errors/BadRequest';

const fileFilter = (req: any, file: any, cb: any) => {
  console.log(file);
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/jpeg'
  ) {
    return cb(null, true);
  }
  return cb(new BadRequest('File type not valid'), false);
};

export const uploadBookTitleImage = multer({
  storage: multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, './src/public/images/');
    },
    filename: function (req: any, file: any, cb: any) {
      cb(null, file.fieldname + Date.now() + '.png');
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 1048576 * 5,
  },
});

export const uploadProfilePicture = multer({
  storage: multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, './src/public/images/Profile/');
    },
    filename: function (req: any, file: any, cb: any) {
      cb(null, file.fieldname + Date.now() + '.png');
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 1048576 * 5,
  },
});
