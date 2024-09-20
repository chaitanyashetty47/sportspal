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
exports.getTurfsForPlaygroundAndSport = exports.getTurfsByPlayground = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTurfsByPlayground = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playgroundId } = req.params;
    try {
        const turfs = yield prisma.turf.findMany({
            where: { playgroundId },
        });
        res.json(turfs);
    }
    catch (error) {
        console.error('Error fetching turfs:', error);
        res.status(500).json({ error: 'An error occurred while fetching turfs' });
    }
});
exports.getTurfsByPlayground = getTurfsByPlayground;
//get turfs by sport and playground
function getTurfsBySportAndPlayground(playgroundId, sportType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const turfs = yield prisma.turf.findMany({
                where: {
                    playgroundId: playgroundId,
                    type: sportType,
                },
                select: {
                    id: true,
                    name: true,
                    hourlyRate: true,
                },
            });
            return turfs;
        }
        catch (error) {
            console.error('Error fetching turfs:', error);
            throw error;
        }
    });
}
const getTurfsForPlaygroundAndSport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playgroundId, sportType } = req.params;
    try {
        const turfs = yield getTurfsBySportAndPlayground(playgroundId, sportType);
        if (turfs.length > 0) {
            res.json(turfs);
        }
        else {
            res.status(404).json({ error: 'No turfs found for the specified sport and playground' });
        }
    }
    catch (error) {
        console.error('Error in getTurfsForPlaygroundAndSport:', error);
        res.status(500).json({ error: 'An error occurred while fetching the turfs' });
    }
});
exports.getTurfsForPlaygroundAndSport = getTurfsForPlaygroundAndSport;
