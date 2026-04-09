"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  TextField,
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
} from "@mui/material";
import { CountryDropdown } from "react-country-region-selector";
import ImageDropzone from "@/app/admin/components/ImageDropzone";
import {
  getCountryCodeFromValue,
  getSpanishCountryNameFromCode,
} from "@/utils/countries";
import styles from "../../../admin.module.css";
import { FIELD_LABELS, TYPE_LABELS } from "@/utils/constants";

const EditPage = () => {
  const params = useParams();
  const router = useRouter();
  const { type, id } = params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [houses, setHouses] = useState([]);
  const [isLoadingHouses, setIsLoadingHouses] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadItem = async () => {
      try {
        const response = await fetch(`/api/admin/${type}/${id}`);

        if (!response.ok) {
          throw new Error("Failed to load item");
        }

        const foundItem = await response.json();

        if (!isMounted) return;

        setItem(foundItem);
        setFormData(foundItem);
      } catch (error) {
        console.error("Error loading item:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [type, id]);

  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        alert("Error saving changes");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Item not found</Typography>
        <Button onClick={() => router.push("/admin")}>
          Volver al dashboard
        </Button>
      </Container>
    );
  }

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
  const getFieldLabel = (field) => {
    const label = FIELD_LABELS[type]?.[field];

    if (label) return label;
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar {TYPE_LABELS[type] || "Item"}: {item.name}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", mt: 3 }}
        >
          {fields.map((field) => {
            if (field === "country") {
              return (
                <Box key={field} sx={{ mb: 2 }}>
                  <Typography
                    component="label"
                    htmlFor="country-dropdown"
                    variant="body2"
                    sx={{
                      display: "block",
                      color: "#00000099",
                      fontWeight: 400,
                    }}
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
                      <Select {...selectProps}>
                        {options
                          .filter(Boolean)
                          .map(({ key, value, label }) => (
                            <option key={key} value={value}>
                              {value
                                ? getSpanishCountryNameFromCode(value)
                                : label}
                            </option>
                          ))}
                      </Select>
                    )}
                    className={styles.countryDropdown}
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
              const hasSelectedHouseOption = houses.some(
                (house) => house.id === formData[field],
              );

              return (
                <>
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
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      {isLoadingHouses
                        ? "Cargando bodegas..."
                        : "Selecciona una bodega"}
                    </MenuItem>
                    {formData[field] && !hasSelectedHouseOption ? (
                      <MenuItem value={formData[field]}>
                        Valor actual (sin sincronizar)
                      </MenuItem>
                    ) : null}
                    {houses.map((house) => (
                      <MenuItem key={house.id} value={house.id}>
                        {house.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              );
            }

            return (
              <>
                <InputLabel htmlFor={field} key={field}>
                  {getFieldLabel(field)}
                </InputLabel>
                <OutlinedInput
                  key={field}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  fullWidth
                  type={
                    field === "price" || field === "year" ? "number" : "text"
                  }
                  sx={{ mb: 2 }}
                />
              </>
            );
          })}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
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

export default EditPage;
