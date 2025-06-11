import React from 'react';

export interface TableRowSkeletonProps {
  columns?: number;
  avatar?: boolean;
}

export default function TableRowSkeleton({ columns = 1, avatar = false }: TableRowSkeletonProps) {
  return (
    <tr className="animate-pulse">
      {avatar && (
        <>
          <td className="p-2">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </td>
          <td className="p-2">
            <div className="h-6 w-20 bg-gray-300 rounded" />
          </td>
        </>
      )}
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="p-2">
          <div className="h-6 w-full bg-gray-300 rounded" />
        </td>
      ))}
    </tr>
  );
}
