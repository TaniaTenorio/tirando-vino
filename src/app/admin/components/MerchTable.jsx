import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import merchList from "@/app/merchdb.json";
import ActionsMenu from "./ActionsMenu";
import { Paper, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const MerchTable = () => {
  const router = useRouter();
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "variety", headerName: "Variedad", width: 150 },
    { field: "price", headerName: "Precio", width: 100 },
    { field: "state", headerName: "Estado", width: 100 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => <ActionsMenu row={params.row} type="merch" />,
    },
  ];
  const rows = merchList;
  const paginationModel = { page: 0, pageSize: 100 };

  return (
    <Box sx={{ width: "100%", marginBottom: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
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

export default MerchTable;
