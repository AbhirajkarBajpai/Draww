const challengeData = require("../modal/challengeData");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const awsConfig = {
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};

const s3 = new S3Client(awsConfig);

const getFileUrl = async (fileName) => {
  const bucketName = "drawwbucket";
  if (!bucketName || !fileName) {
    return res
      .status(400)
      .json({ message: "Missing bucketName or fileName parameter." });
  }
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
  }
};

exports.getUploadFilesURL = async (req, res) => {
  const { fileType, fileName } = req.query;

  if (!fileType || !fileName) {
    return res
      .status(400)
      .json({ message: "Missing fileType or fileName parameter." });
  }

  // Determine the folder based on file type
  const folder = fileType.startsWith("image") ? "images" : "videos";
  const bucketName = "drawwbucket";
  const key = `${folder}/${fileName}`;

  try {
    // Command for the PUT request
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    // Generate a signed URL valid for 60 seconds
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.json({ signedUrl, key });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res
      .status(500)
      .json({ message: "Error generating signed URL.", error: error.message });
  }
};


exports.uploadData = async (req, res) => {
  const { type, img, vdo, topic } = req.body;

  if (!img || !vdo || !topic) {
    return res
      .status(400)
      .json({ message: "Missing img, vdo, or topic in the request body" });
  }

  const id = uuidv4();

  try {
    const newData = new challengeData({
      id,
      type,
      img,
      vdo,
      topic,
    });

    await newData.save();
    console.log(`Data saved: ${JSON.stringify(newData)}`);

    res.status(201).json({ id, message: "Data stored successfully" });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ message: "Error saving data to database" });
  }
};
exports.getdata = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await challengeData.findOne({ id });

    if (data) {
      const imgLoc = data.img;
      const vdoLoc = data.vdo;
      const imgUrl = await getFileUrl(`images/${imgLoc}`);
      const vdoUrl = await getFileUrl(`videos/${vdoLoc}`);

      res.json({
        id: data.id,
        topic: data.topic,
        image: imgUrl,
        video: vdoUrl,
      });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ message: "Error retrieving data from database" });
  }
};
