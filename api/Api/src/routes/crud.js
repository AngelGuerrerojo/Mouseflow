const express = require('express');
const router = express.Router();
const controlador = require('../controller/crud');

router.get('/', controlador.obtener);
router.get('/:id', controlador.saludo);
router.post('/', controlador.insertar);
router.put('/:id', controlador.actualizar);
router.patch('/:id', controlador.actualizarcol);
router.delete('/:id', controlador.eliminar);

module.exports = router;