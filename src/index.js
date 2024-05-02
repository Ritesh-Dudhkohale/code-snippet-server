import connectDB from "./database/connection.js";
import app from "./app.js";

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
  });
});
