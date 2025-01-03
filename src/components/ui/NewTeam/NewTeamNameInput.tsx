import { Input } from "@nextui-org/react";

export default function TeamCodeInput() {
  return (
    <Input
      type="text"
      placeholder="New Team Name"
      size="sm"
      radius="lg"
      color="default"
      className="w-64 mx-2 text-white"
    />
  );
}
