"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playgroundControllers_1 = require("../controllers/playgroundControllers");
const router = (0, express_1.Router)();
router.get('/', playgroundControllers_1.getPlaygrounds);
router.get('/:playgroundId/timings', playgroundControllers_1.getTimingsByPlayground);
router.get('/:playgroundId/', playgroundControllers_1.getPlaygroundDetails);
exports.default = router;
