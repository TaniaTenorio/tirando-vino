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
    color: "Color",
    variety: "Variedad",
    house: "Bodega",
    region: "Región",
    country: "País",
    price: "Precio",
    year: "Año",
    imageURL: "Imagen",
  },
  merch: {
    name: "Nombre",
    variety: "Variedad",
    price: "Precio",
    imageURL: "Imagen",
  },
};

const EditPage = () => {
  const params = useParams();
  const router = useRouter();
  const { type, id } = params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

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

  const getFields = () => {
    if (type === "wine") {
      return [
        "name",
        "house",
        "variety",
        "year",
        "color",
        "country",
        "region",
        "price",
        "imageURL",
      ];
    } else if (type === "merch") {
      return ["name", "variety", "price", "imageURL"];
    }
    return [];
  };

  const fields = getFields();
  const getFieldLabel = (field) => {
    const label = FIELD_LABELS[type]?.[field];

    if (label) return label;
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar {type === "wine" ? "Vino" : "Merch"}: {item.name}
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

            return (
              <TextField
                key={field}
                label={getFieldLabel(field)}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                fullWidth
                rows={1}
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
