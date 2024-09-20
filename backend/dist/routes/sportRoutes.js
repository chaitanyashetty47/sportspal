"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sportController_1 = require("../controllers/sportController");
const router = (0, express_1.Router)();
router.get('/:playgroundId/sports', sportController_1.getSportsByPlayground);
exports.default = router;
