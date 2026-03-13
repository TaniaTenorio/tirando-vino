import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import winesList from "@/app/database.json";
import ActionsMenu from "./ActionsMenu";
import { Paper, Box, Button } from "@mui/material";
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

const WinesTable = () => {
  const router = useRouter();
  const [rows, setRows] = React.useState(winesList);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isBulkUpdating, setIsBulkUpdating] = React.useState(false);

  const handleBulkStateChange = async (state) => {
    if (selectedIds.length === 0) return;

    setIsBulkUpdating(true);

    try {
      const response = await fetch("/api/admin/wine", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds, state }),
      });

      if (!response.ok) {
        throw new Error("Failed to update selected items");
      }

      setRows((currentRows) =>
        currentRows.map((row) =>
          selectedIds.includes(row.id) ? { ...row, state } : row,
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
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "color", headerName: "Color", width: 100 },
    { field: "variety", headerName: "Variedad", width: 150 },
    {
      field: "house",
      headerName: "Bodega",
      width: 100,
      valueGetter: (_, row) => formatHouseValue(row.house),
    },
    { field: "region", headerName: "Región", width: 150 },
    {
      field: "country",
      headerName: "País",
      width: 150,
      valueGetter: (_, row) => getCountryDisplayValue(row.country),
    },
    { field: "price", headerName: "Precio", width: 100 },
    { field: "state", headerName: "Estado", width: 100 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => <ActionsMenu row={params.row} type="wine" />,
    },
  ];
  const paginationModel = { page: 0, pageSize: 100 };

  return (
    <Box sx={{ width: "100%", marginBottom: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            disabled={selectedIds.length === 0 || isBulkUpdating}
            onClick={() => handleBulkStateChange("inactive")}
          >
            Desactivar seleccionados
          </Button>
          <Button
            variant="outlined"
            color="success"
            disabled={selectedIds.length === 0 || isBulkUpdating}
            onClick={() => handleBulkStateChange("active")}
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
          rows={rows}
          columns={columns}
          rowSelectionModel={{ type: "include", ids: new Set(selectedIds) }}
          onRowSelectionModelChange={(newSelectionModel) =>
            setSelectedIds(normalizeSelectionModel(newSelectionModel))
          }
          getRowClassName={(params) =>
            params.row.state === "inactive" ? "row-inactive" : ""
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
