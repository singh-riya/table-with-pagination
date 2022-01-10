import { Button, Input, Modal, Paper, Stack, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
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

const ModalForm = ({open, handleClose, addPassenger}) => {
  return (
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
                <Button variant='contained' type='submit'>
                  Submit
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>
    </Modal>
  );
};

export default ModalForm;
