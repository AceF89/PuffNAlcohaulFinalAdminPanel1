// usePlacesAutocomplete.ts
import { useState, useRef, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places")[] = ['places'];

const usePlacesAutocomplete = (apiKey: string) => {
  const [address, setAddress] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<any | object>({
    country: "",
    state: "",
    city: "",
    zipcode: "",
    placeId: "",
  });
  const [lat, setLat] = useState<any>();
  const [lng, setLng] = useState<any>();
  const [placeId, setPlaceId] = useState<string>("");

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
        setLat(place?.geometry?.location?.lat());
        setLng(place?.geometry?.location?.lng());
        setPlaceId(place.place_id || "");

        let newCountry = "", newState = "", newCity = "", newZipcode = "";

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
          country: newCountry,
          state: newState,
          city: newCity,
          zipcode: newZipcode,
          placeId: place.place_id,
        });
      }
    });

    searchBoxRef.current = autocomplete;
  }, [isLoaded]);

  return { address, isLoaded, loadError, fullAddress, lat, lng, placeId };
};

export default usePlacesAutocomplete;
