const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  mode: 'development', // ou 'production' en fonction de votre besoin
  entry: './index.js', // Remplacez par le chemin vers votre fichier principal
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled files
  },
  plugins: [
    new Dotenv() // Chargement des variables d'environnement
  ]
};
