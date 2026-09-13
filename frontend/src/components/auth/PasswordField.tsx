import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  name: string;
  helperText?: string;
}

const PasswordField = ({ id, name, helperText }: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        Password
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          required
          minLength={8}
          placeholder="Create a secure password"
          className="w-full rounded-xl border border-surface-line px-4 py-3 pr-11 text-sm text-ink placeholder:text-ink/35 focus:border-ink"
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {helperText && <p className="mt-1.5 text-xs text-surface-muted">{helperText}</p>}
    </div>
  );
};

export default PasswordField;
