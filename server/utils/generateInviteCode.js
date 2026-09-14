import crypto from "crypto";

const generateInviteCode = () => {
  return crypto.randomBytes(48).toString("hex");
};

export default generateInviteCode;
