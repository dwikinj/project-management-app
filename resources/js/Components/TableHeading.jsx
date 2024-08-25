import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";

export default function TableHeading({ children,name, sortable = true, sort_field = null, sort_direction = null, onSort = null }) {
  return (
    <th 
      onClick={sortable ? () => onSort(name) : null} 
      className={`px-3 py-2 ${sortable ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUpIcon
              className={
                "w-4 " +
                (sort_field === name && sort_direction === "asc"
                  ? "text-blue-500"
                  : "")
              }
            />
            <ChevronDownIcon
              className={
                "w-4 -mt-2 " +
                (sort_field === name && sort_direction === "desc"
                  ? "text-blue-500"
                  : "")
              }
            />
          </div>
        )}
      </div>
    </th>
  );
}
