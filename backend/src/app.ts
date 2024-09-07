import express from 'express';
import cors from 'cors';
import playgroundRoutes from './routes/playgroundRoutes';
import turfRoutes from './routes/turfRoutes';
import sportRoutes from './routes/sportRoutes';
import  authMiddleware  from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());
//app.use(authMiddleware);

app.use('/playgrounds', playgroundRoutes);
app.use('/playgrounds', turfRoutes);
app.use('/playgrounds', sportRoutes);

export default app;
