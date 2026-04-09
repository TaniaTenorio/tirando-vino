"use client";

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import ActionsMenu from "./ActionsMenu";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Box,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { getCountryDisplayValue } from "@/utils/countries";

const formatHouseValue = (value) => {
  if (!value) return "";

  return value
    .toString()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const normalizeSelectionModel = (selectionModel) => {
  if (Array.isArray(selectionModel)) return selectionModel;
  if (selectionModel?.ids) return Array.from(selectionModel.ids);
  return [];
};

const WinesTable = ({ initialRows = [] }) => {
  const router = useRouter();
  const [rows, setRows] = React.useState(initialRows);
  const [housesById, setHousesById] = React.useState({});
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isBulkUpdating, setIsBulkUpdating] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [colorFilter, setColorFilter] = React.useState("all");
  const [houseFilter, setHouseFilter] = React.useState("all");
  const [countryFilter, setCountryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const clearFilters = () => {
    setSearchTerm("");
    setColorFilter("all");
    setHouseFilter("all");
    setCountryFilter("all");
    setStatusFilter("all");
  };

  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  React.useEffect(() => {
    let isMounted = true;

    const loadHouses = async () => {
      try {
        const response = await fetch("/api/admin/house");

        if (!response.ok) {
          throw new Error("Failed to load houses");
        }

        const houses = await response.json();

        if (!isMounted) return;

        const mapped = (houses || []).reduce((acc, house) => {
          acc[house.id] = house.name;
          return acc;
        }, {});

        setHousesById(mapped);
      } catch (error) {
        console.error("Error loading houses:", error);
      }
    };

    loadHouses();

    return () => {
      isMounted = false;
    };
  }, []);

  const getHouseDisplayValue = React.useCallback(
    (value) => {
      if (!value) return "";

      if (housesById[value]) {
        return housesById[value];
      }

      return formatHouseValue(value);
    },
    [housesById],
  );

  const handleBulkStatusChange = async (status) => {
    if (selectedIds.length === 0) return;

    setIsBulkUpdating(true);

    try {
      const response = await fetch("/api/admin/wine", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update selected items");
      }

      setRows((currentRows) =>
        currentRows.map((row) =>
          selectedIds.includes(row.id) ? { ...row, status } : row,
        ),
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Error updating selected wines:", error);
      alert("No se pudieron actualizar los elementos seleccionados.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const columns = [
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "color", headerName: "Color", width: 100 },
    { field: "variety", headerName: "Variedad", width: 150 },
    {
      field: "house",
      headerName: "Bodega",
      width: 100,
      valueGetter: (_, row) => getHouseDisplayValue(row.house),
    },
    { field: "region", headerName: "Región", width: 150 },
    {
      field: "country",
      headerName: "País",
      width: 150,
      valueGetter: (_, row) => getCountryDisplayValue(row.country),
    },
    { field: "price", headerName: "Precio", width: 100 },
    { field: "status", headerName: "Estado", width: 100 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => <ActionsMenu row={params.row} type="wine" />,
    },
  ];

  const colorOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.color).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [rows],
  );

  const houseOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.house).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [rows],
  );

  const countryOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.country).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [rows],
  );

  const filteredRows = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const nameMatches = !normalizedSearch
        ? true
        : (row.name || "").toLowerCase().includes(normalizedSearch);
      const colorMatches =
        colorFilter === "all" ? true : (row.color || "") === colorFilter;
      const houseMatches =
        houseFilter === "all" ? true : (row.house || "") === houseFilter;
      const countryMatches =
        countryFilter === "all" ? true : (row.country || "") === countryFilter;
      const statusMatches =
        statusFilter === "all" ? true : (row.status || "") === statusFilter;

      return (
        nameMatches &&
        colorMatches &&
        houseMatches &&
        countryMatches &&
        statusMatches
      );
    });
  }, [rows, searchTerm, colorFilter, houseFilter, countryFilter, statusFilter]);

  const paginationModel = { page: 0, pageSize: 100 };

  return (
    <Box sx={{ width: "100%", marginBottom: "20px" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "50%", md: "25%" },
        }}
      >
        <InputLabel htmlFor="search-input">Buscar por nombre</InputLabel>
        <OutlinedInput
          type="text"
          id="search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Box>
      <Box
        sx={{
          mb: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(5, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        <FormControl size="small">
          <InputLabel id="color-filter-label">Color</InputLabel>
          <Select
            labelId="color-filter-label"
            value={colorFilter}
            label="Color"
            onChange={(event) => setColorFilter(event.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {colorOptions.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel id="house-filter-label">Bodega</InputLabel>
          <Select
            labelId="house-filter-label"
            value={houseFilter}
            label="Bodega"
            onChange={(event) => setHouseFilter(event.target.value)}
          >
            <MenuItem value="all">Todas</MenuItem>
            {houseOptions.map((house) => (
              <MenuItem key={house} value={house}>
                {getHouseDisplayValue(house)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel id="country-filter-label">Pais</InputLabel>
          <Select
            labelId="country-filter-label"
            value={countryFilter}
            label="Pais"
            onChange={(event) => setCountryFilter(event.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {countryOptions.map((country) => (
              <MenuItem key={country} value={country}>
                {getCountryDisplayValue(country)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel id="status-filter-label">Estado</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Estado"
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Activo</MenuItem>
            <MenuItem value="inactive">Inactivo</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            disabled={selectedIds.length === 0 || isBulkUpdating}
            onClick={() => handleBulkStatusChange("inactive")}
          >
            Desactivar seleccionados
          </Button>
          <Button
            variant="outlined"
            color="success"
            disabled={selectedIds.length === 0 || isBulkUpdating}
            onClick={() => handleBulkStatusChange("active")}
          >
            Reactivar seleccionados
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/new/wine")}
        >
          Agregar vino
        </Button>
      </Box>
      <Paper sx={{ height: "600px", width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          rowSelectionModel={{ type: "include", ids: new Set(selectedIds) }}
          onRowSelectionModelChange={(newSelectionModel) =>
            setSelectedIds(normalizeSelectionModel(newSelectionModel))
          }
          getRowClassName={(params) =>
            params.row.status === "inactive" ? "row-inactive" : ""
          }
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[100, 200]}
          checkboxSelection
          sx={{
            border: 0,
            "& .row-inactive .MuiDataGrid-cell": {
              color: "error.main",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default WinesTable;
