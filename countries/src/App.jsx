import { useState, useEffect } from "react";
import axios from "axios";

function App() {
   const [query, setQuery] = useState("");
   const [countries, setCountries] = useState([]);
   const [filteredCountries, setFilteredCountries] = useState([]);
   const [weatherData, setWeatherData] = useState(null);

   const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

   const coordinates = filteredCountries.length === 1 ? filteredCountries[0].capitalInfo.latlng : null;
   const lat = coordinates ? coordinates[0] : null;
   const lon = coordinates ? coordinates[1] : null;

   useEffect(() => {
      if (coordinates) {
         axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
            .then(response => {
               setWeatherData(response.data);
            })
            .catch(error => {
               console.error("Error fetching weather data:", error);
            });
      }
   }, [coordinates, apiKey]);

   useEffect(() => {
      axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
         setCountries(response.data);
      })
      .catch(error => {
          console.error("Error fetching countries:", error);
      });
    }, []);

    useEffect(() => {
      const filtered = countries.filter(country => 
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(filtered);
      console.log("Filtered countries:", filtered);
    }, [query, countries]);

    const handleQueryChange = (event) => {
      setQuery(event.target.value);
    }

    const handleShowClick = (country) => {
      setFilteredCountries([country]);
    }

    const renderCountries = () => {
      if(filteredCountries.length > 10) {
        return <p>Too many matches, specify another filter</p>;
      }
      if(filteredCountries.length >1 && filteredCountries.length <= 10) {
        return (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.cca3}>{country.name.common} 
              <button onClick={() => handleShowClick(country)}>Show</button>
              </li>
            ))}
          </ul>
        );
      }
      if(filteredCountries.length === 1) {
        const country = filteredCountries[0];
        return(
          <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <h2>Languages</h2>
            <ul>
              {Object.values(country.languages).map(language => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200" />
            <h3>Weather in {country.capital}</h3>
            <p>Temperature {weatherData?.main?.temp} Celsius</p>
            {weatherData && weatherData.weather && weatherData.weather[0] && (
              <img 
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                alt={weatherData.weather[0].description} 
              />
            )}
            <p>Wind {weatherData?.wind?.speed} m/s</p>
          </div>
        )
    }
  }

    return (
      <div>
        Find countries <input value={query} onChange ={handleQueryChange}/>
        <div>{renderCountries()}</div>
      </div>
    )
}

    export default App;