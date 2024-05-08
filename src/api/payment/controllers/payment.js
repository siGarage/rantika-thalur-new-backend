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
        phone,
        name,
        pin,
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
            Order_Phone: phone,
            Order_Pin: pin,
            Order_Name: name,
            Payment_id: razorpay_payment_id,
          },
        });
      await strapi.plugins["email"].services.email.send({
        to: email,
        cc: "contactrantikathakurclothing@gmail.com",
        replyTo: "valid email address",
        subject: "You got a new message from RantikaThakurClothing:",
        text: `<p>Dear Customer,</p>
        <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
         Thank you for shopping at the Rantika Thakur Clothing! Your order has confirmed.
        Price :${amount}
        </p>
        <p>
          Best wishes,<br>RantikaThakurClothing Team<br>
          Keep Shoping...! 
        </p>`,
        html: `<p>Dear Customer,</p>
        <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
         Thank you for shopping at the Rantika Thakur Clothing! Your order has confirmed.
        Price :${amount}
        </p>
        <p>
          Best wishes,<br>RantikaThakurClothing Team<br>
          Keep Shoping...! 
        </p>`,
      }),
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
