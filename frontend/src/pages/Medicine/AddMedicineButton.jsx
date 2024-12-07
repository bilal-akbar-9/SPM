import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useState } from "react";
import "./AddMedicineButton.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMedicineButton() {
  const [medicationId, setMedicationId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [sideEffects, setSideEffects] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setMedicationId("");
    setName("");
    setDescription("");
    setManufacturer("");
    setPurchasePrice(0);
    setPrice(0);
    setSideEffects("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/pharmacy-api/medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicationId,
          name,
          description,
          manufacturer,
          purchasePrice,
          price,
          sideEffects,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        showNotification("Medicine added successfully!", "success");
        handleClose();
      } else {
        showNotification("Failed to add medicine.", "error");
        handleClose();
      }
    } catch (err) {
      console.error(err);
      showNotification("An error occurred.", "error");
      handleClose();
    }
  };

  const showNotification = (message, type) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
    } else if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        + Add Medicine
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>{"Add a New Medicine"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <div className="form-field">
              <label>Medication ID</label>
              <input
                type="text"
                value={medicationId}
                onChange={(e) => setMedicationId(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Purchase Price</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="form-field">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="form-field">
              <label>Side Effects</label>
              <textarea
                value={sideEffects}
                onChange={(e) => setSideEffects(e.target.value)}
                placeholder="Enter any side effects"
                required
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleFormSubmit}>Add Medicine</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
