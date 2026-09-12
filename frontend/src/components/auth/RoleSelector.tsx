import { roleOptions } from "../../data/roleOptions";
import type { AuthRole } from "../../types/auth";
import RoleCard from "./RoleCard";

interface RoleSelectorProps {
  selectedRoleId: AuthRole | null;
  onSelect: (roleId: AuthRole) => void;
}

const RoleSelector = ({ selectedRoleId, onSelect }: RoleSelectorProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      role="radiogroup"
      aria-label="I'm a mentee or a mentor"
    >
      {roleOptions.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          isSelected={role.id === selectedRoleId}
          onSelect={() => onSelect(role.id)}
        />
      ))}
    </div>
  );
};

export default RoleSelector;
