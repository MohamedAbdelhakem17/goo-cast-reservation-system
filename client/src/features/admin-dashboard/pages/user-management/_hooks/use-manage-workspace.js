import * as Yup from "yup";
import { useFormik } from "formik";
import { useMangeWorkSpace } from "@/apis/admin/mange-user.api";

export default function useUserManageWorkspace(selectedUser) {
  const { mangeWorkSpace, error, isPending, isSuccess } = useMangeWorkSpace();

  const formik = useFormik({
    initialValues: { name: "", link: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      link: Yup.string().required("Link is required"),
    }),
    onSubmit: (values, formikHelpers) => {
      handleWorkspaceAction(
        {
          user_id: selectedUser._id,
          name: values.name,
          link: values.link,
          action: selectedUser?.workspace ? "update" : "add",
        },
        formikHelpers
      );
    },
  });

  const handleWorkspaceAction = (data, formikHelpers, callbacks = {}) => {
    mangeWorkSpace(data, {
      onSuccess: (res) => {
        formikHelpers.resetForm();
        formikHelpers.setSubmitting(false);
        if (callbacks.onSuccess) callbacks.onSuccess(res);
      },
      onError: (err) => {
        formikHelpers.setSubmitting(false);
        if (callbacks.onError) callbacks.onError(err);
      },
    });
  };

  return { formik, handleWorkspaceAction, error, isPending, isSuccess };
}
