module.exports = mongoose => {
    const Product = mongoose.model(
        "product",
        mongoose.Schema(
            {
                name: String,
                image: String,
                description: String,
                qty: Number,
                price: Number
            },
            { timestamps: true }
        )
    );

    return Product;
};