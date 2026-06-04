import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("youtube_clone");

    // সব কালেকশনের নাম দেখাও
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // "user" (singular) কালেকশনে কিছু আছে কিনা
    const userSingularCount = await db.collection("user").countDocuments();
    const usersSingularDocs = await db.collection("user").find().limit(5).toArray();

    // "users" (plural) কালেকশনে কিছু আছে কিনা
    const usersPluralCount = await db.collection("users").countDocuments();
    const usersPluralDocs = await db.collection("users").find().limit(5).toArray();

    return Response.json({
      allCollections: collectionNames,

      userSingular: {
        collection: "user",
        count: userSingularCount,
        docs: usersSingularDocs.map((d) => ({ _id: d._id, email: d.email, name: d.name, channelName: d.channelName, following: d.following, subscribers: d.subscribers })),
      },

      usersPlural: {
        collection: "users",
        count: usersPluralCount,
        docs: usersPluralDocs.map((d) => ({ _id: d._id, email: d.email, name: d.name, channelName: d.channelName, following: d.following, subscribers: d.subscribers })),
      },
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
