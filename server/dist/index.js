"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});
const findAllFilesinFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    const getImageDimensions = (path) => {
        const dimensions = require("image-size");
        const dimensionsOfImage = dimensions(path);
        return dimensionsOfImage;
    };
    const getAllFiles = () => {
        const files = fs_1.default.readdirSync("uploads");
        const filteredFiles = files.filter((file) => {
            return file.endsWith(".jpg") || file.endsWith(".png");
        });
        const response = filteredFiles.map((file) => {
            const { width, height } = getImageDimensions(path_1.default.join("uploads", file));
            return {
                name: file,
                url: path_1.default.join("uploads", file),
                width: width,
                height: height,
            };
        });
        return response;
    };
    return getAllFiles();
});
app.use("/uploads", express_1.default.static("uploads"));
app.get("/api/files", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield findAllFilesinFolder();
    res.status(200).send(files);
}));
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (req.file) {
        res.status(200).send({
            message: "File uploaded successfully",
        });
    }
    else {
        res.status(400).send({ message: "File not uploaded" });
    }
});
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}`);
});
