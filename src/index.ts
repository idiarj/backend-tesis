import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    console.log('Received a request b');
    res.json({ message: 'Hello, World!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

