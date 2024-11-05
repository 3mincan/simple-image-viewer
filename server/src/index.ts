import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const findAllFilesinFolder = async () => {
  const getImageDimensions = (path: string) => {
    const dimensions = require("image-size");
    const dimensionsOfImage = dimensions(path);
    return dimensionsOfImage;
  };
  const getAllFiles = () => {
    const files = fs.readdirSync("uploads");

    const filteredFiles = files.filter((file) => {
      return file.endsWith(".jpg") || file.endsWith(".png");
    });

    const response = filteredFiles.map((file) => {
      const { width, height } = getImageDimensions(path.join("uploads", file));

      return {
        name: file,
        url: path.join("uploads", file),
        width: width,
        height: height,
      };
    });
    return response;
  };
  return getAllFiles();
};

app.use("/uploads", express.static("uploads"));

app.get("/api/files", async (req: Request, res: Response) => {
  const files = await findAllFilesinFolder();

  res.status(200).send(files);
});

app.post(
  "/api/upload",
  upload.single("file"),
  (req: Request, res: Response) => {
    if (req.file) {
      res.status(200).send({
        message: "File uploaded successfully",
      });
    } else {
      res.status(400).send({ message: "File not uploaded" });
    }
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`);
});
