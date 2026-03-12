import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import winesList from "@/app/database.json";
import ActionsMenu from "./ActionsMenu";
import { Paper, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const WinesTable = () => {
  const router = useRouter();
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "color", headerName: "Color", width: 100 },
    { field: "variety", headerName: "Variedad", width: 150 },
    { field: "house", headerName: "Bodega", width: 100 },
    { field: "region", headerName: "Región", width: 150 },
    { field: "country", headerName: "País", width: 150 },
    { field: "price", headerName: "Precio", width: 100 },
    { field: "state", headerName: "Estado", width: 100 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => <ActionsMenu row={params.row} type="wine" />,
    },
  ];
  const rows = winesList;
  const paginationModel = { page: 0, pageSize: 100 };

  return (
    <Box sx={{ width: "100%", marginBottom: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
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
