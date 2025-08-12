import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero, Packages, BookNow, Studio, Reviews, EmailSuccessfully } from "./_components";

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
    <main className="container mx-auto py-5 my-5">
      <Hero />
      <Packages />
      <BookNow />
      <Studio />
      <Reviews />
      <AnimatePresence>
        {showMessage && (<EmailSuccessfully />)}
      </AnimatePresence>
    </main>
  );
};

export default Home;
