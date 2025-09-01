import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 7,
  message: {
    success: false,
    message: "Too many checkout requests, please try again later",
  },
  keyGenerator: (req) => ipKeyGenerator(req), 
});
