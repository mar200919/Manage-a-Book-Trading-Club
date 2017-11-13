var express = require('express');
var router = express.Router();
var profileController = require('../controllers/profile.server.controller');

router.put('/accept',  profileController.acceptRequest);
router.put('/decline',  profileController.declineRequest);
router.put('/cancel',  profileController.cancelRequest);
router.put('/return',  profileController.returnBook);
router.put('/requestBookBack',  profileController.requestBookBack);
router.put('/:id',  profileController.updateCityAndState);

module.exports = router;