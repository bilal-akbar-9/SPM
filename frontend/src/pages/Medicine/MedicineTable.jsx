import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function medicineTable(medicine) {
  return (
    <TableContainer component={Paper}
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        paddingBottom: "50px",
        marginTop: "30px",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="medicine table">
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "rgb(6, 6, 75)",
            }}
          >
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Medicine ID</TableCell>
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Medicine Name</TableCell>
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Count</TableCell>
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Manufacturer</TableCell>
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Purchase Price</TableCell>
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Price</TableCell>
            <TableCell
              sx={{
                color: "white",
              }}
            >
              side Effects</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {medicine?.length > 0 ? (medicine.map((medicine, index) => (
            <TableRow key={index}>
              <TableCell>{medicine.medicationId}</TableCell>
              <TableCell>{medicine.name}</TableCell>
              {
                medicine.count === 0 ? (
                  <TableCell sx={{ color: "red" }}>
                    <div className='unavailable'>Out of Stock</div>
                  </TableCell>
                ) : (
                    <TableCell sx={{ color: "green" }}>
                      <div className='available'>{medicine.count}</div>
                    </TableCell>
                  )
              }
              {/* <TableCell>{book.bookStatus}</TableCell> */}
              <TableCell>{medicine.manufacturer}</TableCell>
              <TableCell>{medicine.purchasePrice}</TableCell>
              <TableCell>{medicine.price}</TableCell>
              <TableCell>{medicine.sideEffects}</TableCell>
            </TableRow>
          ))) : (
            <TableRow>
              <TableCell>No Medicine available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer >
  );
}


//need to add buttons for edit (use a dialog here) and delete, should be able to find them in other work
