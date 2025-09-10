import { Input } from "@/components/common";

export default function UserSearch({ setSearchTerm, searchTerm }) {
  return (
    <div className="relative mb-6 w-full">
      <Input
        type="text"
        placeholder="Search users..."
        className="border-main w-full rounded-md border py-2 pr-4 pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <i className="fas fa-search absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"></i>
    </div>
  );
}
