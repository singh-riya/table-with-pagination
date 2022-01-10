import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import {
  Button,
  Grid,
  Snackbar,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import ModalForm from "./ModalForm";
import Pagination from "./Pagination";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ContainerTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState({
    columns: [],
    rows: [],
    totalCount: 0,
  });
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getData = async (config) => {
    let offset = page;
    let limit = rowsPerPage;
    if (config?.page) offset = config.page;
    if (config?.rowsPerPage) limit = config.rowsPerPage;

    await axios
      .get("https://api.instantwebtools.net/v1/passenger", {
        params: {
          page: offset,
          size: limit,
        },
      })
      .then(({ data }) => {
        if ((data?.data || []).length) {
          const columns = Object.keys(data.data[0] || {});
          setData({
            columns,
            rows: data.data.map((row) => Object.values(row)),
            totalCount: data?.totalPages,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
    getData({
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    getData({
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  const addPassenger = async (values) => {
    await axios
      .post("https://api.instantwebtools.net/v1/passenger", values)
      .then((_response) => {
        handleClose();
        setOpenSnack({
          show: true,
          message: "Passenger added successfully",
          severity: "success"
        });
        getData();
      })
      .catch((err) => {
        console.log(err);
        handleClose();
        setOpenSnack({
          show: true,
          message: "Error in adding passenger",
          severity: "error"
        });
      });
  };

  return (
    <>
      <Grid container direction='column'>
        <Grid item>
          <Button onClick={handleOpen}>Add Passenger</Button>
          <ModalForm
            open={open}
            handleClose={handleClose}
            addPassenger={addPassenger}
          />        
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openSnack.show}
            onClose={() => setOpenSnack({ show: false, message: '' })}
            autoHideDuration={6000}
            message={openSnack.message}
          >
            <Alert onClose={() => setOpenSnack({ show: false, message: '' })} severity={openSnack.severity} sx={{ width: '100%' }} >
              {openSnack.message}
            </Alert>
          </Snackbar>
        </Grid>

        <Grid item>
          <Paper sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {data.columns.map((key, index) => {
                      console.log({ key, index });
                      return <TableCell key={index}>{key}</TableCell>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.rows.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        {row.map((cell, index) => {
                          if (!Array.isArray(cell)) {
                            return (
                              <TableCell key={index}>{cell || "--"}</TableCell>
                            );
                          }
                          return <TableCell key={index}>--</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              rowsPerPage={rowsPerPage}
              page={page}
              totalCount={data.totalCount}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              count={data.totalCount}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
