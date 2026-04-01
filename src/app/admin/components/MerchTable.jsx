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

const MerchTable = () => {
  const router = useRouter();
  const [rows, setRows] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isBulkUpdating, setIsBulkUpdating] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/merch")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch merch data");
        return res.json();
      })
      .then((data) => setRows(data))
      .catch((err) => console.error("Error loading merch data:", err));
  }, []);

  const handleBulkStatusChange = async (status) => {
    if (selectedIds.length === 0) return;

    setIsBulkUpdating(true);

    try {
      const response = await fetch("/api/admin/merch", {
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
      console.error("Error updating selected merch items:", error);
      alert("No se pudieron actualizar los elementos seleccionados.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const columns = [
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "variety", headerName: "Variedad", width: 150 },
    { field: "price", headerName: "Precio", width: 100 },
    { field: "status", headerName: "Estado", width: 100 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => <ActionsMenu row={params.row} type="merch" />,
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
          onClick={() => router.push("/admin/new/merch")}
        >
          Agregar merch
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

export default MerchTable;
