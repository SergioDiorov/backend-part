import { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueName = uuidv4();
    cb(null, file.fieldname + '-' + uniqueName + '.jpg');
  },
});

const imageExtentions = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (imageExtentions.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const fileMiddleware = multer({ storage, fileFilter });