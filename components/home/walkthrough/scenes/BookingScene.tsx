"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Star, Wrench, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { DEMO_DATA } from "../walkthrough.config";

interface BookingSceneProps {
  onActionClick: () => void;
}

export default function BookingScene({ onActionClick }: BookingSceneProps) {
  const { booking, vehicle } = DEMO_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col justify-between py-1 text-zinc-900 overflow-y-auto"
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 flex-shrink-0">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-1.5 sm:px-2 py-0.5 rounded-md">
              Authorized Service Center
            </span>
          </div>
          <h2 className="text-sm sm:text-lg font-bold text-zinc-900 mt-0.5 truncate">{booking.facility}</h2>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-amber-100">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-[11px] sm:text-xs font-bold text-amber-950">{booking.rating}</span>
          <span className="text-[10px] sm:text-xs text-zinc-500 hidden xs:inline">({booking.reviews})</span>
        </div>
      </div>

      {/* ── Service & Garage Detail Card ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-auto py-1 sm:py-2">
        {/* Left: Garage Info */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-900 mb-1">
              <Wrench className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="truncate">{booking.serviceName}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-zinc-400 flex-shrink-0" /> Ring Road Hub · 2.4 km away
            </p>

            <div className="mt-3 p-2.5 sm:p-3.5 bg-white rounded-xl border border-zinc-200/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 font-medium">Technician Labor</span>
                <span className="font-bold text-zinc-900 font-mono text-xs sm:text-sm">Rs. {booking.laborCost.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Includes 24-point safety inspection</div>
            </div>
          </div>

          <div className="text-[10px] sm:text-xs text-emerald-700 flex items-center gap-1 mt-3 pt-2.5 border-t border-zinc-200/60 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>30-day / 1,000 km warranty included</span>
          </div>
        </div>

        {/* Right: Slot Picker */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" /> Select Appointment Slot
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                Fast Track
              </span>
            </div>

            {/* Date Pill */}
            <div className="bg-orange-50/70 border border-orange-400 rounded-xl p-2.5 mb-2.5 flex items-center justify-between shadow-2xs">
              <div className="text-xs font-bold text-zinc-900">{booking.displayDate}</div>
              <span className="text-[9px] font-bold text-orange-600 bg-white px-2 py-0.5 rounded-md">
                Recommended
              </span>
            </div>

            {/* Time Slot Selector */}
            <div className="grid grid-cols-3 gap-1.5">
              {["09:00 AM", "10:00 AM", "02:00 PM"].map((slot) => {
                const isSelected = slot === booking.time;
                return (
                  <div
                    key={slot}
                    className={`text-center py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-orange-500 text-white shadow-xs border border-orange-600"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    <Clock className="w-3 h-3 mx-auto mb-0.5 opacity-80" />
                    <span>{slot}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between">
            <span>Slot: <strong className="text-zinc-900">{booking.time}</strong></span>
            <span className="text-[10px] text-zinc-400 font-mono">Instant Confirmation</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-zinc-100">
        <div className="text-[10px] sm:text-xs text-zinc-500 truncate">
          Parts pre-forwarded to <strong className="text-zinc-900">{booking.facility}</strong>
        </div>

        <button
          onClick={onActionClick}
          id="btn-booking-action"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 w-full sm:w-auto"
        >
          <span>Confirm Booking (10% Loyalty Auto-Applied)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
