import express from "express";
import { db } from "./db.js";
import users from "./schema.js";
import { eq } from "drizzle-orm";
import cors from 'cors'

const app = express();
const PORT = 4000;
const router = express.Router();

app.use(cors());


app.use(express.json());

router.get('/', async (req, res) => {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    const user = await db.select().from(users).where(eq(users.id, id));

    if (!user) res.status(404).json({ error: 'User not found' });

    res.json(user);
});

router.post('/', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) res.status(400).json({ error: 'Fields ara missing' });


    const [newUser] = await db.insert(users).values({ name, email }).returning();

    res.status(201).json(newUser);
});

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body

    const updated = await db.update(users).set({ name, email }).where(eq(users.id, id)).returning();

    if (!updated.length) res.status(404).json({ error: 'User not found' });

    res.json({ user: updated[0], message: 'This user updated successfully' });
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await db.delete(users).where(eq(users.id, id)).returning();

    if (!deleted.length) res.status(404).json({ error: 'User not found' });

    res.json({ user: deleted[0], message: 'This user deleted successfully' });
});

app.use('/api/users', router);

app.listen(PORT, () => console.log(`This api is using http://localhost:${PORT}`));