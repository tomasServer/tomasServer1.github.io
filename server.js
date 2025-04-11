const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     // Replace with your MySQL username
    password: '',     // Replace with your MySQL password
    database: 'nova'  // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { numero, contrasena, nombre, ubicacion } = req.body;
        
        // Validate input
        if (!numero || !contrasena || !nombre) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos los campos son requeridos' 
            });
        }
        
        // Check if user already exists
        db.query('SELECT * FROM clientes WHERE numero = ?', [numero], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error en el servidor' 
                });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Este número ya está registrado' 
                });
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);
            
            // Insert new user
            const newUser = {
                numero,
                contrasena: hashedPassword,
                nombre,
                ubicacion
            };
            
            db.query('INSERT INTO clientes SET ?', newUser, (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Error al registrar usuario' 
                    });
                }
                
                console.log('User registered:', result.insertId);
                res.status(201).json({ 
                    success: true, 
                    message: 'Usuario registrado correctamente',
                    userId: result.insertId
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error en el servidor' 
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { numero, contrasena } = req.body;
        
        // Validate input
        if (!numero || !contrasena) {
            return res.status(400).json({ 
                success: false, 
                error: 'Usuario y contraseña son requeridos' 
            });
        }
        
        // Check if user exists
        db.query('SELECT * FROM clientes WHERE numero = ?', [numero], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error en el servidor' 
                });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Usuario no encontrado' 
                });
            }
            
            const user = results[0];
            
            // Compare password
            const isMatch = await bcrypt.compare(contrasena, user.contrasena);
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Contraseña incorrecta' 
                });
            }
            
            // Return user data (excluding password)
            const userData = {
                id: user.id,
                numero: user.numero,
                nombre: user.nombre,
                ubicacion: user.ubicacion,
                isAdmin: user.isAdmin === 1
            };
            
            res.json({ 
                success: true, 
                user: userData 
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error en el servidor' 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});