import express from 'express';
import axios from 'axios';
import { createClient } from 'redis';
import responseTime from 'response-time';

const app = express();
const api_url = "https://rickandmortyapi.com/api/character";

// Configuración correcta del cliente Redis
const client = createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    }
});

app.use(responseTime());

app.get('/characters', async (req, res) => {
    try {
        await client.connect(); // Asegurar que el cliente esté conectado
        const reply = await client.get('characters');

        if (reply) {
            console.log('Using cache data');
            return res.json(JSON.parse(reply));
        }

        console.log('Using API data');
        const { data } = await axios.get(api_url);
        await client.set('characters', JSON.stringify(data.results), { EX: 3600 }); // Expira en 1 hora

        res.json(data.results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/characters/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await client.connect();
        const reply = await client.get(`characters:${id}`);

        if (reply) {
            console.log('Using cache data');
            return res.json(JSON.parse(reply));
        }

        console.log('Using API data');
        const { data } = await axios.get(`${api_url}/${id}`);
        await client.set(`characters:${id}`, JSON.stringify(data), { EX: 3600 });

        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const main = async () => {
    try {
        await client.connect();
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

main();
