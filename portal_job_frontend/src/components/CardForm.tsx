import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  // SelectContent,
  // SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";

// HTML Types elements
import { ChangeEvent, FormEvent, useState } from "react";

// PDF view and creator functions
import { PDFViewer } from "@react-pdf/renderer";
import PdfDocument from "./PDFExport";

// Loading animations
import CircleLoader from "react-spinners/CircleLoader";

const CardForm = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [data, setData] = useState([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    if (id === "pageNumber" && /^\d+$/.test(value)) {
      const pageNumber = parseInt(value)
      if (pageNumber > 0 && pageNumber < 26) { setPageNumber(pageNumber) }
    }
  };

  const axiosInstance = axios.create({
    timeout: 10000000, // Set timeout to 300 seconds
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSuccess(false)
      setIsLoading(true);

      const response = await axiosInstance.post("https://portal-job-scraping.vercel.app/get-pdf", {
        pageNumber: pageNumber,
      });

      if (response.data) {
        const { jobLists } = response.data;

        setIsSuccess(true)
        setData(jobLists);
      }

      setIsLoading(false);

      setTimeout(() => {
        setIsSuccess(false)
      }, 1600)
    } catch (error) {
      console.error(`Error: ${error}`);
      setIsLoading(false);
      setIsSuccess(false)
    }
  };

  return (
    <div className="p-10 flex justify-center items-center h-screen flex-row gap-10">
      <Card className="w-[400px] max-h-[350px]">
        <CardHeader>
          <CardTitle>Découvrez de nouvelles opportunités</CardTitle>
          <CardDescription>
            Explorez les dernières offres d'emploi disponibles sur{" "}
            <strong>PortalJob</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="pageNumber">Nombre de pages</Label>
                <Input
                  type="number"
                  id="pageNumber"
                  min={1}
                  max={25}
                  placeholder="Entrez le nombre de pages souhaité (0 à 99)"
                  onChange={handleInputChange}
                  value={pageNumber}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="jobType">Type d'emploi</Label>
                <Select>
                  <SelectTrigger id="jobType" disabled>
                    <SelectValue placeholder="Informatique / Web" />
                  </SelectTrigger>
                  {/* <SelectContent position="popper">
                    <SelectItem value="informatique-web" >Informatique / Web</SelectItem>
                  </SelectContent> */}
                </Select>
              </div>
            </div>
            <Button
              className={`w-full mt-6 ${isSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading && !isSuccess && (
                <>
                  <CircleLoader className="mr-2" color="#ffffff" size={15} speedMultiplier={0.7} />
                  <span>Récupérations des emplois...</span>
                </>
              )}
              {isSuccess && !isLoading && (
                <>
                  <span>Récupération avec succès...</span>
                </>
              )}
              {!isSuccess && !isLoading && (
                <>
                  <span>Trouver de nouvelles opportunités</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="h-full">
        {data.length > 0 && (
          <PDFViewer className="w-[600px] h-[600px]">
            <PdfDocument data={data} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
};

export default CardForm;
