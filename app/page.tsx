import Home from "@/components/home";
import { StoredValueProvider } from "@/components/stored-value-context";

export default function HomePage() {
  return (
    <StoredValueProvider>
      <Home />
    </StoredValueProvider>
  );
}
