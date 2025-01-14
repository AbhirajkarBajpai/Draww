const express = require('express');
const challengeDataController = require('../controller/challengeDataController');

const router = express.Router();

router.get('/getUploadUrl', challengeDataController.getUploadFilesURL);
router.post('/uploadChallengeData', challengeDataController.uploadData);
router.get('/getChallengeData/:id', challengeDataController.getdata);

module.exports = router;