const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the build directory
app.use(express.static("./"));
// Catch-all handler to send the React app's index.html file for any route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
<<<<<<< HEAD

// Define the port to run the server on
const PORT = process.env.PORT || 80;

=======
const PORT = process.env.PORT || 3000;
>>>>>>> 520ac0370fdd37d1f02a9c9260678b28b27cd9cd
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});