const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());
// Mongodb Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7mdpwuk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("New Network Resale Server Running!");
});

async function run() {
  try {
    const productCategoriesCollection = client
      .db("new-network-resale")
      .collection("productCategories");
    const brandProductsCollection = client
      .db("new-network-resale")
      .collection("brandProducts");
    const bookingsCollection = client
      .db("new-network-resale")
      .collection("bookings");
    const productsCollection = client
      .db("new-network-resale")
      .collection("products");
    const usersCollection = client.db("new-network-resale").collection("users");

    app.get("/product-categories", async (req, res) => {
      const result = await productCategoriesCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const allProducts = await brandProductsCollection.find({}).toArray();
      const category = allProducts.filter((pd) => pd.brand_category_id === id);
      res.send(category);
    });
    // Booking Store
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // Get All Admin
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.type === "Seller" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Seller Products Store
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    console.log("DB Connect!");
  } finally {
  }
}
run().catch((error) => console.log(error));

app.listen(port, () => {
  console.log(`New Network Resale listening on port http://localhost:${port}`);
});
