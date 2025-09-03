import { Input } from '@/components/common';

export default function UserSearch(setSearchTerm, searchTerm) {
    return (
        <div className="relative mb-6 w-full max-w-xs">
            <Input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-main rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
    )
}
