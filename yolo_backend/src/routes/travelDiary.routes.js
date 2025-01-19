const express = require('express');
const router = express.Router();
const TravelDiaryController = require('../controllers/travelDiary.controller');
const auth = require('../middleware/auth');

router.use(auth);

const travelDiaryController = new TravelDiaryController();

router.get('/list', travelDiaryController.listDiaries.bind(travelDiaryController));
router.get('/query/:id', travelDiaryController.getDiary.bind(travelDiaryController));
router.post('/create', travelDiaryController.createDiary.bind(travelDiaryController));
router.put('/update/:id', travelDiaryController.updateDiary.bind(travelDiaryController));
router.delete('/delete/:id', travelDiaryController.deleteDiary.bind(travelDiaryController));

module.exports = router;
