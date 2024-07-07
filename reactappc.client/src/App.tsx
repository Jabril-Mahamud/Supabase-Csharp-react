import { useEffect, useState } from 'react';

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

function App() {
    const [forecasts, setForecasts] = useState<Forecast[]>();

    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = forecasts === undefined
        ? <p className="italic">Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact" className="text-blue-500 hover:text-blue-700">https://aka.ms/jspsintegrationreact</a> for more details.</p>
        : <table className="w-full border-collapse" aria-labelledby="tableLabel">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Temp. (C)</th>
                    <th className="p-2 text-left">Temp. (F)</th>
                    <th className="p-2 text-left">Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="p-2">{forecast.date}</td>
                        <td className="p-2">{forecast.temperatureC}</td>
                        <td className="p-2">{forecast.temperatureF}</td>
                        <td className="p-2">{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <h1 id="tableLabel" className="text-3xl font-bold mb-4">Weather forecast</h1>
            <p className="mb-6">This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        setForecasts(data);
    }
}

export default App;