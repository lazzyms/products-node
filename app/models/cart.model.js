module.exports = mongoose => {
    const Cart = mongoose.model(
        "cart",
        mongoose.Schema(
            {
                product: Object,
                cartTotal: Number
            },
            { timestamps: true }
        )
    );

    return Cart;
};