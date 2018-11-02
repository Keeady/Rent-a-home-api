const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: "nothing to see here."});
});

module.exports = router;
