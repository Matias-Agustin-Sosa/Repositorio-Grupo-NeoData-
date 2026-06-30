const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

const leerTokenOpcional = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (token) {
        try {
            const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal');
            req.usuario = verificado;
        } catch (error) {
            console.log("Token opcional inválido o expirado, continuando como invitado.");
        }
    }
    next(); 
};

router.get('/', leerTokenOpcional, controller.getAll);        
router.get('/:id', controller.getById);    

router.post('/checkout', verificarToken, controller.checkout); 

router.post('/', verificarToken, esAdmin, controller.create);       

router.put('/:id', verificarToken, esAdmin, controller.update);     

router.delete('/:id', verificarToken, esAdmin, controller.remove);  

module.exports = router;