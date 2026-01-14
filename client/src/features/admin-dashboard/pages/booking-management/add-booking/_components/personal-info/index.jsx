import { useState } from "react";
import SelectUser from "./select-user";
import AddUserForm from "./user-form";

export default function PersonalInformation({ setFieldValue, getFieldError, formik }) {
  // Stet
  const [newUser, setNewUser] = useState(false);

  return (
    <>
      {newUser ? (
        <AddUserForm
          setFieldValue={setFieldValue}
          formik={formik}
          getFieldError={getFieldError}
          setNewUser={setNewUser}
        />
      ) : (
        <SelectUser setNewUser={setNewUser} setFieldValue={setFieldValue} />
      )}
    </>
  );
}
