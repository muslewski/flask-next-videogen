export const removeFile = async (fileName: string) => {
  try {
    const response = await fetch(`/api/remove-audio/${fileName}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove audio file");
    }

    const result = await response.json();
    if (result.status === "success") {
      console.log("Audio file removed successfully");
    } else {
      console.error("Error removing audio file:", result.message);
    }
  } catch (error) {
    console.error("Error removing audio file:", error);
  }
};
