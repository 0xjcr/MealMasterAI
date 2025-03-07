import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { submitForm, getAll } from "../api.service.js";
import { DietContext } from "../App";
import { Diet } from "../components/DietDisplay";

interface DietProviderProps {
  children: React.ReactNode;
}

const DietProvider: React.FC<DietProviderProps> = ({ children }) => {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastCreatedDiet, setLastCreatedDiet] = useState<Diet | null>(null);

  const { user, isAuthenticated } = useAuth0();

  const handleMealSubmit = async (
    formData: FormData,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    try {
      const userEmail = isAuthenticated && user ? user.email : null;
      const auth0Id = isAuthenticated && user ? user.sub : null;
      const userName = isAuthenticated && user ? user.name : null;
      const userPic = isAuthenticated && user ? user.picture : null;

      const generatedDiet = await submitForm(
        formData,
        auth0Id,
        userEmail,
        userName,
        userPic
      );

      setDiets((prevDiets) => [...prevDiets, generatedDiet]);
      setLastCreatedDiet(generatedDiet);
      if (onSuccess) {
        setIsLoading(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    fetchDiets();
  }, []);

  const fetchDiets = async () => {
    setIsLoading(true);
    const diets = await getAll();
    setDiets(diets);
    setIsLoading(false);
  };

  return (
    <DietContext.Provider
      value={{ diets, setDiets, handleMealSubmit, isLoading, lastCreatedDiet }}
    >
      {children}
    </DietContext.Provider>
  );
};

export default DietProvider;
