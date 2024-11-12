import mongoose from "mongoose";

const NftSchema = new mongoose.Schema({
    nftName: { type: String },
    price: { type: String },
    imgUri: { type: String, unique: true },
});

const NftModel = mongoose.model("Nft", NftSchema);

export default NftModel;
