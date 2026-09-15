import React from 'react';
import { CrewProfile } from '../../types';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Award,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CrewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  crew: CrewProfile | null;
  onInvite: (crew: CrewProfile) => void;
}

export const CrewProfileModal: React.FC<CrewProfileModalProps> = ({
  isOpen,
  onClose,
  crew,
  onInvite,
}) => {
  if (!isOpen || !crew) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative my-8 w-full max-w-xl rounded-[32px] border-2 border-black bg-white p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-black hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <img
              src={crew.photoUrl}
              alt={crew.name}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-black shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-black">{crew.name}</h3>
                <CheckCircle2 className="h-5 w-5 text-black fill-[#FED000]" />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-black font-semibold">
                <MapPin className="h-3.5 w-3.5 text-black" />
                <span>{crew.city}</span>
                <span>•</span>
                <span>{crew.age} years old</span>
                <span>•</span>
                <span>{crew.gender}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex items-center gap-1 rounded-lg bg-[#FED000] px-2.5 py-1 text-xs font-black text-black border border-black">
                  <Star className="h-3.5 w-3.5 fill-black text-black" />
                  <span>{crew.systemRating} System Rating</span>
                </div>
                <span className="text-xs text-black font-bold">
                  ({crew.completedEventsCount} verified shifts)
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-6 text-xs sm:text-sm text-black font-medium leading-relaxed bg-[#FFFDE6] p-4 rounded-2xl border-2 border-black">
            "{crew.bio}"
          </p>

          {/* Categories */}
          <div className="mt-6">
            <div className="text-xs font-black text-black uppercase tracking-wider mb-2">
              Verified Roles & Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {crew.categories.map((c, i) => (
                <span
                  key={i}
                  className="rounded-xl bg-black text-white px-3 py-1.5 text-xs font-bold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border-2 border-black p-3 bg-white">
              <span className="text-black font-bold">Total Experience:</span>
              <div className="font-black text-black mt-0.5">
                {crew.experienceYears} Years ({crew.experienceLevel})
              </div>
            </div>

            <div className="rounded-xl border-2 border-black p-3 bg-white">
              <span className="text-black font-bold">Expected Pay:</span>
              <div className="font-black text-black mt-0.5">{crew.expectedPay}</div>
            </div>

            <div className="rounded-xl border-2 border-black p-3 bg-white">
              <span className="text-black font-bold">Availability:</span>
              <div className="font-black text-black mt-0.5">{crew.availability}</div>
            </div>

            <div className="rounded-xl border-2 border-black p-3 bg-white">
              <span className="text-black font-bold">Punctuality Score:</span>
              <div className="font-black text-black mt-0.5">99.2% on-time arrival</div>
            </div>
          </div>

          {/* Contact Details (Simulated for Organisers) */}
          <div className="mt-4 rounded-2xl bg-[#FFFDE6] border-2 border-black p-4 text-black text-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-black font-bold">Direct Contact:</span>
              <span className="text-black font-black underline">Verified Phone & Identity</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-black font-black">
              <Phone className="h-3.5 w-3.5 text-black" />
              <span>{crew.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-black font-semibold">
              <Mail className="h-3.5 w-3.5 text-black" />
              <span>{crew.email}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t-2 border-black flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-black py-3 text-xs font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onInvite(crew);
                onClose();
              }}
              className="flex-1 rounded-xl bg-[#FED000] border-2 border-black py-3 text-xs font-black text-black hover:bg-[#E5BB00] cursor-pointer"
            >
              Invite to Event
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
