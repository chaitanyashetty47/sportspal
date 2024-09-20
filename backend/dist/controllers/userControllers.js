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
exports.getAllUsers = exports.createOrUpdateUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrUpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supabaseId, email } = req.body;
        const user = yield prisma.user.upsert({
            where: { supabaseId: supabaseId },
            update: {
                email,
            },
            create: {
                supabaseId,
                email,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error creating/updating user:', error);
        res.status(500).json({ error: 'Failed to create/update user' });
    }
});
exports.createOrUpdateUser = createOrUpdateUser;
// //get users by email
// export const getUsersByEmail = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     const users = await prisma.user.findMany({
//       where: { email },
//     });
//   } catch (error) {
//     console.error('Error getting users by email:', error);
//     res.status(500).json({ error: 'Failed to get users by email' });
//   }
// };
//get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ error: 'Failed to get all users' });
    }
});
exports.getAllUsers = getAllUsers;
