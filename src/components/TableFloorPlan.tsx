"use client";

import React from "react";

interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  isVipLounge: boolean;
  isAvailable: boolean;
  location: string;
}

interface TableFloorPlanProps {
  tables: Table[];
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
  bookingDate: string;
}

function getTableShape(capacity: number): string {
  if (capacity <= 2) return "w-16 h-16 rounded-full";
  if (capacity <= 4) return "w-20 h-20 rounded-lg";
  return "w-28 h-20 rounded-xl";
}

function getCapacityLabel(capacity: number): string {
  if (capacity <= 2) return "2";
  if (capacity <= 4) return "4";
  if (capacity <= 6) return "6";
  if (capacity <= 8) return "8";
  return "10";
}

function PeopleIcons({ count }: { count: number }) {
  const icons = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    icons.push(
      <svg
        key={i}
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    );
  }
  return <div className="flex flex-wrap justify-center gap-0.5">{icons}</div>;
}

function TableBox({
  table,
  isSelected,
  onSelectTable,
}: {
  table: Table;
  isSelected: boolean;
  onSelectTable: (tableId: string) => void;
}) {
  const shapeClass = getTableShape(table.capacity);

  let bgClass = "";
  let borderClass = "";
  let cursorClass = "";
  let extraClasses = "";

  if (!table.isAvailable) {
    bgClass = "bg-red-800/80";
    borderClass = "border-2 border-red-500";
    cursorClass = "cursor-not-allowed";
    extraClasses = "opacity-70";
  } else if (isSelected) {
    bgClass = "bg-[#C9992E]/20";
    borderClass = "border-2 border-[#C9992E]";
    cursorClass = "cursor-pointer";
    extraClasses = "animate-pulse shadow-[0_0_15px_rgba(201,153,46,0.5)]";
  } else {
    bgClass = "bg-green-700/80";
    borderClass = "border-2 border-green-400";
    cursorClass = "cursor-pointer";
  }

  const handleClick = () => {
    if (table.isAvailable) {
      onSelectTable(table.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!table.isAvailable}
      className={`relative flex flex-col items-center justify-center ${shapeClass} ${bgClass} ${borderClass} ${cursorClass} ${extraClasses} transition-all duration-300 hover:scale-105`}
    >
      <span className="text-sm font-bold text-white">{table.tableNumber}</span>
      <div className="text-yellow-200 mt-0.5">
        <PeopleIcons count={table.capacity} />
      </div>
      <span className="text-[10px] text-white/70 mt-0.5">
        {getCapacityLabel(table.capacity)} seats
      </span>
      {!table.isAvailable && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-red-200 bg-red-900/50 rounded-lg">
          Reserved
        </span>
      )}
      {isSelected && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#C9992E] rounded-full flex items-center justify-center text-xs font-bold text-white">
          ✓
        </span>
      )}
    </button>
  );
}

export default function TableFloorPlan({
  tables,
  selectedTableId,
  onSelectTable,
  bookingDate,
}: TableFloorPlanProps) {
  const mainHallTables = tables.filter((t) => !t.isVipLounge);
  const vipLoungeTables = tables.filter((t) => t.isVipLounge);

  const mainHallByCapacity: Record<number, Table[]> = {};
  mainHallTables.forEach((t) => {
    const key = t.capacity;
    if (!mainHallByCapacity[key]) mainHallByCapacity[key] = [];
    mainHallByCapacity[key].push(t);
  });

  const vipByCapacity: Record<number, Table[]> = {};
  vipLoungeTables.forEach((t) => {
    const key = t.capacity;
    if (!vipByCapacity[key]) vipByCapacity[key] = [];
    vipByCapacity[key].push(t);
  });

  return (
    <div className="w-full rounded-2xl bg-[#F7EEDD] p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#6E1423]">
          Restaurant Floor Plan
        </h2>
        <span className="text-sm text-[#6E1423]/70">
          {bookingDate
            ? new Date(bookingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Select a date"}
        </span>
      </div>

      <div className="flex gap-2 mb-6 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-600 border border-green-400" />
          <span className="text-[#241A12]">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-700 border border-red-500" />
          <span className="text-[#241A12]">Reserved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#C9992E]/30 border-2 border-[#C9992E]" />
          <span className="text-[#241A12]">Selected</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#6E1423]/30" />
          <h3 className="text-lg font-semibold text-[#6E1423] tracking-wide">
            Main Hall
          </h3>
          <div className="h-px flex-1 bg-[#6E1423]/30" />
        </div>

        {Object.keys(mainHallByCapacity).length === 0 ? (
          <p className="text-center text-[#6E1423]/50 py-8">
            No tables available in the Main Hall
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(mainHallByCapacity)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([capacity, group]) => (
                <div key={capacity}>
                  <h4 className="text-sm font-medium text-[#6E1423]/70 mb-3 uppercase tracking-wider">
                    {getCapacityLabel(Number(capacity))} Seater
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {group.map((table) => (
                      <TableBox
                        key={table.id}
                        table={table}
                        isSelected={selectedTableId === table.id}
                        onSelectTable={onSelectTable}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="bg-[#241A12] rounded-xl p-6 shadow-inner border border-[#C9992E]/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#C9992E]/40" />
          <h3 className="text-lg font-semibold text-[#C9992E] tracking-wide flex items-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            VIP Lounge
          </h3>
          <div className="h-px flex-1 bg-[#C9992E]/40" />
        </div>

        {vipLoungeTables.length === 0 ? (
          <p className="text-center text-[#C9992E]/50 py-8">
            No VIP tables available
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(vipByCapacity)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([capacity, group]) => (
                <div key={capacity}>
                  <h4 className="text-sm font-medium text-[#C9992E]/70 mb-3 uppercase tracking-wider">
                    {getCapacityLabel(Number(capacity))} Seater
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {group.map((table) => (
                      <TableBox
                        key={table.id}
                        table={table}
                        isSelected={selectedTableId === table.id}
                        onSelectTable={onSelectTable}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}