import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// You will need your own API key for accessing geoDB services
const GEO_DB_API_KEY = 'YOUR_GEO_DB_API_KEY';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    // Fetch countries data from REST Countries API
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countryData = response.data.map(country => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryData);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      // Fetch states data from GeoDB API
      axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${selectedCountry.code}/regions`, {
        headers: {
          'X-RapidAPI-Key': GEO_DB_API_KEY,
        },
      })
        .then(response => {
          const stateData = response.data.data.map(state => ({
            name: state.name,
            code: state.regionCode,
          }));
          setStates(stateData);
          setCities([]);
        })
        .catch(error => console.error('Error fetching states:', error));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      // Fetch cities data from GeoDB API
      axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${selectedCountry.code}/regions/${selectedState.code}/cities`, {
        headers: {
          'X-RapidAPI-Key': GEO_DB_API_KEY,
        },
      })
        .then(response => {
          const cityData = response.data.data.map(city => ({
            name: city.city,
            lat: city.latitude,
            lng: city.longitude,
          }));
          setCities(cityData);
        })
        .catch(error => console.error('Error fetching cities:', error));
    }
  }, [selectedState]);

  const handleCountryChange = (event) => {
    const country = countries.find(c => c.code === event.target.value);
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateChange = (event) => {
    const state = states.find(s => s.code === event.target.value);
    setSelectedState(state);
    setSelectedCity(null);
  };

  const handleCityChange = (event) => {
    const city = cities.find(c => c.name === event.target.value);
    setSelectedCity(city);
  };

  return (
    <div>
      <h4>All Locations</h4>
      <Form>
        <Form.Group controlId="countrySelect">
          <Form.Label>Country</Form.Label>
          <Form.Control as="select" onChange={handleCountryChange}>
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {selectedCountry && (
          <Form.Group controlId="stateSelect">
            <Form.Label>State</Form.Label>
            <Form.Control as="select" onChange={handleStateChange}>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        {selectedState && (
          <Form.Group controlId="citySelect">
            <Form.Label>City</Form.Label>
            <Form.Control as="select" onChange={handleCityChange}>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
      </Form>

      <MapContainer center={[51.505, -0.09]} zoom={3}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedCity && (
          <Marker position={[selectedCity.lat, selectedCity.lng]}>
            <Popup>{selectedCity.name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationSelector;
