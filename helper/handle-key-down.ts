export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
  handleSubmit: () => void
) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};
