const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.workspaceRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

export default requireRole;
