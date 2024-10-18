import React, { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button } from "react-bootstrap";
import { InputCtrl, SelectCtrl } from "../../controllers";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteConfirm from "../../components/Inplace Confirm/DeleteConfirm";
import { useToast } from "../../hooks";
import Loader from "../../components/Loader";
import { getCity, getCountry, getState } from "helpers/api/place";
import { deleteStores, getStores, saveStores } from "helpers";
import AutocompleteInput from "controllers/AutocompleteInput";
import usePlacesAutocomplete from "components/PlacesAutoComplete/usePlacesAutocomplete";

//Default values
const defaultValues: {
  Id: number;
  name: string;
  email: string;
  posApiKey:string;
  barcode:string;
  address: string;
  address2:string;
  phoneNumber:number | string;
  countryId : number | string;
  stateId : number | string;
  cityId : number | string;
  zipCode :number | string;
  latitude: number;
  longitude:number;

} = {
  Id: 0,
  name: "",
  email: "",
  posApiKey:"",
  phoneNumber:"",
  address:"",
  address2:"",
  countryId : "",
  stateId : "",
  cityId :"",
  barcode:"",
  zipCode : "",
  longitude:0,
  latitude:0,
};

const EventsEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoadoing]: any = useState(false);
  const [country, setCountry] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [ defaultaddress, setDefaultAddress]= useState('')
  const [apiStatus] = useState({
    inprogress: false,
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<{
    Id: number;
    name: string;
    email: string;
    address: string;
    address2:string;
    barcode:string;
    phoneNumber:number | string;
    countryId : number | string;
    stateId : number | string;
    cityId : number | string;
    posApiKey:string;
    zipCode :number | string
    latitude: number;
    longitude:number;

  }>({
    defaultValues: {
      ...defaultValues,
    },
    mode: "onBlur",
  });
  const showError = (_fieldName: string): any => {
    const keyList: Array<string> = _fieldName.split(".");
    const [key1, key2] = keyList;
    let error;
    if (key1 && key2) {
      const errorObj = (errors as any)[key1];
      error = errorObj ? errorObj[key2] : null;
    } else if (key1) {
      error = (errors as any)[key1];
    }
    return error ? error.message || "Field is required" : null;
  };

  let location = useLocation();
  let path = location.pathname;
  let arr = path.split("/");
  let id = parseInt(arr[arr.length - 1]);

  const onSubmit: SubmitHandler<{
    Id: number;
    name: string;
    email: string;
    address: string;
    address2:string;
    posApiKey:string;
    barcode:string;
    phoneNumber:number | string;
    countryId : number | string;
    stateId : number | string;
    cityId : number | string;
    latitude: number;
    longitude:number;
    zipCode:number | string;
  }> = async (data) => {
  
    // saveUserData
    try {
      const response = await saveStores({
        Id: data.Id,
        name: data.name,
        email: data.email,
        address:data.address,
        address2:data.address2,
        phoneNumber:data.phoneNumber,
        countryId:data.countryId,
        stateId:data.stateId,
        cityId:data.cityId,
        barcode:data.barcode,
        posApiKey:data.posApiKey,
        latitude: lat,
        longitude: lng,
        zipCode:data.zipCode,
          });

      if (response.statusCode === 200) {
        showToast("success", response.message);
        navigate(-1);
      } else {
        console.log(response.error);
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

 

  const GetDetails = async () => {
    setLoadoing(true);
    try {
      const response = await getStores({ id });
      reset({
        Id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        address:response.data.address,
        address2:response.data.address2,
        phoneNumber:response.data.phoneNumber,
        countryId:response.data.countryId,
        stateId:response.data.stateId,
        cityId:response.data.cityId,
        barcode:response.data.barcode,
        posApiKey:response.data.posApiKey,
        latitude:response.data.latitude,
        longitude:response.data.longitude,
        zipCode:response.data.zipCode,
      });
    setDefaultAddress(response.data.address)
      setLoadoing(false);
    } catch (error) {
      setLoadoing(false);
      console.log(error, "error");
    }
  };

  async function deleteData() {
    let response = await deleteStores(id);
    try {
      if (response.statusCode === 200) {
        console.log(response.message);
        showToast("success", response.message);
        navigate("/store");
      } else {
        console.log(response.message);
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(response.error);
    }
  }



  const fetchCountry = async () => {
    try {
      const response = await getCountry({
        pageNumber: 1,
        pageSize: 500,
      });
      if (response.statusCode === 200) {
        setCountry(
          response.data.items.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const fetchState = async (countryId: number | string) => {
    try {
      const response = await getState({
        pageNumber: 1,
        pageSize: 500,
        countryId: countryId ? countryId : selectedCountry?.value,
      });
      if (response.statusCode === 200) {
        setState(
          response.data.items.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const fetchCity = async (stateId: number | string) => {
    try {
      const response = await getCity({
        pageNumber: 1,
        pageSize: 500,
        stateId: stateId ? stateId :seletedState?.value
      });
      if (response.statusCode === 200) {
        setCity(
          response.data.items.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (Number(params.id)) {
      GetDetails();
    }
    fetchCountry();
  }, []);

  const countryId = watch("countryId");
  const stateId = watch("stateId");
  const { fullAddress , address, isLoaded, loadError , lat , lng } = usePlacesAutocomplete("AIzaSyCTR1vsV9Ebf3_YFvJYMJgRgmfV1xppxAs");

  const selectedCountry = country?.find((loc: any) => loc.label === fullAddress.country);
  const seletedState = state?.find((loc: any) => loc.label === fullAddress.state)
  const selectedCity = city?.find((loc: any) => loc.label === fullAddress?.city)

  useEffect(() => {
    setValue("address", address)
    setValue("address", address)
    setDefaultAddress(address)
    setValue("zipCode" , fullAddress?.zipcode)
    setValue("stateId" , seletedState?.value)
    setValue("cityId" , selectedCity?.value)
  }, [address , fullAddress , seletedState ,selectedCity])


  useEffect(() => {
    if (countryId || selectedCountry) {
      fetchState(countryId ? countryId :selectedCountry?.value);
    }
  }, [countryId , selectedCountry]); 

  useEffect(() => {
    if (stateId || seletedState) {
      fetchCity(stateId ? stateId : seletedState?.value);
    }
  }, [stateId , seletedState]); 
  return (
    <>
      <PageTitleBox
        name="Store Detail"
        pageTitle="Store Details"
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none">
          <Card.Body>
            {loading && <Loader />}
            <Row>
              <Col xl={12}>
               
                 <Row>
                 <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter name"
                      label="Name"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter email"
                      label="Email"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={6}>
                    <AutocompleteInput
                      control={control}
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Enter Address"
                      label="Address 1"
                      showError={showError}
                      required={true}
                      onChange={(e:any)=>setDefaultAddress(e.target.value)}
                      // defaultValue={defaultaddress}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      value={defaultaddress}
                    />
                  </Col>  
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="address2"
                      id="address2"
                      placeholder="Enter Address"
                      label="Address 2 "
                      showError={showError}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>  
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type=""
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Enter Phone Number"
                      label="Phone Number"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      minLength={10}
                      maxLength={13}
                    />
                  </Col>
                  </Row>              
               <Row>
               {/* <Col xl={4}> 
                <SelectCtrl
                      control={control}
                      name="countryId"
                      id="countryId"
                      placeholder="Please Select Country"
                      label="Country"
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={country}
                      showError={showError}
                      onSelect={(selectedCountry) =>
                        fetchState(Number(selectedCountry.value))
                      }
                    /> 
                  </Col> */}
                  <Col xl={4}>
                    <SelectCtrl
                      control={control}
                      name="stateId"
                      id="stateId"
                      placeholder="Please Select State"
                      label="State"
                      required={true}
                      disabled={true}
                      className="mb-3"
                      options={state}
                      showError={showError}
                      onSelect={(selectedState) =>
                        fetchCity(Number(selectedState.value))
                      }
                    />
                  </Col>
                  <Col xl={4}>
                    <SelectCtrl
                      control={control}
                      name="cityId"
                      id="cityId"
                      placeholder="Please Select City"
                      label="City"
                      required={true}
                      disabled={true}
                      className="mb-3"
                      options={city}
                      showError={showError}
                    />
                  </Col>
                  <Col xl={4}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      placeholder="Enter zipcode"
                      label="Zip Code"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="posApiKey"
                      id="posApiKey"
                      placeholder="Enter pos key"
                      label="POS Key"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  
               </Row>             
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <div className="d-flex justify-content-between align-items-baseline">
          <div className="button-list">
            <Button
              type="submit"
              disabled={apiStatus.inprogress}
              className="px-4 save-btn"
            >
              Save
            </Button>
            <Button
              className="px-4 cancel-btn"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <DeleteConfirm
              isHide={!Number(params.id)}
              disabled={apiStatus.inprogress}
              confirm={() => {
                deleteData();
              }}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default EventsEdit;
