import multer from "multer";



// Configure multer storage 
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/'); // Specify the destination directory for uploaded files
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for each uploaded file
    }
});

// File filter
const fileFilter = (_req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
}

const upload = multer({ storage, fileFilter });

export default upload;