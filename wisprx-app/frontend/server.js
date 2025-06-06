const express = require("express");
const path = require("path");
const app = express();

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
	app.use(express.static(path.join(__dirname, "build")));

	app.get("/*", function (req, res) {
		res.sendFile(path.join(__dirname, "build", "index.html"));
	});
} else {
	app.get("*", (req, res) => {
		res.send("⚠️ Frontend em modo desenvolvimento. Use 'npm start' em /frontend.");
	});
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Frontend server rodando em: http://localhost:${PORT}`);
});
