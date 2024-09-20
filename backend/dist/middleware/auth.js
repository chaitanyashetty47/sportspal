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
const supabase_js_1 = require("@supabase/supabase-js");
const client_1 = require("@prisma/client");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_API_KEY);
const prisma = new client_1.PrismaClient();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });
    const { data: { user }, error } = yield supabase.auth.getUser(token);
    if (error || !user)
        return res.status(401).json({ error: 'Invalid token' });
    // Fetch or create user in your database
    let dbUser = yield prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) {
        // Create new user
        dbUser = yield prisma.user.create({
            data: {
                supabaseId: user.id,
                email: user.email,
                name: ((_b = user.user_metadata) === null || _b === void 0 ? void 0 : _b.full_name) || null,
                avatarUrl: ((_c = user.user_metadata) === null || _c === void 0 ? void 0 : _c.avatar_url) || null,
                provider: ((_d = user.app_metadata) === null || _d === void 0 ? void 0 : _d.provider) || 'email',
            },
        });
    }
    else {
        // Prepare update data
        const updateData = {};
        // Only update name if it's provided and different
        if (((_e = user.user_metadata) === null || _e === void 0 ? void 0 : _e.full_name) && user.user_metadata.full_name !== dbUser.name) {
            updateData.name = user.user_metadata.full_name;
        }
        // Only update avatarUrl if it's provided and different
        if (((_f = user.user_metadata) === null || _f === void 0 ? void 0 : _f.avatar_url) && user.user_metadata.avatar_url !== dbUser.avatarUrl) {
            updateData.avatarUrl = user.user_metadata.avatar_url;
        }
        // Only update provider if it's provided and different
        if (((_g = user.app_metadata) === null || _g === void 0 ? void 0 : _g.provider) && user.app_metadata.provider !== dbUser.provider) {
            updateData.provider = user.app_metadata.provider;
        }
        // Only perform update if there are changes
        if (Object.keys(updateData).length > 0) {
            dbUser = yield prisma.user.update({
                where: { id: dbUser.id },
                data: updateData,
            });
        }
    }
    req.user = dbUser;
    next();
});
exports.default = authMiddleware;
