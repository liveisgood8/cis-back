import multer = require('multer');
import { extname, basename, join } from 'path';
import config from '../config';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(config.staticPath, 'uploads'));
  },
  filename: (req, file, cb) => {
    const fileExtension = extname(file.originalname);
    const fileName = basename(file.originalname, fileExtension);
    cb(null, `${file.fieldname}_${fileName}_${Date.now()}${fileExtension}`);
  },
});

const multerUpload = multer({
  storage: storage,
});

export default multerUpload;
