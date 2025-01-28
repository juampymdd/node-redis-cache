import express from 'express';
import axios from 'axios';
import { createClient } from 'redis';

const app = express();
const client = createClient({
    host: '127.0.0.1',
    port: 6379
});


import responseTime from 'response-time';
const api_url = "https://rickandmortyapi.com/api/character";


app.use(responseTime());

app.get('/characters', async (req, res) => {
    const reply = await client.get('characters');

    if (reply) {
        console.log('Using cache data');
        return res.json(JSON.parse(reply));
    } else {
        console.log('Using API data');
        const { data } = await axios.get(api_url)
        await client.set('characters', JSON.stringify(data.results));
        res.json(data);
    }

});

app.get('/characters/:id', async (req, res) => {
    const { id } = req.params;
    const reply = await client.get(`characters:${id}`);

    if (reply) {
        console.log('Using cache data');
        return res.json(JSON.parse(reply));
    } else {
        console.log('Using API data');
        const { data } = await axios.get(`${api_url}/${id}`);
        await client.set(`characters:${id}`, JSON.stringify(data));
        res.json(data);
    }
});

const main = async () => {
    await client.connect();
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

main();