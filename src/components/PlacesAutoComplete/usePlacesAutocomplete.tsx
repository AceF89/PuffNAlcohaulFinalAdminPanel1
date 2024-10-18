// usePlacesAutocomplete.ts
import { useState, useRef, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places")[] = ['places'];

const usePlacesAutocomplete = (apiKey: string) => {
  const [address, setAddress] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<any | object>({
    country:"",
    state: "",
    city: "",
    zipcode: "",
  });
  const [lat , setLat] = useState<any>()
  const [lng , setLng] = useState<any>()


  const searchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const input = document.getElementById('address') as HTMLInputElement;
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode'],
      componentRestrictions: { country: 'us' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setAddress(place.formatted_address);
        setLat(place?.geometry?.location?.lat())
        setLng(place?.geometry?.location?.lng())

        console.log(place);
      }
      let newCountry = "",newState = "", newCity = "", newZipcode = "";

      place?.address_components?.forEach((component: any) => {
        if (component.types.includes("country")) {
          newCountry = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          newState = component.long_name;
        }
        if (component.types.includes("locality")) {
          newCity = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          newZipcode = component.long_name;
        }
      });
      setFullAddress({
        country :newCountry,
        state: newState,
        city: newCity,
        zipcode: newZipcode,
      });
    });


    searchBoxRef.current = autocomplete;
  }, [isLoaded]);

  return { address, isLoaded, loadError, fullAddress , lat , lng };
};

export default usePlacesAutocomplete;
