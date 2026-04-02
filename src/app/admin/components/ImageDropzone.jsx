"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDropzone } from "react-dropzone";
import styles from "../admin.module.css";

const DEFAULT_MAX_SIZE_MB = 2;

const ImageDropzone = ({
  label,
  value,
  onChange,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
}) => {
  const [error, setError] = React.useState("");
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const buildValidationMessage = (fileRejections) => {
    const firstRejection = fileRejections?.[0];
    const firstErrorCode = firstRejection?.errors?.[0]?.code;

    if (firstErrorCode === "file-too-large") {
      return `La imagen es demasiado grande. Tamaño máximo permitido: ${maxSizeMB} MB.`;
    }

    if (firstErrorCode === "file-invalid-type") {
      return "Formato no válido. Sube una imagen (JPG, PNG, WEBP, etc.).";
    }

    if (firstErrorCode === "too-many-files") {
      return "Solo puedes seleccionar una imagen.";
    }

    return "No se pudo cargar la imagen. Intenta con otro archivo.";
  };

  const onDrop = React.useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError(buildValidationMessage(fileRejections));
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      setError("");

      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result);
      };
      reader.onerror = () => {
        setError("No se pudo leer el archivo");
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: maxSizeBytes,
  });

  const handleRemoveImage = () => {
    setError("");
    onChange("");
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ display: "block", mb: 1, color: "text.secondary" }}
      >
        {label}
      </Typography>

      {value ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body">Vista previa</Typography>

          <div className={styles.previewHeader}>
            <Box
              component="img"
              src={value}
              alt="Preview"
              sx={{
                maxWidth: "100%",
                maxHeight: 220,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.300",
                objectFit: "contain",
              }}
            />
            <Button
              variant="text"
              color="error"
              onClick={handleRemoveImage}
              sx={{ mt: 1 }}
            >
              Eliminar imagen
            </Button>
          </div>
        </Box>
      ) : (
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.400",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.2s ease",
            bgcolor: isDragActive ? "action.hover" : "transparent",
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body2">
            Arrastra una imagen aquí o haz clic para seleccionar un archivo
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "text.secondary" }}
          >
            Máximo {maxSizeMB} MB. Formatos permitidos: JPG, PNG, WEBP, etc.
          </Typography>
        </Box>
      )}

      {error ? (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block" }}
        >
          {error}
        </Typography>
      ) : null}
    </Box>
  );
};

export default ImageDropzone;
