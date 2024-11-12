import dotenv from "dotenv";
dotenv.config();

try {
  dotenv.config();
} catch (error) {
  console.error("Error loading environment variables:", error);
  process.exit(1);
}

export const MONGO_URL = `mongodb+srv://nikolicmiloje0507:byrW1cYDK807qd13@cluster0.z8spqcz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/sendBtc`;
export const PORT = process.env.PORT || 9000
export const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";