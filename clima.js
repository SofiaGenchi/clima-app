const axios = require('axios');
const { format } = require('date-fns');

const API_KEY = '0eb147ba829a4b298f0224459242108'; // Reemplaza con tu clave de API
const BASE_URL = 'http://api.weatherapi.com/v1/forecast.json';

async function obtenerClima(ciudad) {
    try {
        const url = `${BASE_URL}?key=${API_KEY}&q=${ciudad}&days=1&lang=es`;
        const respuesta = await axios.get(url);
        const datos = respuesta.data;

        if (datos && datos.current && datos.forecast) {
            const { temp_c, condition, humidity, wind_kph, pressure_mb, vis_km, uv } = datos.current;
            const prob_lluvias = datos.forecast.forecastday[0].day.daily_chance_of_rain;
	    const hora_lluvias = datos.forecast.forecastday[0].hour[0].time;

            // Obtener la fecha y hora actuales
            const ahora = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

            console.log(`Fecha y Hora de la consulta: ${ahora}`);
            console.log(`Ciudad: ${ciudad}`);
            console.log(`Temperatura actual: ${temp_c}°C`);
            console.log(`Descripción: ${condition.text}`);
            console.log(`Humedad: ${humidity}%`);
            console.log(`Velocidad del viento: ${wind_kph} km/h`);
            console.log(`Presión atmosférica: ${pressure_mb} mb`);
            console.log(`Visibilidad: ${vis_km} km`);
            console.log(`Índice UV: ${uv}`);
            console.log(`Lluvias: ${prob_lluvias}% de probabilidades`);
	    console.log(`Hora de la probabilidad de lluvia: ${hora_lluvias}`);
        } else {
            console.log('Error: No se pudo obtener el clima. Verifica la ciudad y la API.');
        }
    } catch (error) {
        console.error('Error al obtener el clima:', error.message);
    }
}

const ciudad = process.argv[2];

if (!ciudad) {
    console.log('Uso: node clima.js <nombre_de_la_ciudad>');
    process.exit(1);
}

obtenerClima(ciudad);
