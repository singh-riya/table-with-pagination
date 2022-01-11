import React, { forwardRef } from "react";
import { Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ModalForm from "./ModalForm";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddPassenger = ({
  open,
  handleOpen,
  handleClose,
  handleCloseSnack,
  addPassenger,
  openSnack = {},
}) => {
  return (
    <>
      <Button onClick={handleOpen}>Add Passenger</Button>
      <ModalForm
        open={open}
        handleClose={handleClose}
        addPassenger={addPassenger}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnack.show}
        onClose={handleCloseSnack}
        autoHideDuration={6000}
        message={openSnack.message}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={openSnack.severity}
          sx={{ width: "100%" }}
        >
          {openSnack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPassenger;
