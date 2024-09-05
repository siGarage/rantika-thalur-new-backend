("use strict");
/**
 * order controller
 */
const Razorpay = require("razorpay");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    try {
      const razorpay = new Razorpay({
        key_id: "rzp_live_91L6FV1TyEcyhT",
        key_secret: "stU7JaLwu93swhqLGdC8bXx8",
      });
        const options = ctx.request.body;
        const order = await razorpay.orders.create(options);
        if (!order) {
          return ctx.send("Error");
        }
        ctx.send(order);
    } catch (error) {
      return ctx.send({ error });
    }
  },
}));
