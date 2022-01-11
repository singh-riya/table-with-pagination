import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
import { Grid } from "@mui/material";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { getComparator, tranformHeaders } from "../utils";
import AddPassenger from "./AddPassenger";

function ContainerTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [data, setData] = useState({
    columns: [],
    rows: [],
    totalCount: 0,
  });
  const [open, setOpen] = useState(false);
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
          const columns = tranformHeaders(data.data[0] || {});
          setData({
            columns,
            rows: data.data,
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
          severity: "success",
        });
        getData();
      })
      .catch((err) => {
        console.log(err);
        handleClose();
        setOpenSnack({
          show: true,
          message: "Error in adding passenger",
          severity: "error",
        });
      });
  };

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    const searchedRows = data.rows.filter((row) => {
      return Object.keys(row).some((key) =>
        (row[key] || "").toString().toLowerCase().includes(value.toLowerCase())
      );
    });
    setData({
      ...data,
      searchedRows,
    });
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack({
      show: false,
      message: "",
      severity: "",
    });
  };

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <AddPassenger
            addPassenger={addPassenger}
            handleClose={handleClose}
            handleCloseSnack={handleCloseSnack}
            open={open}
            openSnack={openSnack}
            handleOpen={handleOpen}
          />
        </Grid>

        <Grid item>
          <Paper sx={{ width: "100%" }}>
            <EnhancedTableToolbar handleSearch={handleSearch} />
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <EnhancedTableHead
                  columns={data.columns}
                  onRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
                <TableBody>
                  {data.rows
                    .sort(getComparator(order, orderBy))
                    .filter((item) => {
                      if (data.searchedRows) {
                        return data.searchedRows.includes(item);
                      }
                      return true;
                    })
                    .map((row, index) => (
                      <TableRow hover key={index}>
                        {Object.keys(row).map((cell, cIndex) => {
                          if (!Array.isArray(row[cell])) {
                            return (
                              <TableCell key={cIndex}>
                                {row[cell] || "--"}
                              </TableCell>
                            );
                          }
                          return <TableCell key={cIndex}>--</TableCell>;
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
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

export default ContainerTable;
