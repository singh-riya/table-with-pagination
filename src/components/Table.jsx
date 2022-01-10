import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import {
  Button,
  Grid,
  Modal,
  Typography,
  Input,
  Stack,
  Snackbar,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  trips: Yup.number().required("Required"),
  airline: Yup.number().required("Required"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ColumnGroupingTable() {
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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Paper sx={style}>
              <h1>Add Passenger Details</h1>
              <Formik
                initialValues={{
                  name: "",
                  trips: "",
                  airline: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                  addPassenger(values);
                }}
              >
                {({ errors, touched, handleChange }) => (
                  <Form>
                    <Stack sx={{ width: "100%" }} spacing={2}>
                      <Input
                        onChange={handleChange}
                        component={Field}
                        name='name'
                        placeholder='Name'
                      />
                      {errors.name && touched.name ? (
                        <Typography color='error' variant='caption'>
                          {errors.name}
                        </Typography>
                      ) : null}
                      <Input
                        onChange={handleChange}
                        component={Field}
                        name='trips'
                        type='number'
                        placeholder='Trips'
                      />
                      {errors.trips && touched.trips ? (
                        <Typography color='error' variant='caption'>
                          {errors.trips}
                        </Typography>
                      ) : null}
                      <Input
                        onChange={handleChange}
                        component={Field}
                        name='airline'
                        type='number'
                        placeholder='Airline'
                      />
                      {errors.airline && touched.airline ? (
                        <Typography color='error' variant='caption'>
                          {errors.airline}
                        </Typography>
                      ) : null}
                      <Button variant='contained' type='submit'>Submit</Button>

                    </Stack>
                  </Form>
                )}
              </Formik>
            </Paper>
          </Modal>
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
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component='div'
              count={data.totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
