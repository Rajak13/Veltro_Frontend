"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Star, Wrench, ShieldCheck, ArrowRight, CheckCircle2, UserCheck } from "lucide-react";
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
      className="h-full flex flex-col justify-between py-1 text-zinc-900"
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              Authorized Service Center
            </span>
            <span className="text-xs text-zinc-400 font-medium">Vehicle: {vehicle.name}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 mt-1">{booking.facility}</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-950">{booking.rating}</span>
            <span className="text-xs text-zinc-500">({booking.reviews} verified reviews)</span>
          </div>
        </div>
      </div>

      {/* ── Service & Garage Detail Card ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-2">
        {/* Left: Garage Info & Certified Warranty Card */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-1.5">
              <Wrench className="w-4 h-4 text-orange-500" />
              <span>{booking.serviceName}</span>
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Ring Road Central Hub · 2.4 km away
            </p>

            <div className="mt-4 p-3.5 bg-white rounded-xl border border-zinc-200/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 font-medium">Certified Technician Labor Fee</span>
                <span className="font-bold text-zinc-900 font-mono text-sm">Rs. {booking.laborCost.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">Includes 24-point safety inspection &amp; road test</div>
            </div>
          </div>

          <div className="text-xs text-emerald-700 flex items-center gap-1.5 mt-4 pt-3 border-t border-zinc-200/60 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Includes Veltro 30-day / 1,000 km post-service warranty</span>
          </div>
        </div>

        {/* Right: Real Veltro Date & Time Slot Picker */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" /> Select Appointment Slot
              </span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                Fast Track Ready
              </span>
            </div>

            {/* Date Pill */}
            <div className="bg-orange-50/70 border-2 border-orange-400 rounded-xl p-3 mb-3 flex items-center justify-between shadow-2xs">
              <div className="text-xs font-bold text-zinc-900">{booking.displayDate}</div>
              <span className="text-[10px] font-bold text-orange-600 bg-white px-2.5 py-0.5 rounded-md shadow-2xs">
                Recommended
              </span>
            </div>

            {/* Time Slot Selector */}
            <div className="text-xs font-semibold text-zinc-500 mb-2">Available Time Windows:</div>
            <div className="grid grid-cols-3 gap-2">
              {["09:00 AM", "10:00 AM", "02:00 PM"].map((slot) => {
                const isSelected = slot === booking.time;
                return (
                  <div
                    key={slot}
                    className={`text-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-orange-500 text-white shadow-xs border border-orange-600"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 mx-auto mb-1 opacity-80" />
                    <span>{slot}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-zinc-500 mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
            <span>Selected Window: <strong className="text-zinc-900">{booking.time}</strong></span>
            <span className="text-[11px] text-zinc-400 font-mono">Instant Confirmation</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Row ── */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
        <div className="text-xs text-zinc-500">
          Parts pre-forwarded to <strong className="text-zinc-900">{booking.facility}</strong> ahead of appointment
        </div>

        <button
          onClick={onActionClick}
          id="btn-booking-action"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105"
        >
          <span>Confirm Booking (10% Loyalty Auto-Applied)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
