"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turfController_1 = require("../controllers/turfController");
const router = (0, express_1.Router)();
router.get('/:playgroundId/turfs', turfController_1.getTurfsByPlayground);
router.get('/:playgroundId/turfs/:sportType', turfController_1.getTurfsForPlaygroundAndSport);
exports.default = router;
