"use strict";
const crypto = require("crypto");

/**
 * payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async create(ctx) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        ids,
        email,
        address,
        amount,
      } = ctx.request.body;
      const sha = crypto.createHmac("sha256", "stU7JaLwu93swhqLGdC8bXx8");
      //order_id + "|" + razorpay_payment_id
      sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = sha.digest("hex");
      if (digest !== razorpay_signature) {
        return ctx.send({ msg: "Transaction is not legit!" });
      }
      let cartItems = [];
      for (const id of ids) {
        // Make API request for each ID
        const entry = await strapi.db.query("api::cart.cart").findOne({
          where: { id: id },
        });
        cartItems.push(entry);
      }
      const createdentry = await strapi.db
        .query("api::order-confirmation.order-confirmation")
        .create({
          data: {
            Order_Details: JSON.stringify(cartItems),
            Order_status: "Confirmed",
            Order_By: email,
            Order_Address: address,
            Order_Amount: amount,
            Payment_id: razorpay_payment_id,
          },
        });
      ctx.send({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } catch (error) {
      return ctx.send({ error });
    }
  },
}));
