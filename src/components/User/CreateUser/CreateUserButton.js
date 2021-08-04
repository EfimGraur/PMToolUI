import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import CustomButton from "../../../CustomButtons/Button";
import CreateUserDialog from "./CreateUserDialog"; 

const CreateAccountButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Account created successfully
        </Alert>
      </Snackbar>
      <CustomButton
        color="info"
        onClick={() => setIsOpen(true)}
        className="t-create-account_button"
      >
        Create Account
      </CustomButton>
      {isOpen && (
        <CreateAccountDialog
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            setShowSuccess(true);
          }}
        />
      )}
    </>
  );
}

export default CreateAccountButton;