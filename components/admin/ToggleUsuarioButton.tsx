"use client";

import { useState } from "react";

type ToggleUsuarioButtonProps = {
  id: string;
  active: boolean;
};

export default function ToggleUsuarioButton({
  id,
  active,
}: ToggleUsuarioButtonProps) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    await fetch(`/api/usuarios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-medium text-wood-600 hover:text-wood-700 disabled:opacity-60"
    >
      {active ? "Desativar" : "Ativar"}
    </button>
  );
}
