// Example payment service
// ❌ Replaceable: frontend se received fields (amount, method)
const createPayment = async ({ userId, amount, method }) => {
  // Payment logic
  // E.g., save in DB, call external payment gateway
  const payment = {
    user: userId,
    amount,
    method,
    status: "pending" // ❌ Replaceable if initial status different
  };
  // Save to DB logic here...
  return payment;
};

module.exports = { createPayment };
