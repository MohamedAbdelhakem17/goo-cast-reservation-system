import { BookingInput, BookingPhoneInput } from "@/components/booking";
import { Button } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.1, duration: 0.4 },
};

export default function AddUserForm({
  setFieldValue,
  formik,
  getFieldError,
  setNewUser,
}) {
  // Localization
  const { t } = useLocalization();

  // Variables
  const { firstName, lastName, phone, email } = formik.values.personalInfo;

  return (
    <>
      {/* Change mode action */}
      <Button onClick={() => setNewUser(false)}>select user</Button>

      {/* Form Input */}
      <motion.div
        {...motionProps}
        className="b-0 m-0 flex w-full flex-col gap-4 lg:flex-row"
      >
        {/* First name */}
        <BookingInput
          className="w-full lg:w-1/2"
          type="text"
          id="firstName"
          label={t("first-name")}
          placeholder={t("enter-your-first-name")}
          errors={getFieldError("personalInfo.firstName")}
          onBlur={(e) => {
            formik.handleBlur(e);
          }}
          onChange={(e) => {
            formik.handleChange(e);
            setFieldValue("personalInfo.firstName", e.target.value);
          }}
          touched={formik.touched.firstName}
          value={firstName}
        />

        {/* Last name */}
        <BookingInput
          className="w-full lg:w-1/2"
          type="text"
          id="lastName"
          label={t("last-name")}
          placeholder={t("enter-your-last-name")}
          errors={getFieldError("personalInfo.lastName")}
          onBlur={(e) => {
            formik.handleBlur(e);
          }}
          onChange={(e) => {
            formik.handleChange(e);
            setFieldValue("personalInfo.lastName", e.target.value);
          }}
          touched={formik.touched.lastName}
          value={lastName}
        />
      </motion.div>

      {/* Email */}
      <motion.div {...motionProps}>
        <BookingInput
          type="text"
          id="email"
          label={t("email")}
          placeholder={t("enter-your-email")}
          errors={getFieldError("personalInfo.email")}
          onBlur={(e) => {
            formik.handleBlur(e);
          }}
          onChange={(e) => {
            formik.handleChange(e);
            setFieldValue("personalInfo.email", e.target.value);
          }}
          touched={formik.touched.email}
          value={email}
        />
      </motion.div>

      {/* Phone number */}
      <motion.div {...motionProps} className="b-0 m-0 w-full">
        <BookingPhoneInput
          label={t("phone-number")}
          value={phone}
          onChange={(value) => setFieldValue("personalInfo.phone", value)}
          onBlur={() => formik.handleBlur({ target: { name: "personalInfo.phone" } })}
          errors={formik.errors.personalInfo?.phone}
          touched={formik.touched.personalInfo?.phone}
        />
      </motion.div>
    </>
  );
}
