export const removeFile = async (
  fileName: string,
  type: "video" | "audio" | "output"
) => {
  try {
    const response = await fetch(`/api/remove-${type}/${fileName}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to remove ${type} file`);
    }

    const result = await response.json();
    if (result.status === "success") {
      console.log(`File ${type} removed successfully`);
    } else {
      console.error(`Error removing ${type} file:`, result.message);
    }
  } catch (error) {
    console.error(`Error removing ${type} file:`, error);
  }
};
