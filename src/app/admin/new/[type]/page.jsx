"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { CountryDropdown } from "react-country-region-selector";
import ImageDropzone from "@/app/admin/components/ImageDropzone";

const FIELD_LABELS = {
  wine: {
    name: "Nombre",
    house: "Bodega",
    variety: "Variedad",
    year: "Año",
    color: "Color",
    country: "País",
    region: "Región",
    pairing: "Maridaje",
    price: "Precio",
    imageURL: "Imagen",
  },
  merch: {
    name: "Nombre",
    variety: "Variedad",
    price: "Precio",
    imageURL: "Imagen",
  },
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
    pairing: "",
    price: "",
    imageURL: "",
    state: "active",
  },
  merch: {
    name: "",
    variety: "",
    price: "",
    imageURL: "",
    state: "active",
  },
};

const NewItemPage = () => {
  const params = useParams();
  const router = useRouter();
  const { type } = params;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(
    type === "wine" ? INITIAL_DATA.wine : INITIAL_DATA.merch,
  );

  const fields =
    type === "wine"
      ? [
          "name",
          "house",
          "variety",
          "year",
          "color",
          "country",
          "region",
          "pairing",
          "price",
          "imageURL",
        ]
      : ["name", "variety", "price", "imageURL"];

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

  if (type !== "wine" && type !== "merch") {
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
          Agregar {type === "wine" ? "Vino" : "Merch"}
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
                    value={formData[field] || ""}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: value,
                      }))
                    }
                    defaultOptionLabel="Selecciona un país"
                    style={{
                      width: "100%",
                      minHeight: "56px",
                      padding: "0 14px",
                      borderRadius: "4px",
                      border: "1px solid rgba(0, 0, 0, 0.23)",
                      backgroundColor: "transparent",
                      font: "inherit",
                    }}
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
                value={formData[field] ?? ""}
                onChange={handleChange}
                fullWidth
                multiline={field === "pairing"}
                rows={field === "pairing" ? 4 : 1}
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
