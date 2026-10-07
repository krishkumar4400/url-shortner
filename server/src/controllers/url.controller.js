import urlModel from "../models/url.model.js";
import generateCode from "../utils/generateCode.js";

const shortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
        success: false,
      });
    }

    const shortCode = generateCode();

    const url = await urlModel.create({
      originalUrl,
      shortCode,
    });

    const shortedUrl = `http://localhost:3000/${shortCode}`;

    return res.status(201).json({
      message: "URL has been shorten successfully",
      success: true,
      url: url,
      shortedUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to short the URL",
      success: false,
    });
  }
};

const getAllUrl = async (req, res) => {
  try {
    const urls = await urlModel.find();
    return res.status(200).json({
      message: "URL has been fetched successfully",
      success: true,
      urls,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to short the URL",
      success: false,
    });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await urlModel.findOneAndUpdate(
      { shortCode },
      {
        $inc: {
          clicks: 1,
        },
      },
      {
        returnDocument: "after",
      },
    );
    console.log(url);
    return res.status(301).redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to short the URL",
      success: false,
    });
  }
};

export { shortUrl, getAllUrl, redirectUrl };
