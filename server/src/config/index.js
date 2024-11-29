import dotenv from "dotenv";
dotenv.configDotenv();

export const config = {
    DATABASE : process.env.MONGO_URI,
    PORT : process.env.PORT
};

