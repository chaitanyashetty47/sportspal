import { Request, Response, NextFunction } from "express";
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client';

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_PROJECT_URL!,
  process.env.SUPABASE_API_KEY!
)
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: any
}

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  // Fetch or create user in your database
  let dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) {
    // Create new user
    dbUser = await prisma.user.create({
      data: {
        supabaseId: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || 'email',
      },
    });
  } else {
    // Prepare update data
    const updateData: any = {};
    
    // Only update name if it's provided and different
    if (user.user_metadata?.full_name && user.user_metadata.full_name !== dbUser.name) {
      updateData.name = user.user_metadata.full_name;
    }
    
    // Only update avatarUrl if it's provided and different
    if (user.user_metadata?.avatar_url && user.user_metadata.avatar_url !== dbUser.avatarUrl) {
      updateData.avatarUrl = user.user_metadata.avatar_url;
    }
    
    // Only update provider if it's provided and different
    if (user.app_metadata?.provider && user.app_metadata.provider !== dbUser.provider) {
      updateData.provider = user.app_metadata.provider;
    }
    
    // Only perform update if there are changes
    if (Object.keys(updateData).length > 0) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: updateData,
      });
    }
  }

  req.user = dbUser;
  next();
};
export default authMiddleware