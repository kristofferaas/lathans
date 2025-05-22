"use client";

import { Button } from "@/components/ui/button";
import { api } from "@convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { FileUp, Upload, CheckCircle2 } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { Id } from "@convex/_generated/dataModel";

export interface UploadScreenshotOnboardingProps {
  onSubmit: (storageId: string | null) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  existingScreenshotStorageId?: Id<"_storage"> | null;
}

export function UploadScreenshotOnboarding({
  onSubmit,
  isLoading,
  errorMessage,
  existingScreenshotStorageId,
}: UploadScreenshotOnboardingProps) {
  // const { user } = useUser(); // Example: Get user from Clerk
  const userId = "placeholder-user-id"; // TODO: Replace with actual user ID from your auth provider

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedStorageId, setUploadedStorageId] = useState<string | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasExistingScreenshot, setHasExistingScreenshot] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const analyzeImage = useAction(
    api.extractLoanInfoFromScreenshot.analyzeImageAndGetLoanDetails,
  );
  const saveLoanDetails = useMutation(api.onboarding.saveAnalyzedLoanDetails);

  useEffect(() => {
    if (existingScreenshotStorageId) {
      setUploadedStorageId(existingScreenshotStorageId);
      setHasExistingScreenshot(true);
    }
  }, [existingScreenshotStorageId]);

  // Helper function to convert a File to a PNG Blob
  const convertToPngClientSide = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            return reject(new Error("Failed to get canvas context"));
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas toBlob returned null"));
              }
            },
            "image/png",
            1, // qualityArgument (1 for best quality)
          );
        };
        img.onerror = (err) => reject(err);
        if (event.target?.result && typeof event.target.result === "string") {
          img.src = event.target.result;
        } else {
          reject(new Error("FileReader did not produce a valid image source."));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File) => {
    if (!file) return;
    if (!userId) {
      console.error("User ID is not available. Cannot save loan details.");
      setUploadError("User ID is not available.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadedStorageId(null);

    try {
      const postUrl = await generateUploadUrl();

      // Convert file to PNG before uploading
      const pngBlob = await convertToPngClientSide(file);

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "image/png" }, // Explicitly set to image/png
        body: pngBlob, // Upload the PNG blob
      });
      const json = await result.json();
      if (!result.ok) {
        const errorMsg = json.error || `Upload failed: ${result.statusText}`;
        console.error(errorMsg, json);
        setUploadError(errorMsg);
        throw new Error(errorMsg);
      }
      const storageId = json.storageId as Id<"_storage">;
      setUploadedStorageId(storageId);

      if (storageId) {
        console.log("Attempting to analyze image with storageId:", storageId);
        try {
          const analysisResult = await analyzeImage({ storageId });
          console.log("Image analysis result:", analysisResult);

          // Save the analyzed details to Convex
          await saveLoanDetails({
            screenshotStorageId: storageId,
            loanName: analysisResult.loanName,
            remainingLoanAmount: analysisResult.remainingLoanAmount,
            nominalInterestRate: analysisResult.nominalInterestRate,
          });
          console.log("Loan details saved to Convex via onboarding mutation.");
        } catch (analysisOrSaveError) {
          console.error(
            "Error analyzing image or saving details:",
            analysisOrSaveError,
          );
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError(
        error instanceof Error ? error.message : "Unknown upload error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    setUploadedStorageId(null);
    setUploadError(null);
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    } else {
      handleFileSelected(null);
    }
  };

  const handleProceed = async () => {
    if (selectedFile && !uploadedStorageId && !isUploading) {
      // Ensure uploadFile completes if a new file was selected but not yet uploaded
      await uploadFile(selectedFile);
    }
    // This onSubmit is for the parent component's logic, e.g., navigating to the next step.
    // It's called regardless of whether a new file was uploaded in this step, or if the user is skipping.
    onSubmit(uploadedStorageId as Id<"_storage"> | null);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 text-center">
      <h3 className="text-2xl font-semibold">Steg 2 av 4</h3>
      <h1 className="text-6xl font-bold italic">
        Last opp skjermbilde (valgfritt)
      </h1>
      <p className="text-xl font-normal">
        For å gjøre det enklere, kan du laste opp et skjermbilde av
        lånedetaljene dine. Dette steget er valgfritt.
      </p>

      {/* Upload Area */}
      <div
        className={`w-full max-w-md rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <FileUp className="text-primary h-12 w-12" />
          <p className="text-lg font-medium">Slipp skjermbildet ditt her</p>
          <p className="text-sm text-gray-500">
            {selectedFile
              ? selectedFile.name
              : "eller klikk for å bla gjennom filer"}
          </p>
          <input
            type="file"
            className="hidden"
            id="screenshot-upload-step2"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            type="button"
            className="mt-4"
            onClick={() =>
              document.getElementById("screenshot-upload-step2")?.click()
            }
            disabled={isUploading || isLoading}
          >
            {isUploading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />{" "}
                Laster opp...
              </>
            ) : hasExistingScreenshot ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Bildet
                er lastet opp
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Bla gjennom filer
              </>
            )}
          </Button>
          {uploadError && (
            <p className="mt-2 text-sm text-red-500">Feil: {uploadError}</p>
          )}
          {uploadedStorageId &&
            !uploadError &&
            !isUploading &&
            !hasExistingScreenshot && (
              <p className="mt-2 text-sm text-green-500">
                Skjermbilde lastet opp!
              </p>
            )}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleProceed}
        disabled={isLoading || isUploading}
        className="w-52"
      >
        {uploadedStorageId ? "Gå videre" : "Hopp over"}
      </Button>

      {errorMessage && (
        <p className="text-destructive text-sm font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
