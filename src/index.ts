import app from "./app";

const PORT = process.env.PORT || 5000;

async function main() {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
  });
}

main();
