import React from 'react';

const SkeletonLoader = ({ rows = 5, cols = 6 }) => {
  return (
    <tbody className="divide-y divide-slate-800 animate-pulse">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="hover:bg-slate-800/20">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default SkeletonLoader;
