const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.logger.debug('Mensagem de DEBUG');
  req.logger.http('Mensagem de HTTP');
  req.logger.info('Mensagem de INFO');
  req.logger.warning('Mensagem de WARNING');
  req.logger.error('Mensagem de ERROR');
  req.logger.fatal('Mensagem de FATAL');

  res.send('Testando todos os níveis de log!');
});

module.exports = router;
