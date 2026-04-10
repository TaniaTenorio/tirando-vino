"use client";

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import ActionsMenu from "./ActionsMenu";
import { Paper, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const normalizeSelectionModel = (selectionModel) => {
  if (Array.isArray(selectionModel)) return selectionModel;
  if (selectionModel?.ids) return Array.from(selectionModel.ids);
  return [];
};

const HousesTable = ({ initialRows = [] }) => {
  const router = useRouter();
  const [rows, setRows] = React.useState(initialRows);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isBulkUpdating, setIsBulkUpdating] = React.useState(false);

  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const handleBulkStatusChange = async (status) => {
    if (selectedIds.length === 0) return;

    setIsBulkUpdating(true);

    try {
      const response = await fetch("/api/admin/house", {
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
      console.error("Error updating selected houses:", error);
      alert("No se pudieron actualizar los elementos seleccionados.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const columns = [
    { field: "name", headerName: "Nombre", width: 260 },
    { field: "status", headerName: "Estado", width: 120 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => <ActionsMenu row={params.row} type="house" />,
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
            onClick={() => handleBulkStatusChange("inactive")}
          >
            Desactivar seleccionadas
          </Button>
          <Button
            variant="outlined"
            color="success"
            disabled={selectedIds.length === 0 || isBulkUpdating}
            onClick={() => handleBulkStatusChange("active")}
          >
            Reactivar seleccionadas
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/new/house")}
        >
          Agregar bodega
        </Button>
      </Box>
      <Paper sx={{ height: "400px", width: "100%" }}>
        <DataGrid
          rows={rows}
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

export default HousesTable;
