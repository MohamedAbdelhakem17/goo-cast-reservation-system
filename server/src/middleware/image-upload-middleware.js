const multer = require('multer');

const multerOptions = () => {
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('This is not an image'), false);
        }
    };

    return multer({ storage, fileFilter });
};

const uploadSingleImage = (imageKey) => multerOptions().single(imageKey);

const uploadMultipleImages = (fields) => multerOptions().fields(fields);

module.exports = {
    uploadSingleImage,
    uploadMultipleImages,
};
