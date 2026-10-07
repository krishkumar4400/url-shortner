async function healthCheck(req, res) {
  try {
    return res.status(200).json({
      message: "Server is up and runnng",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Health check failed",
      success: false,
      error,
    });
  }
}

export default healthCheck;
