const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        minlength: 2 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8 
    },
    role: { 
        type: String, 
        enum: ['client', 'admin'], 
        default: 'client' 
    }
}, { timestamps: true });

// Middleware Mongoose pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10); 
});

module.exports = mongoose.model('User', userSchema);