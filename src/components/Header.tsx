import { type HeaderProps } from "../types/types.js";
import Logo from "./Logo.tsx";
import TempUnits from "./TempUnits.tsx";

function Header({ selectedUnit, setSelectedUnit }: HeaderProps) {
  return (
    <header className="flex justify-between items-center">
      <Logo />
      <TempUnits
        setSelectedUnit={setSelectedUnit}
        selectedUnit={selectedUnit}
      />
    </header>
  );
}

export default Header;
