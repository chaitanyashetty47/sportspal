"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaygroundByTurfId = exports.getTimingsByPlayground = exports.getTurfsByPlayground = exports.getPlaygroundDetails = exports.getPlaygrounds = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPlaygrounds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playgrounds = yield prisma.playground.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                turfs: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
            }
        });
        const playgroundsWithSports = playgrounds.map(playground => ({
            id: playground.id,
            name: playground.name,
            address: playground.address,
            sports: [...new Set(playground.turfs.map(turf => turf.type))],
            turfs: playground.turfs,
        }));
        res.json(playgroundsWithSports);
    }
    catch (error) {
        console.error('Error fetching playgrounds:', error);
        res.status(500).json({ error: 'An error occurred while fetching playgrounds' });
    }
});
exports.getPlaygrounds = getPlaygrounds;
//get individul playground detaiks
// app.get('/playgrounds/:playgroundName/:playgroundId', 
const getPlaygroundDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playgroundId } = req.params;
    try {
        const playground = yield prisma.playground.findUnique({
            where: { id: playgroundId },
            select: {
                address: true,
                name: true,
                turfs: true,
                startTime: true,
                endTime: true,
            },
        });
        if (!playground) {
            return res.status(404).json({ error: 'Playground not found' });
        }
        res.json(playground);
    }
    catch (error) {
        console.error('Error fetching playground:', error);
        res.status(500).json({ error: 'An error occurred while fetching playground information' });
    }
});
exports.getPlaygroundDetails = getPlaygroundDetails;
//returns all the turfs available in a playground
// app.get('/playgrounds/:playgroundId/turfs', 
const getTurfsByPlayground = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playgroundId } = req.params;
    try {
        const turfs = yield prisma.turf.findMany({
            where: { playgroundId: playgroundId },
        });
        res.json(turfs);
    }
    catch (error) {
        console.error('Error fetching turfs:', error);
        res.status(500).json({ error: 'An error occurred while fetching turfs' });
    }
});
exports.getTurfsByPlayground = getTurfsByPlayground;
// returns the timings  in a playground
// app.get('/playgrounds/:playgroundId/timings', 
const getTimingsByPlayground = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playgroundId } = req.params;
    try {
        const playground = yield prisma.playground.findUnique({
            where: { id: playgroundId },
            select: {
                startTime: true,
                endTime: true,
            },
        });
        if (!playground) {
            return res.status(404).json({ error: 'Playground not found, the id is incorrec' });
        }
        res.json({
            startTime: playground.startTime,
            endTime: playground.endTime,
        });
    }
    catch (error) {
        console.error('Error fetching timings:', error);
        res.status(500).json({ error: 'Error fetching playground timings' });
    }
});
exports.getTimingsByPlayground = getTimingsByPlayground;
//return plyground by turf id
const getPlaygroundByTurfId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { turfId } = req.params;
    try {
        const playground = yield prisma.playground.findUnique({
            where: { id: turfId },
            select: {
                id: true,
                name: true,
                address: true,
            },
        });
        res.json(playground);
    }
    catch (error) {
        console.error('Error fetching playground by turf id:', error);
        res.status(500).json({ error: 'Error fetching playground by turf id' });
    }
});
exports.getPlaygroundByTurfId = getPlaygroundByTurfId;
