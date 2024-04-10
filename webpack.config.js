const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./js/load-images.js",
    other: "./js/lightbox.js",
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: "[name].bundle.js", // Utilisez [name] pour générer des noms de fichiers dynamiques
    path: path.resolve(__dirname, "dist"),
  },
};
