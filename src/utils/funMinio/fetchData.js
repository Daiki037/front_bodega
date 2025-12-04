import { loadOptions } from '../../../src/components/funciones/funcionesFormularios';

export const fetchData = async (endpoint, setStates) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/consultaDiccionario/${endpoint}`);
    const jsonData = await response.json();
    const options = loadOptions(jsonData);
    if (Array.isArray(setStates)) {
      setStates.forEach(setState => setState(options));
    } else {
      setStates(options);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error);
  }
};