import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Hero,
  Packages,
  BookNow,
  Studio,
  Reviews,
  EmailSuccessfully,
} from "./_components";
import RadioButton from "../../../../components/common/radio-button";

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const isActivated = localStorage.getItem("emailActivated");
    if (isActivated === "true") {
      setShowMessage(true);
      localStorage.removeItem("emailActivated");
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }
  }, []);

  return (
    <main className="container mx-auto my-5 py-5">
      <Hero />
      <RadioButton
        label={"active "}
        initialValue={true}
        callback={(value) => {
          console.log(`status is ${value ? "" : "not "}active now`);
        }}
      />

      <RadioButton
        label={"not active "}
        initialValue={false}
        callback={(value) => {
          console.log(`status is ${value ? "" : "not "}active now`);
        }}
      />
      <Packages />
      <BookNow />
      <Studio />
      {/* <Reviews /> */}
      <AnimatePresence>{showMessage && <EmailSuccessfully />}</AnimatePresence>
    </main>
  );
};

export default Home;
