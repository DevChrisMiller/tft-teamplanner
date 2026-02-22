import { Input } from "@nextui-org/react";

interface Props {
  value: string;
  onChange: (name: string) => void;
}

export default function NewTeamNameInput({ value, onChange }: Props) {
  return (
    <Input
      type="text"
      placeholder="Team name..."
      size="sm"
      radius="lg"
      color="default"
      className="w-64 mx-2 text-white"
      value={value}
      onValueChange={onChange}
      maxLength={40}
    />
  );
}
