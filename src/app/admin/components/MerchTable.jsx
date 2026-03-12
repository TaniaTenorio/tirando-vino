import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import merchList from "@/app/merchdb.json";
import ActionsMenu from "./ActionsMenu";
import { Paper } from "@mui/material";

const MerchTable = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "variety", headerName: "Variedad", width: 150 },
    { field: "price", headerName: "Precio", width: 100 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: () => <ActionsMenu />,
    },
  ];
  const rows = merchList;
  const paginationModel = { page: 0, pageSize: 100 };

  return (
    <Paper sx={{ height: "400px", width: "100%", marginBottom: "20px" }}>
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

export default MerchTable;
