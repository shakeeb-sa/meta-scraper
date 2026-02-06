const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // We can add "credits" later if you want to make it a paid SaaS
    plan: { type: String, default: 'free' } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);