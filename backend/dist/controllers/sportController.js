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
exports.getSportsByPlayground = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSportsByPlayground = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playgroundId } = req.params;
    try {
        const sports = yield prisma.turf.findMany({
            where: { playgroundId },
            distinct: ['type'],
            select: { type: true },
        });
        res.json(sports);
    }
    catch (error) {
        console.error('Error fetching sports:', error);
        res.status(500).json({ error: 'An error occurred while fetching sports' });
    }
});
exports.getSportsByPlayground = getSportsByPlayground;
