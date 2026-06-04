import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('youtube_clone');

export const auth = betterAuth({
  database: mongodbAdapter(db),
  user: {
    modelName: "users", // ব্যাকএন্ড Express সার্ভারের সাথে একই "users" কালেকশন ব্যবহার করার জন্য
  },
  emailAndPassword: { 
    enabled: true, 
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    }, 
  plugins: [jwt()],
});
