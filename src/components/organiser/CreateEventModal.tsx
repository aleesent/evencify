import React, { useState, useEffect } from 'react';
import {
  EventType,
  CrewCategory,
  EventItem,
  CREW_CATEGORIES,
  EVENT_TYPES,
} from '../../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Banknote,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventItem) => void;
  organiserName: string;
  organiserId?: string;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  organiserName,
  organiserId,
}) => {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // STEP 1 — EVENT DETAILS (Clean, no pre-filled auto data)
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [expectedAttendance, setExpectedAttendance] = useState<number | ''>('');

  // STEP 2 — CREW REQUIREMENTS
  const [crewPositionsTotal, setCrewPositionsTotal] = useState<number | ''>('');
  const [requiredCategory, setRequiredCategory] = useState<CrewCategory>('Hospitality Staff');
  const [showGenderRequirement, setShowGenderRequirement] = useState(false);
  const [genderRequirement, setGenderRequirement] = useState<'Male' | 'Female' | 'Any'>('Any');
  const [showAgeRequirement, setShowAgeRequirement] = useState(false);
  const [ageRequirement, setAgeRequirement] = useState('');
  const [experienceRequirement, setExperienceRequirement] = useState<'Fresher' | 'Experienced' | 'Both'>('Fresher');
  const [dressCode, setDressCode] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // STEP 3 — PAYMENT
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payBasis, setPayBasis] = useState<'Per Day' | 'Per Hour' | 'Per Shift'>('Per Shift');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentTimeline, setPaymentTimeline] = useState<'Same Day' | 'Within 24 Hours' | 'Within 3 Days'>('Same Day');
  const [advanceRequired, setAdvanceRequired] = useState(false);

  const resetForm = () => {
    setStep(1);
    setStepError(null);
    setName('');
    setEventType('Wedding');
    setDate('');
    setStartTime('');
    setEndTime('');
    setVenue('');
    setCity('');
    setExpectedAttendance('');
    setCrewPositionsTotal('');
    setRequiredCategory('Hospitality Staff');
    setShowGenderRequirement(false);
    setGenderRequirement('Any');
    setShowAgeRequirement(false);
    setAgeRequirement('');
    setExperienceRequirement('Fresher');
    setDressCode('');
    setSpecialRequirements('');
    setPayAmount('');
    setPayBasis('Per Shift');
    setPaymentMethod('');
    setPaymentTimeline('Same Day');
    setAdvanceRequired(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    setStepError(null);
    if (step === 1) {
      if (!name.trim()) {
        setStepError('Please enter an event name to continue.');
        return;
      }
      if (!date) {
        setStepError('Please select the event date.');
        return;
      }
      if (!venue.trim()) {
        setStepError('Please enter the venue or address.');
        return;
      }
      if (!city.trim()) {
        setStepError('Please enter the event city.');
        return;
      }
    } else if (step === 2) {
      if (!crewPositionsTotal || Number(crewPositionsTotal) < 1) {
        setStepError('Please enter the total number of crew required (at least 1).');
        return;
      }
    } else if (step === 3) {
      if (!payAmount || Number(payAmount) <= 0) {
        setStepError('Please enter a valid pay amount per crew member.');
        return;
      }
      if (!paymentMethod.trim()) {
        setStepError('Please specify the payment method (e.g. UPI / Bank Transfer / Cash).');
        return;
      }
    }

    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    setStepError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const totalCrew = Number(crewPositionsTotal) || 1;
    const amount = Number(payAmount) || 0;

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      name: name.trim(),
      eventType,
      date,
      startTime,
      endTime,
      venue: venue.trim(),
      city: city.trim(),
      expectedAttendance: expectedAttendance ? Number(expectedAttendance) : undefined,
      organiserId: organiserId || 'org-1',
      organiserName: organiserName || 'Organiser',
      crewPositionsTotal: totalCrew,
      crewPositionsAvailable: totalCrew,
      requiredCategory,
      genderRequirement: showGenderRequirement ? genderRequirement : 'Any',
      ageRequirement: showAgeRequirement ? ageRequirement : undefined,
      experienceRequirement,
      dressCode: dressCode.trim(),
      specialRequirements: specialRequirements.trim(),
      payAmount: amount,
      payBasis,
      paymentMethod: paymentMethod.trim(),
      paymentTimeline,
      advanceRequired,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Open',
    };

    onEventCreated(newEvent);
    handleCloseModal();
  };

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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[28px] border-2 border-black bg-white p-6 sm:p-8 z-10"
        >
          {/* Close button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-6 right-6 rounded-full p-2 text-black hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Stepper Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FED000] px-2.5 py-0.5 text-[11px] font-black text-black uppercase tracking-wider">
                <Building className="h-3 w-3" />
                CREATE EVENT • STEP {step} OF 4
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-black">
              {step === 1 && 'Step 1 — Event Details'}
              {step === 2 && 'Step 2 — Crew Requirements'}
              {step === 3 && 'Step 3 — Payment Terms'}
              {step === 4 && 'Step 4 — Review & Publish'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-black mt-1">
              {step === 1 && 'Set the foundational schedule and venue location'}
              {step === 2 && 'Define role specifics, headcounts, and dress codes'}
              {step === 3 && 'Set transparent compensation and payout schedule'}
              {step === 4 && 'Review your staffing requirements before publishing'}
            </p>

            {/* Stepper Bar */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full border border-black transition-all ${
                    s <= step ? 'bg-[#FED000]' : 'bg-white'
                  }`}
                />
              ))}
            </div>

            {stepError && (
              <div className="mt-3.5 flex items-center gap-2 rounded-xl border-2 border-black bg-red-100 p-2.5 text-xs font-black text-red-900 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
                <span>{stepError}</span>
              </div>
            )}
          </div>

          {/* STEP 1: EVENT DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Heritage Sangeet & Reception"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Venue / Full Address
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Avadh Utopia Grand Ballroom, Dumas Road"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Surat"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Expected Attendance (Optional)
                  </label>
                  <input
                    type="number"
                    value={expectedAttendance}
                    onChange={(e) => setExpectedAttendance(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 500"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CREW REQUIREMENTS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Total Crew Required
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={crewPositionsTotal}
                    onChange={(e) => setCrewPositionsTotal(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 10"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Crew Category / Role
                  </label>
                  <select
                    value={requiredCategory}
                    onChange={(e) => setRequiredCategory(e.target.value as CrewCategory)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  >
                    {CREW_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Fresher', 'Experienced', 'Both'] as const).map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperienceRequirement(exp)}
                      className={`rounded-xl py-2 text-xs font-black transition-all border-2 border-black cursor-pointer ${
                        experienceRequirement === exp
                          ? 'bg-black text-[#FED000]'
                          : 'bg-white text-black hover:bg-[#FFFDE6]'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Gender Requirement */}
              <div className="rounded-xl border-2 border-black bg-[#FFFDE6] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-black">Specify Gender Requirement?</div>
                    <div className="text-[11px] font-bold text-black">Only enable if genuinely role-specific</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showGenderRequirement}
                    onChange={(e) => setShowGenderRequirement(e.target.checked)}
                    className="h-4 w-4 accent-black rounded cursor-pointer"
                  />
                </div>

                {showGenderRequirement && (
                  <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t-2 border-black/15">
                    {(['Any', 'Male', 'Female'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenderRequirement(g)}
                        className={`rounded-lg py-1.5 text-xs font-black border-2 border-black cursor-pointer ${
                          genderRequirement === g
                            ? 'bg-black text-[#FED000]'
                            : 'bg-white text-black hover:bg-[#FFFDE6]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Age Range */}
              <div className="rounded-xl border-2 border-black bg-[#FFFDE6] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-black">Specify Age Range?</div>
                    <div className="text-[11px] font-bold text-black">Only enable when strictly required</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showAgeRequirement}
                    onChange={(e) => setShowAgeRequirement(e.target.checked)}
                    className="h-4 w-4 accent-black rounded cursor-pointer"
                  />
                </div>

                {showAgeRequirement && (
                  <div className="mt-3 pt-2 border-t-2 border-black/15">
                    <input
                      type="text"
                      value={ageRequirement}
                      onChange={(e) => setAgeRequirement(e.target.value)}
                      placeholder="e.g. 21 - 30 years"
                      className="w-full rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Dress Code
                </label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="e.g. Black formal trousers, black shoes & white collared shirt"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Special Skills / Requirements
                </label>
                <textarea
                  rows={2}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Fluency in Gujarati and Hindi, guest reception etiquette..."
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT DETAILS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Pay Per Crew Member (₹)
                  </label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1500"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-black text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Payment Basis
                  </label>
                  <select
                    value={payBasis}
                    onChange={(e) => setPayBasis(e.target.value as any)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  >
                    <option value="Per Shift">Per Shift</option>
                    <option value="Per Day">Per Day</option>
                    <option value="Per Hour">Per Hour</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="e.g. Direct UPI / Bank Transfer / Cash"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Payment Timeline
                  </label>
                  <select
                    value={paymentTimeline}
                    onChange={(e) => setPaymentTimeline(e.target.value as any)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  >
                    <option value="Same Day">Same Day (Shift Wrap-up)</option>
                    <option value="Within 24 Hours">Within 24 Hours</option>
                    <option value="Within 3 Days">Within 3 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Advance Required?
                  </label>
                  <select
                    value={advanceRequired ? 'yes' : 'no'}
                    onChange={(e) => setAdvanceRequired(e.target.value === 'yes')}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  >
                    <option value="no">No Advance Required</option>
                    <option value="yes">Yes (Advance Escrow)</option>
                  </select>
                </div>
              </div>

              {/* Total Estimated Spend Callout */}
              <div className="rounded-2xl border-2 border-black bg-[#FFFDE6] p-4">
                <div className="flex items-center justify-between text-xs font-bold text-black">
                  <span>Estimated Total Crew Spend ({crewPositionsTotal || 0} staff × ₹{payAmount || 0})</span>
                  <span className="text-base font-black text-black bg-[#FED000] border-2 border-black px-2 py-0.5 rounded-lg">
                    ₹{(Number(crewPositionsTotal || 0) * Number(payAmount || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-black bg-white p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-2">
                  <span className="font-black text-sm text-black">{name || 'Untitled Event'}</span>
                  <span className="rounded-md border border-black bg-[#FED000] px-2 py-0.5 text-[11px] font-black text-black">
                    {eventType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-black font-semibold">
                  <div>
                    <span className="font-black">Date:</span> {date || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-black">Timing:</span> {startTime || '--:--'} - {endTime || '--:--'}
                  </div>
                  <div className="col-span-2">
                    <span className="font-black">Venue:</span> {venue || 'Not specified'}{city ? `, ${city}` : ''}
                  </div>
                </div>

                <div className="border-t-2 border-black/15 pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-black">Crew Positions:</span>
                    <span className="font-black text-black">
                      {crewPositionsTotal || 0} × {requiredCategory}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-black">Experience Required:</span>
                    <span className="font-black text-black">{experienceRequirement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-black">Payout per Crew:</span>
                    <span className="font-black text-black bg-[#FED000] border border-black px-1 rounded">₹{payAmount || 0} {payBasis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-black">Disbursement:</span>
                    <span className="font-black text-black">{paymentTimeline}</span>
                  </div>
                  <div className="flex justify-between font-black text-black pt-1 border-t-2 border-black/15">
                    <span>Total Crew Budget:</span>
                    <span className="bg-[#FED000] border-2 border-black px-2 rounded">
                      ₹{(Number(crewPositionsTotal || 0) * Number(payAmount || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-[#FED000] p-3 text-xs font-black text-black flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-black shrink-0" />
                <span>
                  Once published, qualified crew members in {city || 'your area'} will be notified to apply.
                </span>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t-2 border-black/15">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-4 py-2.5 text-xs font-black text-black hover:bg-[#FFFDE6] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-black px-6 py-2.5 text-xs font-black text-[#FED000] hover:bg-black/90 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FED000] px-7 py-3 text-xs sm:text-sm font-black text-black hover:bg-[#E5BB00] cursor-pointer"
              >
                <span>Publish Event</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
