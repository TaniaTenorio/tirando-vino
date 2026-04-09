"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CountryDropdown } from "react-country-region-selector";
import ImageDropzone from "@/app/admin/components/ImageDropzone";
import {
  getCountryCodeFromValue,
  getSpanishCountryNameFromCode,
} from "@/utils/countries";

const FIELD_LABELS = {
  wine: {
    name: "Nombre",
    house: "Bodega",
    variety: "Variedad",
    year: "Año",
    color: "Color",
    country: "País",
    region: "Región",
    price: "Precio",
    imageURL: "Imagen",
  },
  merch: {
    name: "Nombre",
    variety: "Variedad",
    price: "Precio",
    imageURL: "Imagen",
  },
  house: {
    name: "Nombre",
  },
};

const TYPE_LABELS = {
  wine: "Vino",
  merch: "Merch",
  house: "Bodega",
};

const INITIAL_DATA = {
  wine: {
    name: "",
    house: "",
    variety: "",
    year: "",
    color: "",
    country: "",
    region: "",
    price: "",
    imageURL: "",
    status: "active",
  },
  merch: {
    name: "",
    variety: "",
    price: "",
    imageURL: "",
    status: "active",
  },
  house: {
    name: "",
    status: "active",
  },
};

const NewItemPage = () => {
  const params = useParams();
  const router = useRouter();
  const { type } = params;
  const [saving, setSaving] = useState(false);
  const [houses, setHouses] = useState([]);
  const [isLoadingHouses, setIsLoadingHouses] = useState(false);

  const [formData, setFormData] = useState(INITIAL_DATA[type] || {});

  const fieldsByType = {
    wine: [
      "name",
      "house",
      "variety",
      "year",
      "color",
      "country",
      "region",
      "price",
      "imageURL",
    ],
    merch: ["name", "variety", "price", "imageURL"],
    house: ["name"],
  };

  const fields = fieldsByType[type] || [];

  React.useEffect(() => {
    setFormData(INITIAL_DATA[type] || {});
  }, [type]);

  React.useEffect(() => {
    if (type !== "wine") {
      return;
    }

    let isMounted = true;

    const loadHouses = async () => {
      setIsLoadingHouses(true);

      try {
        const response = await fetch("/api/admin/house");

        if (!response.ok) {
          throw new Error("Failed to load houses");
        }

        const data = await response.json();

        if (!isMounted) return;

        setHouses(data || []);
      } catch (error) {
        console.error("Error loading houses:", error);
        if (isMounted) {
          setHouses([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingHouses(false);
        }
      }
    };

    loadHouses();

    return () => {
      isMounted = false;
    };
  }, [type]);

  const getFieldLabel = (field) => {
    const label = FIELD_LABELS[type]?.[field];

    if (label) return label;
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error creating item");
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Error creating item");
    } finally {
      setSaving(false);
    }
  };

  if (!TYPE_LABELS[type]) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Tipo de item no válido.</Typography>
        <Button onClick={() => router.push("/admin")}>
          Volver al dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Agregar {TYPE_LABELS[type]}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
        >
          {fields.map((field) => {
            if (field === "country") {
              return (
                <Box key={field}>
                  <Typography
                    component="label"
                    htmlFor="country-dropdown"
                    variant="body2"
                    sx={{ display: "block", mb: 1, color: "text.secondary" }}
                  >
                    {getFieldLabel(field)}
                  </Typography>
                  <CountryDropdown
                    id="country-dropdown"
                    name={field}
                    value={getCountryCodeFromValue(formData[field])}
                    valueType="short"
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: value,
                      }))
                    }
                    defaultOptionLabel="Selecciona un país"
                    customRender={({ options, ...selectProps }) => (
                      <select
                        {...selectProps}
                        style={{
                          width: "100%",
                          minHeight: "56px",
                          padding: "0 14px",
                          borderRadius: "4px",
                          border: "1px solid rgba(0, 0, 0, 0.23)",
                          backgroundColor: "transparent",
                          font: "inherit",
                        }}
                      >
                        {options
                          .filter(Boolean)
                          .map(({ key, value, label }) => (
                            <option key={key} value={value}>
                              {value
                                ? getSpanishCountryNameFromCode(value)
                                : label}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                </Box>
              );
            }

            if (field === "imageURL") {
              return (
                <ImageDropzone
                  key={field}
                  label={getFieldLabel(field)}
                  value={formData[field] || ""}
                  onChange={(imageValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: imageValue,
                    }))
                  }
                />
              );
            }

            if (field === "house") {
              return (
                <FormControl key={field} fullWidth>
                  <InputLabel id="house-select-label">
                    {getFieldLabel(field)}
                  </InputLabel>
                  <Select
                    labelId="house-select-label"
                    label={getFieldLabel(field)}
                    name={field}
                    value={formData[field] ?? ""}
                    onChange={handleChange}
                    disabled={isLoadingHouses}
                  >
                    <MenuItem value="" disabled>
                      {isLoadingHouses
                        ? "Cargando bodegas..."
                        : "Selecciona una bodega"}
                    </MenuItem>
                    {houses.map((house) => (
                      <MenuItem key={house.id} value={house.id}>
                        {house.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            return (
              <TextField
                key={field}
                label={getFieldLabel(field)}
                name={field}
                value={formData[field] ?? ""}
                onChange={handleChange}
                fullWidth
                type={field === "price" || field === "year" ? "number" : "text"}
              />
            );
          })}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : "Crear item"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/admin")}
              disabled={saving}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewItemPage;
