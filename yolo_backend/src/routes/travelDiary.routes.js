const express = require('express');
const router = express.Router();
const travelDiaryController = require('../controllers/travelDiary.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/list', travelDiaryController.listDiaries);
router.get('/query/:id', travelDiaryController.getDiary);
router.post('/create', travelDiaryController.createDiary);
router.put('/update/:id', travelDiaryController.updateDiary);
router.delete('/delete/:id', travelDiaryController.deleteDiary);

module.exports = router;
