import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import winesList from "@/app/database.json";
import ActionsMenu from "./ActionsMenu";
import { Paper } from "@mui/material";

const WinesTable = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "color", headerName: "Color", width: 100 },
    { field: "variety", headerName: "Variedad", width: 150 },
    { field: "house", headerName: "Bodega", width: 100 },
    { field: "region", headerName: "Región", width: 150 },
    { field: "country", headerName: "País", width: 150 },
    { field: "price", headerName: "Precio", width: 100 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: () => <ActionsMenu />,
    },
  ];
  const rows = winesList;
  const paginationModel = { page: 0, pageSize: 100 };

  return (
    <Paper sx={{ height: "600px", width: "100%", marginBottom: "20px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[100, 200]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default WinesTable;
