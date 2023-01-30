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

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
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
