"use client";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function TextfieldName(
  { name, setName, submitName }: { name: string; setName: Function | null; submitName: (name: string) => void }
) {
  const [inName, setInName] = useState<string>(name);

  useEffect(() => {
    setInName(name);
  }, [name]);
  
  return (
    <form
      className="my-4"
      onSubmit={(e) => {
        e.preventDefault();
        submitName(inName);
      }}
    >
      <TextField
        variant="filled"
        label="User Name"
        type="text"
        fullWidth
        margin="normal"
        sx={{
          backgroundColor: "white",
        }}
        value={inName}
        onChange={(e) => {
          setName && setName(e.target.value);
          setInName(e.target.value);
        }}
      />
    </form>
  )
}