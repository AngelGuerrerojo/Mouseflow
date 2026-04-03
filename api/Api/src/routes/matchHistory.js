const express = require('express');
const router = express.Router();
const controlador = require('../controller/matchHistory');

router.get('/', controlador.obtener);
router.get('/:id', controlador.obtenerPorId);
router.post('/', controlador.insertar);
router.put('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

module.exports = router;
