const express = require('express');
const axios = require('axios');
const { format } = require('date-fns');
const path = require('path');

const API_KEY = '0eb147ba829a4b298f0224459242108'; // Reemplaza con tu clave de API
const BASE_URL = 'http://api.weatherapi.com/v1/forecast.json';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/clima', async (req, res) => {
    const ciudad = req.query.ciudad;

    if (!ciudad) {
        return res.status(400).json({ error: 'Falta el parámetro de ciudad' });
    }

    try {
        const url = `${BASE_URL}?key=${API_KEY}&q=${ciudad}&days=1&lang=es`;
        const respuesta = await axios.get(url);
        const datos = respuesta.data;

        if (datos && datos.current && datos.forecast) {
            const { temp_c, condition, humidity, wind_kph, pressure_mb, vis_km, uv } = datos.current;
            const prob_lluvias = datos.forecast.forecastday[0].day.daily_chance_of_rain;
            const hora_lluvias = datos.forecast.forecastday[0].hour[0].time;

            const ahora = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

            res.json({
                fechaHora: ahora,
                ciudad: ciudad,
                temperatura: `${temp_c}°C`,
                descripcion: condition.text,
                humedad: `${humidity}%`,
                velocidadViento: `${wind_kph} km/h`,
                presionAtmosferica: `${pressure_mb} mb`,
                visibilidad: `${vis_km} km`,
                indiceUV: uv,
                lluvias: `${prob_lluvias}%`,
                horaLluvias: hora_lluvias
            });
        } else {
            res.status(500).json({ error: 'No se pudo obtener el clima. Verifica la ciudad y la API.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el clima: ' + error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
