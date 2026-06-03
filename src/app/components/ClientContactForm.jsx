import React from "react";
import {
  Container,
  Box,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import {
  getStatesOfCountry,
  getCitiesOfState,
} from "@countrystatecity/countries-browser";

const MEXICO_ISO2 = "MX";
const ZIP_REGEX = /^(?!00)\d{5}$/;

const ClientContactForm = ({
  formData,
  onFormChange,
  validationTriggered = false,
}) => {
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [selectedState, setSelectedState] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [loadingStates, setLoadingStates] = React.useState(true);
  const [loadingCities, setLoadingCities] = React.useState(false);
  const [zipTouched, setZipTouched] = React.useState(false);
  const [touchedFields, setTouchedFields] = React.useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    stateCode: false,
    city: false,
  });

  const isZipValid = ZIP_REGEX.test(formData.zip);
  const showZipError = zipTouched && !isZipValid;
  const showNameError = touchedFields.name && formData.name.trim() === "";
  const showEmailError = touchedFields.email && formData.email.trim() === "";
  const showPhoneError = touchedFields.phone && formData.phone.trim() === "";
  const showAddressError =
    touchedFields.address && formData.address.trim() === "";
  const showStateError =
    touchedFields.stateCode && formData.stateCode.trim() === "";
  const showCityError = touchedFields.city && formData.city.trim() === "";

  const markTouched = React.useCallback((field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  }, []);

  React.useEffect(() => {
    getStatesOfCountry(MEXICO_ISO2)
      .then((data) => setStates(data))
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false));
  }, []);

  React.useEffect(() => {
    if (validationTriggered) {
      setTouchedFields({
        name: true,
        email: true,
        phone: true,
        address: true,
        stateCode: true,
        city: true,
      });
      setZipTouched(true);
    }
  }, [validationTriggered]);

  React.useEffect(() => {
    setSelectedState(formData.stateCode || "");
    setSelectedCity(formData.city || "");
  }, [formData.stateCode, formData.city]);

  React.useEffect(() => {
    if (!formData.stateCode) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    getCitiesOfState(MEXICO_ISO2, formData.stateCode)
      .then((data) => setCities(data))
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, [formData.stateCode]);

  const handleStateChange = React.useCallback(
    (event) => {
      const stateCode = event.target.value;
      const selectedStateData = states.find(
        (state) => state.iso2 === stateCode,
      );

      setSelectedState(stateCode);
      setSelectedCity("");
      setCities([]);
      onFormChange({
        stateCode,
        stateName: selectedStateData?.name || "",
        city: "",
      });

      if (!stateCode) return;

      setLoadingCities(true);
      getCitiesOfState(MEXICO_ISO2, stateCode)
        .then((data) => setCities(data))
        .catch(() => setCities([]))
        .finally(() => setLoadingCities(false));
    },
    [onFormChange, states],
  );

  return (
    <Container sx={{ textAlign: "left", marginTop: 2, padding: 0 }}>
      <Box component="form" noValidate autoComplete="off">
        <InputLabel htmlFor="name">Nombre</InputLabel>
        <FormControl fullWidth error={showNameError}>
          <OutlinedInput
            id="name"
            required
            value={formData.name}
            onBlur={() => markTouched("name")}
            onChange={(event) => onFormChange({ name: event.target.value })}
          />
          {showNameError ? (
            <FormHelperText>El nombre es obligatorio.</FormHelperText>
          ) : null}
        </FormControl>

        <InputLabel htmlFor="email">Correo electrónico</InputLabel>
        <FormControl fullWidth error={showEmailError}>
          <OutlinedInput
            id="email"
            required
            value={formData.email}
            onBlur={() => markTouched("email")}
            onChange={(event) => onFormChange({ email: event.target.value })}
          />
          {showEmailError ? (
            <FormHelperText>
              El correo electrónico es obligatorio.
            </FormHelperText>
          ) : null}
        </FormControl>

        <InputLabel htmlFor="phone">Teléfono</InputLabel>
        <FormControl fullWidth error={showPhoneError}>
          <OutlinedInput
            id="phone"
            required
            value={formData.phone}
            onBlur={() => markTouched("phone")}
            onChange={(event) => onFormChange({ phone: event.target.value })}
          />
          {showPhoneError ? (
            <FormHelperText>El teléfono es obligatorio.</FormHelperText>
          ) : null}
        </FormControl>

        <InputLabel htmlFor="address">Dirección</InputLabel>
        <FormControl fullWidth error={showAddressError}>
          <OutlinedInput
            id="address"
            required
            value={formData.address}
            onBlur={() => markTouched("address")}
            onChange={(event) => onFormChange({ address: event.target.value })}
          />
          {showAddressError ? (
            <FormHelperText>La dirección es obligatoria.</FormHelperText>
          ) : null}
        </FormControl>

        <InputLabel id="state-label">Estado</InputLabel>
        <FormControl fullWidth error={showStateError}>
          <Select
            labelId="state-label"
            id="state"
            value={selectedState}
            onBlur={() => markTouched("stateCode")}
            onChange={handleStateChange}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            label="Estado"
            disabled={loadingStates}
            MenuProps={{
              disablePortal: true,
              MenuListProps: {
                onClick: (event) => event.stopPropagation(),
              },
            }}
            endAdornment={
              loadingStates ? (
                <CircularProgress size={18} sx={{ mr: 2 }} />
              ) : null
            }
            fullWidth
          >
            {states.map((state) => (
              <MenuItem key={state.iso2} value={state.iso2}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
          {showStateError ? (
            <FormHelperText>Selecciona un estado.</FormHelperText>
          ) : null}
        </FormControl>

        <InputLabel id="city-label">Ciudad</InputLabel>
        <FormControl fullWidth error={showCityError}>
          <Select
            labelId="city-label"
            id="city"
            value={selectedCity}
            onBlur={() => markTouched("city")}
            onChange={(event) => {
              setSelectedCity(event.target.value);
              onFormChange({ city: event.target.value });
            }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            label="Ciudad"
            disabled={!selectedState || loadingCities}
            MenuProps={{
              disablePortal: true,
              MenuListProps: {
                onClick: (event) => event.stopPropagation(),
              },
            }}
            endAdornment={
              loadingCities ? (
                <CircularProgress size={18} sx={{ mr: 2 }} />
              ) : null
            }
            fullWidth
          >
            {cities.map((city) => (
              <MenuItem key={`${city.name}-${city.id}`} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
          {showCityError ? (
            <FormHelperText>Selecciona una ciudad.</FormHelperText>
          ) : null}
        </FormControl>

        <InputLabel htmlFor="zip">Código Postal</InputLabel>
        <FormControl fullWidth error={showZipError}>
          <OutlinedInput
            id="zip"
            required
            value={formData.zip}
            onBlur={() => setZipTouched(true)}
            onChange={(event) => {
              const sanitizedZip = event.target.value
                .replace(/\D/g, "")
                .slice(0, 5);
              onFormChange({ zip: sanitizedZip });
            }}
            inputProps={{
              maxLength: 5,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
          {showZipError ? (
            <FormHelperText>Ingresa un código postal válido.</FormHelperText>
          ) : null}
        </FormControl>
      </Box>
    </Container>
  );
};

export default ClientContactForm;
