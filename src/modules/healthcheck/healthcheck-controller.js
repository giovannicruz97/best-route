export const getHealthcheck = async (_, res) =>
  res.json({ status: true, message: "It's alright!" });
