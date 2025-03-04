// dao/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, sparse: true }, // Adiciona um campo para GitHub ID
  name: { type: String, required: true },
  email: { type: String, required: false }, // Tornar o email opcional
  password: { type: String, required: false } //  Tornar a senha opcional
});

// Método para criptografar a senha antes de salvar
userSchema.pre('save', async function(next) {
  try {
    const saltRounds = 10; // Número de rounds de hash
    this.password = await bcrypt.hash(this.password, saltRounds); 
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar a senha fornecida com a senha criptografada
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;