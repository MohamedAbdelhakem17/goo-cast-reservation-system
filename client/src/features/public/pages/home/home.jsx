import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BookNow, EmailSuccessfully, Hero, Packages } from "./_components";

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    localStorage.removeItem("bookingConfirmation");
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
    <main className="container mx-auto my-5 py-5 dark:bg-gray-950">
      <Hero />
      <Packages />
      <BookNow />
      {/* <Studio /> */}
      {/* <Reviews /> */}
      <AnimatePresence>{showMessage && <EmailSuccessfully />}</AnimatePresence>
    </main>
  );
};

export default Home;
